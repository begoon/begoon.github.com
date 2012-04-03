---
layout: post
title: "Перебор всех разбиений множества на два подмножества"
language: russian
date: 2010-06-13 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/06/blog-post_13.html
categories:
- olympiad programming
- russian
---
Допустим, есть массив (вектор) `v`, и надо перебрать все возможные варианты разделения его компонент на два непересекающихся подмножества.

Если элементов множества немного, а именно - их количество умещается в разрядную сетку вашего компьютера, например, не более 32-х или 64-х, то есть элегантный способ организовать перебор следующим образом:

{% codeblock lang:cpp %}
vector<int> v(20); // Исходное множество

// Всего вариантов будет: 2^(v.size())-1.
for (int i = 1; i < (1 << v.size()); ++i) {
  vector<int> left, right;
  for (int j = 0; j < v.size(); ++j) {
    if ((i >> j) & 1)
      left.push_back(v[j]);
    else
      right.push_back(v[j]);
  }

  // Текущий вариант множеств left и right готов для обработки.
  ...
}
{% endcodeblock %}
