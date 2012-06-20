---
layout: post
title: "Mini computers: MK802, CuBox, Raspberry PI"
language: english
date: 2012-06-20 20:52
comments: true
categories: 
- cubox
- english
- mk802
- raspberry-pi
---
Seems that homemade microcomputers are coming back. I already wrote about [Maximite][Maximite - 8-bit nostalgia with a soldering iron].

[Maximite - 8-bit nostalgia with a soldering iron]: /blog/english/2012/01/19/maximite-kit/

Lately I had an opportunity to play with a few devices of such sort, but slightly upper class based on ARM, not PIC32.

I apologize at once for quality of pictures, but I didn't manage properly taking pictures of the bright computer screen neither on iPhone nor on a camera.

MK802 (aka Mini Android 4.0)
============================

This is a device I have bought. It costs 70$ + delivery. There is another, more modern 1GB model already available on the [official website][Miniand homepage]. Mine has 512MB only.

[Miniand homepage]: https://www.miniand.com

My photos:

![](/images/blog/mini-computers/mk802/IMG_0362.JPG)

![](/images/blog/mini-computers/mk802/IMG_0363.JPG)

![](/images/blog/mini-computers/mk802/IMG_0364.JPG)

The USB #1. The device can be powered via this socket but they say it needs at least two amps, so powering from a regular computer may not work. I connected a keyboard here.

![](/images/blog/mini-computers/mk802/IMG_0366.JPG)

Mini HDMI. I also managed to connect to a DVI monitor via an adapter. 

![](/images/blog/mini-computers/mk802/IMG_0368.JPG)

At the end face there is another USB port and an external power connector.

![](/images/blog/mini-computers/mk802/IMG_0369.JPG)

Micro-SD. The case of the device as a whole is a just bit bigger than a regular USB stick.

![](/images/blog/mini-computers/mk802/IMG_0371.JPG)

Connected to TV. Android is built-in. Booting time to this splash-screen is ~5s. 

![](/images/blog/mini-computers/mk802/IMG_0372.JPG)

Time of the full boot is ~25s.

![](/images/blog/mini-computers/mk802/IMG_0374.JPG)

Connected a mouse, somehow entered a WiFi password in the virtual keyboard and checked out the proper website.

![](/images/blog/mini-computers/mk802/IMG_0379.JPG)

The desktop is optimized as a media center, that's why everything is so big on the screen. After some fiddling with fonts, I had got this:

![](/images/blog/mini-computers/mk802/IMG_0386.JPG)

Now another proper website.

![](/images/blog/mini-computers/mk802/IMG_0380.JPG)

Internal storage characteristics.

![](/images/blog/mini-computers/mk802/IMG_0383.JPG)

The version of Android.

![](/images/blog/mini-computers/mk802/IMG_0384.JPG)

Pre-installed applications.

![](/images/blog/mini-computers/mk802/IMG_0385.JPG)

Finally, yet another proper website. Unfortunately, JSLinux wasn't able to boot up fully. Maybe because of the web browser.

![](/images/blog/mini-computers/mk802/IMG_0387.JPG)

Built-in Android doesn't require a flash card. If to prepare a card with another Linux, MK802 will boot from it. I have tried images of Ubuntu 12.04 and Lubuntu from the official website. Alas, it worked very slow and unresponsive. MK802 does require a proper distro optimized specifically for this platform.

On the [official forum][] there are more photos of MK802. Also there are [disassembly slides][] of a slightly different model.

[official forum]: https://www.miniand.com/forums/forums/2/topics/1
[disassembly slides]: https://www.miniand.com/forums/forums/2/topics/19

Conclusion: It is not quite clear who is the audience of this device. Even Maximite allows to play with hardware, but here... Maybe running [XBMC][] as a media center might have at least little sense.

[XBMC]: http://xbmc.org/

CuBox
=====

Produced [SolidRun][]. The device was purchased by one of my colleagues, annoyed waiting his Raspberry PI (I'm also still waiting mine), and I was able to play with it. 

CPU is slower, but the [peripherals][] are much more advanced (no WiFi, though), and they also promise 1080p video. So CuBox is more likely to be a media center.

[SolidRun]: http://solid-run.com/
[peripherals]: http://solid-run.com/products/cubox

It's a proper cube, which side is roughly as a match box.

![](/images/blog/mini-computers/cubox/image_0.jpeg)

Power, Ethernet, HDMI, Micro-SD, USBx2, eSATA.

![](/images/blog/mini-computers/cubox/image_1.jpeg)

SPDIF, micro-USB (console).

![](/images/blog/mini-computers/cubox/image_2.jpeg)

Frankly, the device looks being made in someone's kitchen. On the second picture it's clearly visible that the connectors are not quite aligned with the case. But the device in general works fine. It has Ubuntu 10.04 pre-installed.

Raspberry PI
============

This board was given to me by another colleague of mine who had eventually got it. It came as is, without a power supply and a flash card to boot from. You have to prepare everything by yourself. Fortunately, plenty of stuff is available online.

![](/images/blog/mini-computers/raspberry-pi/raspberry-pi.jpg)

What does make PI different from MK802 and CuBox is general purpose ports (GPIO) (in the top left corner). Theoretically you can plug in your own homemade devices into Raspberry PI. PI was developed as an educational device, not an end user one.

Instead of the conclusion
=========================

The market of tiny computers is exploding. They grow as mushrooms after the rain. ARM is great, apart from one little issue -- Chrome isn't yet available on it due to obvious reasons.
