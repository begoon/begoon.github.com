---
layout: post
title: "Список процессов в Windows"
language: russian
date: 2009-05-17 05:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/05/windows.html
categories:
- russian
---
Писал я как-то один QA тест, и нужно мне было понять — выполнятся ли сейчас определенный процесс или нет, и если да, то с какой командной строкой. Естественно, нужно и для UNIX и для Windows.

В UNIX в порядке вещей просто вызвать команду [ps][] через [popen()][] и распарсить текстовый вывод. Переносимо и надежно, так как для всех UNIXов ps всегда существует, и на этот факт можно положиться.

[ps]: http://en.wikipedia.org/wiki/Ps_(Unix)
[popen()]: http://www.opengroup.org/onlinepubs/007908799/xsh/popen.html

Для Windows же все оказалось чуть сложнее. Известная утилита `pslist` не является стандартной, и полагаться на нее опасно. Возиться с Windows API тоже не хотелось.

Я нашел вот такой способ. Через [_popen()][] (аналог UNIXового `popen()`) можно вызвать вот такую команду:

    WMIC PROCESS get Caption,Commandline,Processid

Получаем название процесса, командную строку и идентификатор процесса.

[_popen()]: http://msdn.microsoft.com/en-us/library/96ayss4b(VS.80).aspx

Конечно, не так задорно, как через ps, но зато стандартно.
