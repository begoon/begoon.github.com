---
layout: post
title: "What is faster on Sieve of Eratosthenes: Go, C or C++?"
language: english
date: 2010-03-06 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/03/what-is-faster-on-sieve-of-eratosthenes.html
categories: 
- benchmark
- english
---
Go is a very interesting language. It compiles to native-code (no VM or JIT) and it comes with automatic garbage collection and built-in concurrency support, the object-oriented model and on top of it - extremely fast compilation.

I love to use [Sieve of Eratosthenes][] as "Hello, world!" when exploring a new language.

[Sieve of Eratosthenes]: http://en.wikipedia.org/wiki/Sieve_of_Eratosthenes

Here is my version of the seive in Go:

File `erato-go-bool.go`:

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

But how fast is this?

I've compared it against implementations in C++ and C.

The first competitor is Go using `bool` type in as a storage (see above). The second one is the also Go's version but with `int` as the storage type.

File `erato-go-int.go`:

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

Then I tested in C++. A `TYPE` macro allows to compile the source with different types (`int` and `bool`):

File `erato-cxx.cpp`:

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

And to have the full picture there is an implementation in C:

File: `erator-c-int.c`:

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

Makefile for easy run:

File `Makefile`:

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

I run this on Ubuntu 64-bit. The C/C++ compiler is gcc 4.4.1. The Go compiler is the lastest from its official repository.

Run:

    make N=100000000

Output:

     Language           N    Count  Time
    ------------------------------------
       go-bool  100000000  5761455  3.96
        go-int  100000000  5761455  6.58
       cxx-int  100000000  5761455  6.76
      cxx-bool  100000000  5761455  2.20
         c-int  100000000  5761455  6.47

C++ using `std::vector<book>` has beaten C and Go. The second is Go's implementation also using `bool`. And on the third place are C, C++ with `std::vector<int>` and Go with `int`.
