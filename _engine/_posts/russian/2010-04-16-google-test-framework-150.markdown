---
layout: post
title: "Google Test Framework 1.5.0"
language: russian
date: 2010-04-16 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/04/google-test-150.html
categories:
- google test
- cplusplus
- testing
- russian
---
Сегодня вышла новая версия правильной библиотеки для unit-тестирования Google [C++ Testing Framework 1.5.0][].

[C++ Testing Framework 1.5.0]: http://code.google.com/p/googletest/

Пока обзор будет краткий (фактически, это просто перевод официального анонса):

* `assert`'ы теперь можно безопасно запускать из разных потоков (работает на платформах, где есть pthreads)
* при использовании предикатов в `EXPECT_TRUE()` теперь можно самому задавать сообщения их ошибках
* библиотеку теперь можно собрать как DLL (эту возможность многие ждали)
* "упакованная" версия теперь входит состав дистрибутива, и ее не надо создавать самому через скрипт ("упакованная" версия - это просто два файла `gtest.h` и `gtest-all.cc`, которые можно добавить в проект и не возиться с двоичной библиотекой)
* система сборки теперь работает через `CMake` (это фантастически удобно)
* добавлены две новые платформы: Solaris и AIX
* убрана поддержка VC++ 7.1 с отключенными исключениями (если исключения включены, то все еще можно компилировать в VC++ 7.1)

Для тех, кто слышит про Google Test впервые, ниже предыдущие посты об этой библиотеке и о тестировании в целом (многие на русском языке):

* [Руководство для начинающих по Google Test и Google Mock][]
* [Google Test Framework 1.4.0][]
* [Google Test Framework 1.3.0][]
* [Введение в Google Mock (видео)][]
* [Презентация от авторов Google C++ Testing Framework][]
* [Анализатор покрытия кода тестами Bullseye Coverage][]
* [Статический анализ кода - Coverity, Klocwork][]
* [Unit-тестирование в языке С][]
* [Автоматизация сборки продукта][]
* [Система автоматизированной интеграции Hudson][]

[Руководство для начинающих по Google Test и Google Mock]: http://code.google.com/p/googletest-translations/
[Google Test Framework 1.4.0]: /blog/russian/2009/10/03/google-test-framework-140/
[Google Test Framework 1.3.0]: /blog/russian/2009/03/19/google-test-framework-130/
[Введение в Google Mock (видео)]: /blog/russian/2009/10/15/introduction-to-googlemock-talk/
[Презентация от авторов Google C++ Testing Framework]: /blog/russian/2009/10/07/google-test-framework-authors-presentation/
[Анализатор покрытия кода тестами Bullseye Coverage]: /blog/russian/2009/04/03/code-bullseye-coverage/
[Статический анализ кода - Coverity, Klocwork]: /blog/russian/2009/02/23/static-code-analysis-coverity-klocwork/
[Unit-тестирование в языке С]: /blog/russian/2009/03/01/unit-testing-in-c/
[Автоматизация сборки продукта]: /blog/russian/2009/05/04/automated-product-build/
[Система автоматизированной интеграции Hudson]: /blog/russian/2009/04/26/continuous-integration-with-hudson/
