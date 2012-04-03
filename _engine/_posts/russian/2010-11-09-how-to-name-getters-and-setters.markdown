---
layout: post
title: "Как называть getter'ы и setter'ы"
language: russian
date: 2010-11-09 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/11/getter-setter.html
categories:
- cplusplus
- russian
---
Для именования функций записи и чтения членов класса (getter/setter) в стандартном C++ есть три часто используемых приема.

**1. Чисто плюсовый вариант, основанный на семантике ссылок.**

{% codeblock lang:cpp %}
class Foo {
  Value field_;
public:
  Value& field() { return field_; }
  const Value& field() const { return field_; }
};
{% endcodeblock %}

Использование:

{% codeblock lang:cpp %}
Foo foo;
foo.field() = field_instance;
field_instance = foo.field();
{% endcodeblock %}

Плюсы: краткость текста, близость к нотации [свойств][Properties], и возможность использования присвоения в каскаде (`foo1.field() = foo2.field() = 2;`).

[Properties]: http://www.cplusplus.com/forum/general/8147/

Минусы: использование синтаксиса вызова функции слева от знака присваивания выглядит непривычно.

**2. Способ в стиле Java.**

{% codeblock lang:cpp %}
class Foo {
  Value field_;
public:
  void setField(const Value& value) { field_ = value; }
  const Value& getField() const { return field_; }
};
{% endcodeblock %}

Использование:

{% codeblock lang:cpp %}
Foo foo;
foo.setField(field_instance);
field_instance = foo.getField();
{% endcodeblock %}

Плюсы: ясность и очевидность синтаксиса.

Минусы: многословность из приставок "get" и "set".

**3. Cтиль Objective-C**

{% codeblock lang:cpp %}
class Foo {
  Value field_;
public:
  void setField(const Value& value) { field_ = value; }
  const Value& field() const { return field_; }
};
{% endcodeblock %}

Использование:

{% codeblock lang:cpp %}
Foo foo;
foo.setField(field_instance);
field_instance = foo.field();
{% endcodeblock %}

Плюсы: краткость текста при чтении (нет почти бессмысленной приставки "get") и очевидность при записи.

Минусы: я пока не нашел таковых.

Понятно, что все три способа имеют право жизнь. Но с точки зрения стилистики, стоит выбрать один и придерживаться его в рамках одного проекта.

Лично я почти всегда предпочитал способ #1, но после своего [последнего поста][Ссылка на временный объект в списке инициализации конструктора] я перешел на третий.

[Ссылка на временный объект в списке инициализации конструктора]: /blog/russian/2010/10/29/reference-to-temporary-object-in-constructor-initialize-list/
