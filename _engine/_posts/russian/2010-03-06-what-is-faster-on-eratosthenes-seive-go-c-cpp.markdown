---
layout: post
title: "Решето Эратосфена - кто быстрее: Go, C или C++?"
language: russian
date: 2010-03-06 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/03/go-c-c.html
categories:
- cplusplus
- go
- russian
---
[Go][] очень интересный язык. Компиляция в native-code (никаких виртуальных машин, JIT-компиляций и т.д.), при этом автоматическая сборка мусора и встроенная поддержка многопоточности, объектно-ориентированная модель, и в довершение всего - очень быстрая компиляция.

Лично я обычно на новых для меня языках люблю писать [Решето Эратосфена][] в качестве "Hello, world!".

[Go]: http://golang.org/
[Решето Эратосфена]: http://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D1%88%D0%B5%D1%82%D0%BE_%D0%AD%D1%80%D0%B0%D1%82%D0%BE%D1%81%D1%84%D0%B5%D0%BD%D0%B0

Моя версия на Go.

Файл `erato-go-bool.go`:

{% codeblock lang:go %}
package main

import "fmt"
import "math"
import "flag"

func main() {
    var N int
    flag.IntVar(&N, "N", 100, "")
    flag.Parse()

    fmt.Printf("%d\n", N)

    seive := make([]bool, N)
   
    limit := int(math.Sqrt(float64(N))) + 1

    for i := 2; i < limit; i++ {
        if !seive[i] {
            for j := i * i; j < N; j += i  {
                seive[j] = true
            }
        }
    }

    count := 0
    for i := 2; i < N; i++ {
        if !seive[i] {
            count++
        }
    }
    fmt.Printf("%d\n", count)
}
{% endcodeblock %}

И первый вопрос, который приходит в голову - а насколько это быстро работает?

Некоторое время назад я уже [писал][Кто быстрее: vector<bool> или vector<int>], как использовал решето для тестирования STL'евского контейнера `std::vector` на разных компиляторах.

Сейчас я провел похожее сравнение между Go, C++ и C.

Итак, первый кандитат - версия на Go с использованием типа `bool` (см. выше). Второй - тоже на Go, но с использованием типа `int`.

Файл `erato-go-int.go`:

{% codeblock lang:go %}
package main

import "fmt"
import "math"
import "flag"

func main() {
    var N int
    flag.IntVar(&N, "N", 100, "")
    flag.Parse()

    fmt.Printf("%d\n", N)

    seive := make([]int, N)
   
    limit := int(math.Sqrt(float64(N))) + 1

    for i := 2; i < limit; i++ {
        if seive[i] == 0 {
            for j := i * i; j < N; j += i  {
                seive[j] = 1
            }
        }
    }

    count := 0
    for i := 2; i < N; i++ {
        if seive[i] == 0 {
            count++
        }
    }
    fmt.Printf("%d\n", count)
}
{% endcodeblock %}

Файл `erato-cxx.cpp`:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>
#include <cstdlib>
#include <cmath>

int main(int argc, char* argv[]) {
  int n = argc > 1 ? std::atoi(argv[1]) : 100;

  std::cout << n << std::endl;

  int sqrt_n = static_cast<int>(std::sqrt(static_cast<double>(n))) + 1;

  std::vector<TYPE> S(n, true);

  for (int i = 2; i < sqrt_n; ++i)
    if (S[i])
      for (int j = i*i; j < n; j+=i)
        S[j] = false;

  int count = 0;
  for (int i = 2; i < n; ++i)
    if (S[i])
      count++;

  std::cout << count << std::endl;

  return 0;
}
{% endcodeblock %}

Ну и для полноты картины версия на С:

Файл `erato-c-int.c`:

{% codeblock lang:cpp %}
#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include <math.h>

int main(int argc, char* argv[]) {
  int n = argc > 1 ? atoi(argv[1]) : 100;
  int* S;
  int count;
  int sz = n * sizeof(*S);
  int i, j;

  printf("%d\n", n);

  long sqrt_n = sqrt(n) + 1;

  S = malloc(sz);
  memset(S, 0, sz);

  for (i = 2; i < sqrt_n; ++i)
    if (S[i] == 0)
      for (j = i*i; j < n; j+=i)
        S[j] = 1;

  count = 0;
  for (i = 2; i < n; ++i)
    if (S[i] == 0)
      count++;

  printf("%d\n", count);

  free(S);
  return 0;
}
{% endcodeblock %}

Ну и `Makefile` для удобного запуска:

{% codeblock lang:makefile %}
.SILENT: 

all: 
        $(MAKE) run 2>&1 | tee log
        $(MAKE) parse-log

run: go-bool go-int cxx-int cxx-bool c-int

N ?= 100000000

go-bool:
        echo $@
        6g erato-$@.go
        6l -o erato-$@ erato-$@.6
        time -p -f %e ./erato-$@ -N=$(N)

go-int: 
        echo $@
        6g erato-$@.go
        6l -o erato-$@ erato-$@.6
        time -p -f %e ./erato-$@ -N=$(N)

cxx-bool:
        echo $@
        g++ -o erato-$@ \
                -O3 -funroll-all-loops -fomit-frame-pointer \
                -DTYPE=bool erato-cxx.cpp 
        time -p -f %e ./erato-$@ $(N)

cxx-int:
        echo $@
        g++ -o erato-$@ \
                -O3 -funroll-all-loops -fomit-frame-pointer \
                -DTYPE=int erato-cxx.cpp 
        time -p -f %e ./erato-$@ $(N)

c-int:
        echo $@
        gcc -o erato-$@ -lm \
                 -O3 -funroll-all-loops -fomit-frame-pointer erato-$@.c
        time -p -f %e ./erato-$@ $(N)

parse-log:
        printf "%10s %10s %8s %5s\n" "Language" N Count Time ; \
        (echo "------------------------------------") ; \
        while read type ; do \
                read N && \
                read count && \
                read time && \
                printf "%10s %10s %8s %5s\n" $$type $$N $$count $$time ; \
        done < log
{% endcodeblock %}

Запускал я все это под Ubuntu 64-bit. Компилятор C и C++ - gcc 4.4.1. Компилятор Go - последний из [официального репозитория][Go repository].

[Go repository]: http://golang.org/doc/install.html

Запускаем:

    make N=100000000
    
и получаем следующее:

     Language           N    Count  Time
    ------------------------------------
       go-bool  100000000  5761455  3.96
        go-int  100000000  5761455  6.58
       cxx-int  100000000  5761455  6.76
      cxx-bool  100000000  5761455  2.20
         c-int  100000000  5761455  6.47
         
Получается, что сделал всех С++ с использованием `std::vector<bool>` для хранения массива. Затем идет Go тоже с типом `bool`. А С, С++ с `std::vector<int>` и Go с `int`'ом примерно равны.

**Update**: После экспериментов в комментариях выходит, что и на С, и на С++ можно добиться равного быстродействия, если использовать битовые поля. Просто в С++ это синтаксически проще, но не более того.

Посты по теме:

* [Кто быстрее: vector&lt;bool&gt; или vector&lt;int&gt;][Кто быстрее: vector<bool> или vector<int>]

[Кто быстрее: vector<bool> или vector<int>]: /blog/russian/2009/02/01/what-is-faster-vector-int-or-bool/
