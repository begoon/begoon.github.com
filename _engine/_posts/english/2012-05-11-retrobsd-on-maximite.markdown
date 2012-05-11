---
layout: post
title: "RetroBSD on Maximite"
language: english
date: 2012-05-11 20:48
comments: true
categories: 
- english
- maximite
- retrobsd
---
I [wrote][Maximite - 8-bit nostalgia with a soldering iron] how I built Maximite.

[Maximite - 8-bit nostalgia with a soldering iron]: /blog/english/2012/01/19/maximite-kit/

Yesterday I was in mood and decided to install [RetroBSD][] there.

RetroBSD is a real UNIX, derived from 2.11BSD and intended for embedded systems with fixed memory mapping. Its target platform is Microchip PIC32 microcontroller with 128KB RAM and 512KB of Flash, which can provide flexible RAM partitioning between user and kernel modes. 

RetroBSD implements real preemptive multitasking and memory protection using hardware capabilities. It provides standard POSIX API (fork, exec, wait4, etc.), plus it may have a C compiler in the system allowing on-board development. The kernel is burned into the chip and the filesystem is loaded from an SD-card.

RetroBSD works not only on Maximite, but also on a few alternative boards based on PIC32 (chipKIT Max32, Sparkfun UBW32, Microchip Explorer 16, Microchip PIC32 USB/Ethernet Starter Kit, Olimex Duinomite, Duinomite-Mini and Duinomite-Mega, eflightworks).

After a little fiddling around with the [bootloader][mphidflash] and [library dependencies][] I managed to build the binaries and upload them onto the device. 

[RetroBSD]: http://retrobsd.org/
[mphidflash]: http://code.google.com/p/mphidflash/
[library dependencies]: http://retrobsd.org/wiki/installation-2/

A solemn moment of powering on...

![](/images/blog/retrobsd-on-maximite-login.png)

This is UNIX!

Of course, games first. The Worm.

![](/images/blog/retrobsd-on-maximite-worm.png)

Canfield

![](/images/blog/retrobsd-on-maximite-canfield.png)

Now a bit of programming -- Forth.

![](/images/blog/retrobsd-on-maximite-forth.png)

At the moment RetroBSD only communicates via the serial port and doesn't support VGA and PS/2 interfaces provided by Maximite, but Serge Vakulenko, the author, has their support in the roadmap.
