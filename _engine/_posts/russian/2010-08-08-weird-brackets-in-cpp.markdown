---
layout: post
title: "Странные скобки в С++"
language: russian
date: 2010-08-08 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/08/blog-post_08.html
categories:
- cplusplus
- russian
---
Недавно более часа потратил на поиск проблемы в куске кода, упрощенный вариант которого привожу ниже:

{% codeblock lang:cpp %}
#include <iostream>
int x;
struct A {
  A(int a) {
    x = a;
  }
};
struct B {
  B(A a) {
    A local_a = a;
  }
};
int main() {
  x = 0;
  std::cout << "Case #0: " << x << std::endl;
  B b1(A(1));
  std::cout << "Case #1: " << x << std::endl;
  int t;
  t = 2;
  B b2(A(t));
  std::cout << "Case #2: " << x << std::endl;
  t = 3;
  B b3((A(t)));
  std::cout << "Case #3: " << x << std::endl;
  return 0;
}
{% endcodeblock %}

Как вы думаете, что должна вывести эта программа? Числа 0, 1, 2 и 3 последовательно для каждого случая?

А она печатает:

    Case #0: 0
    Case #1: 1
    Case #2: 1
    Case #3: 3

Почему для случая #2 не произошло присваивание? Куда делась двойка? 

[Ответ на этот вопрос][Темные углы C++] кроется в наличии рудиментов языка С в грамматике С++.

[Темные углы C++]: /blog/russian/2009/02/09/dark-corners-of-cpp/
