---
layout: post
title: "Virtual private functions in C++"
language: english
date: 2011-12-21 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/12/private-c-virtual-private-functions-in-english.html
categories: 
- cplusplus
- english
---
I've come across an interesting in my point of view bit of code. There was a virtual private function. The approach is odd at the first place and I thought it shouldn't even compile, but surprisingly it did. I felt that this was yet another gap in my C++.

I wrote this code:

{% codeblock lang:cpp %}
#include <iostream>

class A {
public:
  void bar() { foo(); }
private:
  virtual void foo() = 0;
};

class B: public A {
private:
  virtual void foo() { std::cout << "B::foo()" << std::endl; }
};

int main(int argc, char* argv[]) {
  A* a = new B();
  a->bar();
  delete a;
  return 0;
}
{% endcodeblock %}

VS2010 and GCC compile it perfectly and it prints out `B::foo()`.

I have concluded that the virtual function mechanism usually implemented via vtable is runtime, but public/private is compile time, and they don't depend on each other.
