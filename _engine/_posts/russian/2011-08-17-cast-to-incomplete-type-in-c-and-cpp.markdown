---
layout: post
title: "Приведение к неполному типу в C и С++"
language: russian
date: 2011-08-17 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/08/c.html
categories: 
- cplusplus
- russian
---
В режиме С и С++ компилируется без ошибок:

{% codeblock lang:cpp %}
void* p = (struct this_does_not_exist *) -1;
{% endcodeblock %}

Убираем `struct` для С++ и получаем:

    cast.cpp
    cast.cpp(1) : error C2065: this_does_not_exist: необъявленный идентификатор
    cast.cpp(1) : error C2059: синтаксическая ошибка: )

Теперь добавляем forward declaration:

{% codeblock lang:cpp %}
class this_does_not_exist;
void* p = (this_does_not_exist *) -1;
{% endcodeblock %}

Тут все честно и компилируется без ошибок.

Скорое всего тут везде все по стандарту, но первый пример все-таки какой-то странный.

GCC хотя бы предупреждение выдает.
