---
layout: post
title: "sizeof('a') в С и C++"
language: russian
date: 2009-03-09 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/chara-c.html
categories:
- cplusplus
- russian
---
В очередной раз [узнал][Алена С++ про sizeof] для себя новый потенциальный вопрос для "прогиба" на каком-нибудь тесте по языку С.

[Алена С++ про sizeof]: http://alenacpp.blogspot.com/2009/03/sizeofa.html

Программа `x.c`:

{% codeblock lang:cpp %}
#include <stdio.h>
int main() {
  char s[4];
  s[0] = 'C'; s[1] = s[2] = '+'; s[3] = 0;
  s[sizeof(' ') ^ 5] = 0;
  printf("%s\n", s);
  return 0;
}
{% endcodeblock %}

Компилируем и запускаем.

Visual Studio:

    cl x.c && x

или в Cygwin:

    gcc -o x x.c && x

Имеем следующий результат:

    C

А теперь так:

    cl /TP x.c && x

или в Cygwin:

    g++ -o x x.c && x

Теперь программа печает иное:

    C++

Результат повеселил некоторых моих коллег.

Нашел небольшой список еще некоторых "[отличий][C vs C++ in compile time]" С и С++, но, пожалуй, этот самый неявный, а значит потенциально опасный.

[C vs C++ in compile time]: http://grprakash.googlepages.com/confusion
