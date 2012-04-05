---
layout: post
title: "Миллисекундный таймер для Windows и UNIX"
language: russian
date: 2009-01-29 01:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/01/blog-post_29.html
categories:
- cplusplus
- russian
---
Очень часто в программе удобно иметь возможность засекать и мерить интервалы времени. Стандартная функция `time()` конечно хороша своей переносимостью, но она работает с секундами, а хочется что-то более быстрое. Микросекунды - это уже тоже перебор. А вот миллисекунды - самое оно.

Итак, задача: сделать простой и переносимый класс C++ для работы с интервалами времени в миллисекундах. Должно работать в Windows и UNIX.

Я придумал вот такой интерфейс для класса:

{% codeblock lang:cpp %}
class PreciseTimer {
public:
  // Тип для работы с тиками таймера. По сути это целое в 64 бита,
  // но конкретное имя рабочего типа будет зависеть от платформы.
  typedef s_int_64 Counter;

  // Функция получение текущего значения миллисекундного таймера.
  // Само по себе это число особого смысла не имеет, так как оно
  // ни к чему не привязано, а вот разница двух таких чисел как 
  // раз используется для замеров интервалов времени.
  // Функция возвращает 0 под Windows, если не удается получить
  // значение системного таймера.
  Counter millisec();

  // Задержка на указанное число миллисекунд. Необходимо учитывать,
  // что в UNIX системах данная функция может быть прервана
  // системым сигналом (signal). В этом случае задержка может быть
  // меньше, чем ожидалось.
  static void sleepMs(int ms);

  // Функция "отметки" текущего момента времени.
  // Добавляет текущее время в очередь отметок.
  void mark();

  // Функция получения времени, прошедшего с последней отметки
  // в функции mark(). Последняя отметка вынимается из очереди
  // и вычитается из текущего значения таймера. Эта разница и
  // есть результат функции. Если очередь отметок пуста (никто
  // не вызывал mark() до этого), то возвращается -1.
  Counter release();

  // Парные вызовы mark()/release() могут быть вложенными.
  //
  // Примерная техника работы с классом:
  // ...
  // PreTimer timer;
  // ...
  // timer.mark();
  // ...что-то делаем тут (1)
  // timer.mark();
  // ...что-то еще делаем тут (2)
  // /* получаем продолжительность дела (2) */
  // t1 = timer.release(); 
  // /* получаем суммарную продолжительность дел (1) и (2) */
  // t2 = timer.release();
  // /* А t3 уже равно -1, так как очередь пуста, так как этот
  //  * вызов release() третий в счету, а вызовов mark() было
  //  * всего два */
  // t3 = timer.release();
}
{% endcodeblock %}

Реалиазация вышла довольно простая. Всего один файл `pretimer.h` (без .cpp) без внешних нестандартных зависимостей.

`pretimer.h`:

{% codeblock lang:cpp %}
#ifndef EXT_PRETIMER_H
#define EXT_PRETIMER_H

#include <stack>

#ifdef WIN32
#include <windows.h>
#else
#include <sys/time.h>
#include <unistd.h>    // usleep()
#endif

// namespace, традиционно, с именем "ext", так что измените под ваши
// привычки именования, если надо.
namespace ext {

class PreciseTimer {
public:
#ifdef WIN32
  // Тип int64 для Windows
  typedef LONGLONG Counter;
#else
  // Тип int64 для UNIX
  typedef long long Counter;
#endif
  PreciseTimer();

  Counter millisec();

  void mark();
  Counter release();

  static void sleepMs(int ms);
private:
  // Тип стека для хранения отметок времени.
  typedef std::stack< Counter > Counters;

  // Стек для хранения отметок времени.
  Counters __counters;

#ifdef WIN32
  // Для Windows надо хранить системную частоту таймера.
  LARGE_INTEGER __freq;
#endif
};

void PreciseTimer::mark() {
  __counters.push(millisec());
}

PreciseTimer::Counter PreciseTimer::release() {
  if( __counters.empty() ) return -1;
  Counter val = millisec() - __counters.top();
  __counters.pop();
  return val;
}

#ifdef WIN32

PreciseTimer::PreciseTimer() {
  // Для Windows в конструкторе получаем системную частоту таймера
  // (количество тиков в секунду).
  if (!QueryPerformanceFrequency(&__freq))
    __freq.QuadPart = 0;
}

PreciseTimer::Counter PreciseTimer::millisec() {
  LARGE_INTEGER current;
  if (__freq.QuadPart == 0 || !QueryPerformanceCounter(¤t)) 
    return 0;
  // Пересчитываем количество системных тиков в миллисекунды.
  return current.QuadPart / (__freq.QuadPart / 1000);
}

void PreciseTimer::sleepMs(int ms) {
  Sleep(ms);
}

#else // WIN32

PreciseTimer::PreciseTimer() {}

PreciseTimer::Counter PreciseTimer::millisec() {
  struct timeval tv;
  gettimeofday(&tv, NULL);
  return tv.tv_sec * 1000 + tv.tv_usec / 1000;
}

void PreciseTimer::sleepMs(int ms) {
  usleep(ms * 1000);
}

#endif // WIN32

} // ext

#endif // _EXT_PRETIMER_H
{% endcodeblock %}

Итак, класс готов, но надо попробовать его в работе. Я, как сугубый апологет unit-тестирования, напишу тесты. Для их компиляции вам потребуется библиотека [Google Test Framework][]. Вы можете взять оригинал с официального сайта, а можете для простоты воспользоваться [моей версией][GoogleTest 1.2.1], упакованной в два компактных файла `gtest-all.cc` и `gtest.h`. Я уже писал про это в [рассказе про unit-тестирование][Unit-тестирование для параллельных потоков]. Там я подробно описал, как подготовить Google Test к удобной работе.

[Google Test Framework]: http://code.google.com/p/googletest/
[GoogleTest 1.2.1]: /downloads/gtest-amalgamation-1.2.1.zip

Итак, тесты.

`pretimer_unittest.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
#include <cstdlib>

// Подключаем наш класс
#include "pretimer.h"

// Простой тест, для Windows, в основном, для проверки
// доступности системного таймера.
TEST(PreciseTimer, PreciseSystemTimerAvailability) {
  ext::PreciseTimer timer;
  // Если метод millisec() возвращает 0, значит недоступен
  // системный таймер.
  EXPECT_NE(0, timer.millisec()) << "Недоступен системный таймер";
}

// Тестирует "точность" измерений.
TEST(PreciseTimer, MeasurementAccuracy) {
  // Тестируем на задержке в 100 миллисекунд.
  const int delay_ms = 100;
  // Зададим наше допустимое отклонение в 10% (10 миллисекунд).
  // Функция задержки msleep() тоже неидеальна и привносит
  // какую-то погрешность помимо наших измерений.
  const int allowed_delta_ms = 10;
  // Создаем таймер
  ext::PreciseTimer timer;
  // Замечаем время
  timer.mark();
  // Ждем 100 миллисекунд
  msleep(delay_ms);
  // Вычисляем модуль разницы между эталоном в 100 миллисекунд
  // и измеренным нами интервалом через mark()/release()
  int delta = std::abs(static_cast<int>(delay_ms - timer.release()));

  // Если отклонение более 10 миллисекунд - ошибка.
  EXPECT_TRUE(delta <= allowed_delta_ms) 
    << "Слишком большое отклонение " << delta << ", превышающее " << allowed_delta_ms;
}

// Тестируем очередь замеров
TEST(PreciseTimer, Queue) {
  // Создаем таймер
  ext::PreciseTimer timer;
  // Делаем замер номер 1
  timer.mark();
  // Делаем замер номер 2
  timer.mark();
  // Получаем текущее значение таймера
  ext::PreciseTimer::Counter a = timer.release();
  // Ждем 100 миллисекунд
  monitor::PreciseTimer::sleepMs(100);
  // Проверяем, что значение таймера до задежки
  // меньше, чем после. Этим мы проверили, что
  // очередь замеров работает, так как получили 
  // корректное значение второго в очереди замера.
  EXPECT_LT(a, timer.release());
}

// Проверка пустой очередь замеров
TEST(PreciseTimer, EmptyQueue) {
  ext::PreciseTimer timer;
  // Если очередь замеров пуста, метод release() должен
  // возвращать -1.
  EXPECT_EQ(-1, timer.release());
}
{% endcodeblock %}

Я потратил на этот класс часа четыре неторопливой работы, а на написание тестов всего полчаса, но эти полчаса будут мне служить верой и правдой еще очень долго.

Забавно, что когда я запускал эти тесты как-то на Windows под виртуальной машиной, то тест *MeasurementAccuracy* [давал сбой][QueryPerformanceCounter на мультиядерных и виртуальных системах]! Видимо виртуальная машина как-то неправильно эмулировала работу таймеров, и замер делался совершенно неправильно. А вот теперь если представить - как бы я искал этот баг вручную по всей боевой программе, а? Кто ж мог предположить, что в виртуальной среде что-то можно пойти не так с таймерами.

Снова повторю - unit тестирование forever!

В завершении, нам нужна главная программа для запуска тестов:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
  // Инициализируем библиотеку
  testing::InitGoogleTest(&argc, argv);
  // Запускаем все тесты, прилинкованные к проекту
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Компилируем:

Visual Studio:

    cl /EHsc /I. /DWIN32 /Fepretimer_unittest.exe runner.cpp pretimer_unittest.cpp gtest-all.cc

UNIX:

    g++ -I. -o pretimer_unittest runner.cpp pretimer_unittest.cpp gtest-all.cc

Запускаем `pretimer_unittest` и получаем:

    [==========] Running 3 tests from 1 test case.
    [----------] Global test environment set-up.
    [----------] 4 tests from PreciseTimer
    [ RUN      ] PreciseTimer.PreciseSystemTimerAvailability
    [       OK ] PreciseTimer.PreciseSystemTimerAvailability
    [ RUN      ] PreciseTimer.MeasurementAccuracy
    [       OK ] PreciseTimer.MeasurementAccuracy
    [ RUN      ] PreciseTimer.Queue
    [       OK ] PreciseTimer.Queue
    [ RUN      ] PreciseTimer.EmptyQueue
    [       OK ] PreciseTimer.EmptyQueue
    [----------] Global test environment tear-down
    [==========] 4 tests from 1 test case ran.
    [  PASSED  ] 4 tests.

Ура! Все работает. Доказано тестами. При использовании данного класса у себя в проекте не забудьте добавить `pretimer_unittest.cpp` в набор ваших прочих unit тестов. Этим вы избавитесь от множества сюрпризов.

Приобщайтесь к unit-тестированию, и программируйте правильно!

* [QueryPerformanceCounter на мультиядерных и виртуальных системах][]
* [Unit-тестирование для параллельных потоков][]

[QueryPerformanceCounter на мультиядерных и виртуальных системах]: /blog/russian/2009/03/05/queryperformancecounter-on-multicore-and-virtual-systems/
[Unit-тестирование для параллельных потоков]: /blog/russian/2009/01/28/unit-testing-concurrent-threads/

