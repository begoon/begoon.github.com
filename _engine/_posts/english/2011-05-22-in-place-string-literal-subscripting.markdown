---
layout: post
title: "In-place string literal subscripting"
language: english
date: 2011-05-22 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/05/in-place-string-literal-subscripting.html
categories: 
- cplusplus
- english
---
I confess, I had never occurred before to subscript a string literal in-place. For example:

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

To me personally the expression `"12345678"[i]` cuts the eye. But from the language point of view everything is fine.
