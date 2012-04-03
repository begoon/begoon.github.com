---
layout: post
title: "Безопасный sizeof для массивов в С++"
language: russian
date: 2011-05-24 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/05/blog-post_24.html
categories: 
- cplusplus
- russian
---
Иногда приходится иметь дело с обычными массивами и указателями на них в С++. Также иногда встает задача определения количества элементов массиве на стадии компиляции.

Например, это можно слелать так:

{% codeblock lang:cpp %}
#define arraysize(array) (sizeof(array) / sizeof(array[0]))
{% endcodeblock %}

Но тут есть одна проблема. Если случайно передать в этот макрос не массив, а просто указатель, что ошибки компиляции не будет, но значение будет далеко от задуманного.

Вчера [прочитал на Харбе][Статья на Хабре] (кстати, отличная статья), что в С++ можно сделать этот макрос более безопасным.

[Статья на Хабре]: http://habrahabr.ru/blogs/google_chrome/119815/

Вот [код, который используется в Chrome][Код в Хроме]:

[Код в Хроме]: http://codesearch.google.com/codesearch/p?hl=en#OAMlx_jo-ck/src/base/basictypes.h&q=arraysize&exact_package=chromium

{% codeblock lang:cpp %}
template <typename T, size_t N>
char (&ArraySizeHelper(T (&array)[N]))[N];
#define arraysize(array) (sizeof(ArraySizeHelper(array)))
{% endcodeblock %}

Выглядит немного запутанно, но можно разобраться:

* `T (&array)[N]` - определение массива (`T array[N]`), который передается по ссылке
* `char (&ArraySizeHelper(...)[N]` - функция, возвращающая массив по ссылке
* `sizeof(ArraySizeHelper(array))` - определение размера возвращаемого функцией значения
* Все это шаблон функции, параметризированный типом массива и его размером, который автоматически определяется компилятором при раскрытии шаблона. Так как функция реально не вызывается, то и тело ее определять не нужно.

Если честно, додуматься до такого непросто. Но макрос весьма хорош. Я взял себе на вооружение.

Кстати, можно поиграться с `sizeof()` от типа возвращаемого функцией значения:

{% codeblock lang:cpp %}
#include <iostream>
#include <string>

std::string f() {
  return std::string();
}

int main() {
  std::cout << sizeof( (&f)() ) << std::endl;
  std::cout << sizeof( std::string ) << std::endl;
  return 0;
}
{% endcodeblock %}

У меня на VS2010 выводит два раза число "28".

Интересно, что в чистом С такой номер тоже проходит:

{% codeblock lang:cpp %}
#include <stdio.h>

struct t {
  char x[1024];
};

struct t f() {
  struct t a;
  return a;
}

int main() {
  printf("%d\n", sizeof(struct t));
  printf("%d\n", sizeof( (*f)() ));
  return 0;
}
{% endcodeblock %}

Печатает два раза "1024".
