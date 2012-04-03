---
layout: post
title: "parseInt() в JavaScript"
language: russian
date: 2010-04-02 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/04/parsetint-javascripte.html
categories:
- russian
---
Напоролся на совершенно замечательное поведение в `parseInt()`'e.

Я думал, что код ниже должен давать мне числа от 0 до 9:

{% codeblock lang:javascript %}
var n = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09' ];
for (var i = 0; i < n.length; ++i)
  document.writeln(parseInt(n[i]))
{% endcodeblock %}

Но выводится:

   0 1 2 3 4 5 6 7 0 0

И это поведение законно, так как лидирующие нули рассматриваются как признак восьмеричного числа, а 8 и 9 не являются восьмеричными знаками.

Правильно надо писать так:

{% codeblock lang:javascript %}
var n = [ '00', '01', '02', '03', '04', '05', '06', '07', '08', '09' ];
for (var i = 0; i < n.length; ++i)
  document.writeln(parseInt(n[i], 10));
{% endcodeblock %}

По хорошему, второй аргумент `parseInt()`'а, задающий систему исчисления, должен быть обязательным, чтобы исключить путаницу.
