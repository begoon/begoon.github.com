---
layout: post
title: "Google Test Framework 1.3.0"
language: russian
date: 2009-03-19 01:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/google-test-framework-130.html
categories:
- google test
- testing
- russian
---
Сегодня вышла новая версия [Google Test Framework][] — [1.3.0][GoogleTest 1.3.0].

[Google Test Framework]: http://code.google.com/p/googletest/
[GoogleTest 1.3.0]: http://googletest.googlecode.com/files/gtest-1.3.0.zip

Радостно, что авторы воплотили [мою идею][Google Test Amalgamation], когда вся библиотека собирается всего в два файла: `gtest-all.cc` и `gtest.h`. Теперь для этого есть специальный скрипт на Питоне. Распаковываем архив `gtest-1.30.zip` и запускаем:

[Google Test Amalgamation]: http://groups.google.com/group/googletestframework/browse_thread/thread/55f0b08a154b0afb

    python scripts\fuse_gtest_files.py . fuse

После этого во вновь созданном подкаталоге fuse будет находиться "упакованная" версия библиотеки в виде двух файлов `gtest/gtest-all.cc` и `gtest/gtest.h`. Моя аналогичная, но [ручная сборка][GoogleTest 1.2.1] для предыдущей версии больше неактуальна.

[GoogleTest 1.2.1]: /downloads/gtest-amalgamation-1.2.1.zip

Опять таки приятно, что включили [мой микропатч][Мой микропачт] для возможности установки флагов командной строки прямо в исходниках тестов. Это очень удобно. Например, есть возможность печати времени работы тестов. Но по умолчанию эта функция выключена, и для ее включения надо в командной строке сказать `--gtest_print_time`. Неудобно постоянно таскать за собой этот ключ. Теперь же можно прямо в тексте тестов, например, в головном модуле, задать этот параметр:

[Мой микропачт]: http://code.google.com/p/googletest/source/detail?r=184&path=/trunk/test/gtest_unittest.cc

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
  testing::InitGoogleTest(&argc, argv);
  testing::GTEST_FLAG(print_time) = true; 
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Итак, новые возможности версии 1.3.0:

* поддержка так называемых "смертельных тестов" для Windows (раньше это работало только под Linux) 
* параметр командной строки `--gtest_also_run_disabled_tests` для принудительного запуска отключенных тестов 
* возможность распараллеливать запуск тестов на разных машинах

Небольшая программа ниже демонстрируем новые "вкусности" Google Test.

Файл `runner.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

#include <fstream>
#include <iostream>
#include <cstdlib>

// -------------------------------------------------------

// Данная функция, если файл не существует, печатает сообщение
// об ошибке и завершает программу с ненулевым кодом.
void openfile(const char* name) {
  std::ifstream is(name);
  if (!is) {
    std::cerr << "Unable to open the file" << std::endl;
    std::exit(1);  
  }
}

// Тест для функции openfile().
TEST(OpenFileDeathTest, ExitIfNoFile) {
  // Задаем заведомо несуществующий файл и смотрим - завершилась
  // ли программа с ненулевым кодом. Также проверяем регулярным
  // выражением то, что программа напечатала при выходе.
  // Мы ожидаем слово "open" среди остального вывода.
  ASSERT_DEATH({ openfile("__nofile__"); }, ".*open.*");
}

// -------------------------------------------------------

// Данная функция должна падать с assert'ом, если делитель
// равен нулю.
int divide(int a, int b) {
  assert(b != 0);
  return a / b;
}

// Тест для assert'а в функции divide().
TEST(AssertDeathTest, DivideByZero) {
  // Задаем нулевой делитель и смотрим - упала или нет.
  // Вывод программы при падении не проверяем.
  ASSERT_DEATH({ divide(1, 0); }, "");
}

// -------------------------------------------------------

// Данная функция должна при ненулевом коде завершать
// программу, прибавив к заданному коду ошибки 50.
void abandon(int code) {
  if (code != 0) std::exit(code + 50);
}

// Тест для функции abandon().
TEST(AbandonDeathTest, ExitCode) {
  // Вызываем функцию и смотрим код возврата.
  // Вывод программы при выходе не проверяем.
  ASSERT_EXIT(abandon(200), testing::ExitedWithCode(250), "");
}

// -------------------------------------------------------

// Заведомо неработающий “сломанный” тест.
// Если имя группы тестов или теста в отдельности предварить
// словом DISABLED_, то тест не будет участвовать с запуске.
// Это удобно, когда какой-то тест сломан, времени на его
// отладку нет, но убирать его из тестирования совсем нельзя.
// В это случае его можно отключить. Google Test при каждом
// запуске будет напоминать, сколько имеется отключенных тестов.
// В процессе же работы над тестом можно запускать программу
// с параметром "--gtest_also_run_disabled_tests", который
// будет проверять также и отключенные тесты.
TEST(BadTest, DISABLED_Test) {
  FAIL();
}

// -------------------------------------------------------

int main(int argc, char* argv[]) {
  testing::InitGoogleTest(&argc, argv);
  // Принудительно печатаем время работы тестов.
  testing::GTEST_FLAG(print_time) = true;
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Компилируем в Visual Studio:

    cl /EHsc /I. /Ferunner_vs2008.exe /DWIN32 runner.cpp gtest\gtest-all.cc

Запускаем:

    [==========] Running 3 tests from 3 test cases.
    [----------] Global test environment set-up.
    [----------] 1 test from OpenFileDeathTest
    [ RUN      ] OpenFileDeathTest.ExitIfNoFile
    [       OK ] OpenFileDeathTest.ExitIfNoFile (31 ms)
    [----------] 1 test from OpenFileDeathTest (31 ms total)

    [----------] 1 test from AssertDeathTest
    [ RUN      ] AssertDeathTest.DivideByZero
    [       OK ] AssertDeathTest.DivideByZero (31 ms)
    [----------] 1 test from AssertDeathTest (31 ms total)

    [----------] 1 test from AbandonDeathTest
    [ RUN      ] AbandonDeathTest.ExitCode
    [       OK ] AbandonDeathTest.ExitCode (32 ms)
    [----------] 1 test from AbandonDeathTest (32 ms total)

    [----------] Global test environment tear-down
    [==========] 3 tests from 3 test cases ran. (94 ms total)
    [  PASSED  ] 3 tests.

      YOU HAVE 1 DISABLED TEST

Отлично, все работает. Также не забудем, что у нас таки есть один отключенный тест. Его можно запустить принудительно, использовав ключ `--gtest_also_run_disabled_tests`:

    runner_vs2008.exe --gtest_also_run_disabled_tests

Получим следующее:

    [==========] Running 4 tests from 4 test cases.
    [----------] Global test environment set-up.
    [----------] 1 test from OpenFileDeathTest
    [ RUN      ] OpenFileDeathTest.ExitIfNoFile
    [       OK ] OpenFileDeathTest.ExitIfNoFile (31 ms)
    [----------] 1 test from OpenFileDeathTest (31 ms total)

    [----------] 1 test from AssertDeathTest
    [ RUN      ] AssertDeathTest.DivideByZero
    [       OK ] AssertDeathTest.DivideByZero (32 ms)
    [----------] 1 test from AssertDeathTest (32 ms total)

    [----------] 1 test from AbandonDeathTest
    [ RUN      ] AbandonDeathTest.ExitCode
    [       OK ] AbandonDeathTest.ExitCode (31 ms)
    [----------] 1 test from AbandonDeathTest (31 ms total)

    [----------] 1 test from BadTest
    [ RUN      ] BadTest.DISABLED_Test
    runner.cpp(72): error: Failed
    [  FAILED  ] BadTest.DISABLED_Test (0 ms)
    [----------] 1 test from BadTest (0 ms total)

    [----------] Global test environment tear-down
    [==========] 4 tests from 4 test cases ran. (94 ms total)
    [  PASSED  ] 3 tests.
    [  FAILED  ] 1 test, listed below:
    [  FAILED  ] BadTest.DISABLED_Test

     1 FAILED TEST

Под занавес отмечу, что появился еще один новый ключ командной строки `--gtest_help` для печати на экран всех весьма многочисленных параметров Google Test. 

Я уже обновился до версии 1.3.0, а вы?
