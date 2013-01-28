@language: english
@date: 2013-01-28 22:00
@tags: snprintf

snprintf() on different platforms
=================================

The `snprintf()` is considered to be "good" for formatting in C in terms of
the buffer overrun problem. But similarly to other functions supporting the
maximum buffer size there is a tricky moment -- dealing with the trailing
zero character if the buffer isn't big enough.

I wanted some clarity in this question, so I wrote the following test
program:

    #include <stdlib.h>
    #include <stdio.h>
    #include <string.h>
    #ifdef WINDOWS
    #define snprintf _snprintf
    #endif
    void test(const int capacity) {
      char buf[1024];
      int n;
      strcpy(buf, "abcdefghijk");
      n = snprintf(buf, capacity, "%d", 123);
      printf("capacity=%d, n=%d, buf=[%s] (length %d)\n",
             capacity, n, buf, (int)strlen(buf));
    }

    int main() {
      test(0);
      test(1);
      test(2);
      test(3);
      test(4);
      test(5);
      return 0;
    }

The program tests how `snprintf()` deals with the buffer when there is no
room for the full result, and whether it adds the trailing `\0` in this case.

I'll be testing on different systems and compilers.

Solaris SunOS 5.10 SPARC, Sun C 5.8
-----------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Solaris SunOS 5.10 SPARC, Sun C 5.12
------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Solaris SunOS 5.10 Intel x86, Sun C 5.12
----------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Solaris SunOS 5.11 Intel x86, Sun C 5.12
----------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Linux 2.6.18 x64, gcc 4.1.2
----------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Linux 2.6.32 x64, gcc 4.4.6
----------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

HP-UX B.11.31 Itanium 64, HP C/aC++ B3910B A.06.22
--------------------------------------------------

    capacity=0, n=0, buf=[abcdefghijk] (length 11)
    capacity=1, n=-1, buf=[] (length 0)
    capacity=2, n=-1, buf=[1] (length 1)
    capacity=3, n=-1, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

AIX 5.3 (PowerPC), IBM XL C/C++ 8.0.0.20
----------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

AIX 6.1 (PowerPC), IBM XL C/C++ 9.0.0.0
---------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

AIX 6.1 (PowerPC), IBM XL C/C++ 9.0.0.15
----------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

AIX 7.1 (PowerPC), IBM XL C/C++ 11.1.0.0
----------------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Windows 7, Visual Studio 12 (17.00.50727.1), x86
------------------------------------------------

    capacity=0, n=-1, buf=[abcdefghijk] (length 11)
    capacity=1, n=-1, buf=[1bcdefghijk] (length 11)
    capacity=2, n=-1, buf=[12cdefghijk] (length 11)
    capacity=3, n=3, buf=[123defghijk] (length 11)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

Windows 7, Visual Studio 12 (17.00.50727.1), x64
------------------------------------------------

    capacity=0, n=-1, buf=[abcdefghijk] (length 11)
    capacity=1, n=-1, buf=[1bcdefghijk] (length 11)
    capacity=2, n=-1, buf=[12cdefghijk] (length 11)
    capacity=3, n=3, buf=[123defghijk] (length 11)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

OSX 10.7.5, Apple clang 4.1
---------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

OSX 10.7.5, Apple gcc/llmv 4.2.1
--------------------------------

    capacity=0, n=3, buf=[abcdefghijk] (length 11)
    capacity=1, n=3, buf=[] (length 0)
    capacity=2, n=3, buf=[1] (length 1)
    capacity=3, n=3, buf=[12] (length 2)
    capacity=4, n=3, buf=[123] (length 3)
    capacity=5, n=3, buf=[123] (length 3)

The conclusion
==============

On all UNIX systems (SunOS, Linux, AIX, OSX), except HP-UX, the buffer is not
touched if it is capacity is 0. Also, the trailing `\0` is counted in the
length of the output (if the buffer size is 1 it can fit only one character,
and this character is the trailing zero). Finally, the function returns the
length of data which would be written if the buffer has enough room. This
length can be used to allocate another, big enough buffer and call the function
once again.

Alas, on HP-UX, if the buffer cannot fit the result, the function returns -1.
In this case it is not clear how to figure out the required length of the
buffer. By the dichotomy method?

On Windows the situation is even worse. First, the function returns -1 similar
to HP-UX if the buffer is not big enough. Second, it does not count the trailing
zero in the length of its output, which means it does not append the trailing
zero at all in the situation of the small buffer. Though, Microsoft does not
recommend using `snprintf()` at all as a non-thread safe function, and
recommends `_snprintf_s()` instead.

It is obvious now why there are so many "a portable snprintf" implementations
in the internet.

Bonus
=====

In my particular case I would be happy using [asprintf][] as an easy to use
alternative, but this function is not standard, and, for instance, HP-UX
does not support it.

[asprintf]: http://linux.die.net/man/3/asprintf
