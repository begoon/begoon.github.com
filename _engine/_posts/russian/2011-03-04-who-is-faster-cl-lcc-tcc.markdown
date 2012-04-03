---
layout: post
title: "Кто из компиляторов быстрее: cl, lcc или tcc"
language: russian
date: 2011-03-04 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/03/cl-lcc-tcc.html
categories:
- compiler
- benchmark
- russian
---
Люблю делать всякие сравнения компиляторов.

Сегодня на ринге Студия 2010, [lcc][] и [tcc][]. Все три я активно использую под Windows для языка С.

[lcc]: http://www.cs.virginia.edu/~lcc-win32/
[tcc]: http://bellard.org/tcc/

Сравнивать будем на любимом решете Эратосфена (`erato-c-int.c`):

{% codeblock lang:cpp %}
#include <stdio.h>
#include <stdlib.h>
#include <memory.h>
#include <string.h>
#include <math.h>

int main(int argc, char* argv[]) {
  int n = argc > 1 ? atoi(argv[1]) : 100;
  int* S;
  int count;
  int sz = n * sizeof(*S);
  int i, j;

  long sqrt_n = sqrt(n) + 1;

  printf("%d\n", n);

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

Скрипт для запуска (Makefile):

{% codeblock lang:makefile %}
SRC=erato-c-int
N=100000000

all:  build run

build: build-cl build-lcc build-tcc

run: run-cl run-lcc run-tcc

build-cl:
  @cl /nologo /O2 -Fe$(SRC)-cl.exe $(SRC).c

run-cl:
  @echo ---
  -@cl 2>&1 | findstr Compiler
  @ntimer.exe $(SRC)-cl.exe $(N) | findstr ETime

build-lcc:
  @c:\lcc\bin\lcc -O2 -o $(SRC)-lcc.obj $(SRC).c
  @c:\lcc\bin\lcclnk -o $(SRC)-lcc.exe $(SRC)-lcc.obj

run-lcc:
  @echo ---
  @c:\lcc\bin\lcc -v
  @ntimer.exe $(SRC)-lcc.exe $(N) | findstr ETime

build-tcc:
  @c:\tcc\tcc -O2 -o $(SRC)-tcc.exe $(SRC).c

run-tcc:
  @echo ---
  @c:\tcc\tcc -v
  @ntimer.exe $(SRC)-tcc.exe $(N) | findstr ETime
{% endcodeblock %}

Погнали:

    ---
    Microsoft (R) 32-bit C/C++ Optimizing Compiler Version 16.00.30319.01 for 80x86
    ETime(   0:00:04.374 ) UTime(   0:00:04.196 ) KTime(   0:00:00.124 )
    ---
    Logiciels/Informatique lcc-win32 version 3.8. Compilation date: Jan 29 2011 11:51:05
    ETime(   0:00:04.415 ) UTime(   0:00:04.102 ) KTime(   0:00:00.202 )
    ---
    tcc version 0.9.25
    ETime(   0:00:04.944 ) UTime(   0:00:04.492 ) KTime(   0:00:00.280 )

Вывод не особо захватывающий. Все выступили примерно одинаково.

Посты по теме:

* [Решето Эратосфена - кто быстрее: Go, C или C++?][]
* [Кто быстрее: vector<bool> или vector<int>][]

[Решето Эратосфена - кто быстрее: Go, C или C++?]: /blog/russian/2010/03/06/what-is-faster-on-eratosthenes-seive-go-c-cpp/
[Кто быстрее: vector<bool> или vector<int>]: /blog/russian/2009/02/01/what-is-faster-vector-int-or-bool/
