---
layout: post
title: "Эмулятор x86 на JavaScript, на котором работает Linux"
language: russian
date: 2011-05-17 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/05/x86-javascript-linux.html
categories: 
- russian
---
Установите свежий браузер (FF4 или Chrome 11) и просто сходите по указанной ссылке.

[http://bellard.org/jslinux/](http://bellard.org/jslinux/)

Посмотрите, как прямо в вашем браузере загрузится Linux. Запустите ls, top, emacs, vi, df, ifconfig, ping и т.д. Попробуйте скомпилировать и запустить программу `tcc hello.c && ./a.out`.

А теперь осознайте - это все чистая программная эмуляция x86 ([подробности][]).

[подробности]: http://bellard.org/jslinux/tech.html

[Мой эмулятор Intel 8080 и Радио-86РК][] просто ничто, по сравнению с этим.

[Мой эмулятор Intel 8080 и Радио-86РК]: http://radio86.googlecode.com/

У меня до сих пор небольшой шок от увиденного.

Когда-то я был уже удивлен до глубины души одним из проектов ([Загрузка Linux без ядра за 25 секунд][]) этого товарища, но это...

[Загрузка Linux без ядра за 25 секунд]: /blog/russian/2009/03/08/boot-linux-without-kernel-in-25-seconds/
