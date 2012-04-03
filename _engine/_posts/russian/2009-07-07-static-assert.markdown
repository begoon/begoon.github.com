---
layout: post
title: "Static assert"
language: russian
date: 2009-07-07 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/07/static-assert.html
categories:
- cplusplus
- russian
---
А какой у вас используется `assert` времени компиляции, если не использовать `boost/static_assert.hpp`?

У меня вот такой:

{% codeblock lang:cpp %}
template <bool> struct STATIC_ASSERTION_FAILURE;
template <> struct STATIC_ASSERTION_FAILURE<true> {};
#define STATIC_CHECK(x) sizeof(STATIC_ASSERTION_FAILURE< (bool)(x) >)
{% endcodeblock %}

Работает приемлемо сносно:

{% codeblock lang:cpp %}
int main() {
  STATIC_CHECK(sizeof(int) < sizeof(char));
  return 0;
}
{% endcodeblock %}
