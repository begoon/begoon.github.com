---
layout: post
title: "Искусственная типизация однородных параметров в C++"
language: russian
date: 2009-10-29 01:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/10/c.html
categories:
- cplusplus
- russian
---
Допустим есть вот такой класс:

{% codeblock lang:cpp %}
class Date {
 public:
  Date(int year, int month, int day) {
    ...
  }
};
{% endcodeblock %}

К сожалению, не весь мир пользуется логичной нотацией Год/Месяц/День или День/Месяц/Год. Иногда люди пишут Месяц/День/Год. Хотя и первые два легко перепутать. Вот к чему я веду: где-то в далеком от описания класса коде кто-то пишет:

{% codeblock lang:cpp %}
Date d(2009, 4, 5);
{% endcodeblock %}

Что он этим хотел сказать? 4-е Мая или 5-е Апреля? Сложно быть уверенным, что пользователь такого класса когда-нибудь не перепутает порядок аргументов.

Можно улучшить дизайн? Да.

Например, так:

{% codeblock lang:cpp %}
class Year {
 public:
  explicit Year(int year) : year_(year) {}
  operator int() const { return year_; }
 private:
  int year_;
};
{% endcodeblock %}

И аналогично:

{% codeblock lang:cpp %}
class Month { ... };
class Day { ... };
{% endcodeblock %}

Интерфейс самого класса Date может быть таким:

{% codeblock lang:cpp %}
class Date {
 public:
   Date(Year year, Month month, Day day);
   Date(Month month, Day day, Year year);
   Date(Day day, Month month, Year year);
}
{% endcodeblock %}

И использовать класс надо так:

{% codeblock lang:cpp %}
Date d(Year(2010), Month(4), Day(5));
{% endcodeblock %}

или

{% codeblock lang:cpp %}
Date d(Month(4), Day(5), Year(2010));
{% endcodeblock %}

Результат будет всегда предсказуем и виден в вызывающем коде. Тут все inline'овое, так что эти три "лишние" класса никакого замедления не дадут.

Согласен, писанины немного больше, но зато полная гарантия от опечаток и, как следствие, глупых, но коварных ошибок.

Возражения есть?
