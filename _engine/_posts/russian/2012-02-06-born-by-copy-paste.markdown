---
layout: post
title: "Рожденный копипастом"
language: russian
date: 2012-02-06 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/02/blog-post.html
categories: 
- cplusplus
- russian
---
Всем своими фибрами ненавижу копипаст с участием переменных с номерами. При очередном копипасте вероятность забыть исправить одну циферку крайне велика. Например, ужасный кусок кода (не правда ли, просто найти опечатку?):

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

Как его можно улучшить? Например, разбить на отдельные тесты. Это идеальный вариант. Но можно сделать и так (что лично на мой взгляд не так уж и плохо), чтобы решить проблему копипаста новых примеров:

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
