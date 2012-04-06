---
layout: post
title: "Pointer cast bug in Codegear (Borland) C++ compiler"
language: english
date: 2009-09-12 01:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/09/pointer-cast-bug-in-codegear-borland-c.html
categories: 
- bug
- compiler
- english
---
Here is the trivial program (`bcc32_5.93_cast_bug.cpp`):

{% codeblock lang:cpp %}
class A {};
class C {};
A* a;
A* b = static_cast<C*>(a);
{% endcodeblock %}

When using `bcc32.exe` (version 5.93) from the Codegear RAD Studio 2007:

    bcc32 -c bcc32_5.93_cast_bug.cpp
    
It dies with an internal compiler error:

    CodeGear C++ 5.93 for Win32 Copyright (c) 1993, 2007 CodeGear
    bcc32_5.93_cast_bug.cpp:
    Fatal F1004 bcc32_5.93_cast_bug.cpp 4: Internal compiler error at 0x44b34e with base 0x400000
    Fatal F1004 bcc32_5.93_cast_bug.cpp 4: Internal compiler error

Nice one. I love internal compiler errors. Do you have some similar stuff in your collection?
