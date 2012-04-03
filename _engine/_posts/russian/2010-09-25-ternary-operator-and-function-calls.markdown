---
layout: post
title: "Тернарный '?' оператор и вызов функций"
language: russian
date: 2010-09-25 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/09/blog-post_25.html
categories:
- cplusplus
- russian
---
Был удивлен, когда компилятор С съел вот такой забавный способ условного вызова функций:

{% codeblock lang:cpp %}
#include <stdio.h>
#include <math.h>
int main() {
  int i;
  for (i = 0; i <= 1; ++i) {
    float a = (i ? floor : ceil) (10.5);
    printf("%d: %f\n", i, a);
  }
  return 0;
}
{% endcodeblock %}

Для С++ надо написать:

{% codeblock lang:cpp %}
#include <stdio.h>
#include <cmath>
int main() {
  int i;
  typedef float (*f)(float);
  for (i = 0; i <= 1; ++i) {
    float a = (i ? (f)std::floor : (f)std::ceil) (10.5);
    printf("%d: %f\n", i, a);
  }
  return 0;
}
{% endcodeblock %}

или

{% codeblock lang:cpp %}
#include <stdio.h>
#include <cmath>
int main() {
  int i;
  for (i = 0; i <= 1; ++i) {
    float a = (i ? std::floorl : std::ceill) (10.5);
    printf("%d: %f\n", i, a);
  }
  return 0;
}
{% endcodeblock %}

Все программы выводят:

    0: 11.000000
    1: 10.000000
