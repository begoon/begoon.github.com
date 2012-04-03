---
layout: post
title: "Print a container with delimiters"
language: english
date: 2010-02-24 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/02/print-container-with-delimiters.html
categories: 
- cplusplus
- stl
- english
---
It's nice to skip a trailing delimiter when printing out a container.

A straightforward solution could be:

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

A condition in the loop solves the problem, it's better to iterate containers using manipulators:

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

It's not also great because iterators of some containers don't support subtraction. For example, this code doesn't compile if we use `std::list` instead of `std::vector` (the first example also fails on `std::list` but due to another reason). The better way is:

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

The `std::distance` template can calculate the distance between two iterators even if they don't support arithmetics. But for this kind of containers `std::distance` just iterates from one to another and the overall time of the print loop seems to be `O(N^2)` instead of original `O(N)`. Also we have to use the type name twice — to declare the iterator and to instantiate `std::distance`. For example, Visual Studio 2008 cannot deduct the type from the parameters of `std::distance`.

There is another neat way allowing to use iterators (with `O(N)` time even for containers such as `std::list`), and to write beautifully and compactly:

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

The trick with pre-increment `--` operator allows to check effectively for the last element of a container.
