---
layout: post
title: "Born by copy-paste"
language: english
date: 2012-02-06 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/02/born-by-copy-paste.html
categories: 
- cplusplus
- english
---
I usually start crying when see a copy-paste with numbered variables. A probability to screw up is very high, just forget to change a single number after pasting. Here is a horrifying piece of code (don't you mind to spot on an incy wincy typo?)

{% codeblock lang:cpp %}
void Test_SplitPair() {
  typedef std::pair<std::string, std::string> Pair;
  using string::SplitPair;

  const Pair p1 = SplitPair("", '=');
  assert(p1.first.empty());
  assert(p1.second.empty());

  const Pair p2 = SplitPair("=", '=');
  assert(p2.first.empty());
  assert(p2.second.empty());

  const Pair p3 = SplitPair("name=value", '=');
  assert(p3.first == "name");
  assert(p3.second == "value");

  const Pair p4 = SplitPair("name = value", '=');
  assert(p3.first == "name");
  assert(p3.second == "value");

  const Pair p5 = SplitPair(" n ame  \t =  va lue  \r\n", '=');
  assert(p5.first == " n ame  \t ");
  assert(p5.second == "  va lue  \r\n");
}
{% endcodeblock %}

Any ways to make to better? The ideal solution is to split to multiple tests. But even less radical approach works to avoid copy-paste problems:

{% codeblock lang:cpp %}
void Test_SplitPair() {
  typedef std::pair<std::string, std::string> Pair;
  using string::SplitPair;
  {
  const Pair p = SplitPair("", '=');
  assert(p.first.empty());
  assert(p.second.empty());
  }
  {
  const Pair p = SplitPair("=", '=');
  assert(p.first.empty());
  assert(p.second.empty());
  }
  {
  const Pair p = SplitPair("name=value", '=');
  assert(p.first == "name");
  assert(p.second == "value");
  }
  {
  const Pair p = SplitPair("name = value", '=');
  assert(p.first == "name");
  assert(p.second == "value");
  }
  {
  const Pair p = SplitPair(" n ame  \t =  va lue  \r\n", '=');
  assert(p.first == " n ame  \t ");
  assert(p.second == "  va lue  \r\n");
  }
}
{% endcodeblock %}
