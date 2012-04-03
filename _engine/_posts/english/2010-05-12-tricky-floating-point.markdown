---
layout: post
title: "Tricky floating point"
language: english
date: 2010-05-12 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/05/floating-point-is-rubbish.html
categories: 
- english
---
How do you think what the code below should print out? I expected two numbers `115`.

{% codeblock lang:cpp %}
#include <iostream>
#include <cmath>
using namespace std;

int main(int argc, char* argv[]) {
  double f = 1.15;
  int a = f * 100.0 + 0.1E-9;
  int b = f * 100.0;
  cout << "a = " << a << endl;
  cout << "b = " << b << endl;
  return 0;
}
{% endcodeblock %}

No, on VS2008 it prints out:

    115
    114

Be careful.

