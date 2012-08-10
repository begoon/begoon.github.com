---
layout: post
title: 'Why a getter doesn't need a "get" prefix'
language: english
date: 2012-05-17 07:48
comments: true
categories: 
- english
- cplusplus
---
### Idea

Never use a `get` prefix for getters.

### Why?

Usually we consider member functions to be getters if they simply return a reference or pointer to a private member, just for the sake of data incapsulation. Such functions don't do anything really, they have no payload.

So, there is nothing requiring a "get" verb to describe its meaning. The getter is just an alias of a member. The "get" prefix is only required when a function does a **real** data transformation or computation, for instance, `getLastTick()` or `getFullUserName()`. But it is even better here to replace "get" by something more meaningful, `extractLastTick()` and `buildFullUserName()`.

&#9632;

Related posts:

* [Naming convension for getters and setters in C++][]

[Naming convension for getters and setters in C++]: /blog/english/2010/11/09/naming-convension-for-getters-and-setters-in-cpp/
