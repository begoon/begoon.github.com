---
layout: post
title: "Хорошо ли использовать std::string?"
language: russian
date: 2009-08-04 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/08/stdstring.html
categories:
- cplusplus
- russian
---
Я регулярно имею споры с коллегами на тему стоит ли повсеместно использовать `std::string`, или таки надо реализовывать свой класс для строчек.

Один из вопросов - это вопрос качества самой реализации `std::string`. Забавно, что большинство людей, которых я просил набросать прототип класса для строчек, более менее эффективного с точки зрения работы с памятью, писали примерно следующее:

{% codeblock lang:cpp %}
class String {
 public:
  explicit String(const std::string& value) { 
    init(value.c_str(), value.length()); 
  }
  String(const String& value) { init(value.data_, value.sz_); }
  ~String() { free(data_); }

  String& operator=(const String& value) {
    if (this != &value) {
      if (value.sz_ > sz_) data_ = (char*)std::realloc(data_, value.sz_);
      sz_ = value.sz_;
      std::memcpy(data_, value.data_, sz_);
    }
    return *this;
  }

 private:
  void init(const char* data, size_t sz) {
    sz_ = sz;
    data_ = (char*)malloc(sz_);
    std::memcpy(data_, data, sz_);
  }
  char* data_;
  size_t sz_;
};
{% endcodeblock %}

Ясно, что при такой реализации оператора присваивания строка в плане занимаемой памяти будет только расти. Это сделано специально.

Практически никто сразу не думал о необходимости наличия операции перемещения, например `swap`. Почему-то наличие конструктора копирования и оператора присваивания считается достаточным.

Что ответить на этот вопрос раз и навсегда для себя самого, я написал тестовую программу. Это программа сортирует массив из длинных строк. Строки представлены четырьмя способами: объект `std::string`, указатель на `std::string`, объект самопального класса `String` (см. выше) и указатель на `String`.

По предварительным очевидным оценкам работа через указатель должна быть максимально эффективная, так как в данном случае при перемещении объектов физически `std::sort()` переставляет только указатели, а не сами объекты.

А вот при работе непосредственно с объектами будет интересно сравнить, насколько банальная реализации строки будет уступать `std::string`.

Итак, `std_string.cpp`:

{% codeblock lang:cpp %}
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include <cstdlib>
#include <cstring>
#include <cassert>

#include "gtest/gtest.h"

static const int N = 100;

// Самопальный класс, реализующий хранение строки более менее
// эффективным образом с точки зрения копирования.
class String {
 public:
  // "explicit" запрещает неявное приведение аргумента, что мы
  // могли точно знать, какие конструктор каких классов вызываются.
  explicit String(const std::string& value) { 
    init(value.c_str(), value.length()); 
  }
  String(const String& value) { init(value.data_, value.sz_); }
  ~String() { free(data_); }

  // Данный оператор - это, пожалуй, единственная попытка сделать
  // работу с памятью эффективной.
  String& operator=(const String& value) {
    if (this != &value) {
      // Память перераспределяется только если оригинал длинее текущей
      // строки. Ясно, что при такой реализации строка может только
      // расти в плане занимаемой памяти.
      if (value.sz_ > sz_) data_ = (char*)std::realloc(data_, value.sz_);
      sz_ = value.sz_;
      std::memcpy(data_, value.data_, sz_);
    }
    return *this;
  }

  friend class StringCmp;
  friend class StringPointerCmp;

 private:
  void init(const char* data, size_t sz) {
    sz_ = sz;
    data_ = (char*)malloc(sz_);
    std::memcpy(data_, data, sz_);
  }
  char* data_;
  size_t sz_;
};

std::vector<std::string> std_strings;
std::vector<std::string*> std_strings_p;
std::vector<String> strings;
std::vector<String*> strings_p;

// Объект для сравнения двух std::string.
class StlStringCmp {
 public:
  bool operator()(const std::string& a, const std::string& b) {
    return a < b;
  }
};

TEST(SortingStlString, StlString) {
  std::sort(std_strings.begin(), std_strings.end(), StlStringCmp());
}

// Объект для сравнения двух std::string*.
class StlStringPointerCmp {
 public:
  bool operator()(const std::string* a, const std::string* b) {
    return *a < *b;
  }
};

TEST(SortingStlString, StlStringPointer) {
  std::sort(std_strings_p.begin(), std_strings_p.end(), StlStringPointerCmp());
}

// Объект для сравнения двух String.
class StringCmp {
 public:
  bool operator()(const String& a, const String& b) {
    assert(a.sz_ == b.sz_);
    return std::memcmp(a.data_, b.data_, a.sz_);
  }
};

TEST(SortingStlString, String) {
  std::sort(strings.begin(), strings.end(), StringCmp());
}

// Объект для сравнения двух String*.
class StringPointerCmp {
 public:
  bool operator()(const String* a, const String* b) {
    assert(a->sz_ == b->sz_);
    return std::memcmp(a->data_, b->data_, a->sz_);
  }
};

TEST(SortingStlString, StringPointer) {
  std::sort(strings_p.begin(), strings_p.end(), StringPointerCmp());
}

int main(int argc, char* argv[]) {
  // Это наполнитель, чтобы строки были длинные, и копирование было
  // ощутимо дорого.
  std::string big(1024 * 1024, '?');
  for (int i = 0; i < N; ++i) {
    // Все строки будут одинаковой длины. Функции сравнения рассчитывают
    // на это.
    std::stringstream fmt;
    fmt << N * 2 - i << big;
    // std::string строка-объект.
    std_strings.push_back(fmt.str());
    // std::string строка-указатель.
    std_strings_p.push_back(new std::string(fmt.str()));
    // Моя строка-объект.
    strings.push_back(String(fmt.str()));
    // Моя строка-указатель.
    strings_p.push_back(new String(fmt.str()));
  }

  testing::InitGoogleTest(&argc, argv);
  // Принудительно печатаем время работы тестов.
  testing::GTEST_FLAG(print_time) = true;
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Компилируем:

    cl /O2 /EHsc /I. std_string.cpp gtest-all.cc

Запускаем:

    [==========] Running 4 tests from 1 test case.
    [----------] Global test environment set-up.
    [----------] 4 tests from SortingStlString
    [ RUN      ] SortingStlString.StlString
    [       OK ] SortingStlString.StlString (203 ms)
    [ RUN      ] SortingStlString.StlStringPointer
    [       OK ] SortingStlString.StlStringPointer (0 ms)
    [ RUN      ] SortingStlString.String
    [       OK ] SortingStlString.String (891 ms)
    [ RUN      ] SortingStlString.StringPointer
    [       OK ] SortingStlString.StringPointer (0 ms)
    [----------] 4 tests from SortingStlString (1125 ms total)

    [----------] Global test environment tear-down
    [==========] 4 tests from 1 test case ran. (1125 ms total)
    [  PASSED  ] 4 tests.
    
Видно, что версии с указателями отработали примерно одинаково быстро, а вот при работе с объектами `std::string` обогнал самопальную реализацию в 4 раза - 203 мс против 891 мс.

Несложно понять, почему это так. `std::sort()` для перестановки элементов использует шаблонную функцию `std::swap()`, которая для `std::string` реализована так, чтобы делать перестановку без физического копирования данных. А для `String` все происходит банально через конструктор копирования и оператор присваивания.

В общем, для себя я вынес, что не надо городить свой огород, так как в большинстве случаев `std::string` решает все проблемы. Но возникает вопрос - как добавлять в `std::string` свою функциональность? Например, поиск слов.

Проблема в том, что у `std::string` деструктор объявлен как невиртуальный (может это сделано по соображениям эффективности), а наследование от класса с невиртуальным деструктором в C++ является не самой правильной затеей.

Автор STL [Александр Степанов][] в своем труде [Notes for the Programming course at Adobe][] советует реализовать дополнительную функциональность для стандартных контейнеров STL через шаблонные алгоритмы. Плюсов тут много, например, реализовав какой-то разбор строки через итераторы в виде шаблонной функции-алгоритма, можно автоматически получить её же для все остальных контейнеров, у которых есть такие же итераторы.

[Александр Степанов]: http://ru.wikipedia.org/wiki/%D0%A1%D1%82%D0%B5%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2,_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80_%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B0%D0%BD%D0%B4%D1%80%D0%BE%D0%B2%D0%B8%D1%87

[Notes for the Programming course at Adobe]: http://www.stepanovpapers.com/notes.pdf

Интересно, что пишет Степанов про свой взляд на то, как надо реализовывать функцию `length()` для контейнеров (в документе, ссылка на который дана выше, Степанов показывает шаг за шагом процесс создания эффективного контейнера):

*While we could make a member function to return length, it is better to make it a global friend function. If we do that, we will be able eventually to define the same function to work on built-in arrays and achieve greater uniformity of design. I made size into a member function in STL in an attempt to please the standard committee. I knew that begin, end and size should be global functions but was not willing to risk another fight with the committee.*

Он считает, что глобальная шаблонная функция `length()` - это правильнее, чем `length()` как член класса. Если б не комитет стандартизации - так оно и было бы в STL.

Итак, подытоживая сказанное, не стоит не доверять `std::string`. Для большинства задач этот класс решает все проблемы. Если надо добавить функциональность - это надо делать через реализацию шаблонного алгоритма.

Есть замечания или протесты? Прилагайте.

Посты по теме:

* [Александр Степанов, "Elements of Programming"][]

[Александр Степанов, "Elements of Programming"]: /blog/russian/2009/07/30/elements-of-programming/
