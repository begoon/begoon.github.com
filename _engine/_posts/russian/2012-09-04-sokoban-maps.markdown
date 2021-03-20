---
layout: post
title: "Уровни для Сокобана"
language: russian
date: 2012-09-04 22:12
comments: true
categories: 
- project
- pusher
- russian
- sokoban
---
Во времена XTшек и ДОС был у меня вариант Сокобана, реализованный в виде
махонького бинаря, размером менее десяти килобайт. Называлось это чудо [pusher.exe][] и выглядело вот так:

[pusher.exe]: /files/pusher.zip

![](/images/blog/pusher-sokoban-level-01.png)

Это был простой уровень, но как насчет вот такого?

![](/images/blog/pusher-sokoban-level-59.png)

*Элементарно запускается через DOSEmu: `DOSEmu -exit pusher.exe`.*

Кому лень запускать можно посмотреть демку:

<iframe width="640" height="360" src="https://www.youtube.com/embed/3zi-ZuL6GKI" frameborder="0" allowfullscreen></iframe>

И стало мне интересно, как шестьдесят уровней помещаются в столь небольшой
бинарь. Поковырявшись немного IDA'ой, я написал программку, которая выдирает
из бинаря `pusher.exe` все уровни и печатает их в текстовом виде:

    *************************************
    Maze: 1
    File offset: 148C, DS:00FC, table offset: 0000
    Size X: 22
    Size Y: 11
    End: 14BD
    Length: 50

        XXXXX
        X   X
        X*  X
      XXX  *XXX
      X  *  * X
    XXX X XXX X     XXXXXX
    X   X XXX XXXXXXX  ..X
    X *  *             ..X
    XXXXX XXXX X@XXXX  ..X
        X      XXX  XXXXXX
        XXXXXXXX

    *************************************
    
Можно [скачать сразу все уровни][sokoban-maps-60-plain.txt].

[sokoban-maps-60-plain.txt]: https://raw.github.com/begoon/sokoban-maps/master/maps/sokoban-maps-60-plain.txt

Уровни сжаты чем-то вроде Хаффмана -- битовыми цепочками переменной длины.
Каждый уровень кодируется следующим образом:

* Размер карты по X (1 байт).
* Размер карты по Y (1 байт).
* X*Y байт самой карты, которая представлена последовательностью пар 
  <СЧЕТЧИК><КОД СИМВОЛА>. СЧЕТЧИК - это либо один бит 0, если символ
  только один, либо четыре бита `1 D3 D2 D1`, и тогда количество повторений
  рассчитывается по формуле `N = 2 + D3*4 + D2*2 + D1`, то есть от 2-х до
  9-и символов. КОД СИМВОЛА имеет пять разных значений: 00 - пустое место,
  01 - стена, 10 - бочка, 110 - место для бочки, 111 - бочка, уже стоящая
  на месте. 
* Начальная позиция игрока по X (1 байт).
* Начальная позиция игрока по Y (1 байт).

И так все 60 уровней.

В файле [pushermaps.c][] можно увидеть весь нехитрый декомпрессор.

[pushermaps.c]: https://github.com/begoon/sokoban-maps/blob/master/pushermaps.c

В процессе [дизассемблирования][pusher.lst] образовались уровни в удобном
текстовом, но все еще сжатом виде, например:

    level_01        db 16h, 0Bh, 0A2h, 0DFh, 38h, 32h, 1Fh, 38h, 2Ah, 3, 0E6h
                    db 12h, 0C0h, 0A5h, 0F2h, 83h, 2, 81h, 3, 0E4h, 12h, 82h
                    db 25h, 6, 0CDh, 64h, 22h, 51h, 0ACh, 11h, 0A1h, 0Ah, 5
                    db 0E5h, 11h, 0B1h, 14h, 82h, 29h, 82h, 31h, 0A0h, 0E1h
                    db 2Ch, 18h, 0D1h, 0CFh, 80h, 0Ch, 8
    level_02        db 0Eh, 0Ah, 0F6h, 58h, 0Ch, 68h, 0Dh, 94h, 0C6h, 80h
                    db 85h, 2, 82h, 18h, 0D0h, 15h, 4Ch, 10h, 0C6h, 0C2h, 18h
                    db 21h, 8Dh, 1, 6, 4, 39h, 10h, 0A0h, 81h, 80h, 85h, 2
                    db 8, 20h, 60h, 34h, 1Bh, 0Ch, 1Eh, 0CAh, 7, 4
    level_03        db 11h, 0Ah, 0E3h, 9Fh, 0Eh, 7, 0C2h, 11h, 42h, 1Fh, 8
                    db 50h, 23h, 0E0h, 85h, 4, 0Ch, 1Eh, 84h, 8, 0A6h, 0B4h
                    db 10h, 85h, 2, 82h, 59h, 0D4h, 28h, 14h, 90h, 0D6h, 83h
                    db 0DFh, 7Ch, 0Eh, 1

И т.д. 

Так что если захочется где-нибудь забацать свой простенький и компактный 
Сокобан, какое-то количество уровней можно
[взять готовыми][sokoban-maps-60-compressed.txt].

[pusher.lst]: https://github.com/begoon/sokoban-maps/blob/master/disasm/pusher.lst
[sokoban-maps-60-compressed.txt]: https://github.com/begoon/sokoban-maps/blob/master/maps/sokoban-maps-60-compressed.txt

Знаю, что в интернете полно уровней для Сокобана, и автоматические решалки
имеются, но это совершенно не отменяет фан копания дизассемблером в бинаре
более чем двадцати летней давности.

Проект на GitHub'e -- https://github.com/begoon/sokoban-maps, если кому
интересно.
