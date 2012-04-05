---
layout: post
title: "Git для работы на нескольких платформах"
language: russian
date: 2011-11-22 01:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/11/git.html
categories: 
- git
- russian
---
Мне приходится часто проверять один и тот же код на нескольких платформах. Это означает, что исходники надо физически копировать с машины на машину. Далее начинаются мелкие правки на каждой платформе, которые надо в конце собрать вместе и пробовать снова.

После десятков версий изощренных скриптов я решил собрать волю в кулак и начать использовать Git.

Задача: на виндовой машине (это мой основной рабочий ноутбук) установить Git как сервер, чтобы я мог всегда иметь на нем самую актуальную копию всего. Затем установить Git как клиент на рабочих машинах и обмениваться commit'ами через центральный репозиторий на Windows.

Для простоты я решил использовать SSH как протокол. Благо все UNIX машины имеют ssh-клиент.

Плюсы - везде Git, все локальные изменения имеют версии и можно вести локальные ветки. Ну и центральная копия - тоже под Git. Минусы - потратить время и все это настроить.

Git/ssh как сервер на Windows - это целая тема, так как нужно поставить SSH сервер и правильно прикрутить к нему Git.

Благодаря двум ([1][Setting up a Msysgit Server with copSSH on Windows], [2][Setup a Git server on Windows machine, with MSysGit and CopSSH]) ссылкам удалось настроить [CopSSH][] в паре с [msysgit][].

[CopSSH]: http://www.itefix.no/i2/copssh
[msysgit]: http://code.google.com/p/msysgit/

Далее Git на клиентских машинах. С Linux и Windows все совсем просто (на Windows используется тот же msysgit).

На Solaris пришлось собрать GNU Make до 3.82 (на 3.75 Git не собирается).

На HPUX and AIX пришлось собрать coreutils (для нормального install), less (представляете, на HPUX нету less по умолчанию), python (опять для HPUX), zlib и свежие tcl/tk.

Один день на борьбу c CopSSH на Windows и день на сборки под UNIXами.

Зато теперь радость и благодать.

P.S. С CopSSH интересная история. Вчера (21 ноября) на их сайте можно было все скачать. Сегодня (22 ноября) читаю на том же сайте:

> Termination of free solutions from ITeF!x

> Submitted by tk on Tue, 22/11/2011 - 08:18 itefix

> Development,distribution and support of free solutions from Itefix are now terminated due to lack of time and changes in priorities.

С их зеркала на sourceforge.net также пропали все файлы. Хорошо, что я не удалил дистрибутив CopSSH, скачанный вчера.

Ссылки по теме:

* [Setting up a Msysgit Server with copSSH on Windows][]
* [Setup a Git server on Windows machine, with MSysGit and CopSSH][]

[Setting up a Msysgit Server with copSSH on Windows]: http://www.timdavis.com.au/git/setting-up-a-msysgit-server-with-copssh-on-windows/
[Setup a Git server on Windows machine, with MSysGit and CopSSH]: http://java2cs2.blogspot.com/2010/03/setup-git-server-on-windows-machine.html

