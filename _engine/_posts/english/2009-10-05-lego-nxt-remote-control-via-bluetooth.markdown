---
layout: post
title: "Lego NXT remote control via bluetooth"
language: english
date: 2009-10-05 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/10/lego-nxt-remote-control-via-bluetooth.html
categories: 
- lego
- project
- english
---
I keep going to spread out my projects on Google Code.

This bit is roughly one year old project — the remote control over Bluetooth for [Lego NXT][] using the applet running on a mobile phone.

[Lego NXT]: http://mindstorms.lego.com/en-us/Default.aspx

I've called it unpretentiously — [nxtbtrc][].

[nxtbtrc]: http://code.google.com/p/nxtbtrc

Everything is simple. The Java applet running on a J2ME compatible phone pairs with Lego NXT brick and then sends commands to it. Nothing special but it was interesting to figure out how to use Bluetooth API in J2ME.

I am not sure about any further development but who knows — maybe it comes in handy for somebody.

Here is the small video demonstrating its work:

{% youtube F0HW3Mth0Pw 425 344 %}

I have even bought the book for this case. By the way the book is quite nice. It tells about Bluetooth from the programmer's point of view in a simple and clean manner. A few stacks of different vendors are covered, their comparison is given and accompanied with examples on different languages and platforms.

Albert Huang, Larry Rudolph, "Bluetooth Essentials for Programmers"

<a href="http://www.amazon.co.uk/gp/product/0521703751/ref=as_li_tf_il?ie=UTF8&tag=prodiy-21&linkCode=as2&camp=1634&creative=6738&creativeASIN=0521703751"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&Format=_SL160_&ASIN=0521703751&MarketPlace=GB&ID=AsinImage&WS=1&tag=prodiy-21&ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&l=as2&o=2&a=0521703751" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
