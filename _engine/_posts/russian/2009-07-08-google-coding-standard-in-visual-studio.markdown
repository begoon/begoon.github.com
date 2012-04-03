---
layout: post
title: "Google C++ coding standard прямо в Visual Studio"
language: russian
date: 2009-07-08 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/07/google-c-coding-stantard-visual-studio.html
categories:
- visual studio
- russian
---
Многие читали [стандарт кодирования на С++ от Google][Google Coding Standard].

[Google Coding Standard]: http://google-styleguide.googlecode.com/svn/trunk/cppguide.xml

Для себя я его давно использую, а на работе удалось продавить его фрагменты в наш внутренний стандарт.

В качестве приятного бонуса Google раздает задорную утилитку [cpplint][], для быстрой проверки исходника на С++ на соответствие правилам и для генерации отчета, понимаемого средой разработки (например, Visual Studio). Написана она на Питоне, так что для ее использования его надо установить.

[cpplint]: http://google-styleguide.googlecode.com/svn/trunk/cpplint/cpplint.py

Я прикрутил `cpplint` себе в Студию, чтобы можно было проверять исходники прямо в редакторе.

`cpplint` имеет несколько десятков checker'ов, их можно опционально отключать. Я отключил только три:

* Проверку на использование `#include` без указания относительного пути, например `#include "one.h"` вместо `#include "path/to/lib/one.h"`. Правило очень разумное, так как исключает перехлест заголовочных файлов с одинаковыми именами в разных подсистемах, но у меня уж больно много, где надо менять.
* Проверку на формирование имени защитного `#define`'а в начале заголовочного файла. У меня свое правило именования, и оно меня устраивает.
* Проверку на неиспользование потоков в STL. Я потоки использую, поэтому отключил.

Итак, получился скрипт `cpplint.cmd`:

    C:\Python25\python.exe %~d0%~p0cpplint.py ^
      --filter=-build/include,-build/header_guard,-readability/streams ^
      --output=vs7 %1 %2 %3 %4 %5 %6 %7 %8 %9
      
Можно его из командной строки вызывать, но из Студии интереснее.

Итак, `Menu->Tools->External Tool...`, жмем `Add` и далее как на картинке (пути подправить по вкусу):

{% img /images/blog/cpplint-visual-studio.png %}

Теперь, прямо в редакторе жмем `ALT-T,C,ENTER` и снизу окне результатов получаем отчет. Кликая на его строки можно скакать по исходнику.

Лично я считаю, что порядок в исходниках напрямую связан с порядком в голове его автора.
