---
layout: post
title: "GMC-4 Microcomputer USB loader"
language: english
date: 2012-07-25 20:06
comments: true
categories: 
- english
- gmc-4
- gmc4
- project
---
I decided to build my own USB loader for [GMC-4][GMC-4 Microcomputer]. Following the advice of Serg Vakulenko, the following board was purchased:

[GMC-4 Microcomputer]: /blog/english/2012/07/04/gmc-4/

![](/images/blog/gmc4-loader/ubw-proto-pic.jpg)

This is a [USB Bit Whacker][], a development board based on PIC18. Its default firmware allows to control I/O pins via [simple commands][UBW FW 1.49] over a virtual serial port.

[USB Bit Whacker]: http://www.sparkfun.com/products/762
[UBW FW 1.49]: http://schmalzhaus.com/UBW/Doc/FirmwareDDocumentation_v149.html

Schematic.

![](/images/blog/gmc4-loader/gmc4-loader-schematic.jpg)

A prototype.

<iframe width="640" height="360" src="http://www.youtube.com/embed/eg6OZMAI5mg" frameborder="0" allowfullscreen></iframe>

I was lazy to etch the board, so soldered manually. Looks unsightly but works.

![](/images/blog/gmc4-loader/IMG_0586.JPG)

![](/images/blog/gmc4-loader/IMG_0587.JPG)

![](/images/blog/gmc4-loader/IMG_0588.JPG)

![](/images/blog/gmc4-loader/IMG_0590.JPG)

![](/images/blog/gmc4-loader/IMG_0589.JPG)

In action.

<iframe width="640" height="360" src="http://www.youtube.com/embed/F2tciUH0NFg" frameborder="0" allowfullscreen></iframe>

After all, GMC-4 is THE thing!

P.S. The sources are available on Github -- [gmc4-loader][]. I suspect that in Python or Ruby it might be much nicer, but it was a nice exercise programming serial ports in UNIX.

[gmc4-loader]: https://github.com/begoon/gmc4-loader/
