---
layout: post
title: "What is faster: search in lists or deletion from vector"
language: english
date: 2012-06-14 00:00
comments: true
categories: 
- cplusplus
- english
- stl
---
Problem: given a container, in which we have to find arbitrary elements and delete them. If to skip initial requirements, its alternative implementations,  or example, using an extra index to avoid linear search time, and to focus on our implementation only, it turns to a question: is it faster to search with O(N) in lists and delete with O(1), or to index an element with O(1) in the vector and delete with O(N). Intuition says that the vector may beat them all (bunk shifts of data in the vector looks more suitable for an optimization rather than a traversal over the list), but I wanted some numbers.

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

The overloaded `erase` function is for uniformity of the `test` funtcion.

Compiling in VS11:

    cl /O2 /EHsc test.cpp && test

Results:

    class std::vector<int,class std::allocator<int> >
    1.40678
    class std::list<int,class std::allocator<int> >
    8.85827
    class std::forward_list<int,class std::allocator<int> >
    8.70124
    class std::deque<int,class std::allocator<int> >
    9.19784

The difference isn't huge but also not negligible at all as for `list` and `forward_list`.

