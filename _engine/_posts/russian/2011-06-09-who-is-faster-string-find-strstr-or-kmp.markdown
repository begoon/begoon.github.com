---
layout: post
title: "Кто быстрее: string::find, strstr или КМП?"
language: russian
date: 2011-06-09 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/06/stringfind-strstr.html
categories: 
- benchmark
- cplusplus
- stl
- russian
---
Я как-то пребывал в убеждении, что библиотечные функции поиска строки в подстроке обычно реализуют какой-нибудь "правильный" алгоритм: [Кнута — Морриса — Пратта (КМП)][], например, или [Бойера — Мура][]. Это было бы логично.

[Кнута — Морриса — Пратта (КМП)]: http://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%9A%D0%BD%D1%83%D1%82%D0%B0_%E2%80%94_%D0%9C%D0%BE%D1%80%D1%80%D0%B8%D1%81%D0%B0_%E2%80%94_%D0%9F%D1%80%D0%B0%D1%82%D1%82%D0%B0
[Бойера — Мура]: http://ru.wikipedia.org/wiki/%D0%90%D0%BB%D0%B3%D0%BE%D1%80%D0%B8%D1%82%D0%BC_%D0%91%D0%BE%D0%B9%D0%B5%D1%80%D0%B0_%E2%80%94_%D0%9C%D1%83%D1%80%D0%B0

Ниже очередная пузомерка сферического коня в попугаях.

В забеге учавствуют:

* `std::string::find()`
* `std::strstr()`
* рукодельный `naive_strstr()` со сложностью `O(N^2)`
* рукодельный КМП (`kmp_strstr()`) без особых изысков

Данные для поиска сделаны в виде "наихудщего случая", когда сравнивать надо все до победного, и совпадение будет только с самом конце. Это должно вызвать явное квадратичное время у `naive_strstr()`.

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>
#include <cstdlib>
#include <cstring>
#include <cassert>
#include <ctime>

int naive_strstr(const char* str, const char* needle) {
  int str_sz = std::strlen(str);
  int needle_sz = std::strlen(needle);
  for (int i = 0; i < str_sz - needle_sz + 1; ++i) {
    int j;
    for (j = 0; j < needle_sz; ++j)
      if (str[i + j] != needle[j])
        break;
    if (j == needle_sz)
      return i;
  }
  return -1;
}

int kmp_strstr(const char* str, const char* needle) {
  int str_sz = std::strlen(str);
  int needle_sz = std::strlen(needle);

  std::vector<int> prefix(needle_sz, 0);
  for (int i = 1; i < needle_sz; ++i) {
    int j = prefix[i - 1];
    while (j > 0 && needle[j] != needle[i])
      j = prefix[j - 1];
    if (needle[j] == needle[i])
      j += 1;
    prefix[i] = j;
  }

  int j = 0;
  for (int i = 0; i < str_sz; ++i) {
    while (j > 0 && needle[j] != str[i])
      j = prefix[j - 1];
    if (needle[j] == str[i])
      j += 1;
    if (j == needle_sz)
      return i - j + 1;
  }

  return -1;
}

int main(int argc, char* argv[]) {
  int N = argc > 1 ? std::atoi(argv[1]) : 10*1000*1000;
  int M = argc > 2 ? std::atoi(argv[2]) : 1000;

  std::string str(N, 'a');
  std::string needle(M, 'a');

  // Our needle is the last M characters of the string.
  str[str.length() - 1] += 1;
  needle[needle.length() - 1] += 1;

  std::cout << "N = " << N << ", M = " << M << std::endl;

  size_t correct_position = str.length() - needle.length();
  std::cout << "Correct position: " << correct_position << std::endl;

  const char* str_p = str.c_str();
  assert(std::strlen(str_p) == str.length());

  const char* needle_p = needle.c_str();
  assert(std::strlen(needle_p) == needle.length());

  time_t started, duration;
  size_t i;

  started = std::time(0);
  i = str.find(needle);
  duration = std::time(0)- started;
  std::cout << "string::find(): " << i << ", time " << duration << std::endl;
  assert(i == correct_position);

  started = std::time(0);
  const char* p = std::strstr(str_p, needle_p);
  duration = std::time(0)- started;
  assert(p != NULL);
  i = p - str_p;
  std::cout << "strstr()      : " << i << ", time " << duration << std::endl;
  assert(i == correct_position);

  started = std::time(0);
  i = naive_strstr(str_p, needle_p);
  duration = std::time(0)- started;
  std::cout << "naive_strstr(): " << i << ", time " << duration << std::endl;
  assert(i == correct_position);

  started = std::time(0);
  i = kmp_strstr(str_p, needle_p);
  duration = std::time(0)- started;
  std::cout << "kmp_strstr()  : " << i << ", time " << duration << std::endl;
  assert(i == correct_position);

  return 0;
}
{% endcodeblock %}

Makefile:

{% codeblock lang:makefile %}
all:  do-32 do-64

target = strstr_find

do-32: build-32
    $(target)

do-64: build-64
    $(target)

do-build:
    "%VS100COMNTOOLS%..\..\VC\vcvarsall.bat" $(arch) && cl /O2 /EHsc $(target).cpp

build-32:
    $(MAKE) do-build arch=x86

build-64:
    $(MAKE) do-build arch=amd64

run:
    $(target)

clean:
    -del *.exe *.ilk *.obj *.pdb *.suo
{% endcodeblock %}

Запускаем на Visual Studio 2010 32-bit:

    N = 10000000, M = 1000
    Correct position: 9999000
    string::find(): 9999000, time 4
    strstr()      : 9999000, time 8
    naive_strstr(): 9999000, time 8
    kmp_strstr()  : 9999000, time 0

Запускаем на Visual Studio 2010 64-bit и получаем странное ускорение у `find()` и замедление `strstr()` и `naive_strstr()`:

    N = 10000000, M = 1000
    Correct position: 9999000
    string::find(): 9999000, time 1
    strstr()      : 9999000, time 16
    naive_strstr(): 9999000, time 10
    kmp_strstr()  : 9999000, time 0

Конечно, тут есть много тонкостей. При различных данных в среднем `strstr()` может реально обгонять мою реализацию КМП, так как `strstr() `все-таки написана на ассемблере, и накладные расходы в КМП могут съесть всего его преимущества, но вот если данные всегда будут "плохими", то без КМП не обойдить.

И еще. Так как КМП требует дополнительную память порядка длины искомой строки, то подобное осложнение может не годиться для библиотечной функции широкого применения. Может поэтому `strstr()` и `string::find()` и работают "в лоб".

Одно не понятно - почему `string::find()` быстрее `strstr()`? Может из-за тотального inline'а.
