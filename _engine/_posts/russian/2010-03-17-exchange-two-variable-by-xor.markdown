---
layout: post
title: "Обмен двух переменных через XOR"
language: russian
date: 2010-03-17 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/03/xor.html
categories:
- cplusplus
- russian
---
Чтобы поменять местами значения двух целочисленных переменных кроме как через использование дополнительной переменной, можно сделать так:

{% codeblock lang:cpp %}
a += b;
b = a - b;
a -= b;
{% endcodeblock %}

Интересно разве что с академической точки зрения. Но есть способ интереснее:

{% codeblock lang:cpp %}
a ^= b ^= a ^= b;
{% endcodeblock %}

который также меняет местами значения этих переменных.

**Update**: В комментариях подсказали грамотную ссылку ([Bit Twiddling Hacks][]) по трюкам с битовой арифметикой.

[Bit Twiddling Hacks]: http://graphics.stanford.edu/~seander/bithacks.html
