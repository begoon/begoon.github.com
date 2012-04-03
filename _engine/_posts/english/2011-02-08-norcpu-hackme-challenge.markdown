---
layout: post
title: "NORCPU hackme challenge"
language: english
date: 2011-02-08 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/02/norcpu-hackme-challenge.html
categories: 
- project
- norcpu
- english
---
Different kinds of "abnormal" programming is quite popular among problem solvers. Sometimes it's even impossible to write code manually anymore for just another "abnormal" programming environment. You have to write a code generator to create even a trivial program.

In the environment I'm describing here you can easily write code manually on the high level macro assembler.

Okay, here is a virtual processor understanding only one logical command - [Peirce arrow][].

[Peirce arrow]: http://en.wikipedia.org/wiki/Logical_NOR

A program written for this processor expects a password as an input. If the password is incorrect, it print out "Wrong password!". Otherwise the special magic message will be printed.

The problem statement: You have to find out that magic message using any approach. For example, you can guess the password, the program will just print the secret out.

The logic is written such way that knowing the algorithm allows restoring the magic message without any problems.

Some time ago I [described this approach][Modelling a CPU with only one operation] in all details.

The original approach I used in this experiment, wasn't 100% "clear", because the addition command was implemented outside the processor. In this implementation everything works inside the processor. It required modifying the interpreter slightly introducing a shift register.

For those who want to try to hack this problem, I've created a web page containing an implementation of this one-command processor and the programming check the password.

Here you go - [the challenge][Challenge].

[Challenge]: /projects/norcpu/challenge/norcpu.html

P.S. The first one solved the problem will get a little prize! Information is on the page.

[Modelling a CPU with only one operation]: /blog/english/2010/04/06/modelling-a-cpu-with-only-one-operation/
