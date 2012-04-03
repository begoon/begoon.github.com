---
layout: post
title: "Google Test Framework 1.6.0"
language: russian
date: 2011-04-18 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/04/google-test-160.html
categories:
- google test
- google mock
- testing
- russian
---
Только что вышла [новая версия][Google Test downloads] отличной библиотеки для unit-тестирования на С++ - Google C++ Testing Framework.

[Google Test downloads]: http://code.google.com/p/googletest/downloads/list

Вот список изменений:

* New feature: ADD_FAILURE_AT() for reporting a test failure at the given source location -- useful for writing testing utilities.
* New feature: the universal value printer is moved from Google Mock to Google Test.
* New feature: type parameters and value parameters are reported in the XML report now.
* A gtest_disable_pthreads CMake option.
* Colored output works in GNU Screen sessions now.
* Parameters of value-parameterized tests are now printed in the textual output.
* Failures from ad hoc test assertions run before RUN_ALL_TESTS() are now correctly reported.
* Arguments of ASSERT_XY and EXPECT_XY no longer need to support << to ostream.
* More complete handling of exceptions.
* GTEST_ASSERT_XY can be used instead of ASSERT_XY in case the latter name is already used by another library.
* --gtest_catch_exceptions is now true by default, allowing a test program to continue after an exception is thrown.
* Value-parameterized test fixtures can now derive from Test and
* WithParamInterface<T> separately, easing conversion of legacy tests.
* Death test messages are clearly marked to make them more distinguishable from other messages.
* Compatibility fixes for Android, Google Native Client, MinGW, HP UX, PowerPC, Lucid autotools, libCStd, Sun C++, Borland C++ Builder (Code Gear), IBM XL C++ (Visual Age C++), and C++0x.
* Bug fixes and implementation clean-ups.
* Potentially incompatible changes: disables the harmful 'make install' command in autotools.

[Полная история версий Google Test][].

[Полная история версий Google Test]: http://code.google.com/p/googletest/source/browse/trunk/CHANGES

Каких-то радикально новых возможностей вроде нет, но исправлено несколько неприятных багов.

Лично я очень ждал исправления мелких, но неприятных несовместимостей с компиляторами HP-UX, Sun и AIX.

Посты по теме и почти по теме:

* [Google Test Framework 1.5.0][]
* [Google Test Framework 1.4.0][]
* [Google Test Framework 1.3.0][]
* [Руководство для начинающих по Google Test на русском][]
* [Руководство для начинающих по Google Mock на русском][]
* [Презентация от авторов Google C++ Testing Framework][]
* [Введение в Google Mock (видео)][]

[Google Test Framework 1.5.0]: /blog/russian/2010/04/16/google-test-framework-150/
[Google Test Framework 1.4.0]: /blog/russian/2009/10/03/google-test-framework-140/
[Google Test Framework 1.3.0]: /blog/russian/2009/03/19/google-test-framework-130/
[Руководство для начинающих по Google Test на русском]: /blog/russian/2009/07/15/googletest-for-beginners-in-russian/
[Руководство для начинающих по Google Mock на русском]: /blog/russian/2009/10/13/googlemock-for-beginner-in-russian/
[Презентация от авторов Google C++ Testing Framework]: /blog/russian/2009/10/07/google-test-framework-authors-presentation/
[Введение в Google Mock (видео)]: /blog/russian/2009/10/15/introduction-to-googlemock-talk/

**UPDATE**

По ходу вышел еще и Google Mock 1.6.0.

Что нового тут:

* Compilation is much faster and uses much less memory, especially when the constructor and destructor of a mock class are moved out of the class body.
* New matchers: Pointwise(), Each().
* New actions: ReturnPointee() and ReturnRefOfCopy().
* CMake support.
* Project files for Visual Studio 2010.
* AllOf() and AnyOf() can handle up-to 10 arguments now.
* Google Mock doctor understands Clang error messages now.
* SetArgPointee<> now accepts string literals.
* gmock_gen.py handles storage specifier macros and template return types now.
* Compatibility fixes.
* Bug fixes and implementation clean-ups.
* Potentially incompatible changes: disables the harmful 'make install' command in autotools.

[Полная история версий Google Mock][].

[Полная история версий Google Mock]: http://code.google.com/p/googlemock/source/browse/trunk/CHANGES
