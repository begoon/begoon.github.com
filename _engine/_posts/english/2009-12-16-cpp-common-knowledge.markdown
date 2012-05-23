---
layout: post
title: 'Steve Dewhurst, "C++ Common Knowledge"'
language: english
date: 2009-12-16 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/12/steve-dewhursts-trainig-c-common.html
categories: 
- book
- english
---
I went to the [Steve Dewhurst][]'s training "[C++ Common Knowledge course][]". I've been having his book quite a long time:

[Steve Dewhurst]: http://semantics.org/instructorbio.html
[C++ Common Knowledge course]: http://semantics.org/courses/Cpp-Common-Knowledge-Training.html

Stephen Dewhurst, "C++ Common Knowledge"

<a href="http://www.amazon.co.uk/gp/product/0321321928/ref=as_li_tf_il?ie=UTF8&tag=prodiy-21&linkCode=as2&camp=1634&creative=6738&creativeASIN=0321321928"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&Format=_SL160_&ASIN=0321321928&MarketPlace=GB&ID=AsinImage&WS=1&tag=prodiy-21&ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&l=as2&o=2&a=0321321928" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

and in general, this training is specifically focused on the topics from it.

Very cool man. It was interesting and accompanied with jokes like that Boost guys just smoke templates etc. I really liked it.

Steve said that C++ is virtually the most that is doing in life. He wrote the compilers, utilities, versed in the standards and now he provides trainings.

I cannot say that I learned something very new - it would be strange since I read his book above from cover to cover and periodically get back to it. Although perhaps one thought I was hooked: the correct implementation of the copy constructor or assignment operator for the class in the hierarchy with a virtual base class having data members is a very complicated task. This clearly violates the principle of independence of the logical levels in the hierarchy of inheritance, as it necessary requires to know exactly from which classes you inherited and how to properly initialize them with multiple inheritance.

The recommendation is as follows: first ask yourself a question: do I need a multiple inheritance here? do I need a virtual multiple inheritance?? but do I need a virtual multiple inheritance with the data in the virtual base class??? And even after long reflection it's better to say "no". Personally I don't have anything against the multiple inheritance. But I don't really like how it's implemented in C++. And I don't really like how it's done in Java either. I do like how it's done in Go. In Go the notions of data structures and interfaces are completely separated. Data structures cannot be inherited. They can only implement interfaces. And you can inherit only an interface. Therefore, in principle, it isn't possible to pick up other people's data in inheritance but only methods. And no data, no problem in its initialization.

So I just summarize the general recommendations from Steve:

* try to use virtual functions and polymorphism in general instead of "if" and "case"
* try to use the STL/Boost algorithms and functors instead of loops
* use only "smart" pointers when working with dynamic memory
* don't use the classical arrays but STL containers (as for example, std::vector guarantees the linear arrangement of elements, it's possible to mix the "old" code that works with pointers with using containers)
* think carefully about copying operations of complex classes (the best way to implement a copy constructor and the swap method, and implement the assignment operator through them)
* always declare the copy constructor and assignment operator, and even if they are not used just simply comment out them with a brief explanation why they are not needed
* never use C-like casts, and only C++-like (static_cast, const_cast, etc.), as they are long, tedious to fill and they distort the view of program - in short everything you need to minimize their presence
* remember that an inheritance - a re-use of interfaces but not code itself
* don't the compiler too much ;-) (Steve wrote them and knows that they may hit your back)
