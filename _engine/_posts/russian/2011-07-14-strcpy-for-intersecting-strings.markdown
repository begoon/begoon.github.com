---
layout: post
title: "strcpy() для перекрывающихся строк"
language: russian
date: 2011-07-14 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/07/strcpy.html
categories: 
- russian
---
Рассмотрим программу:

{% codeblock lang:cpp %}
#include <string.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
  char b[32];
  strcpy(b, "123456789012345");
  strcpy(b + 1, b);
  printf("[%s]\n", b);
  return 0;
}
{% endcodeblock %}

Тут ясно видна проблема - строки, передаваемые в `strcpy()`, перекрываются.

По-хорошему, тут имеется неопределенное поведение, так как `strcpy()` не гарантирует порядок перемещения байт, а именно от него зависит в данном случае результат.

Проверим на разных компиляторах и платформах.

**Visual Studio 2010 64-bit**

    [1123446788012245]

Строка искажается каждые четыре байта, явно копировали по 32 бита.

**Linux 64-bit**

    [1123456788012345]

Уже иной результат. Компилятор и libc:

    ldd --version
    ldd (GNU libc) 2.5

    gcc --version
    gcc (GCC) 4.1.2 20080704 (Red Hat 4.1.2-50)

В `man strcpy` говорят:

    *The strings may not overlap...*

Странно, почему не "must not".

**Solaris (SPARC)**

    [1123446788012245]

Компилятор и libc:

    cc -V
    cc: Sun C 5.8 2005/10/13

    version /usr/lib/libC*
    version of "/usr/lib/libC.so.3": SC2.0.1 12/20/94 Sun C++ 3.0.1 patch 100962-09
    version of "/usr/lib/libC.so.5": Sun SUNWlibC SunOS 5.10 Patch 119963-06 2006/04/21
    version of "/usr/lib/libCrun.so.1": Sun SUNWlibC SunOS 5.10 Patch 119963-06 2006/04/21
    version of "/usr/lib/libCstd.so.1": Sun SUNWlibC SunOS 5.10 Patch 119963-06 2006/04/21

**AIX**

    [1111111111012245]

Тут результат явно левый. Но зато в документации сказано ясно и понятно:

*String movement is performed on a character-by-character basis and starts at the left. Overlapping moves toward the left work as expected, but overlapping moves to the right may give unexpected results.*

Компилятор и libc:

    lslpp -L | grep Compiler
    vacpp.cmp.core            8.0.0.20    C     F    IBM XL C/C++ Compiler

    lslpp -L | grep libc
    bos.rte.libc               5.3.9.1    C     F    libc Library

**HP-UX**

    [1123456789012345]

Компилятор:

    what `which cc`

    HP C/aC++ for Integrity Servers B3910B A.06.22 [Nov 14 2008]

Вроде скопировано правильно, но в документации (`man strcpy`) говорят (формулировка интересна):

*Character movement is performed differently in different implementations, so moves involving overlapping source and destination strings may yield surprises.*

**Вывод**: `strcpy()` - нехорошая функция, по многим причинам.
