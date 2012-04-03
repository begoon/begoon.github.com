---
layout: post
title: "return со значением для void-функции"
language: russian
date: 2010-06-12 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/06/return-void.html
categories:
- cplusplus
- russian
---
Я как-то думал, что для void-функций оператор return не может иметь ничего, кроме пробелов, перед завершающей его точкой с запятой. Оказывается, что нет. Visual Studio съела без каких-либо жалоб вот такой код:

{% codeblock lang:cpp %}
void v() {}
void f(){ 
  return v();
}

int main() {
  f();
}
{% endcodeblock %}
