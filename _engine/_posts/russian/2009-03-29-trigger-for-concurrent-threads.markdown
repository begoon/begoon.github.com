---
layout: post
title: "Триггер параллельных потоков для Windows и UNIX"
language: russian
date: 2009-03-29 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/windows-unix.html
categories:
- cplusplus
- threading
- russian
---
Условные переменные, как и [мьютексы][Самодельный мьютекс на C++ для Windows и UNIX], являются базовыми примитивами для синхронизации в параллельном программировании. К сожалению, классическая условная переменная в нотации потоков POSIX (pthread) [сложно реализуема в Windows][Conditional Variables in Windows] ([судя по MSDN Windows][Native Conditional Variables in Windows] таки поддерживают механизм условных переменных на уровне API, но не в XP или 2003, в чем-то более новом, увы). Мне потребовался для одного проекта простейший механизм синхронизации двух потоков: один поток ждет, не занимая ресурсов процессора, и активизируется, только когда другой поток его попросит об этом. Простейший триггер. Конечно, по логике — это обыкновенная условная переменная в упрощенном варианте. Для UNIX это реализуется именно через условную переменную потоков POSIX, а для Windows — через события.

[Conditional Variables in Windows]: http://www.cs.wustl.edu/~schmidt/win32-cv-1.html
[Native Conditional Variables in Windows]: http://msdn.microsoft.com/en-us/library/ms686903(VS.85).aspx

Файл `trigger.h`:

{% codeblock lang:cpp %}
#ifndef _EXT_TRIGGER_H
#define _EXT_TRIGGER_H

#ifdef WIN32
  #include <windows.h>
#else
  #include <pthread.h>
#endif

namespace ext {

class Trigger {
public:
  Trigger();
  ~Trigger();
  
  // Функция посылки сигнала потоку, 
  // ждущему на функции Wait().
  void Signal();
  // Функция ожидания сигнала.
  // Вызов этой функции приводит к блокировке потока до
  // получения сигнала от функции Signal().
  // Внимание: функция Signal() не должна быть вызвана до
  // того, как ждущий поток "сядет" на Wait(). Подобное 
  // использование ведет к неопределенному поведению.
  void Wait();

private:
#ifdef WIN32    
  HANDLE __handle;
#else
  pthread_mutex_t __mutex;
  pthread_cond_t __cv;
#endif
  // "Защита" от случайного копирования.
  Trigger(const Trigger&);
  void operator=(const Trigger&);
};

} // namespace ext

#endif
{% endcodeblock %}

Файл `trigger.cpp`:

{% codeblock lang:cpp %}
#include "Trigger.h"

namespace ext {

#ifdef WIN32

Trigger::Trigger() { 
  __handle = CreateEvent(
    NULL,               // Атрибуты безопасности по умолчанию.
    TRUE,               // Режим ручной активации события.
    FALSE,              // Начальное состояния -- неактивное.
    NULL                // Безымянное событие.
  ); 
}

Trigger::~Trigger() { 
  CloseHandle(__handle);
}

void Trigger::Signal() {
  SetEvent(__handle);
}

void Trigger::Wait() {
  // Ждем наступление события.
  WaitForSingleObject(__handle, INFINITE);
  // "Перезаряжаем" событие.
  ResetEvent(__handle);
}

#else // WIN32

Trigger::Trigger() { 
  pthread_mutex_init(&__mutex, NULL); 
  pthread_cond_init(&__cv, NULL); 
}

Trigger::~Trigger() { 
  pthread_cond_destroy(&__cv); 
  pthread_mutex_destroy(&__mutex); 
}

void Trigger::Signal() {
  pthread_mutex_lock(&__mutex);
  pthread_cond_signal(&__cv);
  pthread_mutex_unlock(&__mutex);
}

void Trigger::Wait() {
  pthread_mutex_lock(&__mutex);
  pthread_cond_wait(&__cv, &__mutex);
  pthread_mutex_unlock(&__mutex);
}

#endif // WIN32

} // namespace ext
{% endcodeblock %}

Пространство имен, как обычно, ext, так что меняете по вкусу.

Проверим, как будет работать (естественно, через тест). 

Для тестирования также потребуются: класс [Thread][Универсальные потоки на С++ для Windows и UNIX], класс [PreciseTimer][Миллисекундный таймер для Windows и UNIX] и Google Test. О том, как собрать себе компактную версию Google 

Test в виде всего двух файлов `gtest-all.cc` и `gtest.h` уже [писал][Google Test Framework 1.3.0].

Файл `trigger_unittest.cpp`:

{% codeblock lang:cpp %}
#include <gtest/gtest.h>

#include "trigger.h"
#include "thread.h"
#include "pretimer.h"

// Тестовый поток, который будет "скакать" по указанным ключевым
// точкам, увеличивая значение счетчика.
class TriggerThread: public ext::Thread {
public:
  TriggerThread(volatile int& flag, ext::Trigger& trigger) :
    __flag(flag), __trigger(trigger)
  {}

  virtual void Execute() {
    // Ждем первого сигнала.
    __trigger.Wait();
    __flag = 1;
    // Ждем второго сигнала.
    __trigger.Wait();
    __flag = 2;
    // Ждем третьего сигнала.
    __trigger.Wait();
    __flag = 3;
  }

private:
  volatile int& __flag;
  ext::Trigger& __trigger;
};

TEST(Trigger, Generic) {
  volatile int flag = 0;
  ext::Trigger trigger;

  // Создаем поток и запускаем егою
  TriggerThread a(flag, trigger);
  a.Start();

  // Подождем, чтобы поток "сел" на Wait().
  ext::PreciseTimer::sleepMs(10);
  // Флаг не должен стать 1, так как поток
  // должен ждать на Wait().
  EXPECT_EQ(0, (int)flag);
   
  // Информируем поток о событии.
  trigger.Signal();
  // Подождем, чтобы поток успел изменить флаг на 1.
  ext::PreciseTimer::sleepMs(10);
  // Проверим, как он это сделал.
  EXPECT_EQ(1, (int)flag);

  // Далее проверка повторяется еще пару раз, чтобы проверить,
  // что синхронизирующий объект правильно "взводится" после
  // срабатывания.

  trigger.Signal();
  ext::PreciseTimer::sleepMs(10);
  EXPECT_EQ(2, (int)flag);

  trigger.Signal();
  a.Join();
  // Последняя проверка не требует ожидания, так как мы присоединись
  // к потоку, и он точно уже завершился.
  EXPECT_EQ(3, (int)flag);
}
{% endcodeblock %}

Компилируем для Windows в Visual Studio:

    cl /EHsc /I. /Fetrigger_unittest_vs2008.exe /DWIN32 runner.cpp ^
        trigger.cpp trigger_unittest.cpp pretimer.cpp thread.cpp gtest\gtest-all.cc

или в GCC:

    g++ -I. -o trigger_unittest_vs2008.exe runner.cpp \
       trigger.cpp trigger_unittest.cpp pretimer.cpp thread.cpp gtest/gtest-all.cc

Запускаем:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from Trigger
    [ RUN      ] Trigger.Generic
    [       OK ] Trigger.Generic (31 ms)
    [----------] 1 test from Trigger (47 ms total)

    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran. (78 ms total)
    [  PASSED  ] 1 test.

Работает.

Внимательный читатель заметит, что по хорошему бы надо протестировать случай, когда функция `Signal()` вызывается раньше, чем слушающий поток дойдет до `Wait()`. Как сказано в комментариях, эта ситуация считается логической ошибкой и ведет к неопределенному поведению. В жизни получается так: реализация для Windows считает, что если функция `Signal()` была вызвана до `Wait()`, то `Wait()` просто тут же выходит, как бы получив сигнал сразу при старте. Реализация же под UNIX работает иначе: `Wait()` отрабатывает только те вызовы `Signal()`, которые были сделаны после начала самого `Wait()`'а. Самое настоящее неопределенное поведение. При использовании данного класса надо помнить об этом ограничении.

Другие посты по теме:

* [Google Test Framework 1.3.0][]
* [Универсальные потоки на С++ для Windows и UNIX][]
* [Самодельный мьютекс на C++ для Windows и UNIX][]

[Универсальные потоки на С++ для Windows и UNIX]: /blog/russian/2009/01/26/universal-threads-for-windows-and-unix/
[Миллисекундный таймер для Windows и UNIX]: /blog/russian/2009/01/29/milliseconds-timer-for-windows-and-unix/
[Самодельный мьютекс на C++ для Windows и UNIX]: /blog/russian/2009/02/06/universal-mutex-in-cpp-for-windows-and-unix/
[Google Test Framework 1.3.0]: /blog/russian/2009/03/19/google-test-framework-130/
