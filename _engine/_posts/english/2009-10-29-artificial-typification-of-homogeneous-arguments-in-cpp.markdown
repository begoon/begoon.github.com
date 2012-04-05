---
layout: post
title: "Artificial typification of homogeneous arguments in C++"
language: english
date: 2009-10-29 01:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/10/artificial-typification-of-homogeneous.html
categories: 
- cplusplus
- english
---
Let's say there is a class with following interface:

{% codeblock lang:cpp %}
class Date {
 public:
  Date(int year, int month, int day) {
    ...
  }
};
{% endcodeblock %}

Unfortunately not everybody in the world uses the same quite logical notation of Year/Month/Day or Day/Month/Year. Some people prefer Month/Day/Year. But even the first two could be easily mixed up. If the following is written:

{% codeblock lang:cpp %}
Data d(2009, 4, 5);
{% endcodeblock %}

Is it 4th of May or 5th of April? Who can be entirely sure what it exactly means without looking in the class declaration?

Any chance to improve the design? Indeed.

For instance:

{% codeblock lang:cpp %}
class Year {
 public:
  explicit Year(int year) : year_(year) {}
  operator int() const { return year_; }
 private:
  int year_;
};
{% endcodeblock %}

And similar for the rest:

{% codeblock lang:cpp %}
class Month { ... };
class Day { ... };
{% endcodeblock %}

Now the interface could look this way:

{% codeblock lang:cpp %}
class Date {
 public:
   Date(Year year, Month month, Day day);
   Date(Month month, Day day, Year year);
   Date(Day day, Month month, Year year);
}
{% endcodeblock %}

We can instantiate the class as:

{% codeblock lang:cpp %}
Date d(Year(2010), Month(4), Day(5));
{% endcodeblock %}

or

{% codeblock lang:cpp %}
Date d(Month(4), Day(5), Year(2010));
{% endcodeblock %}

The result is always visible and fully predictable in a calling code. Everything will be inlined so no slow down involved at all because of those three "unnecessary" classes.

I agree there is more typing job but it fully gets you rid of any typos and consequently of silly but annoying bugs.

Any objections?
