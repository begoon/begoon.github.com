---
layout: post
title: "Cast to incomplete type in C and C++"
language: english
date: 2011-08-17 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/08/cast-to-incomplete-type-in-c-and-c.html
categories: 
- cplusplus
- english
---
This compiles in C and C++ without any problems:

{% codeblock lang:cpp %}
void* p = (struct this_does_not_exist *) -1;
{% endcodeblock %}

Remove `struct`, compile as C++ and get an error:

    cast.cpp
    cast.cpp(1) : error C2065: 'this_does_not_exist' : undeclared identifier
    cast.cpp(1) : error C2059: syntax error : ')'

Adding a forward declaration:

{% codeblock lang:cpp %}
class this_does_not_exist;
void* p = (this_does_not_exist *) -1;
{% endcodeblock %}

And it again compiles cleanly.

All examples conform the Standard but to be honest the first one is really odd.

GCC gives a warning at least.
