---
layout: post
title: "Trade-off with const in legacy code"
language: english
date: 2012-01-04 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/01/trade-off-with-const-in-legacy-code-english.html
categories: 
- cplusplus
- english
---
Today we argued an hour with a colleague regarding the following code:

{% codeblock lang:cpp %}
void foo(T* t) {
  bar(t);
}
{% endcodeblock %}

The problem is that the function `bar` is a part of a legacy library which we cannot refactor right now. The signature of `bar` is `void bar(T*)`. `T` is not `const`. But in reality `bar` never changes an object referenced by `t`. This is how it was implemented.

But `foo` is a part of a brand new API, and we want to make nice or clean. The contract of the function `foo` says that it doesn’t need to change its parameter.

I think the code should be like this:

{% codeblock lang:cpp %}
void foo(const T* t) {
  bar(const_cast<T*>(t));
}
{% endcodeblock %}

Why? The contact of foo doesn’t require the pointer t to be non-const. We must reflect this in the API by making `t` `const`. It doesn’t matter that for some reason a particular implementation of `foo` is based on the legacy `bar` function not having `const` in the argument but never changing it. Yes, we have to use the ugly `const_cast` but this bad code is nicely isolated inside `foo` only and doesn’t affect our nice and clean brand new API. Moreover, if we refactor `foo` at some point and get rid of legacy `bar` at all, the problem will disappear completely.

Here is a counterargument from my colleague: it may turn out that the function `foo` can have a bug and accidentally change `t` even it is declared as `const`. The solution is to simply keep the argument of `foo` non-const. In this case we don’t need that cast, we explicitly show to an end user of `foo` that she should expect its parameter to be `const`, and eventually we never violate the contact of the function `foo`.

Eventually we haven’t agreed. My flaw is that `const` doesn’t really protect from side effects coming from legacy `bar` and the argument of `foo` may be changed regardless being `const`. My friend’s flaw is that it is not easy to explain in the documentation how and why the argument of `foo` may be changed. Just because our particular implementation dictates this? Such approach spreads the drawback of the legacy code to our nice and shiny new code.

Dilemma.

P.S. There is another esoteric approach — to create a temporary deep copy of `T` inside `foo` and pass it to `bar` by non-const pointer. Personally if I have to choose between quick but badly designed code and slow but nicely written code I usually go for the second one. Tomorrow we can buy another faster computer and the slow code will be faster, but that computer will make the bad code better.
