---
layout: post
title: "Интересное: EKOPath Compiler, ASCII Flow, Address Sanitizer"
language: russian
date: 2011-06-16 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/06/blog-post_16.html
categories: 
- russian
---
**EKOPath 4 Compiler Suite**

[EKOPath][] вроде как [собирается выпустить в open-source][EKOPath Announcement] их супер-пупер оптимизирующий компилятор C++.

[EKOPath]: http://www.pathscale.com/
[EKOPath Announcement]: http://www.pathscale.com/ekopath4-open-source-announcement

Как пишут в пресс-релизе:

*The PathScale EKOPath Compiler Suite has the world's **most advanced optimization infrastructure** and can fully exploit the potentials of many-core architectures.*

- - -

Вам хочется рисовать диаграммы и блок-схемы по-настоящему, в vi'e, роняя скупую слезу юниксоида, взгляните на это [ASCII Flow][].

[ASCII Flow]: http://www.asciiflow.com/

Как говориться, почему рулит plain-text? А потому, что его можно поместить под контроль версий (1) и делать diff (2).

- - -

Google [выложил][Address Sanitizer announce] в open-source [Address Sanitizer][].

[Address Sanitizer announce]: http://blog.chromium.org/2011/06/testing-chromium-addresssanitizer-fast.html
[Address Sanitizer]: http://code.google.com/p/address-sanitizer/wiki/AddressSanitizer

Address Sanitizer - это аналог Valgrind, но не совсем. Например, эта штука умеет ловить buffer over-/underrun не только на куче, но и на стеке. Работает только на Linux Intel 32 и 64 бит.
