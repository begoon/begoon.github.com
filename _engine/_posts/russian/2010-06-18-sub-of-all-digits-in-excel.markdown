---
layout: post
title: "Сумма цифр числа в Excel'е"
language: russian
date: 2010-06-18 02:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/06/excel.html
categories:
- olympiad programming
- russian
---
Разбираясь с задачей из [последней SRM'ки][TopCoder SRM 473. Уроки], решил я посмотреть, как будет выглядеть график у функции `Y=D(X)`, где `X` - натуральное число, а `D(X)` - сумма цифр его десятичной записи. Оказывается, вот такой хитрой формулой:

[TopCoder SRM 473. Уроки]: /blog/russian/2010/06/18/topcoder-srm-473/

    =SUMPRODUCT(MID(A1,ROW(INDIRECT("1:" & LEN(A1))),1)) 

можно в Экселе посчитать этот самый `D(X)`. Ума не приложу, что это формула значит, но точно работает.

А вот и сам график, кому интересно:

{% img /images/blog/sum-of-all-digits.png %}
