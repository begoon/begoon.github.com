---
layout: post
title: "Как понятно объяснить задачу о разрезании пиццы"
language: russian
date: 2012-05-01 23:45
comments: true
categories: 
- problem
- russian
---
Есть классическая задача о разрезании пиццы, в которой спрашивается количество разрезов пиццы, чтобы в итоге получилось N кусков. Фактически это задача о разбиении плоскости прямыми. В "Конкретной математике" есть вот такое объяснение:

{% img /images/blog/knuth-on-pizza-problem.png %}

Я читал его много раз, но так и не мог понять -- почему именно так?

В итоге, я нашел вот эту страницу -- [Dividing The Plane][], где есть такое предложение:

[Dividing The Plane]: http://www.jimloy.com/geometry/plane.htm

> Let's say that we've got n lines (for some arbitrary n). And we add an n+1th line. That line goes through region-line-region-line-...-line-region. It went through n lines and n+1 regions (assuming that all of the lines intersect). For each region that it went through, it added a region (split that region into two regions).

И вот эта фраза на пальцах объясняет, почему именно `n`-я прямая добавляет `n + 1` регионов. Идея тут в визуализации прохода новой прямой через существующие регионы.

