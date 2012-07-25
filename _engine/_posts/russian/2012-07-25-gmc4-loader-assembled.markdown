---
layout: post
title: "Загрузчик для GMC-4 в сборе"
language: russian
date: 2012-07-25 20:06
comments: true
categories: 
- gmc-4
- gmc4
- project
- russian
---
Захотелось мне тоже смастерить загрузчик для [GMC-4][Микрокомпьютер GMC-4]. По совету того же Сергея Вакуленко решено было использовать вот такого зверя:

[Микрокомпьютер GMC-4]: /blog/russian/2012/07/04/gmc-4/

![](/images/blog/gmc4-loader/ubw-proto-pic.jpg)

Это [USB Bit Whacker][]. Сборка на PIC18, которая со своей стандартной прошивкой позволяет управлять пачкой входов и выходов через простейший ["птичий" язык][UBW FW 1.49], команды которого подаются через виртуальный последовательный порт.

[USB Bit Whacker]: http://www.sparkfun.com/products/762
[UBW FW 1.49]: http://schmalzhaus.com/UBW/Doc/FirmwareDDocumentation_v149.html

Схема.

![](/images/blog/gmc4-loader/gmc4-loader-schematic.jpg)

Сначала макет.

<iframe width="640" height="360" src="http://www.youtube.com/embed/eg6OZMAI5mg" frameborder="0" allowfullscreen></iframe>

Травить плату было лень, поэтому слепил на макетной. Выглядит неказисто, но работает.

![](/images/blog/gmc4-loader/IMG_0586.JPG)

![](/images/blog/gmc4-loader/IMG_0587.JPG)

![](/images/blog/gmc4-loader/IMG_0588.JPG)

![](/images/blog/gmc4-loader/IMG_0590.JPG)

![](/images/blog/gmc4-loader/IMG_0589.JPG)

В работе.

<iframe width="640" height="360" src="http://www.youtube.com/embed/F2tciUH0NFg" frameborder="0" allowfullscreen></iframe>

Все таки GMC-4 -- вещь!

P.S. Выложил исходник на Github -- [gmc4-loader][]. Если написать на Питоне или Руби,  будет еще проще. А программирование последовательных портов в UNIX -- это круто.

[gmc4-loader]: https://github.com/begoon/gmc4-loader/
