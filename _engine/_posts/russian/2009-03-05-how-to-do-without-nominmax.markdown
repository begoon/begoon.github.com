---
layout: post
title: "Как обойтить без макроса NOMINMAX"
language: russian
date: 2009-03-05 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/nominmax.html
categories:
- cplusplus
- visual studio
- russian
---
В комментариях к [посту][std::min() и std::max() в Visual Studio] про проблему конфликта имен STL'евских `std::min` и `std::max` с одноименными макросами из файла `windows.h` мне подсказали интересное решение.

Если вместо, например, `std::max(a, b)` написать `(std::max)(a, b)`, то результат работы препроцессора выглядит так:

{% codeblock lang:cpp %}
#line 3 "minmax.cpp"
int main() {
  int a = (std::min)(10, 20);
  return 0;
}
{% endcodeblock %}

вместо:

{% codeblock lang:cpp %}
#line 3 "minmax.cpp"
int main() {
  int a = std::(((10) < (20)) ? (10) : (20));
  return 0;
}
{% endcodeblock %}

и конфликта не происходит. Все компилируется без проблем.

Не берусь судить, на сколько это красивое решение, и я бы все-таки предпочел действовать напрямую через макрос NOMINMAX, но выход элегантный.

Другие посты по теме:

* [std::min() и std::max() в Visual Studio][]

[std::min() и std::max() в Visual Studio]: /blog/russian/2009/02/15/min-max-in-visual-studio/
