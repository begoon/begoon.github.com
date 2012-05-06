---
layout: post
title: "Comparing the performance of atomic, spinlock and mutex"
language: english
date: 2012-05-05 23:32
comments: true
categories: 
- boost
- english
- threading
---
I was curious in benchmark of different synchronization mechanisms: atomic, spinlock, mutex.

## Without synchronization 

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

Compiling via clang:

    clang++ -std=c++11 -stdlib=libc++ -O3 -o test test.cpp && time ./test

Run:

    SSttaarrtteedd  10  2100000000000000

    11177087

    real	0m0.070s
    user	0m0.089s
    sys	0m0.002s

Obviously, the increment and decrement operations aren't atomic, and the `value` variable contains garbage at the end.

## LOCK

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

Run:

    SSttaarrtteedd  10  2000000100000000

    10000000

    real	0m0.481s
    user	0m0.779s
    sys	0m0.005s

Now `value` has the correct value at the end, but, of course, this is a dirty non-portable hack for x86 only. For example, this code works for me only if compiled with `-O3`. Otherwise it crashes with "illegal instruction" because the compiler injects extra stuff between the LOCK instruction and the following increment or decrement.

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

Run:

    SSttaarrtteedd  10  2100000000000000

    10000000

    real	0m0.457s
    user	0m0.734s
    sys	0m0.004s
   
The result is correct, and the time is almost the same as with `LOCK`. Not surprisingly, `atomic` under cover also uses `LOCK` but in a portable and guaranteed way.

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

Run:

    SSttaarrtteedd  10  2100000000000000

    10000000

    real	0m0.541s
    user	0m0.675s
    sys	0m0.089s

A bit slower but not much.

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

Run:

    SSttaarrtteedd  10  2010000000000000

    10000000

    real	0m25.229s
    user	0m7.011s
    sys	0m22.667s
    
Now it works much slower, really.

## Benchmark

**Method**        | **Time (sec.)**
------------------|--------------
No synchronization|  0.070
LOCK              |  0.481         
Atomic            |  0.457
Spinlock          |  0.541
Mutex             | 22.667

Of course, the result depends really on the platform and the compiler (I tested on Mac Air and clang). But for me it was quite interesting to see that spinlock, in spite of its more sophisticated implementation comparing to atomics, works not much slower. 

Sadly, my clang 3.1 still doesn't support `atomic`, and I had to use boost.
