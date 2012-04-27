---
layout: post
title: 'What is faster: std::endl vs "\n"?'
language: english
date: 2012-04-25 23:28
comments: true
categories: 
- english
- cplusplus
- stl
---
To this day I believed, that `std::endl` is always better that `\n` in C++ streams (portability, for instance). It turns out that no.

A code with `std::endl`:

{% codeblock lang:cpp %}
#include <string>
#include <iostream>

int main() {
  for (int i = 0; i < 1000000; ++i) {
    std::string s(1, 'x');
    std::cout << s << std::endl;
  }
  return 0;
}
{% endcodeblock %}

Compile and run:

    clang++ -o endl -O3 endl.cpp && time ./endl >rubbish

    real	0m4.518s
    user	0m1.080s
    sys	0m3.311s
    
A code with `\n`:

{% codeblock lang:cpp %}
#include <string>
#include <iostream>

int main() {
  for (int i = 0; i < 1000000; ++i) {
    std::string s(1, 'x');
    std::cout << s << '\n';
  }
  return 0;
}
{% endcodeblock %}

Compile and run:

    clang++ -o endl -O3 endl.cpp && time ./endl >rubbish

    real	0m0.263s
    user	0m0.236s
    sys	0m0.008s    

The difference is obvious. The second one is much faster.

`std::endl` always `flush`es the stream. In turn, `\n` simply puts a new line character to the stream, and in most cases this is exactly what we need. And `std::flush`, if necessary, can be called afterwards, once, explicitly.

