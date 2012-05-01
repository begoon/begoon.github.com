---
layout: post
title: "Баг с std::async() в Visual Studio 11 (preview)"
language: russian
date: 2012-05-01 13:10
comments: true
categories: 
- russian
- visual studio
- bug
---
Наткнулся на, видимо, баг в библиотеке Visual Studio 11 (preview).

{% codeblock lang:cpp %}
#include <future>

int main(int argc, char* argv[]) {
  for (auto i = 0L; i < 1000000; ++i) {
    auto f = std::async([](){ return 0; });
    f.get();
  }
  return 0;
}
{% endcodeblock %}

Данный код стабильно падает. Исключений не бросает. Интересно, что если уменьшать количество итерации, то падения изчезают.

Компилятор cl.exe 17.00.40825.2, студия 11.0.40825.2 PREREL. [Запостил на Stack Overflow][]. Пока говорят, что скорее всего реально баг.

[Запостил на Stack Overflow]: http://stackoverflow.com/questions/10301432/number-of-async-futures-in-c11

Где обычно файлят баги в VS?
