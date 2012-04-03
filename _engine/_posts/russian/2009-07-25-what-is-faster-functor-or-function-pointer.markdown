---
layout: post
title: "Кто быстрее: функтор или указатель на функцию"
language: russian
date: 2009-07-25 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/07/blog-post_25.html
categories:
- cplusplus
- russian
---
Возьмем небольшую программу, которая сортирует большой массив, используя разные методы сравнения элементов: по умолчанию (предоставляемый компилятором для базовых типов), через указатель на функцию и через функтор. 

`functor.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

#include <algorithm>

typedef double Type;

Type* array;
const int N = 100000000;

inline bool less(Type a1, Type a2) {
  return a1 < a2;
}

class Less {
 public:
  inline bool operator()(Type a1, Type a2) {
    return a1 < a2;
  }
};

// Использование встроенной функции сравнения.
TEST(Callback, BuiltIn) {
  std::sort(array, array + N);
}

// Использование свободной функции сравнения по указателю.
TEST(Callback, Function) {
  std::sort(array, array + N, less);
}

// Использование функтора.
TEST(Callback, Functor) {
  std::sort(array, array + N, Less());
}

int main(int argc, char* argv[]) {
  // Создаем отсортированный массив.
  array = new Type[N];
  Type* p = array;
  for (int i = 0; i < N; ++i) *p++ = i;

  testing::InitGoogleTest(&argc, argv);
  // Принудительно печатаем время работы тестов.
  testing::GTEST_FLAG(print_time) = true;
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Компилируем и запускаем (Visual Studio 2008):

    cl /O2 /arch:SSE2 /EHsc /I. functor.cpp gtest\gtest-all.cc && functor

Результат:

    [==========] Running 3 tests from 1 test case.
    [----------] Global test environment set-up.
    [----------] 3 tests from Callback
    [ RUN      ] Callback.BuiltIn
    [       OK ] Callback.BuiltIn (9547 ms)
    [ RUN      ] Callback.Function
    [       OK ] Callback.Function (24391 ms)
    [ RUN      ] Callback.Functor
    [       OK ] Callback.Functor (9578 ms)
    [----------] 3 tests from Callback (43547 ms total)

    [----------] Global test environment tear-down
    [==========] 3 tests from 1 test case ran. (43547 ms total)
    [  PASSED  ] 3 tests.

Видно, что скорость функтора (9578 мс) практически равна встроенной функции (9547 мс) сравнения. А вот вызов свободной функции конкретно отстает (24391 мс), приблизительно в 2.5 раза.

Такое поведение можно объяснить тем, что в данном случае при вызове обычной функции компилятор не может оптимизировать такой вызов встраиванием (inlining). Вне зависимости от того, что функция объявлена выстраиваемой, так как ее вызов производится по указателю, компилятор не может сделать предположений о значении этого указателя на стадии исполнения, а значит провести оптимизацию. 

При использовании же функтора компилятору доступна информация о семантике вызываемого кода, поэтому все типы оптимизации возможны. Отсюда и скорость, близкая к встроенной функции сравнения.

Как вариант, при замене типа с `double` на `int` и при условии, что опция `/arch:SSE2` включена, тест с функтором работал даже быстрее встроенной функции.

**Вывод**

Использование функторов предпочтительнее, чем свободных функций. С точки зрения проектирования и так все понятно (функтор, или функциональный объект, можно удобно тестировать, наследовать и т.д), но, как видно, и в плане производительности функтор тоже впереди.
