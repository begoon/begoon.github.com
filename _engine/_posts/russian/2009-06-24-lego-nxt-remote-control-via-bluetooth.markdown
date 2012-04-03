---
layout: post
title: "Управление Lego NXT через bluetooth"
language: russian
date: 2009-06-24 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/06/lego-nxt-remote-control-via-bluetooth.html
categories:
- project
- russian
---
Продолжаю постепенно выкладывать на Google Code свои проекты.

На этот раз это эксперимент годовалой давности — удаленное управление для [Lego NXT][] через апплет, работающий на сотовом телефоне.

[Lego NXT]: http://www.mindstorms.ru/

Назвал незамысловато — [nxtbtrc][].

[nxtbtrc]: http://code.google.com/p/nxtbtrc

Все просто — запускается на телефоне апплет, он спаривается с NXT и потом может посылать на него команды. В целом ничего сложного, просто было интересно разобраться как работать с синим зубом в апплетах. 

Врядли я там чего еще буду модифицировать, но может кому и пригодится.

Даже книжку, помню, для этого специально купил. Хорошая, кстати, книжка. Все доступно и понятно о bluetooth с точки зрения программиста. Рассмотрены несколько стеков разных производителей, их сравнение и использование на разных языках и платформах.

Albert Huang, Larry Rudolph

[Bluetooth Essentials for Programmers][]

[Bluetooth Essentials for Programmers]: http://www.amazon.co.uk/Bluetooth-Essentials-Programmers-Albert-Huang/dp/0521703751/

{% img /images/covers/english/bluetooth-essentials-for-programmers-cover.jpg %}

**Обновление**: Небольшое видео, демонстрирующее все в работе:

{% youtube F0HW3Mth0Pw %}

Посты по теме:

* [Хостинг на Google Code: SerialCom][]
* [Скрипты на Lua в С++][]

[Хостинг на Google Code: SerialCom]: /blog/russian/2009/06/07/googlecode-hosting-serialcom/
[Скрипты на Lua в С++]: /blog/russian/2009/06/12/lua-scripts-in-cpp/
