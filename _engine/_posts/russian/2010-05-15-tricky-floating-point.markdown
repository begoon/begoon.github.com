---
layout: post
title: "Плавающая точка уплыла"
language: russian
date: 2010-05-15 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/05/blog-post.html
categories:
- olympiad programming
- russian
---
Решал одну задачу на [UVa Online Judge][]. Долго не мог найти проблему и проверял алгоритм.

Но все было гораздо проще. Как вы думаете, что должна выводить следующая программа?

[UVa Online Judge]: http://uva.onlinejudge.org/

{% codeblock lang:cpp %}
#include <iostream>
#include <cmath>
using namespace std;

int main(int argc, char* argv[]) {
  double f = 1.15;
  int a = f * 100.0 + 0.1E-9;
  int b = f * 100.0;
  cout << "a = " << a << endl;
  cout << "b = " << b << endl;
  return 0;
}
{% endcodeblock %}

Я ожидал два числа 115. 

Нет, у меня на VS2008 она печатает:

    a = 115
    b = 114

Вот такие дела.

**Update:**

Кстати, если попробовать так:

{% codeblock lang:cpp %}
#include <iostream>
#include <cmath>
using namespace std;

int main(int argc, char* argv[]) {
  double f = 1.15;
  int a = f * 100.0 + 0.1E-9;
  int b = f * 100.0;
  cout << "a = " << a << endl;
  cout << "b = " << b << endl;
  double f1 = 0.15;
  int a1 = f1 * 100.0 + 0.1E-9;
  int b1 = f1 * 100.0;
  cout << "a1 = " << a1 << endl;
  cout << "b1 = " << b1 << endl;
  return 0;
}
{% endcodeblock %}

то результат будет:

    a = 115
    b = 114
    a1 = 15
    b1 = 15

Как я думаю, это из-за того, что числа, у которых целая часть нулевая имеют немного особое внутреннее представление в IEEE.

На ТопКодере есть отличная статья на эту тему ([часть 1][] и [часть 2][]). Все кратко и по делу.

[часть 1]: http://www.topcoder.com/tc?module=Static&d1=tutorials&d2=integersReals
[часть 2]: http://www.topcoder.com/tc?module=Static&d1=tutorials&d2=integersReals2
