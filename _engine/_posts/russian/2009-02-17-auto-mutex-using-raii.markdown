---
layout: post
title: "Автоматический мьютекс с использованием RAII"
language: russian
date: 2009-02-17 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/blog-post_17.html
categories:
- cplusplus
- threading
- russian
---
Описанный мной ранее класс [Mutex][Самодельный мьютекс на C++ для Windows и UNIX] является базовым механизмом синхронизации потоков при параллельном программировании и применяется сплошь и рядом.

Часто бывают случаи, когда несколько функций реализуют какую-то единую функциональность, построенную на общем разделяемом ресурсе, защищенном блокировкой. В этом случае каждая функция в начале работы занимает эту блокировку, а на выходе — освобождает ее. Например, методы класса-регистратора системных событий все работают с выходным буфером и используют единую блокировку для синхронизации доступа к нему. Например:

{% codeblock lang:cpp %}
class Logger {
public:
  ...
  void put(const char* str) {
    __lock.Lock();
    __buffer.push_back(str);
    __lock.Unlock();
  }
  void flush() {
    __lock.Lock();
    ...
    __buffer.clear();
    __lock.Unlock();
  }
  ...
private:
  Mutex __lock;
  std::vector<std::string> __buffer;
}
{% endcodeblock %}

В целом, такой подход является не совсем правильным, так как данные методы могут быть весьма сложными, иметь многочисленные условные операторы, могут генерировать исключения. В этом случае программисту необходимо позаботиться о **всех** возможных вариантах завершения каждой функции и везде вставить оператор освобождения блокировки:

{% codeblock lang:cpp %}
__lock.Unlock();
{% endcodeblock %}

Если этого не сделать, то неосвобожденная по какой-то редко возникающей причине блокировка может просто "подвесить" всю программу, так как все остальные функции, работающие с этой блокировкой, более никогда не получат управления. 

К счастью, в С++ есть механизм, дающий возможность очень просто избежать подобных проблем, вывозом кода освобождения блокировки при любом варианте завершения функции. Механизм называется RAII ([Resource Acquisition Is Initialization][RAII]). В С++ деструкторы созданных в контексте функции объектов **обязательно** вызываются перед завершением контекста (попросту говоря, когда функция завершается любым способом). Если возникло непойманное в функции исключение, то в процессе раскрутки стека деструкторы созданных локальных объектов тоже будут вызваны. Отсюда и идея: занимать блокировку в конструкторе созданного в функции локального объекта и затем освобождать ее в деструкторе. Использование такого метода позволило бы изменить приведенный пример так:

[RAII]: http://ru.wikipedia.org/wiki/RAII

{% codeblock lang:cpp %}
class Logger {
public:
  ...
  void put(const char* str) {
    AutoLock(__lock);
    __buffer.push_back(str);
  }
  void flush() {
    AutoLock(__lock);
    ...
    __buffer.clear();
  }
  ...
private:
  Mutex __lock;
  std::vector<std::string> __buffer;
}
{% endcodeblock %}

Объект `AutoLock`, создаваемый первым в контексте каждой функции, будет занимать блокировку и освобождать ее при закрытии этого контекста.

Идея проста и понятна, а класс, реализующий эту логику еще проще. 

Пространство имен ext можно заменить по вкусу на подходящее вам.

Файл `autolock.h`:

{% codeblock lang:cpp %}
#ifndef _EXT_AUTOLOCK_H
#define _EXT_AUTOLOCK_H

#include "mutex.h"

namespace ext {

class AutoLock {
public:
  // Запираем блокировку в конструторе
  AutoLock(Mutex& lock) : __lock(lock) {
    __lock.Lock();
  }

  // Освобождаем блокировку в деструкторе
  ~AutoLock() {
    __lock.Unlock();
  }
private:
  // Защита от случайного копирования
  AutoLock(const AutoLock&);
  void operator=(const AutoLock&);

  Mutex& __lock;
};

} // ext 

#endif
{% endcodeblock %}

Данный класс использует реализацию блокировки (мьютекса) [Mutex][Самодельный мьютекс на C++ для Windows и UNIX].

Посмотрим, как оно будет в деле (конечно с помощью unit-тестирования).

Традиционно, для компиляции тестов нам нужна [Google Test Framework][]. Как я уже [писал][Unit-тестирование для параллельных потоков], вы можете скачать [мою модификацию][GoogleTest 1.2.1] этой библиотеки, которая сокращена до двух необходимых файлов `gtest/gtest.h` и `gtest-all.cc`.

[Google Test Framework]: http://code.google.com/p/googletest/
[GoogleTest 1.2.1]: /downloads/gtest-amalgamation-1.2.1.zip

Файл `autolock_unittest.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

#include "autolock.h"
#include "mutex.h"
#include "thread.h"

// Универсальная задержка в миллисекундах для Windows и UNIX
#ifdef WIN32
#include <windows.h>
#define msleep(x)    Sleep(x)
#else
#include <unistd.h>
#define msleep(x)    usleep((x)*1000)
#endif

// Тестовый поток
class T: public ext::Thread {
public:
  // Параметры потока:
  //   flag    - флаг для сигнализации о выполненном действии
  //   mutex   - рабочий объект-блокировка
  //   timeout - время, которое необходимо подождать после 
  //             установки флага
  //   val     - значение, в которое надо установить флаг
  T(volatile int& flag, ext::Mutex& mutex, int timeout, int val) :
    __flag(flag), __mutex(mutex), __timeout(timeout), __val(val)
  {}

  // Функция потока: занять автоматическую блокировку, установить
  // флаг, подождать указанное время, освободить автоматическую
  // блокировку.
  virtual void Execute() {
    ext::AutoLock locker(__mutex);
    __flag = __val;
    msleep(__timeout);
  }
private:
  volatile int& __flag;
  ext::Mutex& __mutex;
  int __timeout;
  int __val;
};

// Данный тест выполняет параллельно две функции, которые конкурируют
// за одну блокировку. Функция-поток 'a' занимает блокировку, устанавливает
// флаг в 1, ждет 100мс и затем освобождает блокировку. Функция-поток 'b'
// стартует, когда поток 'a' уже занял блокировку, поэтому после старта
// потока 'b' флаг еще некоторое время будет равен 1, пока поток 'a' не
// отпустит блокировку, и затем поток 'b' изменит флаг в 0, получив 
// управление ожидания на блокировке.
TEST(AutoLock, ConcurrentCalls) {
  volatile int flag = 0;

  ext::Mutex mutex;

  T a(flag, mutex, 100, 1);
  T b(flag, mutex, 0, 0);

  // Запускаем поток 'a'.
  a.Start();
  // Ждем, пока поток 'a' займет блокировку.
  // Это случится, когда флаг станет равен 1.  
  while (!flag);

  // Запускаем поток 'b'.
  b.Start();
  // Ждем немного, чтобы убедиться, что поток запустился
  // и дошел до попытки занять блокировку.
  msleep(50);

  // Так как время задержки в потоке 'a' больше 50мс,
  // то флаг все еще равен 1, так как поток 'a' пока не отпустил
  // блокировку, не давая потоку 'b' получить управление
  // и изменить флаг в 0.
  EXPECT_EQ(1, flag);

  // Ждем завершения потока 'a' (блокировка должна быть
  // отпущена при его завершении.
  a.Join();

  // Ждем завершения потока 'b', который к своему завершению
  // должен обнулить флаг.
  b.Join();
  EXPECT_EQ(0, flag);
}
{% endcodeblock %}

Для компиляции нам также понадобятся файлы `mutex.h` (класс [Mutex][Самодельный мьютекс на C++ для Windows и UNIX]), `thread.cpp` и `thread.h` (класс [Thread][Универсальные потоки на С++ для Windows и UNIX]). 

Файл для запуска тестов `runner.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Компилируем:

Visual Studio:

    cl /EHsc /I. /Feautolock_unittest_vs2008.exe /DWIN32 runner.cpp autolock_unittest.cpp thread.cpp gtest\gtest-all.cc

Cygwin:

    cl /EHsc /I. /Feautolock_unittest_vs2008.exe /DWIN32 runner.cpp autolock_unittest.cpp thread.cpp gtest\gtest-all.cc

Запускаем:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from AutoLock
    [ RUN      ] AutoLock.ConcurrentCalls
    [       OK ] AutoLock.ConcurrentCalls
    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran.
    [  PASSED  ] 1 test.

Работает, что приятно. Тест работает как ожидалось.

Не забудьте включить файл `autolock_unittest.cpp` в тестовый набор вашего проекта. Не тратьте время на вылавливание неожиданных глюков тогда, когда вы уже порядком подзабыли, как тут все работает. Пусть ловлей глюков занимается тест, автоматизировано.

Другие посты по теме:

* [Самодельный мьютекс на C++ для Windows и UNIX][]
* [Универсальные потоки на С++ для Windows и UNIX][]
* [Unit-тестирование для параллельных потоков][]

[Самодельный мьютекс на C++ для Windows и UNIX]: /blog/russian/2009/02/06/universal-mutex-in-cpp-for-windows-and-unix/
[Универсальные потоки на С++ для Windows и UNIX]: /blog/russian/2009/01/26/universal-threads-for-windows-and-unix/
[Unit-тестирование для параллельных потоков]: /blog/russian/2009/01/28/unit-testing-concurrent-threads/

