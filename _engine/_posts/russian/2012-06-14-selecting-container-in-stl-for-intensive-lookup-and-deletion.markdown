---
layout: post
title: "Что быстрее: поиск в list, deque и forward_list или удаление из vector"
language: russian
date: 2012-06-14 00:00
comments: true
categories: 
- cplusplus
- russian
- stl
---
Задача: есть контейнер, в котором надо находить произвольные элементы и удалять их. Если оставить за рамками обсуждения общую резонность данной задачи и ее альтернативные решения, например, через дополнительный индекс для исключения линейного поиска, то получается, надо выяснить, что быстрее: искать по списку за O(N) и удалять за O(1), или получить элемент в векторе за O(1) и удалять за O(N). Как-то интуиция подсказывает, то если хода нет, то надо ходить с бубей, то есть, если не знаешь что использовать, сначала попробуй вектор. Блочная сдвижка элементов вектора выглядит более оптимизируемой, нежели проход по связному списку. Но мне хотелось немного цифр.

Итак:

{% codeblock lang:cpp %}
#include <future>
#include <vector>
#include <deque>
#include <list>
#include <forward_list>
#include <typeinfo>
#include <iterator>
#include <iostream>

template <typename T>
void go(T f) {
  auto start = std::chrono::high_resolution_clock::now();
  f();
  auto stop = std::chrono::high_resolution_clock::now();
  auto duration = std::chrono::duration<double>(stop - start).count();
  std::cout << duration << "\n";
}

void erase(std::forward_list<int>& c, std::forward_list<int>::iterator i) {
  c.erase_after(i);
}

template <typename T> void erase(T& c, typename T::iterator i) {
  c.erase(i);
}

template <typename T> void test() {
  std::cout << typeid(T).name() << "\n";
  size_t const N = 100000;
  T v(N, 0);
  std::srand(0);
  for (auto t = N; t > 0; --t) {
    auto i = v.begin();
    std::advance(i, std::rand() % t);
    erase(v, i);
  }
}

int main() {
  go (test<std::vector<int>>);
  go (test<std::list<int>>);
  go (test<std::forward_list<int>>);
  go (test<std::deque<int>>);
}
{% endcodeblock %}

Перегруженная функция `erase` сделана для единоообразия функции `test`.

Компилируем в VS11:

    cl /O2 /EHsc test.cpp && test

Результат:

    class std::vector<int,class std::allocator<int> >
    1.40678
    class std::list<int,class std::allocator<int> >
    8.85827
    class std::forward_list<int,class std::allocator<int> >
    8.70124
    class std::deque<int,class std::allocator<int> >
    9.19784

Разница, конечно, не в разы, но и не совсем уже незаметная, как для `list` и `forward_list`.
