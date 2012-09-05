---
layout: post
title: "Levels for Sokoban"
language: english
date: 2012-09-04 22:12
comments: true
categories: 
- english
- project
- pusher
- sokoban
---
At the times of XTs and DOS I loved playing Sokoban. The game I had was a
tiny executable (less than 10Kb) for DOS called [pusher.exe][]:

[pusher.exe]: /files/pusher.zip

![](/images/blog/pusher-sokoban-level-01.png)

That was the first, simplest level, but how about this one?

![](/images/blog/pusher-sokoban-level-59.png)

*The game perfectly works in DOSEmu: `DOSEmu -exit pusher.exe`.*

Lazy people can checkout a quick video instead:

<iframe width="640" height="360" src="http://www.youtube.com/embed/3zi-ZuL6GKI" frameborder="0" allowfullscreen></iframe>

I was curious how 60 maps fitted into such a tiny executable. After a bit 
of fiddling with IDA I wrote a simple program to extract the maps from the
`pusher.exe` binary and print them out. For example:

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
    
All the map [are available][sokoban-maps-60-plain.txt].

[sokoban-maps-60-plain.txt]: https://raw.github.com/begoon/sokoban-maps/master/maps/sokoban-maps-60-plain.txt

The maps are compressed with a Huffman-like approach using bit sequences
of variable length. Each level has the following structure:

* map size X (1 byte)
* map size Y (1 byte)
* X*Y bytes of the map represented as a sequence of pairs \<COUNTER>\<CODE>.
  \<COUNTER> is either a single 0 bit which means one repetition,
  or four bits `0 D3 D2 D1`, where the number of repetitions
  `N = 2 + D3*4 + D2*2 + D1` (values 2 to 9). \<CODE> has five different 
  values: 00 - an empty space, 01 - a wall, 10 - a barrel, 101 - a place
  for the barrel, 111 - a barrel already in place.
* Player's start position X (1 byte)
* Player's start position Y (1 byte)

And so for all 60 maps.

In the file [pushermaps.c][] there is an implementation of the simple
decompressor.

[pushermaps.c]: https://github.com/begoon/sokoban-maps/blob/master/pushermaps.c

When [disassembling][pusher.lst] the maps also had been presented in the
convenient plain text form but still compressed.

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
                    
... etc. 

So if you'd like to implement a quick and compact Sokoban for some reason,
there is a [bunch of already created and nicely compressed maps][sokoban-maps-60-compressed.txt].

[pusher.lst]: https://github.com/begoon/sokoban-maps/blob/master/disasm/pusher.lst
[sokoban-maps-60-compressed.txt]: https://github.com/begoon/sokoban-maps/blob/master/maps/sokoban-maps-60-compressed.txt

I know that there are tons of levels for Sokoban in the internet, plus
automated Sokoban solvers and similar stuff. But it still doesn't make
all that fun of dissecting the twenty years old or more binary less
interesting.

The project is available at GitHub'e -- https://github.com/begoon/sokoban-maps.
