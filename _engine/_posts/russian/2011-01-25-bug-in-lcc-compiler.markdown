---
layout: post
title: "Баг в компиляторе LCC"
language: russian
date: 2011-01-25 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/01/lcc.html
categories:
- russian
---
Благополучно нарвался на баг в компиляторе [LCC][Компилятор языка С: LCC-WIN32].

[Компилятор языка С: LCC-WIN32]: /blog/russian/2011/01/18/lcc-compiler-for-windows/

    c:\lcc\bin\lcc -v

    Logiciels/Informatique lcc-win32 version 3.8. Compilation date: Dec  4 2010 13:14:58

Файл: `t.c`:

{% codeblock lang:cpp %}
int main() {
    char* p;
    char* s[1] = { p };
}
{% endcodeblock %}

    c:\lcc\bin\lcc t.c
    Error t.c 3 Compiler error (trap). Stopping compilation

Обычно ж как бывает, начинает проявляется "баг компилятора" -- программа ведется себя странно, исключения почему-то не ловятся, наблюдаются неожиданные падения программы и т.д. В подавляющим случаев, увы, все кончается просто ошибками работы с памятью. Ничего сверхестественного.

Баги же типа этого, проявляющиеся на тривиальном примере - это всегда событие.

Из недавнего:

* [Ошибка в компиляторе Godegear (Borland) C++ при приведении типов указателей][]
* [Двойная точка с запятой в разделе объявления переменных][]

[Ошибка в компиляторе Godegear (Borland) C++ при приведении типов указателей]: /blog/russian/2009/09/12/codegear-borland-compiler-bug-when-casting-pointers/
[Двойная точка с запятой в разделе объявления переменных]: /blog/russian/2009/09/21/doubled-semicolon-in-variables-declaration/
