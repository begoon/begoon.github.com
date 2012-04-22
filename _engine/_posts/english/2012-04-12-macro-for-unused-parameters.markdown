---
layout: post
language: english
date: 2012-04-12 17:21
title: "Macro for unused parameters"
categories:
- macro
- english
---
Sometimes there is a function (or a method) having declared but unused parameters. It can be legacy code or just bad design. Normally the compiler gives a warning about this. 

It could be fixed this way:

{% codeblock lang:cpp %}
void f(int a, int /* b */) {
  ...
}
{% endcodeblock %}

But it looks ugly.

There is a better way:

{% codeblock lang:cpp %}

#define DISCARD_UNUNSED_PARAMETER(x) (void)x

void f(int a, int b) {
  DISCARD_UNUNSED_PARAMETER(b);
  ...
}
{% endcodeblock %}

This macro is clear, and you can easily find all such places in the project.

By they way, in `Go` this situation is treated as the error, not warning. It can be annoying when you add, remove, comment out and put back things all the time, because sometimes you do have unused stuff. But eventually such approach doesn't allow that temporary garbage to spread and stay in the code (for example, in C++ who on Earth wants to clean up the list of included STL headers after hours of coding?)
