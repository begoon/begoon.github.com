---
layout: post
title: "Doubled semi-colon in variable declarations"
language: english
date: 2009-09-21 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/09/double-semi-column-in-variable.html
categories: 
- bug
- english
---
It seems to be a completely innocent example (`vs_double_semicolumn.c`):

{% codeblock lang:cpp %}
void main() {
  int a;;
  int b;
}
{% endcodeblock %}

Compile (in С mode, there is no `/TP`):

    cl vs_double_semicolumn.c

The result:

    vs_double_semicolumn.c
    vs_double_semicolumn.c(3) : error C2143: syntax error : missing ';' before 'type'
    The result of Codegear/Borland is roughly the same (though the error message is more clear):
    CodeGear C++ 5.93 for Win32 Copyright (c) 1993, 2007 CodeGear
    vs_double_semicolumn.c:
    Error E2140 vs_double_semicolumn.c 3: Declaration is not allowed here in function main
    *** 1 errors in Compile ***

The problem hides behind an accidental typo of the doubled `;` character. By the way, this example is absolutely real from life. Just one misprint raises a lot of questions.

It turns out that the second `;` character is treated as an empty statement but not as an empty variable declaration. The compiler decides that declarations of variables are finished and a block of statements begins, therefore it reasonably complains on the `b` declaration expecting statements.

I've checked it on gcc and native compilers of AIX, Solaris and HP-UX. All of those have eaten this example without any problems.

Related posts:

* [Pointer cast bug in Codegear (Borland) C++ compiler][]

[Pointer cast bug in Codegear (Borland) C++ compiler]: /blog/english/2009/09/12/pointer-cast-bug-in-codegear-borland-compiler/
