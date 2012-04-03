---
layout: post
title: "Radio-86RK emulator in JavaScript"
language: english
date: 2009-10-02 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/10/radio-86rk-emulator-in-javascript.html
categories: 
- project
- radio86
- english
---
*Note: This post contains lots of information on Russian and links to resources on Russian. Unfortunately it's not possible to translate certain things like original 8-bit games output written ages ago or original screenshots. In this post I'm mostly keen on emotions and memories when you see the machine given your basics right in a web browser and it is reconstructed bit by bit just in pure JavaScript.*

The first computer I started programming on was [Radio-86RK][]. My brother built it... and it got started and keeps going up to nowadays.

[Radio-86RK]: http://en.wikipedia.org/wiki/History_of_computer_hardware_in_Soviet_Bloc_countries#Radio-86RK

That is why I still have a tender affection for this little 8-bit piece of hardware. As the result of this affection I have been writing its emulators.

The first one was for DOS. I still keep its [original web site][Emulator for DOS] without any changes. That emulator was quite powerful: the built-in debugger, the game cracking mechanism etc. But DOS time was over and now that emulator works properly only in [DosBox][]. The sources are [available for download][Emulator for DOS sources].

[Emulator for DOS]: /projects/radio86/emulator/dos/
[DosBox]: http://www.dosbox.com/
[Emulator for DOS sources]: /projects/radio86/emulator/dos/download.html

The next generation of dear RK was already for Windows and based on [SDL][]. But there was no the built-in debugger and the project itself seems to be unfinished but runnable and allowing to still play games. That is why its [binary only but accompanied with bunch of games][Emulator for Windows] is available on public.

[SDL]: http://www.libsdl.org/
[Emulator for Windows]: /projects/radio86/emulator/windows/radio86-0.0.1.zip

But a couple of days ago I have come across this - the [emulator of Sinclair ZX Spectrum][jsspeccy] written on pure JavaScript (no applets, activex etc.)

[jsspeccy]: http://matt.west.co.tt/spectrum/jsspeccy/

I was impressed and inspired so after a day or two my old little RK monster has been born again and its new platform is JavaScript. It seems that proper browsers now already provide quite good JavaScript performance. 2D graphics are implemented via `canvas` HTML5 tag.

The project comes out as [Radio-86РК in JavaScript][] (in Russian).

[Radio-86РК in JavaScript]: http://code.google.com/p/radio86/

The emulator and games live in the one single file [radio86.html][]. By clicking on this link the emulator gets started right in a browser. There is the game selector at the bottom, and the possibility to play around with screen dimensions and speed.
Even if you do not understand Russian there is no problem at all. Just launch the emulator, select a game and try to play. Most of games use the arrows for movements and the space bar to shoot/jump/take/etc. You will definitely feel the spirit of those 8-bit B&W dodgy games. Have a fun!

[radio86.html]: http://radio86.googlecode.com/hg/online/radio86.html

In general the emulation works on the Intel 8080 commands level.

Here is the screenshot of the classic game Volcano from the emulator.

{% img /images/blog/radio86-volcano.png %}

At the moment I've tested the emulator in the Google Chrome 4.* only. I'm not quite keen about any compatibility with other browsers but let's see how it goes along. IE (even version 8) does not definitely handle it properly but Firefox and Opera could try.

The wonderful 8-bit world of Radio-86RK is coming back!

**Update**: Version 0.3 is released. It works much faster and does not thrash CPU anymore. Also I have included a few applications (interpreters, compilers, tools etc.)
