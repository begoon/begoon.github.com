---
layout: post
title: "Статический аргумент функции putenv"
language: russian
date: 2009-02-01 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/putenv.html
categories:
- cplusplus
- russian
---
В мире программирования UNIX есть стандартная библиотечная функция `putenv()`. Она устанавливает переменную окружения для текущего процесса. В основном функция полезна, когда ваш процесс вызывает из под себя другой процесс и передает ему какие-либо параметры через переменные окружения. 

Прототип функции такой:

{% codeblock lang:cpp %}
int putenv(char* string);
{% endcodeblock %}

Казалось бы, все предельно просто и понятно — вызываешь функцию, она делает свое дело, если надо проверятся код ошибки, и все пучком. 

Например:

{% codeblock lang:cpp %}
putenv("TESTVAR=testvalue");
{% endcodeblock %}

Или так:

{% codeblock lang:cpp %}
...
char var[1024];
...
strcpy(var, "TESTVAR=");
strcat(var, value);
putenv(var);
...
{% endcodeblock %}

Вроде похожие примеры, хотя между ними есть огромное "но". Первый пример будет работать нормально, а вот второй пример может приводить к неверному значению установленной переменной или даже к падению программы с нарушением защиты памяти на некоторых платформах. Почему?

Отгадка кроется в том, что на некоторых операционных системах и версиях системной библиотеки libc значение параметра будет использоваться напрямую даже после возврата из функции. Другими словами, функция `putenv()` не копирует переданный ей параметр куда-либо. Если вы передадите в эту функцию буфер, размещенный в стеке (автоматическая переменная), то это прямой путь к серьезным ошибкам памяти, так в момент реального использования установленной переменной автоматический буфер может уже не существовать (функция, его создавшая, уже завершила работу и подчистила за собой стек). Отсюда вывод — указатель, передаваемый в функцию `putenv()`, всегда должен указывать на статические данные. Первый пример работает правильно, так как в С и C++ строковые константы размещены в статическом сегменте и постоянны во время всей жизни программы.

Ситуация усугубляется еще и тем, что разные версии системной библиотеки ведут себя по разному. Нет четкого правила: копировать значение буфера или нет. Я лично наступил на эти грабли, когда начал писать программу под виндами на Visual Studio, все работало. А вот при запуске на юниксах или под виндами, но использовании компилятора gcc из [Cygwin][], все падало. Конечно, чтение документации все сразу прояснило, но вот осадочек остался. Просто использование буфера напрямую, без создания внутренней копии, как-то противоречит здравому смыслу, но... как сделало, так сделано.

[Cygwin]: http://www.cygwin.com/

Я набросал мини-тесты на всю эту тему.

Традиционно, для компиляции тестов нам нужна [Google Test Framework][]. Как я уже [писал][Unit-тестирование для параллельных потоков], вы можете скачать [мою модификацию][GoogleTest 1.2.1]  этой библиотеки, которая сокращена до двух необходимых файлов `gtest/gtest.h` и `gtest-all.cc`.

[Google Test Framework]: http://code.google.com/p/googletest/
[GoogleTest 1.2.1]: /downloads/gtest-amalgamation-1.2.1.zip

Файл тестов (`putenv_unittest.cpp`):

{% codeblock lang:cpp %}
#include <gtest/gtest.h>
#include <cstdlib>

// Главная проверочная функция. Вызывает putenv() с указанным буфером
// (автоматическим или статическим), если надо перезатирает буфер, чтобы
// проверить тот ли это буфер, и после сверяет установленное значение
// с ожидаемым эталоном.
void checkPutEnv(char* buf, bool rewrite) {
  // Эталон
  const char* etalon = "TESTVAR=testvalue";
  // Копируем эталон в буфер
  std::strcpy(buf, etalon);
  // Устанавливаем переменную
  putenv(buf);
  // Если того требуют условия теста, то перезатираем буфер
  // фальшивым значением.
  if (rewrite)
    std::strcpy(buf, "TESTVAR=novalue");
  // Копируем значение системной переменной.
  std::string actual = getenv("TESTVAR");
  // Сверяем результаты
  EXPECT_EQ(std::string("testvalue"), actual);
}

// Тест с использованием статического буфера без перезатирания.
// Это должно работать стопудово на все платформах, так как
// используется статический буфер, и мы его не перезатираем.
TEST(PutEnv, UsingStaticVariable) {
 static char buf[1024];
 checkPutEnv(buf, false);
}

// Тест с использованием статического буфера с перезатиранием.
// Данный тест будет рабоать только на системах, которые копируют
// аргумент putenv()'а во внутренний буфер. То есть перезатирание
// нами буфера не приведет к изменению значения установленной
// переменной.
TEST(PutEnv, UsingStaticVariableRewriteBuffer) {
 static char buf[1024];
 checkPutEnv(buf, true);
}
{% endcodeblock %}

Файл головной программы запуска тестов (`runner.cc`):

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
 testing::InitGoogleTest(&argc, argv);
 return RUN_ALL_TESTS();
}
{% endcodeblock %}

Сначала пробуем в Visual Studio.

Компилируем:

    cl /EHsc /I. /Feputenv_unittest_vs2008.exe runner.cpp putenv_unittest.cpp gtest\gtest-all.cc

Запускаем `putenv_unittest_vs2008.exe':

    [==========] Running 2 tests from 1 test case.
    [----------] Global test environment set-up.
    [----------] 2 tests from PutEnv
    [ RUN      ] PutEnv.UsingStaticVariable
    [       OK ] PutEnv.UsingStaticVariable
    [ RUN      ] PutEnv.UsingStaticVariableRewriteBuffer
    [       OK ] PutEnv.UsingStaticVariableRewriteBuffer
    [----------] Global test environment tear-down
    [==========] 2 tests from 1 test case ran.
    [  PASSED  ] 2 tests.

Видно, что все тесты работают, а это значит, что микрософтовский `putenv()` копирует значение аргумента во внутренний буфер, и значит можно передавать в него указатель на нестатический блок памяти.

Теперь пробуем тоже под виндами, но через Cygwin.

Компилируем:

    g++ -I. -o putenv_unittest_cygwin.exe putenv_unittest.cpp runner.cpp gtest/gtest-all.cc

Запускаем:

    [==========] Running 2 tests from 1 test case.
    [----------] Global test environment set-up.
    [----------] 2 tests from PutEnv
    [ RUN      ] PutEnv.UsingStaticVariable
    [       OK ] PutEnv.UsingStaticVariable
    [ RUN      ] PutEnv.UsingStaticVariableRewriteBuffer
    putenv_unittest.cpp:15: Failure
    Value of: actual
      Actual: "novalue"
    Expected: std::string("testvalue")
    Which is: "testvalue"
    [  FAILED  ] PutEnv.UsingStaticVariableRewriteBuffer
    [----------] Global test environment tear-down
    [==========] 2 tests from 1 test case ran.
    [  PASSED  ] 1 test.
    [  FAILED  ] 1 test, listed below:
    [  FAILED  ] PutEnv.UsingStaticVariableRewriteBuffer

     1 FAILED TEST

Видно, что тест `PutEnv.UsingStaticVariableRewriteBuffer`, ожидая получить значение переменной `testvalue`, получил `novalue`. Ясно, мы принудительно перезаписали оригинальное значение переменной прямо в буфере после вызова `putenv()`. Вывод: Cygwin'овский `putenv()` не копирует значение аргумента куда-либо и, значение буфера используется напрямую, поэтому тут надо передавать указатель обязательно на статический блок памяти, или хотя бы такой блок, которые не исчезнет на момент обращения к переменной.

Резюме.

Будьте осторожны при использовании функции `putenv()`, так как на некоторых платформах ее аргумент не копируется во внутренний буфер, как бы это ни подсказывала вам очевидная логика, а используется прямо из вашего буфера.

Другие посты по теме:

* [Unit-тестирование для параллельных потоков][]

[Unit-тестирование для параллельных потоков]: /blog/russian/2009/01/28/unit-testing-concurrent-threads/
