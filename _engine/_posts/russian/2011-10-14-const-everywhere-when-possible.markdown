---
layout: post
title: "сonst везде, где только можно"
language: russian
date: 2011-10-14 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/10/onst.html
categories: 
- cplusplus
- russian
---
Интересно, что далеко не все мне знакомые программисты исповедуют радикальный подход по использованию `const`: использовать `const` абсолютно везде, где это не приводит к ошибкам компиляции.

Я не имею ввиду очевидные применения `const` для аргументов функций и константных методов.

Я имею ввиду, что любая переменная, которая не меняется с момента ее создания, должна быть `const`. Само название "переменная" значит, что объект должен меняться. Если он не меняется, то это уже не переменная. Сделать переменную непемеренной в C/C++ можно с помощью ключевого слова `const`.

Пара примеров, где люди часто не ставят `const`:

{% codeblock lang:cpp %}
const int sz = very_long_name_to_calculate_size(...);
for (int i = 0; i < sz; ++i) {
...
const VeryLongClassName var(a, lot, of, different, parameters);
int a = var.getX();
// Only "const" functions of "VeryLongClassName" are called further down.
{% endcodeblock %}

Кстати, явное указание на неизменность переменной помогает компилятору в оптимизации.

Посты по теме:

* [const T* или T const*][]
* [Неконстантные ссылки][]
* [Ссылка на временный объект в списке инициализации конструктора][]

[const T* или T const*]: /blog/russian/2009/09/30/const-t-or-t-const/
[Неконстантные ссылки]: /blog/russian/2010/11/17/non-const-references/
[Ссылка на временный объект в списке инициализации конструктора]: /blog/russian/2010/10/29/reference-to-temporary-object-in-constructor-initialize-list/
