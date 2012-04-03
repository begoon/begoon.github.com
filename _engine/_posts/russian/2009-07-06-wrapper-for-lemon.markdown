---
layout: post
title: "Обертка генератора парсеров грамматик Lemon для C++"
language: russian
date: 2009-07-06 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/07/lemon.html
categories:
- project
- russian
---
Выложил на Google Code прототип библиотеки для удобного использования генератора [LALR][] парсеров грамматик [Lemon][] на С++.

[LALR]: http://en.wikipedia.org/wiki/LALR_parser
[Lemon]: http://www.hwaci.com/sw/lemon/

Проект называется [lemonbind][].

[lemonbind]: http://code.google.com/p/lemonbind/

Lemon - это создающий исходник на C/C++ генератор, похожий на [yacc][] или [bison][], для реализации заданой грамматики. Lemon был создан автором [SQLite][] для разбора SQL'я.

[yacc]: http://en.wikipedia.org/wiki/Yacc
[bison]: http://en.wikipedia.org/wiki/GNU_bison
[SQLite]: http://www.sqlite.org/

Есть у Lemon несколько радикальных отличий от собратьев. В отличие от yacc/bison Lemon не использует обратные вызовы, то есть не парсер вызывает нас, когда готов принять очередной токен, а мы вызываем парсер, когда готовы скормить ему очередной токен. Также Lemon безопасен в потоковом плане и реентабелен. Именно эти отличия позволяют неплохо завернуть его в обертку C++ со всеми вытекающими радостями. Также Lemon использует более простую нотацию по именованию параметров в продукциях грамматики, значительно снижающую вероятность опечататься.

Lemon представляет собой всего для файла: [lemon.c][] и [lempar.c][]. Первый - это, собственно, генератор грамматик. Компилируется практически любым компилятором C/C++. Второй - шаблон, который использует генератор для создания целевого файла-парсера на языке С. Сгенерированный парсер также прекрасно компилируется любым компилятором C/C++.

[lemon.c]: http://code.google.com/p/lemonbind/source/browse/tools/lemon.c
[lempar.c]: http://code.google.com/p/lemonbind/source/browse/tools/lempar.c

Конечно, Lemon'у нужен лексический анализатор. Я использовал [flex][]. Его тоже пришлось обернуть в С++.

[flex]: http://en.wikipedia.org/wiki/Flex_lexical_analyser

Возникает вопрос - а для чего этот велосипед, когда есть [ANTLR][], [Boost Spirit][] и прочие навороченные инструменты. Ответ как всегда прост - простота и скорость. Парадоксальная ситуация - подход с генерацией исходника, реализующего требуемую грамматику, был придуман много лет назад и воплощен в виде старичков типа lex/yacc/bison, а до сих пор используется за неимением простых и быстрых альтернатив, работающих на сложных грамматиках и на больших объемах анализируемого текста.

[ANTLR]: http://www.antlr.org/
[Boost Spirit]: http://spirit.sourceforge.net/

Собственно, моя мини библиотека на данный момент имеет три основных класса: [Token][], [Tokenizer][] (обертка flex) и [Parser][] (обертка Lemon). Набор тестов демонстрирует, как работать с этими классами. Тест [Parser.NestedSelect][] разбирает вложенный SELECT тривиального диалекта SQL и строит дерево разбора.

[Token]: http://code.google.com/p/lemonbind/source/browse/token.h
[Tokenizer]: http://code.google.com/p/lemonbind/source/browse/tokenizer.h
[Parser]: http://code.google.com/p/lemonbind/source/browse/parser.cpp
[Parser.NestedSelect]: http://code.google.com/p/lemonbind/source/browse/parser_unittest.cpp

Все находится в начальной стадии, но основной функционал уже присутствует. Пока не до конца продуман универсальный интерфейс для генерации дерева разбора (пока его генерация жестко привязана к конкретной грамматике), но сам парсер уже закончен.

P.S. Нашел [дружественный проект][Lemon for D] по адаптированию Lemon'а для генерации парсеров не только на C и C++, но и на D.

[Lemon for D]: http://code.google.com/p/lemon-parser-generator/

P.P.S. Настоятельно рекомендую по теме вот эту книгу в заслуженной форме большего кирпича.

Альфред В. Ахо, Моника С. Лам, Рави Сети, Джеффри Д. Ульман

[Компиляторы. Принципы, технологии и инструментарий][]

[Компиляторы. Принципы, технологии и инструментарий]: http://www.ozon.ru/context/detail/id/3829076/?partner=easy-coding

{% img /images/covers/russian/compilers-cover.jpg %}