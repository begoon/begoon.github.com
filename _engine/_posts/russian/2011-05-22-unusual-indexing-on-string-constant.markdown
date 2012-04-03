---
layout: post
title: "Необычная индексация по строковой константе"
language: russian
date: 2011-05-22 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/05/blog-post.html
categories: 
- cplusplus
- russian
---
Признаюсь, мне никогда раньше не приходило в голову индексировать строковую константу прямо на месте. Например:

{% codeblock lang:cpp %}
#include <stdio.h>

int main() {
  int i;
  for (i = 0; i < 8; ++i)
    printf("%c", "12345678"[i]);
  printf("\n");
  return 0;
}
{% endcodeblock %}

Лично мне выражение `"12345678"[i]` как-то режет глаз. Хотя с точки зрения языка тут все в порядке.
