---
layout: post
title: "Потоки в C++ против потоков в Go"
language: russian
date: 2011-04-18 01:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/04/c-go.html
categories:
- go
- boost
- threading
- russian
---
После [поста про потоки в Go][Пример многопоточного программирования в Go] я прочитал [другое мнение][Пост Евгения Лазина] про общую целесообразность Go в плане продвинутости в многопоточном программировании.

[Пост Евгения Лазина]: http://evgeny-lazin.blogspot.com/2011/04/httpeasy-coding.html

Признаюсь, я не боец в бусте и новом C++, но благодаря [предоставленному примеру][Пример], было очевидно, что и на С++ решение получается весьма изящное.

[Пример]: http://pastebin.com/kwq0cj4v

Интересно было сравнить производительнось потоков во обоих языках в плане скорости из создания и назначения им работы. Как я понял, это битва между pthreads и системой Go-рутин, которые не являются потоками операционной системы. Как [сказано в документации][Goroutines]:

*Goroutines are multiplexed onto multiple OS threads so if one should block, such as while waiting for I/O, others continue to run. Their design hides many of the complexities of thread creation and management.*

[Goroutines]: http://golang.org/doc/effective_go.html#goroutines

Я взял последний boost, и на той же восьми процессорной машине провел эксперимент.

Программе надо будет выполнить множество однотипной работы (фактически, вызвать функцию). Задачи будут мультиплексироваться между несколькими параллельными потоками. Сама функция будет элементарной и быстрой. Надеюсь, этим удастся сфокусировать тестирование именно на подсистеме потоков, нежели на полезной нагрузке.

Итак, программа на Go:

{% codeblock lang:go %}
package main

import (
        "flag"
        "fmt"
)

var jobs *int = flag.Int("jobs", 8, "number of concurrent jobs")
var n *int = flag.Int("tasks", 1000000, "number of tasks")

func main() {
        flag.Parse()

        fmt.Printf("- running %d concurrent job(s)\n", *jobs)
        fmt.Printf("- running %d tasks\n", *n)
        tasks := make(chan int, *jobs)
        done := make(chan bool)

        for i := 0; i < *jobs; i++ {
                go runner(tasks, done)
        }

        for i := 1; i <= *n; i++ {
                tasks <- i
        }

        for i := 0; i < *jobs; i++ {
                tasks <- 0
                <- done
        }
}

func runner(tasks chan int, done chan bool) {
        for {
                if arg := <- tasks; arg == 0 {
                        break
                }
                worker()
        }
        done <- true
}

func worker() int {
        return 0
}
{% endcodeblock %}

Makefile для прогона по серии параметров:

{% codeblock lang:makefile %}
target = go_threading

all: build

build:
        6g $(target).go
        6l -o $(target) $(target).6

run:
        (time -p ./$(target) -tasks=$(args) \
                1>/dev/null) 2>&1 | head -1 | awk '{ print $$2 }'

n = \
10000 \
100000 \
1000000 \
10000000 \
100000000

test:
        @for i in $(n); do \
                echo "`printf '% 10d' $$i`" `$(MAKE) args=$$i run`; \
        done
{% endcodeblock %}

Программа на C++:

{% codeblock lang:cpp %}
#include <iostream>
#include <boost/thread.hpp>
#include <boost/bind.hpp>
#include <queue>
#include <string>
#include <sstream>

class thread_pool {

  typedef boost::function0<void> worker;

  boost::thread_group threads_;
  std::queue<worker> queue_;
  boost::mutex mutex_;
  boost::condition_variable cv_;
  bool done_;

 public:

  thread_pool() : done_(false) {
    for(int i = 0; i < boost::thread::hardware_concurrency(); ++i)
      threads_.create_thread(boost::bind(&thread_pool::run, this));
  }

  void join() {
    threads_.join_all();
  }

  void run() {
    while (true) {
      worker job;
      {
        boost::mutex::scoped_lock lock(mutex_);
        while (queue_.empty() && !done_)
          cv_.wait(lock);

        if (queue_.empty() && done_) return;

        job = queue_.front();
        queue_.pop();
      }
      execute(job);
    }
  }

  void execute(const worker& job) {
    job();
  }

  void add(const worker& job) {
    boost::mutex::scoped_lock lock(mutex_);
    queue_.push(job);
    cv_.notify_one();
  }

  void finish() {
    boost::mutex::scoped_lock lock(mutex_);
    done_ = true;
    cv_.notify_all();
  }
};

void task() {
  volatile int r = 0;
}

int main(int argc, char* argv[]) {
  thread_pool pool;
  int n = argc > 1 ? std::atoi(argv[1]) : 10000;

  int threads = boost::thread::hardware_concurrency();
  std::cout << "- executing " << threads << " concurrent job(s)" << std::endl;
  std::cout << "- running " << n << " tasks" << std::endl;
  for (int i = 0; i < n; ++i) {
    pool.add(task);
  }

  pool.finish();
  pool.join();

  return 0;
}
{% endcodeblock %}

Makefile:

{% codeblock lang:makefile %}
BOOST = ~/opt/boost-1.46.1

target = boost_threading

build:
        g++ -O2 -I $(BOOST) -o $(target) \
                -lpthread \
                -lboost_thread \
                 -L $(BOOST)/stage/lib \
                $(target).cpp

run:
        (time -p LD_LIBRARY_PATH=$(BOOST)/stage/lib ./$(target) $(args) \
                1>/dev/null) 2>&1 | head -1 | awk '{ print $$2 }'

n = \
10000 \
100000 \
1000000 \
10000000 \
100000000

test:
        @for i in $(n); do \
                echo "`printf '% 10d' $$i`" `$(MAKE) args=$$i run`; \
        done
{% endcodeblock %}

В обоих языках число потоков будет равно количеству процессоров - 8. Количество задач, прогоняемых через эти восемь поток будет варьироваться.

Запускаем программу на C++:

    make && make -s test

    g++ -O2 -I ~/opt/boost-1.46.1 -o boost_threading \
                    -lpthread \
                    -lboost_thread \
                     -L ~/opt/boost-1.46.1/stage/lib \
                    boost_threading.cpp
    (time -p LD_LIBRARY_PATH=~/opt/boost-1.46.1/stage/lib ./boost_threading  \
                    1>/dev/null) 2>&1 | head -1 | awk '{ print $2 }'
         10000 0.03
        100000 0.35
       1000000 3.43
      10000000 29.57
     100000000 327.37

Теперь Go:

    make && make -s test

    6g go_threading.go
    6l -o go_threading go_threading.6
         10000 0.00
        100000 0.03
       1000000 0.35
      10000000 3.72
     100000000 38.27
     
Разница очевидна.

Может быть я сравниваю соленое с красным, и результаты просто неадекватны. Будет очень признателен за подсказку, в каких попугаях на правильно измерять.

Посты по теме:

* [Пример многопоточного программирования в Go][]

[Пример многопоточного программирования в Go]: /blog/russian/2011/04/12/multithreading-in-go/
