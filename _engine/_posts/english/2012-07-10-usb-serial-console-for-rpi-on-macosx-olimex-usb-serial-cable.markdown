---
layout: post
title: "USB Serial Console for Raspberry Pi on Mac OSX Lion: Olimex USB Serial Cable"
language: english
date: 2012-07-10 23:57
comments: true
categories: 
- english
- raspberry-pi
- rpi
---
I recently started playing to Raspberry Pi. Along with other questions I wanted to try talking to RPi via a serial cable. The [documentation about RPi peripherals][] says that at reset only pins GPIO 14 & 15 (TxD, RxD) are assigned to the alternate function UART. So, it should work out of the box.

[documentation about RPi peripherals]: http://elinux.org/Rpi_Low-level_peripherals  

I decided to buy [Olimex USB To Serial Cable]. It was available on eBay as [Olimex USB-SERIAL-CABLE Olinuxino console cable alternative to Raspberry Pi][]. 

This cable provides 3.3V output levels which are strongly recommended for RPi (not 5V), and its 3 wires with male plugs can be directly connected to the RPi GPIO P1 header.

[Olimex USB To Serial Cable]: https://www.olimex.com/dev/usb-serial-cable.html
[Olimex USB-SERIAL-CABLE Olinuxino console cable alternative to Raspberry Pi]: http://www.ebay.co.uk/itm/Olimex-USB-SERIAL-CABLE-Olinuxino-console-cable-alternative-to-Raspberry-Pi-/280917749304?pt=UK_BOI_Electrical_Components_Supplies_ET&hash=item416800ae38

![](/images/blog/olimex-cable/olimex-usb-serial-cable-olinuxino-console-cable.png)

Unfortunately, at a time of this writing, there were no drivers for Mac OSX available on the [official website][Olimex USB To Serial Cable], and OSX Lion (10.7.4) didn't recognize this device. It was an unpleasant surprise because before I saw that Lion perfectly recognized other USB-RS232 hardware based on different chipsets (Microchip, for example). 

I checked the Product ID and Manufacturer on the Olimex cable. When the cable is connected, click on "About This Mac > More Info… > System Report… > USB". 

![](/images/blog/olimex-cable/pl2303-serial-usb-on-lion.png)

Then Googling for a Prolific driver for Mac brought me to a great blog post, called "[PL2303 Serial-USB on OSX Lion][]". Following the instructions I installed the driver and connected to Raspberry Pi.

[PL2303 Serial-USB on OSX Lion]: http://xbsd.nl/2011/07/pl2303-serial-usb-on-osx-lion.html

In short I did the following:

    cd /tmp
    wget http://xbsd.nl/~martijn/log/osx-pl2303.kext.tgz
    tar xvzf http://xbsd.nl/~martijn/log/osx-pl2303.kext.tgz
    cd osx-pl2303.kext
    sudo cp -R osx-pl2303.kext /System/Library/Extensions/
    cd /System/Library/Extensions
    chmod -R 755 osx-pl2303.kext
    chown -R root:wheel osx-pl2303.kext
    cd /System/Library/Extensions

    kextload ./osx-pl2303.kext
    kextcache -system-cache

> Note: Just in case, I made a copy of the "[osx-pl2303.kext.tgz][]" file.

[osx-pl2303.kext.tgz]: /files/olimex-cable/osx-pl2303.kext.tgz

You can make sure that everything is installed correctly by:

    kextstat -b nl.bjaelectronics.driver.PL2303

It should print the following:

    Index Refs Address            Size       Wired      Name (Version) <Linked Against>
       74    0 0xffffff7f808ee000 0xb000     0xb000     nl.bjaelectronics.driver.PL2303 (1.0.0d1) <73 34 5 4 3>

> Note: If you need to *unload* the driver for some reason, you check that the driver is loaded (by `kextstat` command above), and then:

    sudo kextunload /System/Library/Extensions/osx-pl2303.kext

When the driver is installed, reconnect the cable to USB. There should be two device drivers created `/dev/cu.PL2303-00002006` and `/dev/tty.PL2303-00002006`. You can check it by:

    ls /dev/*PL*

It should print:

    /dev/cu.PL2303-00002006		/dev/tty.PL2303-00002006

Now let's connect the cable to the RPi header P1. It's better to disconnect it from USB temporarily.

The pinout of the cable is the following:

**Wire** | **Desc** | **Rip GPIO**  
---------|----------|----------------
Blue     |  GND     |   0v
Green    |  Rx      |   14/TxD       
Red      |  Tx      |   15/RxD

An example of the connection:

![](/images/blog/olimex-cable/pl2303-serial-usb-on-lion-connected.jpg)

When all three wires are attached, you can connect the cable back to USB. Now any terminal emulator software can talk to RPi via the `/dev/cu.PL2303-00002006` device. I used Minicom:

    minicom -D /dev/cu.PL2303-00002006 -b 115200

It should print something like this:

    Welcome to minicom 2.6.1

    OPTIONS: 
    Compiled on May 10 2012, 07:16:49.
    Port /dev/cu.PL2303-00002006

    Press Meta-Z for help on special keys


    Debian GNU/Linux 6.0 raspberrypi ttyAMA0

    raspberrypi login:    

Finally, you may want to re-direct the RPi console from HDMI to the serial port (ttyAMA0). In this case RPi will be printing boot messages to the serial console instead of the monitor.

*You need to login to your RPi* (via SSH, telnet or just established serial connection) and execute the following:

    sudo mount /dev/mmcblk0p1 /mnt

This will mount your boot partition to `/mnt`. Now you need to edit the kernel commund line:

    sudo vi /mnt/cmdline.txt

In `cmdline.txt` make sure that `console=ttyAMA0,115200` and `kgdboc=ttyAMA0,115200`, and there is no another `console=` assignment, for example to `tty0`. After you save the changes and reboot RPi, you may see RPi boot messages in the terminal emulator connected to `/dev/cu.PL2303-00002006`.
