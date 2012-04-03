---
layout: post
title: "Naming convension for getters and setters in C++"
language: english
date: 2010-11-09 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/11/getter-and-setter-naming-in-c.html
categories: 
- cplusplus
- english
---
When writing getter and setter methods in standard C++ there are three main approaches for naming.

1\. Pure C++ method based on the references.

{% codeblock lang:cpp %}
class Foo {
  Value field_;
public:
  Value& field() { return field_; }
  const Value& field() const { return field_; }
};
{% endcodeblock %}

Usage:

{% codeblock lang:cpp %}
Foo foo;
foo.field() = field_instance;
field_instance = foo.field();
{% endcodeblock %}

Pros: brevity, closeness to the property notation and possibility of using in a cascade assignment (`foo1.field() = foo2.field() = 2;`).

Cons: using the function call on the left looks unusual.

2\. Java way

{% codeblock lang:cpp %}
class Foo {
  Value field_;
public:
  void setField(const Value& value) { field_ = value; }
  const Value& getField() const { return field_; }
};
{% endcodeblock %}

Usage:

{% codeblock lang:cpp %}
Foo foo;
foo.setField(field_instance);
field_instance = foo.getField();
{% endcodeblock %}

Pros: clarity and obviousness.

Cons: wordiness due to `get` and `set` prefixes.

3\. Objective-C way

{% codeblock lang:cpp %}
class Foo {
  Value field_;
public:
  void setField(const Value& value) { field_ = value; }
  const Value& field() const { return field_; }
};
{% endcodeblock %}

Usage:

{% codeblock lang:cpp %}
Foo foo;
foo.setField(field_instance);
field_instance = foo.field();
{% endcodeblock %}

Pros: brevity (no useless `get` prefix) and clarify.

Cons: haven't found so far.

All three have rights to live but from the style perspective it's good to be consistent and use only one style across one project.
