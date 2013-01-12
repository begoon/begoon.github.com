@language: english
@date: 2013-01-12 22:00
@tags: cpluscplus, putenv, getenv

An environment variables manager class
======================================

I haven't publish code quite a long time. Let's get back to the roots.

The `putenv()` function has a quite unpleasant property. It doesn't take a
copy of its argument using it directly by pointer. Moreover, the argument
is a non-const pointer. So, it is impossible to pass automatic or 
temporary objects, and even passing constant strings (which are persistent
by default) we need to cast them to non-const ones, which is not quite right.
All of this encourages such nonsense like `malloc` or `strdup`.

So, there is a class below called `EnvironmentVariablesManager`. This is a
simple wrapper around `putenv()` and `getenv()` proving persistent storage
for the values passed to `putenv()` (in the form of "name=value") .

The class is designed to work on Linux, AIX, HP-UX, Solaris and Windows.

EnvironmentVariablesManager.h file:

``` c++
#ifndef ENVIRONMENT_VARIABLE_MANAGER_H
#define ENVIRONMENT_VARIABLE_MANAGER_H

#include <string>
#include <vector>
#include <map>

class EnvironmentVariablesManager {
 public:
  typedef std::vector<char> VariableContainer;
  typedef std::map<std::string, VariableContainer> Variables;

  EnvironmentVariablesManager() {}

  void put(const std::string& name, const std::string& value);
  std::string get(const std::string& name) const;
  void del(const std::string& name);

  static void PutOSVariable(char* value);
  static std::string GetOSVariable(const char* name);
  static bool IsOSVariableSet(const char* name);

 private:
  VariableContainer PairToContainer(const std::string& name,
                                    const std::string& value) const;
  Variables vars_;

  // This class is not copiable.
  EnvironmentVariablesManager(const EnvironmentVariablesManager&);
  void operator=(const EnvironmentVariablesManager&);
};

#endif
```

EnvironmentVariablesManager.cpp file:

``` c++
#include "EnvironmentVariablesManager.h"

#ifdef WINDOWS
#include <windows.h>
#else
#include <unistd.h>
#endif

#include <vector>
#include <map>
#include <string>
#include <iterator>
#include <algorithm>

#include <cassert>

void EnvironmentVariablesManager::put(const std::string& name,
                                      const std::string& value) {
  const VariableContainer pair = PairToContainer(name, value);
  const std::pair<Variables::iterator, bool> inserted =
    vars_.insert(std::make_pair(name, pair));
  if (!inserted.second)
    inserted.first->second = pair;
  char* data = &(inserted.first->second[0]);
  PutOSVariable(data);
}

std::string EnvironmentVariablesManager::get(const std::string& name) const {
  return GetOSVariable(name.c_str());
}

void EnvironmentVariablesManager::del(const std::string& name) {
  put(name, "");
}

void EnvironmentVariablesManager::PutOSVariable(char* value) {
  ::putenv(value);
}

std::string EnvironmentVariablesManager::GetOSVariable(const char* name) {
#ifdef WINDOWS
  size_t sz = 0;
  assert(getenv_s(&sz, NULL, 0, name) == 0);
  if (sz == 0) return std::string();
  std::vector<char> value(sz + 1);
  assert(getenv_s(&sz, &value[0], sz, name) == 0);
  return std::string(&value[0], sz - 1);
#else
  const char* const value = std::getenv(name);
  return value ? value : "";
#endif
}

bool EnvironmentVariablesManager::IsOSVariableSet(const char* name) {
#ifdef WINDOWS
  size_t sz = 0;
  assert(getenv_s(&sz, NULL, 0, name) == 0);
  return sz > 0;
#else
  const char* value = std::getenv(name);
  return value != NULL && *value != '\0';
#endif
}

EnvironmentVariablesManager::VariableContainer 
EnvironmentVariablesManager::PairToContainer(const std::string& name,
                                             const std::string& value) const {
  VariableContainer pair;                                            
  std::copy(name.begin(), name.end(), std::back_inserter(pair));
  pair.push_back('=');
  std::copy(value.begin(), value.end(), std::back_inserter(pair));
  pair.push_back('\0');
  return pair;
}
```

Unit-tests using `std::assert`.

EnvironmentVariablesManager_unittest.cpp file:

``` c++
#include <iostream>
#include <string>
#include <vector>
#include <cstdlib>
#include <cstring>
#include <cassert>

#ifdef WINDOWS
#include <windows.h>
#else
#include <stdlib.h>
#include <stdio.h>
#include <unistd.h>
#endif

#include "EnvironmentVariablesManager.h"

void Test_EnvironmentVariablesManager_get_put() {
  EnvironmentVariablesManager env;
  assert(std::string("") == env.get("_a_unique_variable_"));
  env.put("_a_unique_variable_", "b");
  assert(std::string("b") == env.get("_a_unique_variable_"));
  env.put("_a_unique_variable_", "abc");
  assert(std::string("abc") == env.get("_a_unique_variable_"));
  env.put("_a_unique_variable_", "");
  assert(std::string("") == env.get("_a_unique_variable_"));
}

namespace {
std::string ReadEnvironmentVariableViaShell(const std::string& name) {
#ifdef WINDOWS
  const std::string shell =
    EnvironmentVariablesManager::GetOSVariable("ComSpec");
  assert(!shell.empty());
  const std::string cmd = shell + " /c echo %" + name + "%";
  FILE* const f = _popen(cmd.c_str(), "rb");
#else
  const std::string cmd = "echo $" + name;
  FILE* const f = popen(cmd.c_str(), "r");
#endif
  assert(f != NULL);
  std::vector<char> line(1024, 0);
  size_t read = 0;
  while (!::feof(f) && read < line.size()) {
    const size_t sz = ::fread(&line[read], 1, line.size() - read, f);
    read += sz;
  }
#ifdef WINDOWS
  ::_pclose(f);
#else
  ::pclose(f);
#endif
  line.resize(read);
  std::string trimmed(read, '\0');
  std::copy(line.begin(), line.end(), trimmed.begin());
  return trimmed.substr(0, trimmed.find_last_not_of("\r\n") + 1);
}
}

void Test_EnvironmentVariablesManager_put_is_propagated_to_child_process() {
  EnvironmentVariablesManager env;
#ifdef WINDOWS
  const std::string empty = "%__unique_%";
#else
  const std::string empty = "";
#endif
  assert(empty == ReadEnvironmentVariableViaShell("__unique_"));
  env.put("__unique_", "b");
  assert(std::string("b") == ReadEnvironmentVariableViaShell("__unique_"));
  env.put("__unique_", "");
  assert(empty == ReadEnvironmentVariableViaShell("__unique_"));
}

void Test_EnvironmentVariablesManager_must_take_a_copy() {
  EnvironmentVariablesManager env;
  char var[] = "12345678";
  env.put("var", var);
  assert(env.get("var") == std::string("12345678"));
  std::strcpy(var, "abc");
  assert(env.get("var") == std::string("12345678"));
}

void Test_EnvironmentVariablesManager_del() {
  EnvironmentVariablesManager env;
  env.put("variable_to_delete", "123");
  assert(std::string("123") == env.get("variable_to_delete"));
  env.del("variable_to_delete");
  assert(env.get("variable_to_delete").empty() == true);
}

void Test_EnvironmentVariablesManager_IsOSVariableSet_set_and_unset() {
  EnvironmentVariablesManager env;
  env.put("a", "value");
  assert(EnvironmentVariablesManager::IsOSVariableSet("a") == true);
  env.put("a", "");
  assert(EnvironmentVariablesManager::IsOSVariableSet("a") == false);
}

void Test_EnvironmentVariablesManager_GetOSVariable() {
  const std::string unique_name = "EnvironmentVariablesManager_GetOSVariable";
  assert(EnvironmentVariablesManager::GetOSVariable(unique_name.c_str())
                                                    .empty());
  const std::string unique_name_pair = unique_name + "=12345678";
  char var[1024];
  unique_name_pair.copy(var, sizeof(var));
  var[unique_name_pair.length()] = '\0';
  ::putenv(var);
  assert(EnvironmentVariablesManager::GetOSVariable(unique_name.c_str())
                                                    == "12345678");
}

void Test_EnvironmentVariablesManager_PutOSVariable() {
  const std::string unique_name = "EnvironmentVariablesManager_PutOSVariable";
  const char* before = ::getenv(unique_name.c_str());
  if (before != NULL)
    assert(std::string(before).empty());

  const std::string unique_name_pair = unique_name + "=12345678";
  char var[1024];
  unique_name_pair.copy(var, sizeof(var));
  var[unique_name_pair.length()] = '\0';

  EnvironmentVariablesManager::PutOSVariable(var);
  const char* after = ::getenv(unique_name.c_str());
  assert(after != NULL);
  assert(std::string(after) == "12345678");
}

int run_tests(int argc, const char* const argv[]) {
  Test_EnvironmentVariablesManager_GetOSVariable();
  Test_EnvironmentVariablesManager_PutOSVariable();
  Test_EnvironmentVariablesManager_get_put();
  Test_EnvironmentVariablesManager_put_is_propagated_to_child_process();
  Test_EnvironmentVariablesManager_must_take_a_copy();
  Test_EnvironmentVariablesManager_del();
  Test_EnvironmentVariablesManager_IsOSVariableSet_set_and_unset();
  return 0;
}

int main(int argc, const char* const argv[]) {
  run_tests(argc, argv);
  std::cout << "All tests pass." << std::endl;
}
```

Overall, nothing really intricate but quite handy. 
