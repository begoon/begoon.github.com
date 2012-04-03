---
layout: post
title: "Ошибка в компиляторе Godegear (Borland) C++ при приведении типов указателей"
language: russian
date: 2009-09-12 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/09/godegear-borland-c.html
categories:
- cplusplus
- bug
- russian
---
Тривиальный пример (`bcc32_5.93_cast_bug.cpp`):

{% codeblock lang:cpp %}
class A {};
class C {};
A* a;
A* b = static_cast<C*>(a);
{% endcodeblock %}

Компилируем в bcc32.exe (версия 5.93) из Codegear RAD Studion 2007:

    bcc32 -c bcc32_5.93_cast_bug.cpp
    
Падает c internal compiler error:

    CodeGear C++ 5.93 for Win32 Copyright (c) 1993, 2007 CodeGear
    bcc32_5.93_cast_bug.cpp:
    Fatal F1004 bcc32_5.93_cast_bug.cpp 4: Internal compiler error at 0x44b34e with base 0x400000
    Fatal F1004 bcc32_5.93_cast_bug.cpp 4: Internal compiler error
    
Люблю собирать падения компиляторов на стадии компиляции. А у вас есть что-нибудь подобное в загашнике?
