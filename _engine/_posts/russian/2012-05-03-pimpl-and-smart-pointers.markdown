---
layout: post
title: "Pimpl и умные указатели"
language: russian
date: 2012-05-03 23:47
comments: true
categories: 
- cplusplus
- russian
- stl
---
Порой понимаешь, что не знаешь каких-то банальных вещей. Сегодня на повестке дня Pimpl и умные указатели. Я почему-то был уверен, что forward class declaration можно делать только если класс используется в форме указателя или ссылки (#1), то есть тексте записывается в форме `T*` или `T&` (#2). Поэтому, когда мне надо было реализовать Pimpl, я не использовал умные указатели, так как с виду для них требуется полное определение класса.

`A.h`:
{% codeblock lang:cpp %}
#include <memory>
class A_pimpl;
class A {
  ...
  std::unique_ptr<A_pimpl> p;
}
{% endcodeblock %}

Я почему-то думал, что это не будет работать из-за неопределенности класса `A_pimpl`. И был сильно удивлен, попробовал и узнав, что на самом деле это прекрасно работает. То есть факт #1 не эквивалентен факту #2.

В `A.cpp` можно теперь спокойно писать:

{% codeblock lang:cpp %}
#include "A.h"
#include "pimpl.h"

A::A() : p(new A_pimpl()) {}
{% endcodeblock %}

Все выше сказанное также работает для `std::shared_ptr` (C++ 2011), `boost::scoped_ptr` и `boost::shared_ptr`.

**Дополнение**

Как меня поправили в комментариях, у класса `A` обязательно должен быть явно задан деструктор, причем его тело должно быть именно в `A.cpp`, а не в заголовочном файле. Иначе будет ошибка типа "error C2338: can't delete an incomplete type".

`A.h`:
{% codeblock lang:cpp %}
#include <memory>
class A_pimpl;
class A {
  A();
  ~A();
  std::unique_ptr<A_pimpl> p;
}
{% endcodeblock %}

и `A.cpp`:

{% codeblock lang:cpp %}
#include "A.h"
#include "pimpl.h"

A::A() : p(new A_pimpl()) {}
A::~A() {}
{% endcodeblock %}
