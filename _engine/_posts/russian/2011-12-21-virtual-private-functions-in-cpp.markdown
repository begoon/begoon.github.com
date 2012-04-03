---
layout: post
title: "Виртуальные private-функции в C++"
language: russian
date: 2011-12-21 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/12/private-c-virtual-private-functions-in.html
categories: 
- cplusplus
- russian
---
Наткнулся на интересный, как мне показалось, код. Там использовалась виртуальная private функция. Прием немного странный, но сейчас не об этом.

Сначала мне показалось, что такой код не должен компилироваться, так как если функция private, она недоступна для использования в дочерних классах. Наблюдался какой-то очередной пробел в моих знаниях по C++.

Я написал программу:

{% codeblock lang:cpp %}
#include <iostream>

class A {
public:
  void bar() { foo(); }
private:
  virtual void foo() = 0;
};

class B: public A {
private:
  virtual void foo() { std::cout << "B::foo()" << std::endl; }
};

int main(int argc, char* argv[]) {
  A* a = new B();
  a->bar();
  delete a;
  return 0;
}
{% endcodeblock %}

И VS2010 и GCC прекрасно его съели, и программа печатает "B::foo()".

Напрашивание такое объяснение - механизм виртуальных функций (технически переопределение функций через vtable) - это runtime, а public/private - это compile time. Получается, что в compile time все законно, и разделение на private/protected/public не зависит от виртуальности функции, а в runtime класс B просто подставляет другую функцию через vtable уже вне зависимости от private/public.
