---
layout: post
title: "The Saleae Logic digital circuit analyzer"
language: english
date: 2012-09-07 22:02
comments: true
categories: 
- english
- oscilloscope
- saleae
---
When playing with the [GMC-4 microcomputer][] and thinking about 
[an automated loader][GMC-4 Microcomputer USB loader] for it, I realised that
having an oscilloscope would be a nice idea because I wouldn't figure
out how the GMC-4 keyboard works only with a simple tester. It didn't happen
to buy a *proper* oscilloscope like Rigol, for instance, but 
[Viacheslav Slavinsky][] suggested to take a look at an interesting option:
[Saleae Logic][]. Of course, this is **not** a regular oscilloscope, but a
simple digital channel analyzer capable to capture 8 or 16 channels
simultaneously and decode protocol like UART, SPI, I2C or others. Exactly
what I wanted.

[GMC-4 microcomputer]: /blog/english/2012/07/04/gmc-4/
[GMC-4 Microcomputer USB loader]: /blog/english/2012/07/25/gmc4-loader-assembled/

[Viacheslav Slavinsky]: http://sensi.org/~svo/
[Saleae Logic]: http://www.saleae.com/logic/

It costs 128€ + 25.80€ VAT for the 8 channel model. They have stock in 
the UK, so delivery was free, fast and no customs involved.

At the beginning I had a cunning plan to buy, play for a while and then
return. They provide an option for full money back within a month **without
explaining anything**. This is very good. Frankly, if there was no such
option, I would never buy it.

![](/images/blog/saleae-logic/IMG_0530.JPG)

![](/images/blog/saleae-logic/IMG_0531.JPG)

It turned out to be a match box size thing in the solid metal case.

![](/images/blog/saleae-logic/IMG_0532.JPG)

![](/images/blog/saleae-logic/IMG_0534.JPG)

The complete set.

![](/images/blog/saleae-logic/IMG_0535.JPG)

Connecting...

![](/images/blog/saleae-logic/IMG_0536.JPG)

To begin with I connected it to a serial port on Raspberry Pi, which
I was using as a telnet console.

![](/images/blog/saleae-logic/IMG_0537.JPG)

Here is a screen shot of the capture. We see that the `ls` command is flying
to one direction and being echoed back from the second one.

![](/images/blog/saleae-logic/saleae-logic-analyser-ls-command.jpg)

Now the GMC-4 keyboard. This is a [scanned keyboard][] where one (out) port is
used to set a "flying" pin selecting the current row (or column) of
buttons, and the second (in) port represents the state of buttons in the
selected row.

[scanned keyboard]: http://www.learningaboutelectronics.com/Articles/How-does-a-matrix-keyboard-scanning-algorithm-work

![](/images/blog/saleae-logic/gmc4-schematic.jpg)

I planned to simulate the keyboard, so I needed timings of the scanning
signal. I connected all four scanning lines to four channels, and got the
following:

![](/images/blog/saleae-logic/saleae-logic-analyser-gmc4-keyboard.jpg)

Now it is crystal clear what's going on. It allows to measure a variety of
parameters of the signal, scale it and compare against previous runs. There
is [a good quality video][Videos] available on the official website showing
some use cases in details. My status in electronics is a layman, so I was 
simply impressed by the ease of use. The guy, Viacheslav, who recommended me 
this device, says that for debugging a complicated digital circuit design it 
is crucial to be able to capture much more than one to two channels
simultaneously.

[Videos]: http://www.saleae.com/logic/videos

As you have probably realised, I didn't return the device, but I had a
complaint though. I wasn't able to capture on the highest frequency
of 24MHz. The Logic software complained about lack of USB bandwidth when
transferring data from the Logic to the computer. The Support suggested 
an issue with my particular USB hub, but I tried different setups and the
problem still stands. But they were ready to take the device back and
refund anytime. Regardless, I liked the device and kept it. It perfectly 
solves all my current needs.

The conclusion
--------------

### Pros

* Extremely simple is use.
* Configurable triggers to initiate capturing (by level, by front, etc.).
* 8 or 16 channels depending on the model for simultaneous capture.
* 100% money back within a month if you're uncertain.

### Cons

* No online mode. You capture first, then view, analyse etc. So, don't
  expect "regular oscilloscope experience".
* My Mac Air wasn't able to capture on the maximal frequence of 24MHz.

### One liner

Recommended.
