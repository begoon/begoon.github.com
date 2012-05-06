---
layout: post
title: "Сравнение скорости atomic, spinlock и mutex"
language: russian
date: 2012-05-05 23:32
comments: true
categories: 
- boost
- russian
- threading
---
Было мне интересно сравнить скорость разных вариантов блокировок: atomic, spinlock, mutex.

## Без синхронизации

Для начала вариант вообще без какой-либо синхронизации:

{% codeblock lang:cpp %}
#include <future>
#include <iostream>

volatile int value = 0;

int loop(bool inc, int limit) {
  std::cout << "Started " << inc << " " << limit << std::endl;
  for (int i = 0; i < limit; ++i) {
    if (inc) { 
      ++value;
    } else {
      --value;
    }
  }
  return 0;
}

int main() {
  auto f = std::async(std::launch::async, std::bind(loop, true, 20000000));
  loop(false, 10000000);
  f.wait();
  std::cout << value << std::endl;
}
{% endcodeblock %}

Компилировать будем clang'ом:

    clang++ -std=c++11 -stdlib=libc++ -O3 -o test test.cpp && time ./test

Запускаем:

    SSttaarrtteedd  10  2100000000000000

    11177087

    real	0m0.070s
    user	0m0.089s
    sys	0m0.002s

Видно, что операции операторов инкремента и декремента неатомарные, и переменная `value` в конце содержит мусор.

## Инструкция LOCK

{% codeblock lang:cpp %}
#include <future>
#include <iostream>

volatile int value = 0;

int loop(bool inc, int limit) {
  std::cout << "Started " << inc << " " << limit << std::endl;
  for (int i = 0; i < limit; ++i) {
    if (inc) { 
      asm("LOCK");
      ++value;
    } else {
      asm("LOCK");
      --value;
    }
  }
  return 0;
}

int main() {
  auto f = std::async(std::launch::async, std::bind(loop, true, 20000000));
  loop(false, 10000000);
  f.wait();
  std::cout << value << std::endl;
} 
{% endcodeblock %}

Запускаем:

    SSttaarrtteedd  10  2000000100000000

    10000000

    real	0m0.481s
    user	0m0.779s
    sys	0m0.005s

Тут уже `value` содержит правильное значение, но, конечно, это абсолютно непереносимый хак, заточенный под x86, и который, например, у меня работает только с `-O3` (с `-O2` падает с "illegal instruction", так как между командой LOCK и инкрементом/декрементом компилятор сует что-то еще).

## Atomic

{% codeblock lang:cpp %}
#include <future>
#include <iostream>
#include "boost/interprocess/detail/atomic.hpp"

using namespace boost::interprocess::ipcdetail;

volatile boost::uint32_t value = 0;

int loop(bool inc, int limit) {
  std::cout << "Started " << inc << " " << limit << std::endl;
  for (int i = 0; i < limit; ++i) {
    if (inc) { 
      atomic_inc32(&value);
    } else {
      atomic_dec32(&value);
    }
  }
  return 0;
}

int main() {
  auto f = std::async(std::launch::async, std::bind(loop, true, 20000000));
  loop(false, 10000000);
  f.wait();
  std::cout << atomic_read32(&value) << std::endl;
}
{% endcodeblock %}

Запускаем:

    SSttaarrtteedd  10  2100000000000000

    10000000

    real	0m0.457s
    user	0m0.734s
    sys	0m0.004s
    
Результат правильный, и время почти такое же, как и с командой `LOCK`. Неудивительно, так как `atomic` на самом тоже использует инструкцию `LOCK`, но просто точно гарантированным и проверенным образом.

## Spinlock

{% codeblock lang:cpp %}
#include <future>
#include <iostream>
#include "boost/smart_ptr/detail/spinlock.hpp"

boost::detail::spinlock lock;
volatile int value = 0;

int loop(bool inc, int limit) {
  std::cout << "Started " << inc << " " << limit << std::endl;
  for (int i = 0; i < limit; ++i) {
    std::lock_guard<boost::detail::spinlock> guard(lock);
    if (inc) { 
      ++value;
    } else {
      --value;
    }
  }
  return 0;
}

int main() {
  auto f = std::async(std::launch::async, std::bind(loop, true, 20000000));
  loop(false, 10000000);
  f.wait();
  std::cout << value << std::endl;
}
{% endcodeblock %}

Запускаем:

    SSttaarrtteedd  10  2100000000000000

    10000000

    real	0m0.541s
    user	0m0.675s
    sys	0m0.089s

Немного медленнее, но не на много.

## Mutex

{% codeblock lang:cpp %}
#include <future>
#include <iostream>

std::mutex mutex;
volatile int value = 0;

int loop(bool inc, int limit) {
  std::cout << "Started " << inc << " " << limit << std::endl;
  for (int i = 0; i < limit; ++i) {
    std::lock_guard<std::mutex> guard(mutex);
    if (inc) { 
      ++value;
    } else {
      --value;
    }
  }
  return 0;
}

int main() {
  auto f = std::async(std::launch::async, std::bind(loop, true, 20000000));
  loop(false, 10000000);
  f.wait();
  std::cout << value << std::endl;
}
{% endcodeblock %}

Запускаем:

    SSttaarrtteedd  10  2010000000000000

    10000000

    real	0m25.229s
    user	0m7.011s
    sys	0m22.667s
    
Вот тут, конечно, реально медленнее.

## Сравнительная табличка

**Метод**         | **Время (сек.)**
------------------|--------------
Без синхронизации |  0.070
LOCK              |  0.481         
Atomic            |  0.457
Spinlock          |  0.541
Mutex             | 22.667

Конечно, очень многое зависит от платформы и компилятора (я тестировал на Mac Air и clang). Но лично я, например, получил интересное наблюдение, что spinlock, несмотря на значительную сложную реализации, судя по сгенерированному кому, почти не уступает atomic'у.

Жалко, что мой clang пока не поддерживает `atomic`, и пришлось использовать boost.

### P.S.

В C++ 2011 гарантируется, что при многопоточном использовании стандартных потоков гарантируется отсутствие data race, но неперемешивание вывода не гарантируется.

> Concurrent access to a synchronized (§27.5.3.4) standard iostream object’s formatted and unformatted input (§27.7.2.1) and output (§27.7.3.1) functions or a standard C stream by multiple threads shall not result in a data race (§1.10). [ Note: Users must still synchronize concurrent use of these objects and streams by multiple threads if they wish to avoid interleaved characters. — end note ]

### Посты по теме

* [Атомарность типа int и указателя][]

[Атомарность типа int и указателя]: /blog/russian/2010/12/27/atomicy-of-int-and-pointer/
