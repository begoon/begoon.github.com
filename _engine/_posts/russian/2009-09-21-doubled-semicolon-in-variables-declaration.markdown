---
layout: post
title: "Двойная точка с запятой в разделе объявления переменных"
language: russian
date: 2009-09-21 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/09/blog-post_21.html
categories:
- cplusplus
- bug
- russian
---
Казалось бы, невинный пример (`vs_double_semicolumn.c`):

{% codeblock lang:cpp %}
void main() {
  int a;;
  int b;
}
{% endcodeblock %}


Компилируем (в режиме языка `С`, то есть без `/TP`):

    cl vs_double_semicolumn.c
    
Результат:

    vs_double_semicolumn.c
    vs_double_semicolumn.c(3) : error C2143: syntax error : missing ';' before 'type'
    
Результат в Codegear/Borland примерно такой же (хотя описание ошибки более ясное):

    CodeGear C++ 5.93 for Win32 Copyright (c) 1993, 2007 CodeGear
    vs_double_semicolumn.c:
    Error E2140 vs_double_semicolumn.c 3: Declaration is not allowed here in function main
    *** 1 errors in Compile ***
    
Проблемка заключается в случайной опечатке в виде двойного символа `;`. Кстати, пример абсолютно реальный, из жизни. Случайная опечатка - и сразу много вопросов.

Получается, что второй символ `;` тут трактуется как пустой оператор, а не пустая декларация переменной. Компилятор решает, что объявления переменных закончены, и начался блок операторов, поэтому резонно ругается на попытку объявить переменную `b` там, где уже должны быть операторы.

Проверил на `gcc`, на родных компиляторах AIX, Solaris и HP-UX. Эти все съели пример без проблем.
