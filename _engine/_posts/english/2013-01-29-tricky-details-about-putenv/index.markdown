@language: english
@date: 2013-01-29 22:00
@tags: cplusplus, putenv

Tricky details about putenv()
=============================

Previously I already talked about a class to deal with the
OS environment variables. The purpose of that class was to store data of the
variables passed into the `putenv()` function.

We rolled out this class into QA, which works on various platforms (AIX,
HP-UX, Solaris, Linux and Windows). Everything seemed to be okay, unit tests
passed and the production code didn't crash. Alas, QA machines controlled by
Hudson/Jenkins are usually overloaded, and quite often it causes very
unexpected issues. After a week we discovered that sometimes the code crashed
on AIX when calling `std::system()`. Even more, it crashed inside this
function, that was for sure. In most cases any "strange" or "magical" behaviour
is related to memory problems. [truss][], injected into command lines passed
to `system()`, showed that some environment variables in the child process
had corrupted values.

[truss]: http://pic.dhe.ibm.com/infocenter/aix/v6r1/index.jsp?topic=%2Fcom.ibm.aix.cmds%2Fdoc%2Faixcmds5%2Ftruss.htm

We began investigating the new class, `EnvironmentVariablesManager`. Below
is its simplified version but still containing a tricky bug. You may try
finding the issue by yourself first, and then read further down.

The simple `main()` function below easily reproduces the issue.

``` c++
#include <vector>
#include <map>
#include <string>

#include <unistd.h>

class EnvironmentVariablesManager {
 public:
  typedef std::vector<char> VariableContainer;
  typedef std::map<std::string, VariableContainer> Variables;
  void put(const std::string& name, const std::string& value) {
    VariableContainer pair;
    PairToContainer(name, value, &pair);
    const std::pair<Variables::iterator, bool> inserted =
      vars_.insert(std::make_pair(name, pair));
    if (!inserted.second)
      inserted.first->second = pair;
    putenv(&inserted.first->second[0]);
  }

 private:
  void PairToContainer(const std::string& name, const std::string& value,
                       VariableContainer* pair) const {
    pair->clear();
    std::copy(name.begin(), name.end(), std::back_inserter(*pair));
    pair->push_back('=');
    std::copy(value.begin(), value.end(), std::back_inserter(*pair));
    pair->push_back('\0');
  }
  Variables vars_;
};

int main() {
  EnvironmentVariablesManager env;
  env.put("DB2_HOME", "a");
  env.put("DB2_HOME", "12345678");
}
```

Valgrind complains on this code saying that `putenv` tries reading some memory
after freeing (this trace is from OSX).

    clang++ -o putenv_check putenv_test.cpp && valgrind ./putenv_check
    ==1046== Memcheck, a memory error detector
    ==1046== Copyright (C) 2002-2012, and GNU GPL'd, by Julian Seward et al.
    ==1046== Using Valgrind-3.8.1 and LibVEX; rerun with -h for copyright info
    ==1046== Command: ./putenv_check
    ==1046==
    --1046-- ./putenv_check:
    --1046-- dSYM directory is missing; consider using --dsymutil=yes
    ==1046== Invalid read of size 1
    ==1046==    at 0x2A8A3B: __findenv (in /usr/lib/system/libsystem_c.dylib)
    ==1046==    by 0x232C62: __setenv (in /usr/lib/system/libsystem_c.dylib)
    ==1046==    by 0x216A7E: putenv (in /usr/lib/system/libsystem_c.dylib)
    ==1046==    by 0x100001999: EnvironmentVariablesManager::put(std::string const&, std::string const&) (in ./putenv_check)
    ==1046==    by 0x1000015DE: main (in ./putenv_check)
    ==1046==  Address 0x100012560 is 0 bytes inside a block of size 11 free'd
    ==1046==    at 0x563A: free (in /usr/local/Cellar/valgrind/3.8.1/lib/valgrind/vgpreload_memcheck-amd64-darwin.so)
    ==1046==    by 0x10000208C: __gnu_cxx::new_allocator<char>::deallocate(char*, unsigned long) (in ./putenv_check)
    ==1046==    by 0x10000201D: std::_Vector_base<char, std::allocator<char> >::_M_deallocate(char*, unsigned long) (in ./putenv_check)
    ==1046==    by 0x100002483: std::vector<char, std::allocator<char> >::operator=(std::vector<char, std::allocator<char> > const&) (in ./putenv_check)
    ==1046==    by 0x1000018A8: EnvironmentVariablesManager::put(std::string const&, std::string const&) (in ./putenv_check)
    ==1046==    by 0x1000015DE: main (in ./putenv_check)
    ==1046==
    ==1046==
    ==1046== HEAP SUMMARY:
    ==1046==     in use at exit: 2,425 bytes in 34 blocks
    ==1046==   total heap usage: 58 allocs, 24 frees, 2,824 bytes allocated
    ==1046==
    ==1046== LEAK SUMMARY:
    ==1046==    definitely lost: 18 bytes in 1 blocks
    ==1046==    indirectly lost: 0 bytes in 0 blocks
    ==1046==      possibly lost: 0 bytes in 0 blocks
    ==1046==    still reachable: 2,407 bytes in 33 blocks
    ==1046==         suppressed: 0 bytes in 0 blocks
    ==1046== Rerun with --leak-check=full to see details of leaked memory
    ==1046==
    ==1046== For counts of detected and suppressed errors, rerun with: -v
    ==1046== ERROR SUMMARY: 9 errors from 1 contexts (suppressed: 1 from 1)

To me it was not that obvious what was wrong. For example, if to remove the
second call `env.put("DB2_HOME", "12345678")`, the issue disappeared
(valgrind didn't complain any more). So, we started to suspect the following
lines of code:

``` c++
    if (!inserted.second)
      inserted.first->second = pair;
    putenv(&inserted.first->second[0]);
```

If to change the code little bit (if fact, doing exactly the same operation
but in a slightly different way):

``` c++
    if (!inserted.second)
      inserted.first->second.assign(pair.begin(), pair.end());
```

the error report changes:

    --1087-- ./putenv_check:
    --1087-- dSYM directory is missing; consider using --dsymutil=yes
    ==1087== Invalid read of size 1
    ==1087==    at 0x2A8A3B: __findenv (in /usr/lib/system/libsystem_c.dylib)
    ==1087==    by 0x232C62: __setenv (in /usr/lib/system/libsystem_c.dylib)
    ==1087==    by 0x216A7E: putenv (in /usr/lib/system/libsystem_c.dylib)
    ==1087==    by 0x1000016A9: EnvironmentVariablesManager::put(std::string const&, std::string const&) (in ./putenv_check)
    ==1087==    by 0x10000129E: main (in ./putenv_check)
    ==1087==  Address 0x100013560 is 0 bytes inside a block of size 11 free'd
    ==1087==    at 0x563A: free (in /usr/local/Cellar/valgrind/3.8.1/lib/valgrind/vgpreload_memcheck-amd64-darwin.so)
    ==1087==    by 0x100001D9C: __gnu_cxx::new_allocator<char>::deallocate(char*, unsigned long) (in ./putenv_check)
    ==1087==    by 0x100001D2D: std::_Vector_base<char, std::allocator<char> >::_M_deallocate(char*, unsigned long) (in ./putenv_check)
    ==1087==    by 0x1000022E9: void std::vector<char, std::allocator<char> >::_M_assign_aux<__gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > > >(__gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > >, __gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > >, std::forward_iterator_tag) (in ./putenv_check)
    ==1087==    by 0x1000021C4: void std::vector<char, std::allocator<char> >::_M_assign_dispatch<__gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > > >(__gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > >, __gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > >, std::__false_type) (in ./putenv_check)
    ==1087==    by 0x1000020A4: void std::vector<char, std::allocator<char> >::assign<__gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > > >(__gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > >, __gnu_cxx::__normal_iterator<char*, std::vector<char, std::allocator<char> > >) (in ./putenv_check)
    ==1087==    by 0x1000015BF: EnvironmentVariablesManager::put(std::string const&, std::string const&) (in ./putenv_check)
    ==1087==    by 0x10000129E: main (in ./putenv_check)

Now it is more or less clear what is going on. But let's consider a much more
simple example first, purely in C:

``` c
#include <unistd.h>
#include <stdlib.h>

int main() {
  char *v1, *v2;
  v1 = malloc(10);
  strcpy(v1, "x=123");
  putenv(v1);
  free(v1);

  v2 = malloc(10);
  strcpy(v2, "x=123");
  putenv(v2);
  free(v2);
  return 0;
}
```

valgrind also reports about this code (this trace is from Linux):

    ==523== Memcheck, a memory error detector
    ==523== Copyright (C) 2002-2010, and GNU GPL'd, by Julian Seward et al.
    ==523== Using Valgrind-3.6.0 and LibVEX; rerun with -h for copyright info
    ==523== Command: ./putenv_test
    ==523==
    ==523== Invalid read of size 1
    ==523==    at 0x4A07CF9: __GI_strncmp (mc_replace_strmem.c:400)
    ==523==    by 0x3E1C235649: __add_to_environ (in /lib64/libc-2.12.so)
    ==523==    by 0x3E1C2353CD: putenv (in /lib64/libc-2.12.so)
    ==523==    by 0x4A0952D: putenv (mc_replace_strmem.c:1165)
    ==523==    by 0x400607: main (in /storage2/home3/ademin/test/env/t)
    ==523==  Address 0x4c28040 is 0 bytes inside a block of size 10 free'd
    ==523==    at 0x4A0595D: free (vg_replace_malloc.c:366)
    ==523==    by 0x4005D7: main (in /storage2/home3/ademin/test/env/t)
    ==523==
    ==523== Invalid read of size 1
    ==523==    at 0x4A07D14: __GI_strncmp (mc_replace_strmem.c:400)
    ==523==    by 0x3E1C235649: __add_to_environ (in /lib64/libc-2.12.so)
    ==523==    by 0x3E1C2353CD: putenv (in /lib64/libc-2.12.so)
    ==523==    by 0x4A0952D: putenv (mc_replace_strmem.c:1165)
    ==523==    by 0x400607: main (in /storage2/home3/ademin/test/env/t)
    ==523==  Address 0x4c28040 is 0 bytes inside a block of size 10 free'd
    ==523==    at 0x4A0595D: free (vg_replace_malloc.c:366)
    ==523==    by 0x4005D7: main (in /storage2/home3/ademin/test/env/t)
    ==523==
    ==523== Invalid read of size 1
    ==523==    at 0x3E1C235652: __add_to_environ (in /lib64/libc-2.12.so)
    ==523==    by 0x3E1C2353CD: putenv (in /lib64/libc-2.12.so)
    ==523==    by 0x4A0952D: putenv (mc_replace_strmem.c:1165)
    ==523==    by 0x400607: main (in /storage2/home3/ademin/test/env/t)
    ==523==  Address 0x4c28041 is 1 bytes inside a block of size 10 free'd
    ==523==    at 0x4A0595D: free (vg_replace_malloc.c:366)
    ==523==    by 0x4005D7: main (in /storage2/home3/ademin/test/env/t)
    ==523==
    ==523==
    ==523== HEAP SUMMARY:
    ==523==     in use at exit: 0 bytes in 0 blocks
    ==523==   total heap usage: 3 allocs, 3 frees, 492 bytes allocated
    ==523==
    ==523== All heap blocks were freed -- no leaks are possible
    ==523==
    ==523== For counts of detected and suppressed errors, rerun with: -v
    ==523== ERROR SUMMARY: 3 errors from 3 contexts (suppressed: 6 from 6)

But if to remove the first `free(v1);` or move it further down **after** the
second `putenv`, the valgrind report becomes clean, nothing bad happens.

The conclusion
--------------

The `putenv` function requires that at the moment of setting the new value of
a variable the previous value must still exist and be in valid memory
(literally it cannot be freed or moved to another location).

For some reason `putenv` tries reading the previous value when setting the new
one.

Now go back to C++. If the original code:

``` c++
    if (!inserted.second)
      inserted.first->second = pair;
```

is replaced to:

``` c++
    if (!inserted.second)
      inserted.first->second.swap(pair);
```

the issue disappears (valgrind doesn't find anything suspecious anymore).

Why? The first code destroys (frees, reallocates) the existing value when
copying the value of `pair` into the map. That is why the subsequent call to
`putenv` tries reading a freed memory location.

The second code doing `swap` only moves the ownership of the data controlled
by `pair` to the element of the map, and in turn the data owned by the
element of the map (the existing value) is moved into the `pair` variable.
The `pair` variable goes out of scope and frees its data only at the end
of the function, clearly after calling `putenv`, so by postponing freeing
memory of existing value we allow `putenv` to read it without any problems.

This is it! End of story.

Frankly, this is the most complicated bug in C++ memory management I came
across recently.

Be aware.
