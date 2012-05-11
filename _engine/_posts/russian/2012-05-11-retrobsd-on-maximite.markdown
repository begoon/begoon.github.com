---
layout: post
title: "RetroBSD на Maximite"
language: russian
date: 2012-05-11 20:48
comments: true
categories: 
- maximite
- retrobsd
- russian
---
Я [уже писал][Maximite: Ностальгия по временам Радио-86РК и Спектрума с паяльником в руках], как собирал Maximite.

[Maximite: Ностальгия по временам Радио-86РК и Спектрума с паяльником в руках]: /blog/russian/2012/01/19/maximite-kit/

Вчера как-то был настрой, и решил я поставить туда [RetroBSD][].

RetroBSD -- это настоящий UNIX, являющийся наследником 2.11BSD и предназначенный для встраиваемых систем с фиксированной структурой памяти. На текущий момент работает на микроконтроллере Microchip PIC32 с 128 килобайтами памяти и 512 килобайтами Flash. Данный процессор позволяет разделять адресное пространство ядра и пользовательских процессов.

RetroBSD обеспечивает защиту памяти ядра, используя аппаратные возможности микропроцессора, полноценную вытесняющую многозадачность, POSIX API (fork, exec, wait4 и т.д.). Можно писать программы прямо на устройстве, так как есть компилятор С. Ядро системы прошивается в кристалл, а файловая система загружается с SD-карты.

RetroBSD поддерживает не только аппаратуру Maximite, но и ряд альтернативных устройств на базе PIC32 (chipKIT Max32, Sparkfun UBW32, Microchip Explorer 16, Microchip PIC32 USB/Ethernet Starter Kit, Olimex Duinomite, Duinomite-Mini и Duinomite-Mega, eflightworks).

После небольшой возни с [программой-загрузчиком][mphidflash] и [установкой необходимых библиотек][installation], получилось все собрать и залить на устройство.

[RetroBSD]: http://retrobsd.org/
[mphidflash]: http://code.google.com/p/mphidflash/
[installation]: http://retrobsd.org/wiki/installation-2/

Торжественный момент включения, и...

![](/images/blog/retrobsd-on-maximite-login.png)

Это UNIX!

Сначала, конечно, игры. Питон, он же Червяк.

![](/images/blog/retrobsd-on-maximite-worm.png)

Пасьянс:

![](/images/blog/retrobsd-on-maximite-canfield.png)

Я теперь немного посерьезнее -- Forth.

![](/images/blog/retrobsd-on-maximite-forth.png)

На данный момент RetroBSD работает только через последовательный порт и не поддерживает VGA и PS/2, но у Сергея Вакуленко, автора RetroBSD, есть планы написать эти драйвера.
