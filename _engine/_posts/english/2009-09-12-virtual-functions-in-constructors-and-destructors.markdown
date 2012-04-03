---
layout: post
title: "Virtual functions in constructors and destructors"
language: english
date: 2009-09-12 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/09/virtual-functions-in-constructors-and.html
categories: 
- cpluscplus
- english
---
Have a look at the simple example (`virtual_funct_const.cpp`):

{% codeblock lang:cpp %}
#include <iostream>

class A {
 public:
  A() {
    construct();
  }

  ~A() {
    destruct();
  }

  virtual void construct() {
    std::cout << "A::construct()" << std::endl;
  }

  virtual void destruct() {
    std::cout << "A::destruct()" << std::endl;
  }
};

class B: public A {
 public:
  B() {
    construct();
  }

  ~B() {
    destruct();
  }

  virtual void construct() {
    std::cout << "B::construct()" << std::endl;
  }

  virtual void destruct() {
    std::cout << "B::destruct()" << std::endl;
  }
};

int main() {
  B b;
  return 0;
}
{% endcodeblock %}

What does this program print out?

Here we go:

    A::construct()
    B::construct()
    B::destruct()
    A::destruct()
    
Seems that constructors and destructors of the classes `A` and `B` called the functions from its own class only even if those functions `construct()` and `destruct()` were declared as virtual.

There is no magic here but the rule: a virtual function becomes non-virtual when called from a constructor or a destructor.

Any rule has to be memorized which is not convenient. It is much better to just understand why it works this way. This behaviour is based on the main principle of the inheritance implementation in C++: when an object is being constructed its constructors are called in order starting from the base class of the hierarchy to the last inherited one. Destructors are called in the reversed order.

A constructor always works with the assumption that its child classes are not constructed yet that is why there is not way to call anything declared in the child classes. Therefore to call a virtual function the constructor has nothing else to do but to call its own implementation of that function. It seems the mechanism of virtual functions does not work here. It really does not because the virtual functions table of the child class does not override the current table yet.

For a destructor everything works vice versa. A destructor knows that all child classes are already destructed and nothing can be called from them. Therefore it just changes an address of the virtual functions table to the address of its own table address and nicely calls an implementation of the virtual function defined in its own class.

Thus a virtual function is not virtual if it is called from a constructor or a destructor.
