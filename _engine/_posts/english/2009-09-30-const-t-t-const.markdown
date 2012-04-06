---
layout: post
title: "const T* vs T const*"
language: english
date: 2009-09-30 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/09/const-t-vs-t-const.html
categories: 
- cplusplus
- english
---
Not a secret that using `const T*` to declare a pointer is exactly the same to `T const*` because it's only important here to use `const` before `*` but the order of `T` and `const` doesn't matter.

The both:

{% codeblock lang:cpp %}
const T* p;
{% endcodeblock %}

and

{% codeblock lang:cpp %}
T const* p;
{% endcodeblock %}

declare the pointer `p` to a const object but not a const pointer. The pointer itself can be modified:

{% codeblock lang:cpp %}
T const* p;
...
p = NULL;
{% endcodeblock %}

But it's impossible to modify the object:

{% codeblock lang:cpp %}
T const* p;
...
p->some_member = 0;   // ERROR: error C2166: l-value specifies const object
{% endcodeblock %}

This was the introductory and let's talk about the topic.

I'm really keen to have readable sources. I could be wrong but in my opinion from the universal point of view using const at the beginning of an expression (for, instance, `const T* p;`) implies that the entire expression is `const`. It doesn't really matter that in this particular case according to the C++ rules it means only that the object is `const` but not the pointer.

That is why `T const* p;` could be treated differently, notably "a type `T` which is `const` and the pointer to this type". Readability becomes a bit better.

Of course, all these are questions of a coding style and it's always recommended to be consistent modifying existing sources. But if you're just learning or beginning a new project or something when it's feasible to try something fresh, it may worth not to refuse yourself in this experience.
