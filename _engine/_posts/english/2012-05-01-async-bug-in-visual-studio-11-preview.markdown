---
layout: post
title: "Bug in std::async() in Visual Studio 11 (preview)"
language: english
date: 2012-05-01 13:10
comments: true
categories: 
- english
- visual studio
- bug
---
Come across a bug in the Visual Studio 11 (preview).

{% codeblock lang:cpp %}
#include <future>

int main(int argc, char* argv[]) {
  for (auto i = 0L; i < 1000000; ++i) {
    auto f = std::async([](){ return 0; });
    f.get();
  }
  return 0;
}
{% endcodeblock %}

This code consistently crashes (and doesn't throw). When decreasing a number of iteration, at some point to stops crashing.

The compiler cl.exe 17.00.40825.2, IDE 11.0.40825.2 PREREL. [Posted on Stack Overflow][]. They say, likely it is the bug.

[Posted on Stack Overflow]: http://stackoverflow.com/questions/10301432/number-of-async-futures-in-c11

Where to file a bug to VS?
