---
layout: post
title: "Swap two numeric variables using XOR"
language: english
date: 2010-03-17 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/03/swap-two-numeric-variables-using-xor.html
categories: 
- english
---
Two numeric variables could be swapped not only via a temporary one. It could be done this way:

    a += b;
    b = a - b;
    a -= b;

This is neat but unlikely useful in practice. But it could be rewritten using bitwise arithmetics to avoid overflow issues:

    a ^= b ^= a ^= b;

This one looks very cool and hackish but unfortinatelly may cause an unpredictable behavior according to the Standard due to the chained assignments. So the last edition is also fast and overflow free but doesn't have an unpredictable behavior:

    a ^= b;
    b ^= a;
    a ^= b;

**Update**: Here is a perfect link to [Bit Twiddling Hacks][] with lots of similar bitwise tips.

[Bit Twiddling Hacks]: http://graphics.stanford.edu/~seander/bithacks.html
