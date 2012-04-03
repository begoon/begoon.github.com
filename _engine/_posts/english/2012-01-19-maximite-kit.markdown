---
layout: post
title: "Maximite - 8-bit nostalgia with a soldering iron"
language: english
date: 2012-01-19 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/01/maximite-8-bit-nostalgy-with-soldering_19-english.html
categories: 
- maximite
- english
---
Recently I have come across an interesting project - Maximite.

This is a micro-computer based on Microchip PIC32 running BASIC. It is so simple that even a novice can build it in a few hours.

{% img /images/blog/maximite-kit/img_0099.jpg %}

It is a bit more powerful than [Radio-86RK][] and ZX Spectrum 48. But its peripherals are fantastic: SD/FAT card, USB, VGA, PS/2, timers, RS232, I2C, SPI, PWM, ADC/DAC and individual general purpose pins.

[Radio-86RK]: http://en.wikipedia.org/wiki/History_of_computer_hardware_in_Soviet_Bloc_countries#Radio-86RK

If you build it on a mock up board buying parts by yourself, it will cost less then ten Australian dollars.

The [project is open-sourced][Maximite project] (schematics, PCB artwork, sources).

[Maximite project]: http://geoffg.net/maximite.html

Even if quickly flip through the [documentation][], no doubts - a list features is impressive. All peripherals are available directly from BASIC.

[documentation]: http://geoffg.net/Downloads/Maximite/Maximite%20User%20Manual%20V3.0.pdf

Programs and data can be stored on a SD card. If there is a "AUTORUN.BAS" file on the card, BASIC will run at the start.

I liked Maximite, but soldering is not my favourite activity. Unfortunately it is only possible to buy a kit, but not a fully assembled unit.

I ordered the [kit from Altronics][] and soon after it arrived.

[kit from Altronics]: http://www.altronics.com.au/index.asp?area=item&id=K9550

Only the microprocessor was already soldered because soldering such form factor chip isn’t an easy task.

Anyway, screw it, let’s do it.

{% img /images/blog/maximite-kit/img_0102.jpg %}

Here a few parts are already in place. I’m not a complete newbie in soldering but last time I took a soldering iron in my hands was about five years ago. I had no acid for soldering, so I was crumbling rosin right to soldering points. The effect is similar to acid. The soldering iron (the one on the plate) with a sharp sting.

{% img /images/blog/maximite-kit/img_0103.jpg %}

I spent the first hour struggling with only a few parts, but eventually it went smoother.

A half is ready.

{% img /images/blog/maximite-kit/img_0106.jpg %}

After one more hour it was all done.

{% img /images/blog/maximite-kit/img_0107.jpg %}

{% img /images/blog/maximite-kit/img_0110.jpg %}

Maximite can be powered from an external 9V source or form USB. I used USB.

Plug into USB and VGA. An off you go!

{% img /images/blog/maximite-kit/img_0111.jpg %}

BASIC is ready but there is no keyboard. I hand’t a proper PS/2 one and I tried a USB-PS/2 connector. Alas, it didn’t fit.

{% img /images/blog/maximite-kit/img_0119.jpg %}

Next day I found the PS/2 keyboard and finally connected.

{% img /images/blog/maximite-kit/img_0114.jpg %}

The case.

{% img /images/blog/maximite-kit/img_0115.jpg %}

{% img /images/blog/maximite-kit/img_0112.jpg %}

Fully assembled.

{% img /images/blog/maximite-kit/img_0113.jpg %}

{% img /images/blog/maximite-kit/img_0116.jpg %}

I have to admit - the kit from Altronics is a very good quality product. The holes are metallized on the board, and the case fits perfectly.

{% img /images/blog/maximite-kit/img_0118.jpg %}

Then I had to upgrade the firmware to the latest version. Maximite can flash itself over USB without a special programmer. Just open the case and hold a special button when switching Maximite on. It goes to a boot loader mode.

Maximite is a standard CDC device in USB infrastructure. Windows still requires a driver though, but Mac has it built-in.

Plug-in.

{% img /images/blog/maximite-kit/dsc01130.jpg %}

Flashing.

{% img /images/blog/maximite-kit/dsc01129.jpg %}

Right, the firmware is upgraded up to 3.0A.

As I said, Maximite supports VGA and PS/2, but you can also connect it to a PC via USB. In this case Maximite mirrors the VGA output to that serial connection to the PC, also treats the data coming from that connection as keyboard input.

So, it is possible to detach VGA and PS/2 at all and talk to Maximite over the serial USB connection only.

For example, VGA dispay (voltmeter):

{% img /images/blog/maximite-kit/dsc01125.jpg %}

The same data on in a terminal emulation application on the PC:

{% img /images/blog/maximite-kit/dsc01123.jpg %}

Interestingly, Maximite works with pixels, not characters. So when a character is being displayed, it is also copied to the console, but when Maxitile draws graphics it is not visible in the serial console.

BASIC language in Maximite gives full control over the peripherals using operators.

There is an archive of BASIC programs running on Maximite available of the project website.

There are a few screenshots.

Clock.

{% img /images/blog/maximite-kit/dsc01132.jpg %}

Character editor.

{% img /images/blog/maximite-kit/dsc01128.jpg %}

Voltmeter.

{% img /images/blog/maximite-kit/dsc01133.jpg %}

Puzzles.

{% img /images/blog/maximite-kit/dsc01126.jpg %}
{% img /images/blog/maximite-kit/dsc01131.jpg %}

I believe, no comment here.

{% img /images/blog/maximite-kit/dsc01134.jpg %}

Conclusion

Every penny I have spent on Maximite is worth that fun I’ve got.

The Maximite project is surprisingly solid. Everything is nice and simple. And it works!

For beginners, even kids, interested in microelectronics, Maximite is simply a godsend. Easy and nice to build. I as an amateur have built everything in a few hours only.

When my brother was building [Radio-86RK Emulator][] and Spectrum about twenty years ago, there was a joke about DIY projects published in radio electronics magazines: if a author says that his device doesn’t required any tuning, there is at least a little chance to get it working; but the author says that his device does require some minor tuning...

[Radio-86RK Emulator]: http://radio86.googlecode.com/hg/online/radio86.html

Anyway, if you want to come back to your 8-bit youth with a soldering iron in hands — build Maximite.
