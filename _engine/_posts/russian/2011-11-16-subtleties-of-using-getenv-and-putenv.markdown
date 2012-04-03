---
layout: post
title: "Тонкости использования getenv() и putenv()"
language: russian
date: 2011-11-16 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/11/getenv-putenv.html
categories: 
- russian
---
Нарвался тут на интересные грабли с функциями [getenv()][] и [putenv()][].

[getenv()]: http://www.kernel.org/doc/man-pages/online/pages/man3/getenv.3.html
[putenv()]: http://www.kernel.org/doc/man-pages/online/pages/man3/putenv.3.html

С `putenv()` у меня [уже был интересный опыт][Статический аргумент функции putenv].

Часто люди пишут так:

{% codeblock lang:cpp %}
if (getenv("A_FLAG")) {
  ...
}
{% endcodeblock %}

Это работает неплохо для переменных-флагов, которые либо есть, либо нет. Значение не важно.

Что получилось у меня:

{% codeblock lang:cpp %}
int main(...) {
  putenv("GLOBAL_FLAG=1");  // Глобальное значение для всей программы.
  ...
  system("xyz");            // Это программа должна видеть GLOBAL_FLAG=1.
  ...
  do_stuff();
  ...
}

void do_stuff() {
  ...
  if (something) {
    putenv("GLOBAL_FLAG="); // Убрать переменную.
    system("abc");          // А вот для этой программы флаг должен быть убран.
    ...
  }
  ...
  if (getenv("GLOBAL_FLAG") {
     // И вот тут начиналась ерунда на разных платформах.
  }
}
{% endcodeblock %}

А корень зла тут в том, что после `putenv()` результат `getenv()` может стать либо `NULL`, либо `""`, в зависимости от платформы.

Например:

{% codeblock lang:cpp %}
if (getenv("GLOBAL_FLAG") {
    ...
{% endcodeblock %}

работает только на Windows и правильнее писать:

{% codeblock lang:cpp %}
const char* p = getenv("GLOBAL_FLAG");
if (p != NULL && *p != '\0') {
  ...
}
{% endcodeblock %}

И лучше сделать wrapper для `getenv()`:

{% codeblock lang:cpp %}
std::string GetEnv(const char* name) {
  const char* v = getenv(name);
  return v ? v : "";
}
{% endcodeblock %}

И для проверки писать:

{% codeblock lang:cpp %}
if (!GetEnv("var").empty()) {
  ..
}
{% endcodeblock %}

Для теста я написал программу, которая выставляет переменную и проверяет ее значение через `getenv()` и через вызов дочерней программы.

{% codeblock lang:cpp %}
#include <string>
#include <vector>
#include <iostream>
#include <cstdlib>

#ifdef WINDOWS
#define putenv _putenv
#endif

void PrintVariableViaShell(const std::string& name) {
  std::cout << "Value from shell:" << std::endl;
  const std::string cmd =
#ifdef WINDOWS
    std::string("cmd /c echo [%") + name + "%]";
#else
    std::string("/bin/sh -c \"echo [$") + name + "]\"";
#endif
  std::cout << cmd << std::endl;
  std::system(cmd.c_str());
}

void PrintVariableViaGetEnv(const std::string& name) {
  std::cout << "Value from getenv():" << std::endl;
  const char* v = std::getenv(name.c_str());
  std::cout << "[" << (v ? v : "<NULL>") << "]" << std::endl;
}

void SetVariableDeleteAndPrint(const char* name_value, const bool equ) {
  const std::string& name_value_s(name_value);
  const std::string name = name_value_s.substr(0, name_value_s.find('='));

  putenv(const_cast<char*>(name_value));
  std::vector<char> delete_without_equ(name.begin(), name.end());
  delete_without_equ.push_back('\0');
  putenv(&delete_without_equ[0]);

  std::cout << "Value after deleting WITHOUT '=':" << std::endl;
  PrintVariableViaShell(name);
  PrintVariableViaGetEnv(name);

  std::cout << std::endl;

  putenv(const_cast<char*>(name_value));
  std::vector<char> delete_with_equ(name.begin(), name.end());
  delete_with_equ.push_back('=');
  delete_with_equ.push_back('\0');
  putenv(&delete_with_equ[0]);

  std::cout << "Value after deleting WITH '=': " << std::endl;
  PrintVariableViaShell(name);
  PrintVariableViaGetEnv(name);
}

int main(int argc, char* argv[]) {
#ifdef WINDOWS
  std::cout << "WINDOWS" << std::endl;
#else
  system("uname");
#endif
  SetVariableDeleteAndPrint("ABC=123", true);
  return 0;
}
{% endcodeblock %}

И вот результы с разных платформ.

**Linux**

    Linux
    Value after deleting WITHOUT '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    []
    Value from getenv():
    [<NULL>]

    Value after deleting WITH '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    []
    Value from getenv():
    []

**AIX**

    AIX
    Value after deleting WITHOUT '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    [123]
    Value from getenv():
    [123]

    Value after deleting WITH '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    []
    Value from getenv():
    []

**SunOS**

    SunOS
    Value after deleting WITHOUT '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    [123]
    Value from getenv():
    [123]

    Value after deleting WITH '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    []
    Value from getenv():
    []
    
**HP-UX**

    HP-UX
    Value after deleting WITHOUT '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    [123]
    Value from getenv():
    [123]

    Value after deleting WITH '=':
    Value from shell:
    /bin/sh -c "echo [$ABC]"
    []
    Value from getenv():
    []

**WINDOWS**

    WINDOWS
    Value after deleting WITHOUT '=':
    Value from shell:
    cmd /c echo [%ABC%]
    [123]
    Value from getenv():
    [123]

    Value after deleting WITH '=':
    Value from shell:
    cmd /c echo [%ABC%]
    [%ABC%]
    Value from getenv():
    [<NULL>]

Только на Windows `getenv()` возвращает `NULL` после удаления. На остальных это будет пустая строка.

Забавно, на Linux можно удалять переменные через `putenv("name")` (без знака "="), а тогда `getenv()` будет возвращать `NULL`.

Посты по теме:

* [Статический аргумент функции putenv][]

[Статический аргумент функции putenv]: /blog/russian/2009/02/01/static-argument-of-putenv/
