---
layout: post
title: "An interview with Geoff Graham"
language: english
date: 2012-08-07 17:00
comments: true
categories: 
- english
- maximite
- interview
---
Today my guest is Geoff Graham, the creator of a popular homebrew 
microcomputer called [Maximite][]. Nowadays we see a boom of projects 
based on microcontrollers. We still call them "microcontrollers" on a 
habit but they are not anymore. For example, Microchip PIC32 crystals 
provide much more functionality in a single chip than we had in 
full-blown microcomputers from the 80th, like Apple 2 or ZX Spectrum 
48.

[Maximite]: http://geoffg.net/maximite.html

![](/images/blog/maximite/geoff-graham/interview/geoff-graham.jpg)

> When I found that the PIC32 chip could be made to use a VGA display 
and keyboard, it was only natural that I should try and recreate one 
of the earlier computers that I had so much fun with in my youth.

- - -

Geoff built a microcomputer, Maximite, using a PIC32 chip. Maximite is 
a complete appliance utilizing modern interfaces. It uses VGA for 
video, PS/2 for the keyboard, SD cards as storage, USB for 
communicating, and it runs BASIC! Doesn't it remind you something? In 
my view, Maximite is a perfect tool to study microelectronics allowing 
to touch how hardware meets with software.

Today we can ask Geoff a few questions in person. Geoff lives in the 
suburb of Kensington in Perth, Western Australia. Perth is a long way 
from anywhere but with the wonders of the Internet and FedEx the world 
is a much smaller place now, so it doesn't stop Geoff to design and 
produce great hardware and software.


**Hi Geoff, thanks for the interview. Let's begin with a light 
question -- why "Maximite"? How did you invent this name?**

At the beginning of the project I wanted to call it The Mighty Mite 
meaning something that was small (mite) that was also powerful 
(mighty).  When the design came to be published in Silicon Chip 
magazine the editor discovered that the name had been trademarked by a 
food manufacturer, so he suggested Maximite as an alternative.  By 
then I could think of nothing better, so that became the name.  As it 
turned out, that is also the name of an explosive which, in a strange 
sort of way, is also appropriate.


**Maximite is very popular. Do you know at least rough figures of how many of them were built? Also when and how did you realise its incredible popularity?**

My standard answer is that "thousands are in use" but I believe that a 
more accurate number is somewhere between 3000 and 4000.  About half 
of them have been built by people with a soldering iron and the other 
half purchased as an assembled board from companies who make copies of 
the design.  

I realised that it would be popular when I looked at the number of 
visitors to my website, in the first few days after the magazine 
article appeared the number of unique visitors to my website jumped by 
100 times before settling down to a long term increase of 20 times the 
pre Maximite days.  What was interesting was that my URL did not 
appear in the first magazine article so many people read the article 
and immediately used Google to find out more.

When I started on the design of the Maximite I was thinking of the 
computers of the 80's which provided me with a lot of fun with back 
then.  They were very popular in their day and, as the modern 
computers have become more complicated and difficult to use, there was 
a vacuum left behind.  I believe that the key to the success of the 
Maximite was that it filled that space.


**For Maximite you had to build hardware and software. This is quite an unusual position nowadays for people working with computers. Professionals in software rarely look at hardware and vice versa. Where are you here? Are you more a hardware engineer by nature or a programmer?**

Yes, that is one of the things that I have found since the Maximite 
design was published.  People tend to look at it through the eyes of a 
hardware engineer and do not appreciate the software - they want to 
add electronic features without regard to the firmware or how the 
BASIC language could accommodate them.  There is always the reverse 
too, people who only think in terms of the software.  I think that I 
am best described as a programmer but with a strong electronic 
background.

Another item that is often missed when people try to change the 
Maximite is its "look and feel" (ie, how the user uses it).  This must 
be consistent with the hardware and software.  All three are part of 
the integrated whole and this is often not appreciated by either the 
hardware or software specialists.


**I personally was amazed of how solid and complete the Maximite 
project is. You designed the board, the case, software, and the kits 
of Maximite are available online. In the world of individual homebrew 
projects people usually don't tend to finish off their projects fully 
to such a polished shape because they loose interest. How did you 
manage that?**

This primarily came from my desire to have the project published in 
Silicon Chip magazine.  Most of their projects are a complete 
"product" designed by a professional engineer and I had to meet that 
standard if I wanted them to publish the Maximite project.  This 
attention to detail is unusual today as magazines tend to only half 
finish the project, things like documentation, a box to put it in, a 
nice front panel and so on are often ignored.

I find that the discipline of designing projects for the magazine is 
quite good.  I have a number of personal projects (ie, ones not 
published by the magazine) that are still sitting around today in a 
half completed form because I do not have that discipline operating on 
me.


**Geoff, you started your microelectronics hobby when you retired. How 
much time a day you usually spend on it? Again, you delivered the 
Maximite project in a such complete form, so seems it required some 
time to put everything in place.**

Yes, I have spent far too much time on it since I have retired, but 
interestingly it was something that I had to do.  It is as if there 
was a design engineer hiding inside of me that could not get out while 
I was following my professional career (which was not in electronics).  
The moment I retired he broke forth.

With the Maximite things seem to come in bursts, I would spend twelve 
hours a day for a month or two then have a break for a few weeks.  It 
is good that I enjoy working on projects like this because they do 
take up a lot of time.  I estimate that the Maximite has taken about 
nine months of solid eight hours a day, forty hours a week to get it 
to where it is now.


**MMBasic. I know you struggled to find software for Maximite. A few 
existing implementations of BASIC you tried didn't really fit, and you 
ended up with your own implementation of BASIC. Could clarify the 
licensing and distribution model of MMBasic? Any plans, maybe, to 
develop a Maximite framework or a library allowing to deal with 
Maximite peripherals in the form of device drivers? It could be useful 
in developing alternative firmware for Maximite, for example, running 
Lua or RetroBSD.**

Yes, when I started on the Maximite project my hope was to find a free 
version of BASIC in the Internet and use that.  But I found that the 
good implementations of the language were not available freely or had 
some other issue.  So I decided to write my own.

Initially I released my version of BASIC (called MMBasic) under the 
GPL GNU licence but I had a bad experience with one commercial 
organisation who removed my name from the software and claimed it as 
theirs, they even changed the copyright to their name.  So I created 
my own license where the software is freely available but it cannot be 
redistributed without my agreement.

This has worked out very well, a number of universities and commercial 
organisations are using it and I have an agreement with them covering 
what they will do with it.  This is much better than allowing someone 
to anonymously download my software and then see it appear on the 
Internet with their name and copyright.

At this time I do not have plans to develop a loadable device driver 
type of architecture.  The main reason is that the PIC32 chip does not 
have enough memory to do all the things that it already does (VGA, 
keyboard, USB, etc) and implement a loadable device driver system.  
There are more powerful chips around but they are impossible to hand 
solder so I have stayed with the PIC32.  Products like the Raspberry 
Pi can have loadable device drivers but they also have a complex 
operating system - just what I was trying to avoid with the Maximite.


**Let's move a bit to your personal background. When and how did you 
study to solder, for instance? I know many people looking for some 
experience in electronics but they are afraid of soldering seeing it 
potentially difficult or even impossible. How would you recommend 
people starting messing around with electronics hands-on?**

I cannot remember when I first started soldering but it was probably 
around age 12.  I am probably the wrong person to ask but I cannot see 
the problem with soldering -- you only need a cheap soldering iron and 
some wire solder.  

One of the great things with electronics is that it can be a very 
cheap hobby.  I would recommend starting with a simple and cheap 
project like flashing a light or adding a clock chip to the Arduino 
and just buy the bits including the soldering iron.  You might make a 
mess of the first project but that is not important and by the time 
you have reached the third project you will regard yourself as almost 
professional.


**Would you recommend any books or websites where beginners could make 
their first easy steps into the wonderful world in electronics? What 
kind of minimal level of knowledge could be enough to design and 
build, for example, Maximite?**

My recommendation would be to start with a magazine subscription.
There is Silicon Chip (in Australia), Elektor (in Europe) and Nuts and 
Volts (in the USA).  All of these will accept international 
subscriptions.  If you are starting with no knowledge at all probably 
Nuts and Volts would be the best.  When you subscribe to a magazine 
you will have a constant stream of ideas and projects to tempt you 
into trying something different and fun.  So a subscription is well 
worth the cost.

The level of knowledge required to build the Maximite is not great 
because it comes already designed and with working software.  On the 
other hand, to design it you would need a great amount of expertise.
I have a lot of expensive test gear, I trained as an electronics 
engineer in my early days and I have about 30 years of experience in 
systems programming - all that is necessary to create something like 
the Maximite.


**Now we have plenty websites providing a marketplace for individual 
hardware developers to sell their ideas and designs, for example, 
SparkFun.com. The internet allows people to get some money from hobby. 
You, as a person, whose hardware designs are being wildly sold over 
the internet, do you think it is feasible to live on income from such 
business? or volumes are still minor?**

It would be very hard to make a living income from that sort of thing.
There are a few, like the designers of the Arduino, who are probably 
doing OK but there are many more who have to keep another job so that 
they can pay the rent.  Part of the problem is people like me who 
produce sophisticated designs and then give them away for free, it is 
hard to compete with that and your customers come to expect products 
or software as a very low price.


**A bit of personal stuff. Can you name any people, for example, engineers or programmers, which you did or would like to learn from?**

The programmer who was the most influential on me is Brian Kernighan 
who, along with Dennis Ritchie, designed the C programming language 
and wrote a book on it called "The C Programming Language" in 1978.
Even today that book is a wonderful introduction to the C programming 
language and well worth a read if you want to get into programming in 
C.  When I write my magazine articles and web pages I always remember 
his clear and easy writing style and try to emulate it in what I do.

Probably the most influential engineer is Jim Rowe who was creating 
projects and writing for electronics magazines in Australia when I was 
a young teenager.  He is still doing it today 50 years later and I 
always find his projects well designed and his magazine articles clear 
and easy to understand.  He is someone else who I try to emulate in my 
projects and articles.


**By the way, how did you come to the world of computers and 
engineering? What was your first computer or programming language?**

This will date me somewhat (I am 64 years old).  I remember the Altair 
computer when it was first released and a little later the company I 
was working for became the distributor for Intel in Australia.  I was 
studying as an electronics engineer at the time and my first computer 
was one that I hand soldered using the Intel 8080 chip and 512 bytes 
of RAM (yes bytes).

Back then BASIC was the only language that you could use because of 
the limited memory capacity and hardware.  Much later, when we had 
disk drives, you could use more sophisticated languages and in my time 
I have written programs in most of them (Fortran, COBOL, PL/1, 
assembler, Pascal, etc).

As you can see, I was involved in electronics, small computers and 
BASIC a long time ago.  So, when I found that the PIC32 chip could be 
made to use a VGA display and keyboard, it was only natural that I 
should try and recreate one of the earlier computers that I had so 
much fun with in my youth.


**Wrapping up, I'd like to ask you to shed some light on your future 
projects? Is Maximite finished or we should wait for the Maximite with 
Ethernet or WiFi or something?**

There is the new Colour Maximite that will be published in the 
September 2012 issue of Silicon Chip.  It will have eight colours on a 
VGA display, stereo synthesised sound and an Arduino compatible 
connector along with all the other features of the original Maximite 
(USB, BASIC language, etc).  That has taken quite a lot of my time and 
energy to create, so after it is published I might take a break for a 
while before looking around for something else.

There is a couple of exclusive photos of the new colour Maximite.

![](/images/blog/maximite/geoff-graham/interview/maximite-colour.jpg)

![](/images/blog/maximite/geoff-graham/interview/maximite-colour-tv-keyboard.jpg)


**Thanks, Geoff, for the interview and for Maximite. Looking forward 
for your further projects.**

**I'm personally incredibly excited that 
today people have started to realise that teaching computers is not 
only about Word and Excel, but also about understanding what is inside 
and how all these guts actually work. And projects like Raspberry Pi 
and your Maximite help enormously get beginners a bit closer to the 
metal.**

&#9632;

*// Geoff Graham, Alexander Demin*

*// August 2012*
