---
layout: post
title: 'James Grenning, "Test Driven Development for Embedded C"'
language: russian
date: 2011-10-25 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/10/blog-post_25.html
categories: 
- book
- testing
- russian
---
[Закомментированные куски кода][] - зло, если они не являются частью документации. Увы, не всегда удается найти достаточно слов, чтобы убедить людей довериться репозиторию и таки удалить комментированный код, который "может мне скоро понадобится". Вот тут на помощь приходят цитаты из книг. Почему-то люди больше верят напечатенному на бумаге, особенно в книге, особенно от популярного издательства.

[Закомментированные куски кода]: /blog/russian/2009/10/06/commented-code-and-todo/

Ребята купили в офис "[Test Driven Development for Embedded C][]" от James W. Grenning.

[Test Driven Development for Embedded C]: http://pragprog.com/book/jgade/test-driven-development-for-embedded-c

{% img /images/covers/english/test-driven-development-for-embedded-c-cover.jpg %}

Хоть там и много про hardware, но примеры как можно и нужно изолировать зависимости для упрощения тестирования на языке С очень полезные. Кроме того описаны пара xUnit библиотек для этого языка (хотя cmockery нет).

Итак, цитата (как есть, без сокращении и перевода).

**Commented-out Code**

> Sources files littered with commented-out code are an ugly mess. New or returning programmers are faced with questions about what the code is supposed to do. "Should the code be uncommented?" "It is no longer needed?" "When will it be needed and under what circumstances is it needed?" "What's that for?"
>
> The solution to this code smell is simple; delete the commented-out code. It can always be recovered from your source repository.
>
> **James W. Grenning**

Посты по теме:

* [Unit-тестирование в языке С][]

[Unit-тестирование в языке С]: /blog/russian/2009/03/01/unit-testing-in-c/
