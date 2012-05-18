---
layout: post
title: "Печать std::string через printf() в Visual Studio"
language: russian
date: 2012-05-18 15:37
comments: true
categories: 
- cplusplus
- russian
- stl
- visual studio
---
В ходе нескольких code review уже неоднократно встречаю вот такое:

{% codeblock lang:cpp %}
#include <string>
#include <cstdio>

int main() {
  std::string s = "12345678";
  std::printf("[%s]\n", s);
}
{% endcodeblock %}

Явная опечатка с пропущеным вызовом `s.c_str()`. Но странно, что Студия, даже с `/Wall` не дает никакого предупрежнения, и более того -- код не падает. Но вот `gcc` предупреждает:

    warning: cannot pass objects of non-POD type 'struct std::string' through '...'; call will abort at runtime

и программа при запуске благополучно падает с `Illegal instruction`.

Неужели в Студии специально сделали, что работал такое глюк просто потому, что это слишком распространенная опечатка?
