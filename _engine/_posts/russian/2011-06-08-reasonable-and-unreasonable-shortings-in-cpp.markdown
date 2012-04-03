---
layout: post
title: "Разумные и неразумные сокращения в C++"
language: russian
date: 2011-06-08 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/06/c.html
categories: 
- cplusplus
- russian
---
Вот вполне себе реальный код:

{% codeblock lang:cpp %}
const char* a = ::getenv("VAR");
if (a == NULL)
  a = "[NULL]";
{% endcodeblock %}

Но в каком-то внутреннем стремлении сделать код "немного лучше", можно написать так:

{% codeblock lang:cpp %}
const char* a = (a = ::getenv("VAR"), a ? a : "[NULL]");
{% endcodeblock %}

Мне внутренне больше нравиться второй вариант. Он как-то выразительнее. Но на code view я, конечно, буду настаивать однозначно на первом, так как не только мне одному этот код потом читать.

Также в С++ считается хорошим тоном объявлять переменную цикла `for` прямо в теле оператора:

{% codeblock lang:cpp %}
for (int i = 0; ...
{% endcodeblock %}

Но вот конструкции типа:

{% codeblock lang:cpp %}
if (int a = foo()) {
  ...
}
{% endcodeblock %}

или

{% codeblock lang:cpp %}
while (int a = foo()) {
  ...
}
{% endcodeblock %}

уже немного режут глаз, хотя и являются корректными.

А у вас какие есть прикольные сокращение? пусть даже не для production code?
