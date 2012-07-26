---
layout: post
title: "Raspberry Pi links"
language: english
date: 2012-07-26 21:21
comments: true
categories: 
- english
- raspberry-pi
- rpi
---
Playing with [Raspberry Pi][] I have collected a bunch of
more or less useful links, so I decided to put them all together.

[Raspberry Pi]: /blog/english/2012/07/11/raspberry-pi-arrived/

Initial re-partitioning
-----------------------

At the time of this writing the standard Debian images (stable)
distributed from the official Raspberry Pi website were built
for 2GB SD cards. It is possible to copy them to larger cards 
and it will work but space above 2GB will be wasted.

There are a few simple steps to re-partition the card after
the first boot.

Images:

http://raspberrypi.org/downloads/

Step by step:

https://projects.drogon.net/raspberry-pi/initial-setup1/

In short:

    printf "d\n3\nd\n2\nn\np\n2\n157696\n\nw\n" | sudo fdisk -cu /dev/mmcblk0
    sudo shutdown -r now
    sudo resize2fs /dev/mmcblk0p2


Troubleshooting
---------------

http://elinux.org/R-Pi_Troubleshooting


GPIO
----

### General info

http://elinux.org/Rpi_Low-level_peripherals

### WiringPi

https://projects.drogon.net/raspberry-pi/wiringpi/

- [Pins](https://projects.drogon.net/raspberry-pi/wiringpi/pins/)
  * [Special Pins](https://projects.drogon.net/raspberry-pi/wiringpi/special-pin-functions/)
- [Download and install](https://projects.drogon.net/raspberry-pi/wiringpi/download-and-install/)
- Wrappers
  * [Ruby](https://rubygems.org/gems/wiringpi/)

### RPI.GPIO

http://pypi.python.org/pypi/RPi.GPIO

Homepage: http://raspberry-gpio-python.googlecode.com

How to install:

    cd /tmp
    wget http://raspberry-gpio-python.googlecode.com/files/RPi.GPIO-0.2.0.tar.gz
    tar xzvf RPi.GPIO-0.2.0.tar.gz
    cd tar xzvf RPi.GPIO-0.2.0
    python setup.py install

Sample program:

    import RPi.GPIO as GPIO
    GPIO.setmode(GPIO.BCM)
    pin = 4
    GPIO.setup(pin, GPIO.OUT)
    while True:
        GPIO.output(pin, True)
        GPIO.output(pin, False)

### Benchmarking Raspberry Pi GPIO speed

http://codeandlife.com/2012/07/03/benchmarking-raspberry-pi-gpio-speed/

### Example with 2 LEDs

https://projects.drogon.net/raspberry-pi/gpio-examples/tux-crossing/2-two-more-leds/

### GPIO Port on the Raspberry Pi

http://chrishatton.org/archives/88


SPI/I2C 3.2 kernel
------------------

This kernel is based the 3.2 branch. It comes with I2C drivers and a bunch
of staging drivers (for example, WiFi).

http://bootc.net/projects/raspberry-pi-kernel


I2C
----

### Quick2Write

- http://quick2wire.com/
- http://quick2wire.com/blog/
- [An experimental GPIO Python library for the Raspberry Pi](http://quick2wire.com/2012/05/an-experimental-gpio-python-library-for-the-raspberry-pi/)


### Linux I2C interface

http://kernel.org/doc/Documentation/i2c/dev-interface


I2C examples
------------

[I2C examples](http://robot-electronics.co.uk/htm/raspberry_pi_examples.htm)

[Example I2C Code](http://raspberrypi.org/phpBB3/viewtopic.php?f=44&t=8043)

    echo ds1307 0x68 > /sys/class/i2c-adapter/i2c-0/new_device

### I2C and the Raspberry Pi

Explanations why and how I2C was added to BootC RPi kernel: 

http://bootc.net/archives/2012/05/19/i2c-and-the-raspberry-pi/

### MCP23017 I2C IO expander

http://nathan.chantrell.net/20120519/raspberry-pi-and-the-mcp23017-i2c-io-expander/


Complete I2C setup on Raspberry Pi
----------------------------------

http://robot-electronics.co.uk/files/rpi_i2c_setup.doc

Set up for using i2c with Raspberry Pi running the standard Debian 
squeeze distribution.

    sudo dpkg-reconfigure tzdata
    sudo apt-get update
    sudo apt-get upgrade 
    sudo apt-get install ca-certificates

Install hexxeh's rpi-upgrade tool https://github.com/Hexxeh/rpi-update#readme:

    sudo wget http://goo.gl/1BOfJ -O /usr/bin/rpi-update
    sudo chmod +x /usr/bin/rpi-update
    sudo apt-get install git-core

    sudo rpi-update

Restart rpi for updates to finish:

    sudo shutdown -r now

Download Chris Boots's kernel with the i2c drivers in as a Debian package 
from his website http://bootc.net. Navigate to where the Debian package 
was saved using command line and install the Debian package.

    dpkg -i linux-image-3.2.18-rpi1+_5_armel.deb

Copy /boot/vmlinuz-3.2.18rpi1+ to /boot/kernel.img:

    sudo cp /boot/vmlinuz-3.2.18rpi+ /boot/kernel.img

Restart RPi again:

    sudo shutdown -r now

Download i2c-tools:

    sudo apt-get install i2c-tools

If you run ls /dev/i2c* you will not be able to see any i2c ports 
(e.g. /dev/i2c-0) listed. At start up the i2c ports will not be active. 
Make it active using modprobe:

    sudo modprobe i2c-dev

Now look to see if your i2c ports exist in /dev:

    ls /dev/i2c*
    i2cdetect -l
    dmesg | grep i2c

You should see two i2c ports listed named /dev/i2c-0 and /dev/i2c-1. 
/dev/i2c-0 is the one we will be using.  Another way of listing them 
is to run i2cdetect -l (a tool that came with the i2c-tools you installed 
earlier).

Change permissions of the i2c-0 port to let you access:

    sudo chmod 666 /dev/i2c-0

You should now be able to download and run some of our example c code. 
You will need to modprobe i2c-dev and change the permissions of the i2c 
port every time you boot up as these setting are not saved by default.


Checking Firmware Version
-------------------------

Firmware should be up-to-date. Its update is harmless and cannot
brick your RPi.

    /opt/vc/bin/vcgencmd version


RPI update
----------

### Method 1

https://github.com/Hexxeh/rpi-update

    wget https://raw.github.com/Hexxeh/rpi-update/master/rpi-update -O /usr/bin/rpi-update && chmod +x /usr/bin/rpi-update

    sudo apt-get install ca-certificates
    rpi-update

### Method 2
 
http://iroylabs.blogspot.co.uk/2012/06/raspberrypi-mouse-and-keyboard-does-not.html

    wget https://raw.github.com/Hexxeh/rpi-update/master/rpi-update
    chmod +x rpi-update
    mv rpi-update /usr/bin/rpi-update
    sudo rpi-update


Keeping Raspberry Pi fresh
--------------------------

http://wrightrocket.blogspot.co.uk/2012/06/keeping-your-raspberry-pi-fresh.html


USB to serial cable
-------------------

Olimex USB-SERIAL-CABLE Olinuxino console cable alternative to Raspberry Pi.

- three wires for Breadboard connection
- SERIAL output 3.3V voltage levels
- GND=BLUE, RX(INPUT)=GREEN, TX(OUTPUT)=RED

BLUE (GND) -> 0v
GREEN (RX) -> GPIO 14/TxD (BCM), or 15 (wiringPi)
RED (TX) -> GPIO 15/RxD (BCD), or 16 (wiringPi) 

### Driver for Mac OSX Lion

http://xbsd.nl/2011/07/pl2303-serial-usb-on-osx-lion.html

    cd /tmp
    wget http://xbsd.nl/~martijn/log/osx-pl2303.kext.tgz
    tar xvzf osx-pl2303.kext.tgz
    cd osx-pl2303.kext
    sudo cp -R osx-pl2303.kext /System/Library/Extensions/
    cd /System/Library/Extensions
    chmod -R 755 osx-pl2303.kext
    chown -R root:wheel osx-pl2303.kext
    cd /System/Library/Extensions

    kextload ./osx-pl2303.kext
    kextcache -system-cache

Check:

    kextstat -b nl.bjaelectronics.driver.PL2303

    Index Refs Address            Size       Wired      Name (Version) <Linked Against>
       74    0 0xffffff7f808ee000 0xb000     0xb000     nl.bjaelectronics.driver.PL2303 (1.0.0d1) <73 34 5 4 3>

### Unload the driver (if needed)

Check "kextstat" first, and if "nl.bjaelectronics.driver.PL2303" is there, it can be unloaded by:

    sudo kextunload /System/Library/Extensions/osx-pl2303.kext/

### Driver as a package

http://changux.co/osx-installer-to-pl2303-serial-usb-on-osx-lio

### PL-2303 cables on Mac

http://planet-rcs.de/article/mac_serial_port/


WiFi
----

http://raspberrywifi.com/

### ASUS N10 WiFi adaptor

Kernel 3.2.21-rpi1+ already has this driver, but it requires firmware.

1. Add the following line to /etc/apt/sources.list:

    deb http://backports.debian.org/debian-backports squeeze-backports non-free

2. Update the package index:

    sudo apt-get update

3. Install firmware-realtek deb package:

    sudo apt-get install firmware-realtek

Check:

    sudo iwlist wlan0 scan

Post-setup:

    sudo vi /etc/network/interfaces

    auto wlan0
    iface wlan0 inet dhcp
    wpa-ssid "your_ssid"
    wpa-psk "your_password"


Cool gadgets
------------

### VGA over serial port

http://hobbytronics.co.uk/serial-vga

### Cardboard case

http://squareitround.co.uk/Resources/Punnet_net_Mk1.pdf


Blogs about Raspberry PI
------------------------

- https://projects.drogon.net/raspberry-pi/
- http://bootc.net/projects/raspberry-pi-kernel
  * http://bootc.net/
- http://raspberrypi.homelabs.org.uk/
- http://pi.gadgetoid.co.uk/
- http://codeandlife.com/topics/raspberry-pi/
- http://blog.mx17.net/category/hardware/raspberry-pi/


Useful sites
------------

- https://projects.drogon.net/
- http://hobbytronics.co.uk/
- http://codeandlife.com/
- http://sparkfun.com/
- http://gadgetoid.com/
