---
layout: post
title: "Тест: что дано, при каком условии, что требуется доказать"
language: russian
date: 2012-04-23 23:07
comments: true
categories: 
- russian
- testing
---
После тренинга [Кевлина Хенни][Programming with GUTs], я понял, что отсутствие под рукой удобной библиотеки для unit тестирования не является причиной его не использовать. Макрос `assert`, который есть везде, является достаточным условием для использования тестов.

[Programming with GUTs]: http://demin.ws/blog/russian/2010/04/28/programming-with-guts/

Например, есть мини-проект в один файл, и не охота тащить Google Test или cmockery. Я обычно делаю что-то такое:

{% codeblock lang:cpp %}
#include <cassert>

void foo(...) {
  // something
}

...

#ifdef UNIT_TESTING
void Test_for_a_particular_use_case() {
  // Initialization
  ...
  assert(condition_1);
  ...
  assert(condition_N);
}
...
int main(...) {
  Test_for_a_particular_use_case();
  std::cout << “All tests passed.” << std::endl;
  return 0;
}

#else

int main(...) {
  // a proper main
}

#endif
{% endcodeblock %}

Тут, конечно, не так удобно, так как иногда забываешь добавить запуск теста в `main()`, и вроде как бы все работает, но на самом деле просто тест не запускается.

Но! Все это мелочи, по сравнению с удобством, которое дают тесты.

### P.S.

Кстати, заметил за собой интересую привычку. Практически всегда, когда пишу функцию, работающую с файлами, всегда рождаются две, например:

{% codeblock lang:cpp %}
void FunctionDoingSomethingFromStream(std::istream* is) {
  ...
}

void FunctionDoingSomethingFromFile(const std::string& filename) {
  std::ifstream is(filename);
  return FunctionDoingSomethingFromStream(&is);  
}
{% endcodeblock %}

Первая функция прекрасно тестируется, так как ей можно подсунуть `std::istringstream` с тестовыми данными. Вторую же можно практически не тестировать (ну разве что на фазе QA, на реальных файлах, но не в unit-тестах в процессе сборки).

Еще интересный приемчик от Кевина Хенни. У теста обычно есть объект тестирования (класс или функция), начальное условие (pre-condition) и конечное состояние (post-condition). И данные фазы удобно подчеркнуть в комментариях словами “Given”, “When” и “Then”, например:

{% codeblock lang:cpp %}
void Test_for_a_particular_use_case_to_check() {
  // Given:
  ClassToTest a;
  // When:
  a.do_this(...);
  a.do_that(...);
  a.setup_something(...);
  // Then:
  assert(condition_1);
  ...
  assert(condition_N);
}
{% endcodeblock %}

Явное разделение этих фаз провоцирует правильную структуру теста: без циклов и условий, и работа только по одному сценарию (для другого сценария будет другой тест).

&#9632;
