---
layout: post
title: "volatile - это очень сильный модификатор в С++"
language: russian
date: 2010-08-01 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/08/volatile.html
categories:
- cplusplus
- russian
---
Как-то по многим блогам эта тема недавно пробегала, но надо отдать должное, вопрос почему эта программа, будучи откомпилированной в Студии, печатает "1" вместо "0", озадачивает даже опытных программистов на С++ (или по крайней мере они дают неправильное объяснение причины происходящего).

{% codeblock lang:cpp %}
#include <iostream>
volatile const char* p = "0";
int main() {
  std::cout << p << std::endl;
  return 0;
}
{% endcodeblock %}

Для получение схожего эффекта в GCC надо заменить "0" на "false".
