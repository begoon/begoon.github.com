---
layout: post
title: "Printing std::string via printf() in Visual Studio"
language: english
date: 2012-05-18 15:37
comments: true
categories: 
- cplusplus
- english
- stl
- visual studio
---
So often in code reviews I see something like this:

{% codeblock lang:cpp %}
#include <string>
#include <cstdio>

int main() {
  std::string s = "12345678";
  std::printf("[%s]\n", s);
}
{% endcodeblock %}

This is an obvious typo of missing `s.c_str()` instead of just `s`. Weirdly, Visual Studio doesn't warn you even with `/Wall`. More over, the code works!. But `gcc` warns though: 

    warning: cannot pass objects of non-POD type 'struct std::string' through '...'; call will abort at runtime

and the program dies with `Illegal instruction`.

Did they really implement a trick in STL to make programs having such  typo working just because this typo is very common? 
