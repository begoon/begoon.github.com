---
layout: post
title: "Архитектура Mercurial на Google Code"
language: russian
date: 2009-06-06 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/06/mercurial-google-code.html
categories:
- russian
---
После [Google I/O][] Mercurial стал доступен на Google Code в публичном доступе наравне с Subversion.

[Google I/O]: http://code.google.com/events/io/

Весьма занимательное видео, рассказывающее некоторые подробности о внедрении Mercurial на Google Code. Почему именно Mercurial, а не Git или Bazaar, какие особенности именно у Mercurial, отличающие от конкурентов (я, например, не знал, в Mercurial хеш-идентификатор каждого коммита задействует не только метаданные, но и само содержимое файлов, что конкретно ограничивает возможности "переписывания" истории, хотя с точки зрения гугловцев это преимущество, нежели недостаток), и, собственно, как все это легло в инфраструктуру Google.

{% youtube hhgQWAbPNYE %}

Посты по теме:

* [Какую распределенную систему контроля версий выбрать: Git, Bazaar или Mercurial?][]

[Какую распределенную систему контроля версий выбрать: Git, Bazaar или Mercurial?]: /blog/russian/2009/05/21/what-version-control-to-choose/
