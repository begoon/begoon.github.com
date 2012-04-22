---
layout: post
language: russian
date: 2012-04-14 17:27
title: "Как вернуть vector из функции: по значению или по ссылке?"
categories:
- cplusplus
- benchmark
- stl
- russian
---
Есть функция, создающая каким-то определенным образом экземпляр `vector`. Вопрос: как вернуть этот экземпляр вызывающему?

Правильное с точки зрения логики и стройности программы решение выглядит так:

{% codeblock lang:cpp %}
std::vector<int> create_vector(const size_t N) {
  std::vector<int> v;
  v.resize(N, 0xDEADC0DE);
  return v;
}
{% endcodeblock %}

Тут экземпляр вектора возвращается *по значению*, что означает потенциальное глубокое копирование локального объекта в контекст вызывающей функции. Сразу возникает сомнение: а что, если вектор огромен - его ж надо будет побайтно перекладывать из одного места в другое? Гораздо "разумнее" было бы написать:

{% codeblock lang:cpp %}
void create_vector(const size_t N, std::vector<int>* v) {
  v->resize(N, 0xDEADC0DE);
}
{% endcodeblock %}

Тут вектор передается по указателю, и стопроцентно ненужного полного копирования не будет. Но такой код выглядит откровенно плохо.

Сравним скорости работы на векторе длиной 100MB. Например, на компиляторе:

    Apple clang version 3.1 (tags/Apple/clang-318.0.45) (based on LLVM 3.1svn)
    Target: x86_64-apple-darwin11.3.0
    
По значению:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

std::vector<int> __attribute__((noinline))
create_vector(const size_t N) {
  std::cout << "by value" << std::endl;
  std::vector<int> v;
  v.resize(N, 0xDEADC0DE);
  return v;
}

int main(int argc, char* argv[]) {
  for (size_t i = 0; i < 10; ++i) {
    const size_t N = 1024 * 1024 * 100;
    std::vector<int> v = create_vector(N);
    if (v[i] != 0xDEADC0DE) {
      std::cout << "Test is rubbish" << std::endl;
      return 0;
    }
  } 
  return 0;
}
{% endcodeblock %}

Запускаем:

    clang++ -O3 -o by_value by_value.cpp && time ./by_value
    
Результат:

    0m4.933s
    
Теперь по указателю:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

void __attribute__((noinline))
create_vector(const size_t N, std::vector<int>* v) {
  std::cout << "by pointer" << std::endl;
  v->resize(N, 0xDEADC0DE);
}

int main(int argc, char* argv[]) {
  for (size_t i = 0; i < 10; ++i) {
    const size_t N = 1024 * 1024 * 100;
    std::vector<int> v;
    create_vector(N, &v);
    if (v[i] != 0xDEADC0DE) {
      std::cout << "Test is rubbish" << std::endl;
      return 0;
    }
  } 
  return 0;
}
{% endcodeblock %}

Запускаем:

    clang++ -O3 -o by_pointer by_pointer.cpp && time ./by_pointer
    
Результат:

    0m4.852s
    
Время в обоих случаях одинаково. Получается, что стоит выбрать первый, "красивый" вариант.

Объяснений тут два. Первый, и возможно самый важный - это [RVO, Return value optimization][RVO]. Это когда компилятор догадывается, что создаваемый локальный экземпляр вектора предназначен для возврата из функции, и сразу создает его в контексте вызывающего кода, чтобы потом не копировать туда. Фактически компилятор реализует передачу по ссылке, но неявно, не портя красоту исходного кода. Данный трюк будет работать для любого класса, не обязательно класса из STL.

[RVO]: http://en.wikipedia.org/wiki/Return_value_optimization

Но оптимизация - это негарантированная вещь. Но тут есть еще одно подспорье. Стандартные контейнеры STL реализованы так, что при даже при глубоком копировании фактически копируется только небольшая управляющая структура, а сами данные, размещенные в куче, просто перебрасываются указателем, без их фактического перемещения. Тут, конечно, будет небольшое дополнительное копирование, но оно минимально, и возможно на него стоит пойти ради сохранения красивого кода.

Ну а в контексте C++11, где есть семантика перемещения, вообще не будет лишних копирований, если класс "правильно" реализован (что верно для классов из STL).

Мораль: используйте по возможности контейнеры из STL и оставьте оптимизацию компилятору. Иногда, конечно, компилятор ошибается, но таких случаев гораздо меньше, чем наоборот.
