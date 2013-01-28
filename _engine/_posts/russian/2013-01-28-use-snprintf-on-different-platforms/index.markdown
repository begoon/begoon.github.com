@language: russian
@date: 2013-01-28 22:00
@tags: snprintf

Как работает snprintf() на разных платформах
============================================

Считается, что функция `snprintf()` является "правильным" способом форматного
преобразования в С, так как есть возможность контролировать длину рождаемых
данных. Но как у остальных функций подобного рода, типа `strcpy()`, у нее есть
мутный момент в плане нуля на конце, если буфер кончился раньше времени.
Мне хотелость определенности в этом вопросе, поэтому программа:

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

Данный код проверяет, как именно `snprintf()` использует предоставленный
буфер, если результат полностью не вмещается, и добавляется ли ноль в конце.

Запускать будем на разных системах и компиляторах.

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

Выводы
======

На всех UNIX'ах (SunOS, Linux, AIX, OSX), кроме HP-UX, буфер не
трогается, если его длина 0, завершающий `\0` учитывается в длине рождаемых
данных (то есть, если буфер длиной 1, то туда влезет только один символ конца
строки), и фукнция всегда возващает длину данных (без учета нуля в конце),
которые могли бы быть записаны, если б хватило буфера. Это число можно
использовать для выделения буфера достаточной длины при повторном вызове
функции.

Увы, на HP-UX, если буфер маловат, то возвращается -1. В этом случае не понятно,
как определить длину требуемого буфера. Методом дихотомии? Странно.

В Windows ситуация еще хуже. Мало того, что функция не возвращает длину
требуемого буфера, так еще не учитывает ноль в расчете его длины. То есть
когда размера буфера не достаточно, то ноль в конце не добавляется.
Но Microsoft говорит, что не стоит использоваться `snprintf()` вообще,
а переключиться на `_snrpintf_s()`.

Теперь понятно, почему интернет полон темами типа "a portable snprintf
implementation".

Бонус
=====

Для моей конкретной задачи неплохо подошла бы функция [asprintf][], так как
меня не пугает malloc на каждом вызове, но увы, функция нестандартная, и то же
HP-UX ее не имеет.

[asprintf]: http://linux.die.net/man/3/asprintf
