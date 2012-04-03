---
layout: post
title: "Динамическая линковка C++ на AIX"
language: russian
date: 2011-06-16 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/06/c-aix.html
categories: 
- cplusplus
- russian
---
AIX мне всегда нравился своим особо изощренным отношением к линковке.

Итак, рассмотрим пример (система AIX 5.3).

Файл `alib.cpp` компилируем как динамическую библиотеку.

{% codeblock lang:cpp %}
struct A {
  A() {
    value_ = 123;
  }
  int value_;
};

A a = A();

extern "C"
int value() {
  return a.value_;
}
{% endcodeblock %}

В этой библиотеке создается статический объект класса `А`, и значение его поля возвращается функцией `value()`.

Компилируем:

    xlC -o alib.so -qrtti=all -qmkshrobj=-100 -G -brtl -bnolibpath alib.cpp

`xlC` - это компилятор С++ на AIX.

Далее, файл `main.c`. Это головной модуль на `С`, который вызывает функцию `value()`.

{% codeblock lang:cpp %}
extern int value();

int main() {
  return value();
}
{% endcodeblock %}

Этот модуль вызывает `value()`, и значение становится кодом возврата процесса.

Компилируем:

    xlc -c -o main.o main.c
    
`xlc` (маленькая "с" на конце) - это компилятор С на AIX.

Линкуем, используя компилятор С, запускаем и печатаем код возврата (`$?`)

    xlc -o main main.o alib.so && LIBPATH=.:$LIBPATH ./main ; echo $?

Результат на экране:

    0
    
Интересно?! Почему не ожидаемое 123?

Теперь линкуем, используя компилятор "С++", запускаем и печатаем код возврата:

    xlC -o main main.o alib.so && LIBPATH=.:$LIBPATH ./main ; echo $?

Результат на экране:

    123
    
**Мораль**: на AIX, при динамической линковке библиотек, чтобы правильно работала статическая инициализация на С++, надо принудительно линковать конечный бинарь в режиме С++ (как бы это странно не звучало). Иначе конструкторы статических объектов вызваны не будут, и их инициализация будет произведена не ДО функции `main()`, а непонятно когда.

Можно принудительно заставить таки систему вызвать конструкторы статических объектов, написав что-то вроде:

{% codeblock lang:cpp %}
#include <dlfcn.h>

static int module_initialised = 0;
static void ManualInitilizationForStatics() {
  if (module_initialised) return;
  dlopen("blah.so", RTLD_NOW);
  module_initialised = 1;
}
{% endcodeblock %}

Но это не программирование, а ерзанье.
