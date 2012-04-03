---
layout: post
title: "Печать контейнера с разделителями"
language: russian
date: 2010-02-24 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/02/blog-post_24.html
categories:
- cplusplus
- russian
---
Иногда, при печати содержимого контейнера хочется избежать ненужного хвостового разделителя.

Простейшее решение выглядит так:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
  int a[] = { 1, 2, 3, 4, 5 };
  std::vector<int> v(a, a + 5);

  for (int i = 0; i < v.size(); ++i) {
    std::cout << v[i];
    if (i < v.size() - 1)
      std::cout << ", ";
  }
  std::cout << std::endl;

  return 0;
}
{% endcodeblock %}

Условие в теле цикла решает поставленную задачу, но контейнеры лучше обходить через итераторы, поэтому следующая попытка может выглятеть так:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
  int a[] = { 1, 2, 3, 4, 5 };
  std::vector<int> v(a, a + 5);

  for (std::vector<int>::const_iterator i = v.begin(); i != v.end(); ++i) {
    std::cout << *i;
    if (v.end() - i > 1)
      std::cout << ", ";
  }
  std::cout << std::endl;

  return 0;
}
{% endcodeblock %}

Но такой подход не самый верный, ибо итераторы далеко не всех контейнеров поддерживают операцию вычетания. Например, при использовании `std::list` вместо `std::vector` будет ошибка компиляции (как, кстати, и для первого примера, но по другой причине). Поэтому правильнее было бы написать:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
  int a[] = { 1, 2, 3, 4, 5 };
  std::vector<int> v(a, a + 5);

  typedef std::vector<int>::const_iterator iterator;
  for (iterator i = v.begin(); i != v.end(); ++i) {
    std::cout << *i;
    if (std::distance<iterator>(i, v.end()) > 1)
      std::cout << ", ";
  }
  std::cout << std::endl;
  return 0;
}
{% endcodeblock %}

Шаблонный класс `std::distance` умеет рассчитывать расстояние между итераторами, и даже для тех, которые не поддерживают операции сложения и вычетания. Для таких итераторов будет делаться пошаговый обход от одного к другому для подсчета расстояния. На первый взгляд получается, что вычислительная сложность такого простого цикла будет уже не линейной, а квадратической. Еше надо таскать за собой описание типа дважды — чтобы создать итератор цикла и экземпляр `std::distance`. Например, Visual Studio 2008 требует указывать тип итератора для шаблона `std::distance` и не может "угадать" его из параметров (другие компиляторы могут вести себя иначе). Получается, на ровном месте навернули какую-то ерунду.

Но есть весьма элегантный способ, который позволяет и использовать итераторы, и сохранить линейную сложность алгоритма для контейнеров, которые не умеют эффективно вычислять расстояние между элементами (например, `std::list`), и писать красиво и компактно:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

int main(int argc, char* argv[]) {
  int a[] = { 1, 2, 3, 4, 5 };
  std::vector<int> v(a, a + 5);

  for (std::vector<int>::const_iterator i = v.begin(); i != v.end(); ++i) {
    std::cout << *i;
    if (i != --v.end())
      std::cout << ", ";
  }
  std::cout << std::endl;

  return 0;
}
{% endcodeblock %}

Трюк с оператором `--` позволяет эффективно проверить на последний элемент контейнера.
