@language: english
@date: 2012-12-26 22:00
@tags: serial, vga

A Serial VGA adapter
====================

I have tested a quite interesting breakout board -- [Serial VGA][]. It
allows to organize multi-windows textual output via RS-232 (TTL) on a VGA
monitor.

[Serial VGA]: http://www.hobbytronics.co.uk/serial-vga

![](IMG_1284.jpg)

![](IMG_1284.jpg)

The maximum window size is 100x50 with 64 colours. It supports up to 9
windows simultaneously. Each window is controlled independently via
special escape (`^[`) sequences.

![](serial-vga-5.jpg)

In general -- very useful for small projects on microcontrollers if you don't
bother doing VGA output by yourself (RS-232 output can be implemented even
manually if your microcontroller doesn't support it for some reason). I also
tested Serial VGA with Raspberry Pi. The only recommendation is to support the
CTS signal line on baud rates faster than 9600. Otherwise the device can loose
some characters.

[The Serial VGA datasheet][].

[The Serial VGA datasheet]: SerialVGA-1.0.pdf
