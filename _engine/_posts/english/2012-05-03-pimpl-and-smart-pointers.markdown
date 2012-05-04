---
layout: post
title: "Pimpl and smart pointers"
language: english
date: 2012-05-03 23:47
comments: true
categories: 
- cplusplus
- english
- stl
---
Sometimes I realise that I don't know obvious things. My discovery of today is about Pimpl and smart pointers. For some reason I thought that the forward class declaration is only possible if the class is referenced by a pointer or a reference (#1), that is used in a form of `T*` or `T&` (#2). Therefore, when I wanted Pimpl, I didn't use smart pointers because it seemed that it needed the full class definition.

`A.h`:
{% codeblock lang:cpp %}
#include <memory>
class A_pimpl;
class A {
  A();
  ~A();
  std::unique_ptr<A_pimpl> p;
}
{% endcodeblock %}

I believed to some reason that it will not work because the class `A_pimpl` is partially defined. I was surprised as a child when tried and realised that it works! The fact #1 is not equivalent to the fact #2.

Now in `A.cpp` I can write:

{% codeblock lang:cpp %}
#include "module.h"
#include "pimpl.h"

A::A() : p(new A_pimpl()) {}
A::~A() {}
{% endcodeblock %}

Everything above also works for `std::shared_ptr` (C++ 2011), `boost::scoped_ptr`, and `boost::shared_ptr`.

**Update**

It is important that class `A` must an explicitly provided destructor. Moreover, its body must in `A.cpp`, not in the header. Otherwise, it will be a compilation error, for example, "error C2338: can't delete an incomplete type".
