---
layout: post
title: "Коварная опечатка в getter'e"
language: russian
date: 2010-10-26 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/10/blog-post_26.html
categories:
- cplusplus
- russian
---
Есть (точнее был) у меня вот такой код:

{% codeblock lang:cpp %}
const std::string& id() const { return id_; }
std::string id() { return id_; }
{% endcodeblock %}

В нем есть одна досадная опечатка, из которой код:

{% codeblock lang:cpp %}
order.id() = 123;
{% endcodeblock %}

делал то, что от него не ожидалось, а точнее, ничего не делал. И проблема, как вы наверное уже догадались, в пропущеном значке `&` во второй строке. Должно было быть так:

{% codeblock lang:cpp %}
const std::string& id() const { return id_; }
std::string& id() { return id_; }
{% endcodeblock %}

Эта опечатка стоила мне часа поиска проблемы через вторичные признаки в виде иногда не обновляемой базы данных.

Причина? А все потому, что я поленился написать тесты изначально, решив, что это уж очень простые методы. Но теперь таки добавил для этого тест:

{% codeblock lang:cpp %}
TEST(Order, GetterSetters) {
  Order order;
  ...
  EXPECT_EQ(0, order.id());   // Must be initialized.
  order.id() = 123;
  EXPECT_EQ(123, order.id());
  ...
}
{% endcodeblock %}

Решил сэкономить время, а вышло наоборот.

Вывод: тесты, тесты и тесты.
