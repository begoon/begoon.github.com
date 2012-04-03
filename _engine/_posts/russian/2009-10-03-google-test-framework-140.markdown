---
layout: post
title: "Google Test Framework 1.4.0"
language: russian
date: 2009-10-03 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/10/google-c-testing-framework-140.html
categories:
- cplusplus
- google test
- testing
- russian
---
Вчера гугловцы анонсировали новую версию моей любимой библиотеки тестирования [Google C++ Testing Framework][] - [1.4.0][GoogleTest 1.4.0].

[Google C++ Testing Framework]: http://code.google.com/p/googletest
[GoogleTest 1.4.0]: http://googletest.googlecode.com/files/gtest-1.4.0.zip

Одна из главных новых возможностей - это [event listener API][]. А попросту говоря, возможность полностью контролировать процесс печати результатов тестирования. Это позволяет формировать отчеты по тестированию в нужном формате без изменения кода библиотеки.

[event listener API]: http://code.google.com/p/googletest/wiki/AdvancedGuide#Extending_Google_Test_by_Handling_Test_Events

Что новенького?

Например, стандартный вывод при выполнении элементарного теста (файл `runner.cpp`):

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

TEST(One, Simple) {
  EXPECT_EQ(1, 2);
}

int main(int argc, char** argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

будет таким:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from One
    [ RUN      ] One.Simple
    runner.cpp(4): error: Value of: 2
    Expected: 1
    [  FAILED  ] One.Simple (15 ms)
    [----------] 1 test from One (15 ms total)

    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran. (31 ms total)
    [  PASSED  ] 0 tests.
    [  FAILED  ] 1 test, listed below:
    [  FAILED  ] One.Simple

     1 FAILED TEST

     [==========] Running 1 test from 1 test case.
     [----------] Global test environment set-up.
     [----------] 1 test from One
     [ RUN      ] One.Simple
     runner.cpp(4): error: Value of: 2
     Expected: 1
     [  FAILED  ] One.Simple (15 ms)
     [----------] 1 test from One (15 ms total)

     [----------] Global test environment tear-down
     [==========] 1 test from 1 test case ran. (31 ms total)
     [  PASSED  ] 0 tests.
     [  FAILED  ] 1 test, listed below:
     [  FAILED  ] One.Simple

      1 FAILED TEST

Для задания иного формата вывода нужно реализовать свой `event listener` (назовем его сервис печати). Например (файл `runner.cpp`):

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

using namespace ::testing;

// Данный класс заменит стандартный сервис печати.
class LaconicPrinter : public ::testing::EmptyTestEventListener {
  // Вызывается до начала работы теста.
  virtual void OnTestStart(const TestInfo& test_info) {
    printf("*** Test %s.%s starting.\n",
           test_info.test_case_name(), test_info.name());
  }

  // Вызывается при срабатывании какого-либо утверждения или явного вызова 
  // функции SUCCESS().
  virtual void OnTestPartResult(const TestPartResult& test_part_result) {
    printf("%s in %s:%d\n%s\n",
           test_part_result.failed() ? "*** Failure" : "Success",
           test_part_result.file_name(),
           test_part_result.line_number(),
           test_part_result.summary());
  }

  // Вызывается после выполнения теста.
  virtual void OnTestEnd(const TestInfo& test_info) {
    printf("*** Test %s.%s ending.\n",
           test_info.test_case_name(), test_info.name());
  }
};

TEST(One, Simple) {
  EXPECT_EQ(1, 2);
}

int main(int argc, char** argv) {
  ::testing::InitGoogleTest(&argc, argv);

  // Получаем ссылку на список сервисов печати.
  ::testing::TestEventListeners& listeners =
      ::testing::UnitTest::GetInstance()->listeners();

  // Удаляем стандартный сервис печати.
  delete listeners.Release(listeners.default_result_printer());
  // Добавляем наш сервис в список. Google Test самостоятельно удалит этот объект.
  listeners.Append(new LaconicPrinter);

  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Теперь отчет по работе тестов будет выглядеть так:

    *** Test One.Simple starting.
    *** Failure in runner.cpp:31
    Value of: 2
    Expected: 1
    *** Test One.Simple ending.
    
Необходимо отметить, что одновременно может быть зарегистрировано несколько сервисов печати. Но в этом случае их выводы могут смешиваться и превращаться в кашу. Для избежания этого мы принудительно удаляем стандартный сервис печати, чтобы его вывод не мешал нашему.

Полностью интерфейс сервиса печати выглядит так:
    
{% codeblock lang:cpp %}
class EmptyTestEventListener : public TestEventListener {
 public:
  // Вызывается при начале прогона всех тестов.
  virtual void OnTestProgramStart(const UnitTest& unit_test);
  // Вызывается при начале очередной итерации тестирования. Google Test 
  // позволяет управлять количеством итерации при прогоне тестов.
  virtual void OnTestIterationStart(const UnitTest& unit_test, int iteration);
  // Вызывается до функции Environment::SetUp(), устанавливающей необходимое
  // окружение для работы всех тестов.
  virtual void OnEnvironmentsSetUpStart(const UnitTest& unit_test);
  // Вызывается после функции Environment::SetUp(), устанавливающей необходимое
  // окружение для работы всех тестов.
  virtual void OnEnvironmentsSetUpEnd(const UnitTest& unit_test);
  // Вызывается при начале прогона группы тестов (у которых первый параметр
  // макроса TEST/TEST_F одинаковый).
  virtual void OnTestCaseStart(const TestCase& test_case);
  // Вызывается при начале работы теста.
  virtual void OnTestStart(const TestInfo& test_info);
  // Вызывается при срабатывании утверждения в тесте или явного вызова 
  // функции SUCCESS().
  virtual void OnTestPartResult(const TestPartResult& test_part_result);
  // Вызывается после завершения работы теста.
  virtual void OnTestEnd(const TestInfo& test_info);
  // Вызывается после прогона группы тестов.
  virtual void OnTestCaseEnd(const TestCase& test_case);
  // Вызывается до функции Environment::TearDown(), производящей освобождение
  // ресурсов, занятых Environment::StartUp().
  virtual void OnEnvironmentsTearDownStart(const UnitTest& unit_test);
  // Вызывается после функции Environment::TearDown().
  virtual void OnEnvironmentsTearDownEnd(const UnitTest& unit_test);
  // Вызывается после очередной итерации тестирования.
  virtual void OnTestIterationEnd(const UnitTest& unit_test, int iteration);
  // Вызывается после прогона всех тестов.
  virtual void OnTestProgramEnd(const UnitTest& unit_test);
};
{% endcodeblock %}

Также из значимого можно отметить новый ключ командной строки ~, позволяющий запускать тесты в случайном порядке. Ключом `--gtest_random_seed=SEED` можно "управлять" случайностью этого порядка. Если `SEED` равен 0, то случайность будет действительно случайной, так как случайная последовательность будет определяться текущим временем.

Что приятно, теперь формат XML файлов, генерируемых при использовании ключа `--gtest_output`, полностью совместим с форматом [JUnit][]. Это значит, что, например, система автоматической сборки, тестирования и интеграции [Hudson][] теперь понимает отчеты Google Test без дополнительный конвертации.

[JUnit]: http://junit.sourceforge.net/
[Hudson]: https://hudson.dev.java.net/

Также теперь при работе в Visual Studio сообщения о сбойных тестах выводятся прямо в окно "Output", что позволяет, кликая на них, сразу находить строки, где сбоят тесты. Здорово, что данная фича [основана на моем коде][Мой патч для Visual Studio].

[Мой патч для Visual Studio]: http://code.google.com/p/googletest/source/detail?r=283

Еще, теперь время работы тестов печатается всегда, по умолчанию, то есть опция `--gtest_print_time` будто бы всегда включена.

Есть еще несколько незначительных улучшений:

* поддержка CodeGear Studio
* собственная реализация `tuple` для независимости от `boost` при использовании `Combine()`
* множество улучшений для совместимости с Solaris, Windows Mobile и некоторыми другими платформами.

Радость, одно слово.

Я перестал что-то писать что-либо на C++ без тестов, а Google Test делает этот процесс простым и легким.

Я уже обновился до версии 1.4.0, а вы?

Ссылки по теме:

* [Google Test Framework 1.3.0][]
* [Руководство для начинающих по Google Test на русском][]

[Google Test Framework 1.3.0]: /blog/russian/2009/03/19/google-test-framework-130/
[Руководство для начинающих по Google Test на русском]: /blog/russian/2009/07/15/googletest-for-beginners-in-russian/
