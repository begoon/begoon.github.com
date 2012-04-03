---
layout: post
title: "Функция задержки для класса PreciseTimer"
language: russian
date: 2009-02-05 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/blog-post_05.html
categories:
- cplusplus
- russian
---
Универсальный класс [Миллисекундный таймер для Windows и UNIX][], дающий возможность работать с миллисекундными интервалами времени в Windows и UNIX получил новую функцию:

{% codeblock lang:cpp %}
static void sleepMs(int ms);
{% endcodeblock %}

Эта функция реализует задержку в указанное число миллисекунд. Функция является статической, то есть ей можно пользоваться без создания экземпляра касса:

{% codeblock lang:cpp %}
ext::PreciseTimer::sleepMs(100);
{% endcodeblock %}

Необходимо учитывать, что в UNIX системах данная функция может быть прервана пришедшим системным сигналом, например, сигналом о полученных новых данных в буфер сокета. В этом случае задержка может быть меньне, чем ожидается.

Обновленный исходный текст класса и тестов находится по [старому адресу][Миллисекундный таймер для Windows и UNIX].

[Миллисекундный таймер для Windows и UNIX]: /blog/russian/2009/01/29/milliseconds-timer-for-windows-and-unix/
