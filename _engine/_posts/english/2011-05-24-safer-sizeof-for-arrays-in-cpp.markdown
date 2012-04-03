---
layout: post
title: "Safer sizeof for arrays in C++"
language: english
date: 2011-05-24 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/05/safer-sizeof-for-arrays-in-c.html
categories: 
- cplusplus
- english
---
Sometimes you have to deal with raw arrays and pointers to them in C++, and also determine a number of elements in the array at compile time.

For example, it can be done this way:

{% codeblock lang:cpp %}
#define arraysize(array) (sizeof(array) / sizeof(array[0]))
{% endcodeblock %}

But there is a little problem over there. If accidently a pointer is passed to the this macro instead of an array, the code still compiles but the value will be far from being conceived.

There is a way to make this macro safer.

{% codeblock lang:cpp %}
template <typename T, size_t N>
char (&ArraySizeHelper(T (&array)[N]))[N];
#define arraysize(array) (sizeof(ArraySizeHelper(array)))
{% endcodeblock %}

Looks cryptic, but we can break it apart:

* `T (&array)[N])` - an array definition (`T array[N]`) passed by reference
* `char (&ArraySizeHelper(...)[N]` - a function returning a array by reference
* `sizeof(ArraySizeHelper(array))` - take a size of the function return value type
* This is a template function, parameterized by an array type and its size deduced automatically by the compiler. The function isn't called, so its definition is not required.

Frankly, it is not easy to get it. But this macro is great.

By the way, we can play with `sizeof()` of the function return value type:

{% codeblock lang:cpp %}
#include <iostream>
#include <string>

std::string f() {
  return std::string();
}

int main() {
  std::cout << sizeof( (&f)() ) << std::endl;
  std::cout << sizeof( std::string ) << std::endl;
  return 0;
}
{% endcodeblock %}


My VS2010 prints out "28" twice.

Interestingly, in C it is also possible:

{% codeblock lang:cpp %}
#include <stdio.h>

struct t {
  char x[1024];
};

struct t f() {
  struct t a;
  return a;
}

int main() {
  printf("%d\n", sizeof(struct t));
  printf("%d\n", sizeof( (*f)() ));
  return 0;
}
{% endcodeblock %}

It prints out `1024` twice.
