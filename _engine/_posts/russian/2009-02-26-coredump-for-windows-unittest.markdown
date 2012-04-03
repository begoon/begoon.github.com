---
layout: post
title: "Unit-тест для Coredump в Windows"
language: russian
date: 2009-02-26 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/unit-coredump.html
categories:
- windows
- russian
---
Как мне подсказали в комментариях к посту про [создание coredump файлов в Windows][Coredump для Windows], если изменить код возврата из функции обработки исключения, то можно подавить появление стандартного окна об ошибке. Посему родился unit-тест для этого модуля.

Модифицированный текст файла `coredump.cpp`, в котором с помощью макроса `UNIT_TESTING` встроена поддержка для тестирования. Если этот макрос определен, то, как я уже сказал, подавляется появление окна с ошибкой, и `coredump` файл создается с постоянным именем.

Файл `coredump.cpp`:

{% codeblock lang:cpp %}
#include <windows.h>
#include <dbghelp.h>   
#include <stdio.h>       // _snprintf

// Наш обработчик непойманного исключения.
static LONG WINAPI ExceptionFilter(EXCEPTION_POINTERS* ExceptionInfo);

// Статический экземпляр переменной, конструктор которой
// вызывается до начала функции main().
static struct CoredumpInitializer {
  CoredumpInitializer() {
    SetUnhandledExceptionFilter(&ExceptionFilter);
  }
} coredumpInitializer;

LONG WINAPI ExceptionFilter(EXCEPTION_POINTERS* ExceptionInfo) {
  char fname[_MAX_PATH];

  SYSTEMTIME st;
  GetLocalTime(&st);

  HANDLE proc = GetCurrentProcess();

#ifdef UNIT_TESTING
  lstrcpy(fname, "___coredump.dmp");
#else
  // Формируем имя для coredump'а.
  _snprintf(
    fname, _MAX_PATH, 
    "coredump-%ld-%ld-%04d%02d%02d%02d%02d%02d%03d.dmp", 
    GetProcessId(proc), GetCurrentThreadId(),
    st.wYear, st.wMonth, st.wDay, 
    st.wHour, st.wMinute, st.wSecond, st.wMilliseconds
  );
#endif

  // Открываем файл.
  HANDLE file = CreateFile(
    fname, 
    GENERIC_READ|GENERIC_WRITE, 
    FILE_SHARE_READ, 
    NULL,
    CREATE_ALWAYS, 
    FILE_ATTRIBUTE_NORMAL, 
    NULL
  );

  MINIDUMP_EXCEPTION_INFORMATION info;
  info.ExceptionPointers = ExceptionInfo;
  info.ThreadId = GetCurrentThreadId();
  info.ClientPointers = NULL;

  // Собственно, сбрасываем образ памяти в файл.
  MiniDumpWriteDump(  
    proc, 
    GetProcessId(proc), 
    file,
    MiniDumpWithFullMemory,
    ExceptionInfo ? &info : NULL,
    NULL, NULL
  );

  CloseHandle(file);

#ifdef UNIT_TESTING
  return EXCEPTION_EXECUTE_HANDLER;
#else
  return EXCEPTION_CONTINUE_SEARCH;
#endif
}
{% endcodeblock %}

Теперь, собственно, тест:

Файл `coredump_unittest.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

#include <fstream>
#include <windows.h>
#include <stdlib.h>

TEST(Coredump, CoredumpCreation) {
   const char* coredump = "___coredump.dmp";

   // На всякий случай заведомо стираем старые файлы.
   EXPECT_EQ(0, std::system("cmd.exe /c del ___coredump_main.* 1>nul 2>&1"));

   // Создаем файл с тестовой программой.
   std::string program = "int main() { *(char *)0 = 0; return 0; }";
   std::ofstream os("___coredump_main.cpp");
   os << program << std::endl;
   os.close();

   // Компилируем тестовую программу с опцией UNIT_TESTING.
   // С этой опцией coredump файл будет создаваться с постоянным
   // именем "___coredump.dmp", и будет подавляется окно с сообщением
   // об ошибке. 
   EXPECT_EQ(
      0, std::system(
         "cl /Zi /DUNIT_TESTING /Fe___coredump_main.exe"
         " ___coredump_main.cpp coredump.cpp dbghelp.lib"
         " 1>nul 2>&1"
      )
   );

   // На всякий случая удаляем старый coredump файл.
   std::remove(coredump);

   // Убеждаемся, что файл действительно удалился.
   std::ifstream isdel(coredump);
   EXPECT_FALSE(isdel.good());
   isdel.close();

   // Запускаем тестовую программу.
   ASSERT_EQ(0xC0000005, std::system("___coredump_main.exe"));

   // Проверяем, создался ли файл coredump.dmp.
   std::ifstream is(coredump);
   EXPECT_TRUE(is.good());
   is.close();

   // Удаляем за собой временные файлы.
   EXPECT_EQ(0, std::system("cmd.exe /c del ___coredump_main.* 1>nul 2>&1"));
   std::remove(coredump);
}
{% endcodeblock %}

Данный тест имеет ряд существенных недостатков. Во-первых, он использует файловую систему, и во-вторых, он вызывает компилятор, что занимает небольшое, но все же время. Недостатки неприятные, но в целом приемлемые.

Кстати, [Google Test Framework][] умеет делать так называемые "[смертельные][Death tests]" (death) тесты. То есть можно протестировать именно аварийное "падение" фрагмента кода, например, из-за нарушения защиты памяти, и для проведения такого теста не надо вручную компилировать что-либо, как мы делали тут. К сожалению, эта возможность основана на использования юниксового системного вызова `fork()` и поэтому доступна только на UNIX платформах.

[Google Test Framework]: http://code.google.com/p/googletest/
[Death tests]: http://code.google.com/p/googletest/wiki/GoogleTestAdvancedGuide#Death_Tests

Дежурный файл для запуска тестов (`runner.cpp`):

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Традиционно, для компиляции тестов нам нужна [Google Test Framework][]. Как я уже [писал][Unit-тестирование для параллельных потоков], вы можете скачать [мою модификацию][GoogleTest 1.2.1]  этой библиотеки, которая сокращена до двух необходимых файлов `gtest/gtest.h` и `gtest-all.cc`.

[GoogleTest 1.2.1]: /downloads/gtest-amalgamation-1.2.1.zip

Компилируем, например в Visual Studio 2008:

    cl /EHsc /I. /Fecoredump_unittest_vs2008.exe /DWIN32 runner.cpp coredump_unittest.cpp gtest\gtest-all.cc`

Запускаем:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from Coredump
    [ RUN      ] Coredump.CoredumpCreation
    [       OK ] Coredump.CoredumpCreation
    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran.
    [  PASSED  ] 1 test.

Работает.

Сразу скажу, я проверял все это только под Windows XP SP2 и Server 2003. Пожалуйста, сообщайте, если есть какие-то проблемы или тонкости под другими виндами.

Как это часто бывает в unit-тестировании, тест получился больше, чем сам тестируемый код. Но повторюсь — это того стоит. Буквально скоро расскажу о моих приключениях с [модулем таймера][Миллисекундный таймер для Windows и UNIX], и как меня выручили тесты.

[Миллисекундный таймер для Windows и UNIX]: /blog/russian/2009/01/29/milliseconds-timer-for-windows-and-unix/

Другие посты по теме:

* [Coredump для Windows][]
* [QueryPerformanceCounter на мультиядерных и виртуальных системах][]
* [Unit-тестирование для параллельных потоков][]

[Coredump для Windows]: /blog/russian/2009/02/25/coredump-for-windows/
[QueryPerformanceCounter на мультиядерных и виртуальных системах]: /blog/russian/2009/03/05/queryperformancecounter-on-multicore-and-virtual-systems/
[Unit-тестирование для параллельных потоков]: /blog/russian/2009/01/28/unit-testing-concurrent-threads/
