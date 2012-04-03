---
layout: post
title: "Unit-тестирование в языке С"
language: russian
date: 2009-03-01 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/unit.html
categories:
- testing
- cmockery
- russian
---
По роду работы мне приходится работать с огромным количеством кода на С, причем чаще всего — это старый код, написанный много лет назад, и написан он без каких-либо намеков на тестирование, увы.
Исправляя в таком коде ошибки, внося какие-то изменения, хочется какой-то гармонии с самим собой, а именно — иметь возможность тестировать, тем самым уменьшить вероятность повторного внесения ошибок. Пусть уж полностью старый код остается без тестов, но раз уж я что-то меняю, я хочу подкрепить свои изменения тестами.

Мир языка С++ не такой дружественный к тестированию, как например, мир Java, C# или мир интерпретаторов. Главная причина — крайне слабый механизм интроспекции, то есть возможности исследования двоичного кода в плане получения информации о структуре исходных текстов. В Java, например, есть `Reflection`, с помощью которого можно прямо на основе скомпилированных классов создать тестовую среду (понять иерархию классов, типа аргументов и т.д.). В С++ приходится многое закладывать в исходный текст на этапе его создания, чтобы облегчить будущее тестирование.

А что же мы имеем в С? Тут, как мне кажется, разрыв в удобстве тестирования по отношению к С++ в разы больше, чем между С++ и Java, например. Причин море: процедурная модель вместо объектно-ориентированной, отсутствие интроспекции вообще, крайне слабая защита при работе с памятью и т.д.

Но шансы все же остались. Я начал поиск готовых библиотек для unit-тестирования в С. Например, есть библиотека [MinUnit][], длиной в четыре строки. Вполне жизненно. Следующий вполне себе вариант — это [CUnit][]. Тут даже есть продвинутый консольный интерфейс.

[MinUnit]: http://www.jera.com/techinfo/jtns/jtn002.html
[CUnit]: http://cunit.sourceforge.net/

Перебрав еще несколько вариантов, я остановился на гугловской библиотеке [cmockery][]. Мне понравилось, что библиотека, несмотря на весьма сложный код, успешно компилируются не только в Visual Studio и GNU C, но и “родными” компиляторами AIX, HP-UX, SunOS и некоторых других экзотических зверей. Также библиотека умеет отлавливать утечки памяти, неправильную работу с распределенными кусками памяти (так называемые buffer over- и under- run). Еще в `cmockery` есть зачатки mock-механизмов, то есть когда задаются предполагаемые сценарии выполнения тестируемого блока, и потом результаты тестового прогона сверяются с предполагаемым сценарием. Mock-возможности я не буду пока рассматривать в данной статье. Про это стоит написать отдельно.

[cmockery]: http://code.google.com/p/cmockery/

На текущий момент актуальной версией `cmockery` является [0.1.2][cmockery 0.1.2]. Из всего архива реально нужны только два файла: `cmockery.c` и `cmockery.h`. Можно, конечно, собрать библиотеку как положено, в двоичном виде, но я предпочитаю работать всегда с исходными текстами, благо компилируется очень быстро (это ж не С++).

[cmockery 0.1.2]: http://cmockery.googlecode.com/files/cmockery-0.1.2.tar.gz

Желающие, могут скачать [мою сборку][Моя сборка cmockery]  cmockery. В этом архиве только необходимые два файла `cmockery.c` и `cmockery.h`. Также в файл `cmockery.h` я внес небольшое изменение, связанное к тем, что функция `IsDebuggerPresent()` почему-то явно объявлена в заголовочных файлах только в Visual Studio 2008. Для студии 2003 и 2005 надо вручную объявлять прототип, иначе при линковке вылезает сообщение:

    error LNK2019: unresolved external symbol _IsDebuggerPresent referenced in function __run_test

Я отрапортовал об этом досадном недочете авторам, и пока новый релиз cmockery не вышел, можно пользоваться моей сборкой, которая без предупреждений компилируются в любой студии.

[Моя сборка cmockery]: /downloads/cmockery-0.1.2-vs.zip

Теперь пример реального использования `cmockery`.

Я долго выбирал то, на чем можно хоть как-то наглядно продемонстрировать unit-тестирование в С. В итоге я остановился на библиотеке для работы со строками. Эта библиотека реализует так называемые строки с длинной. То есть надо для кода на С дать более менее удобный интерфейс для манипулированию строками, которые хранят внутри себя длину.

Основа библиотеки была написана весьма давно, и много раз переписывалась практически с нуля, но я все еще использую ее в некоторых проектах.

Естественно, я не буду приводить всю библиотеку. Во-первых, она весьма тривиальна и вся ее "фишка" состоит в удобности работы, нежели в какой-то особо хитрой и заумной реализации. Во-вторых, полный ее исходный текст весьма объемен. Я выбрал небольшой ее фрагмент, но его тестирование позволяет почувствовать дух тестирования в С.

Итак, библиотека `cstring`. Тут можно создавать в некоторые "объекты", реализованные через структуры, которые представляют собой "строки". Такая "строка" может создаваться либо в стеке (автоматическая переменная), либо в куче. Также предоставляется набор разнообразных базовых функций: определение длины, копирование, склейка, интерфейс со строками языка С `(char *)` и т.д. Как я уже сказал, для демонстрации системы тестирования я оставил только несколько функций.

Заголовочный файл `cstring.h`:

{% codeblock lang:cpp %}
#ifndef _CSTRING_H
#define _CSTRING_H

#define _decl_string_t(N) \
struct {                  \
  int sz;                 \
  char data[N];           \
}

typedef _decl_string_t(1) string_t;

/**
 * Объявление строки в форме автоматической переменной в стеке.
 * Длина строки инициализируется нулем.
 */
#define decl_string_t(name, size) _decl_string_t(size) name = { 0 }

/**
 * Создание новой строки в куче.
 */
string_t* string_new(int sz);

/* Трюк с дублированием имен функций, начинающихся с символа '_'
 * требуется для подавление предупреждений компилятора о преобразовании
 * типов.
 */

/**
 * Удаление строки из кучи.
 */
#define string_delete(str) _string_delete((string_t*)str)
void _string_delete(string_t* str);

/** 
 * Текущая длина строки.
 */
#define string_length(str) _string_length((const string_t*)str)
int _string_length(const string_t* str);

/**
 * Изменение длины строки.
 */
#define string_resize(str, sz) _string_resize((string_t*)str, sz)
int _string_resize(string_t* str, int sz);

/**
 * Копирование строки из строки С, завершающейся нулем.
 */
#define string_from_c_str(dst, src) _string_from_c_str((string_t*)dst, src)
string_t* _string_from_c_str(string_t* dst, const char* src);

/**
 * Добавление символа в строку.
 */
#define string_append_ch(str, ch) _string_append_ch((string_t*)str, ch)
string_t* _string_append_ch(string_t* str, char ch);

/**
 * Превращение строки в строку С без добавления нуля на конце.
 */
#define string_data(str) str->data

/**
 * Превращение строки в строку С с нулем на конце.
 */
#define string_c_str(str) _string_c_str((string_t*)str)
char* _string_c_str(string_t* str);

#endif
{% endcodeblock %}

Файл `cstring.c`:

{% codeblock lang:cpp %}
#include <stdlib.h>

#include "cstring.h"

/**
 * Подготовительная площадка для тестирования.
 * Если задан макрос UNIT_TESTING, то функции работы с кучей подменяются
 * на тестовые.
 */
#if UNIT_TESTING
extern void* _test_malloc(const size_t size, const char* file, const int line);
extern void* _test_calloc(const size_t number_of_elements, const size_t size,
                          const char* file, const int line);
extern void _test_free(void* const ptr, const char* file, const int line);

#define malloc(size) _test_malloc(size, __FILE__, __LINE__)
#define calloc(num, size) _test_calloc(num, size, __FILE__, __LINE__)
#define free(ptr) _test_free(ptr, __FILE__, __LINE__)
#endif // UNIT_TESTING

/**
 * Создание новой строки в куче. Трюк "sizeof(string_t)" используется, чтобы
 * правильно отработать ситуацию, если из-за выравнивания между элементами
 * структуры string_t 'sz' и 'data' вдруг появится промежуток.
 */ 
string_t* string_new(int sz) {
  return malloc(sizeof(string_t) + sz - 1);
}

/**
 * Удаление строки из кучи.
 */
void _string_delete(string_t* str) {
  free((void *)str);
}

/**
 * Текущая длина строки.
 */
int _string_length(const string_t* str) {
  return str->sz;                                                                                        
}

/**
 * Изменение длины строки.
 */
int _string_resize(string_t* str, int sz) {
  return str->sz = sz;
}

/**
 * Копирование строки из строки С, завершающейся нулем.
 */
string_t* _string_from_c_str(string_t* dst, const char* src) {
  int sz = strlen(src);
  memcpy(dst->data, src, sz);
  dst->sz = sz;
  return dst;
}

/**
 * Добавление символа в строку.
 */
string_t* _string_append_ch(string_t* str, char ch) {
  str->data[str->sz++] = ch;
  return str;
}

/**
 * Превращение строки в строку С с нулем на конце. Фактически,
 * в тело строки добавляется ноль и возвращается указатель на данные.
 */
char* _string_c_str(string_t* str) {
  str->data[str->sz] = 0;
  return string_data(str);
}
{% endcodeblock %}

Как вы заметили, в коде есть специальный блок, ограниченный макросом `UNIT_TESTING`. Ничего не поделаешь, в языке С приходится "готовить" код к потенциальному тестированию и вставлять фрагменты, позволяющие тестовой среде работать с этим кодом. Этот блок, если задан макрос `UNIT_TESTING`, переопределяет функции работы с кучей, чтобы можно было перехватывать их вызовы. Подменяющие функции `_test_malloc()`, `_test_calloc()` и `_test_free()` предоставляются библиотекой `cmockery`.

Теперь файл тестов `cstring_unittest.c`:

{% codeblock lang:cpp %}
#include <stdarg.h>
#include <stddef.h>
#include <setjmp.h>
#include <cmockery.h>

#include "cstring.h"

/**
 * Тестируем декларацию строки длиной 20 в виде автоматической
 * переменной, добавляем в нее два символа, обрезаем строку
 * до длины в один байт и проверяем, добавился ли 0 при преобразовании
 * в строку С.
 */
void string_c_str_test(void **state) {
  decl_string_t(a, 20);
  a.data[0] = 'a';
  a.data[1] = 'b';
  a.sz = 1;
  assert_memory_equal("a\0", string_c_str(&a), 2);
}

/**
 * Тестируем изменение длины строки.
 */
void string_resize_test(void **state) {
  decl_string_t(a, 20);
  a.sz = 2;
  string_resize(&a, 1);
  assert_int_equal(1, string_length(&a));
}

/**
 * Тестируем добавление символа путем сравнения со строками С
 */
void string_append_ch_test(void **state) {
  decl_string_t(a, 20);
  assert_string_equal("", string_c_str(&a));
  assert_string_equal("a", string_c_str(string_append_ch(&a, 'a')));
  assert_string_equal("ab", string_c_str(string_append_ch(&a, 'b')));
}

/**
 * Тестируем декларацию строки в виде автоматической переменной.
 * Длина строки сразу после декларации должна быть нулевой.
 */
void string_declare_test(void **state) {
  decl_string_t(a, 20);
  assert_int_equal(0, string_length(&a));
}

/**
 * Тестируем размещение новой строки в куче и ее удаление из нее.
 */
void string_heap_allocation_test(void **state) {
  string_t* a = string_new(20);
  string_delete(a);
}

/**
 * Тестируем копирование строки из строки С с нулем на конце.
 */
void string_from_c_str_test(void **state) {
  string_t* a = string_new(8);
  string_from_c_str(a, "12345678");
  assert_int_equal(8, string_length(a));
  string_delete(a);
}

/**
 * Создаем список тестов и запускаем их.
 */
int main(int argc, char* argv[]) {
  const UnitTest tests[] = {
    unit_test(string_declare_test),
    unit_test(string_c_str_test),
    unit_test(string_append_ch_test),
    unit_test(string_heap_allocation_test),
    unit_test(string_from_c_str_test),
    unit_test(string_resize_test),
  };
  return run_tests(tests);
}
{% endcodeblock %}

Схема очень похожа на любое другое [xUnit][] тестирование: каждый тест проверяет какой-то один функциональный элемент, тесты объединяются в группы и запускаются автоматически все вместе. Правда, из-за ограничений языка С каждый тест приходится вручную добавлять в список запуска, увы. 

[xUnit]: http://en.wikipedia.org/wiki/Unit_testing

Как я уже сказал, для компиляции потребуются файлы `cmockery.c` и `cmockery.h` (см. выше). Эти файлы можно положить в текущий каталог. 

Компилируем в Visual Studio:

    cl /DUNIT_TESTING /I. cstring_unittest.c cstring.c cmockery.c

Если все скомпилировалось нормально, то запускаем файл `cstring_unittest`:

    string_declare_test: Starting test
    string_declare_test: Test completed successfully.
    string_c_str_test: Starting test
    string_c_str_test: Test completed successfully.
    string_append_ch_test: Starting test
    string_append_ch_test: Test completed successfully.
    string_heap_allocation_test: Starting test
    string_heap_allocation_test: Test completed successfully.
    string_from_c_str_test: Starting test
    string_from_c_str_test: Test completed successfully.
    string_resize_test: Starting test
    string_resize_test: Test completed successfully.
    All 6 tests passed

Все тесты отработали правильно. 

Но неинтересно, когда все работает. Внесем в тест библиотеки "случайные ошибки". Каждую из них можно спокойно допустить непреднамеренно. Строки с ошибками я пометил комментариями со словом "ОШИБКА (!)". Посмотрим, как `cmockery` справится с этим. 

Файл `cstring.c` с "ошибками":

{% codeblock lang:cpp %}
#include <stdlib.h>

#include "cstring.h"

/**
 * Подготовительная площадка для тестирования.
 * Если задан макрос UNIT_TESTING, то функции работы с кучей подменяются
 * на тестовые.
 */
#if UNIT_TESTING
extern void* _test_malloc(const size_t size, const char* file, const int line);
extern void* _test_calloc(const size_t number_of_elements, const size_t size,
                          const char* file, const int line);
extern void _test_free(void* const ptr, const char* file, const int line);

#define malloc(size) _test_malloc(size, __FILE__, __LINE__)
#define calloc(num, size) _test_calloc(num, size, __FILE__, __LINE__)
#define free(ptr) _test_free(ptr, __FILE__, __LINE__)
#endif // UNIT_TESTING

/**
 * Создание новой строки в куче. Трюк "sizeof(string_t)" используется, чтобы
 * правильно отработать ситуацию, если из-за выравнивания между элементами
 * структуры string_t 'sz' и 'data' вдруг появится промежуток.
 */ 
string_t* string_new(int sz) {
  return malloc(sizeof(string_t) + 1 - 1); // (ОШИБКА!) "Неверная" длина.
}

/**
 * Удаление строки из кучи.
 */
void _string_delete(string_t* str) {
  // (ОШИБКА!) "Забыли" вызвать free().
}

/**
 * Текущая длина строки.
 */
int _string_length(const string_t* str) {
  return str->sz;                                                                                        
}

/**
 * Изменение длины строки.
 */
int _string_resize(string_t* str, int sz) {
  return str->sz;  // (ОШИБКА!) "Забыли" уменьшить длину строки.
}

/**
 * Копирование строки из строки С, завершающейся нулем.
 */
string_t* _string_from_c_str(string_t* dst, const char* src) {
  int sz = strlen(src);
  memcpy(dst->data, src, sz);
  // (ОШИБКА!) "Забыли" присвоить длине новое значение.
  return dst;
}

/**
 * Добавление символа в строку.
 */
string_t* _string_append_ch(string_t* str, char ch) {
  str->data[str->sz] = ch; // (ОШИБКА!) "Забыли" увеличить длину.
  return str;
}

/**
 * Превращение строки в строку С с нулем на конце. Фактически,
 * в тело строки добавляется ноль и возвращается указатель на данные.
 */
char* _string_c_str(string_t* str) {
  // (ОШИБКА!) "Забыли" добавить 0 в конец.
  return string_data(str);
}
{% endcodeblock %}

Компилируем и запускаем:

    string_declare_test: Starting test
    string_declare_test: Test completed successfully.
    string_c_str_test: Starting test
    difference at offset 1 0x00 0x62
    1 bytes of 0x0040f014 and 0x0012fe7c differ
    ERROR: cstring_unittest.c:19 Failure!
    string_c_str_test: Test failed.
    string_append_ch_test: Starting test
    "ab" != "b"
    ERROR: cstring_unittest.c:39 Failure!
    string_append_ch_test: Test failed.
    string_heap_allocation_test: Starting test
    Blocks allocated...
      0x00326ee0 : cstring.c:27
    ERROR: string_heap_allocation_test leaked 1 block(s)
    string_heap_allocation_test: Test failed.
    string_from_c_str_test: Starting test
    Blocks allocated...
      0x00326ee0 : cstring.c:27
    Guard block of 0x00326f18 size=8 allocated by cstring.c:27 at 0x00326f20 is corrupt
    ERROR: cmockery.c:1379 Failure!
    string_from_c_str_test: Test failed.
    string_resize_test: Starting test
    0x1 != 0x2
    ERROR: cstring_unittest.c:29 Failure!
    string_resize_test: Test failed.
    5 out of 6 tests failed!
        string_c_str_test
        string_append_ch_test
        string_heap_allocation_test
        string_from_c_str_test
        string_resize_test
    Blocks allocated...
      0x00326ee0 : cstring.c:27
    Guard block of 0x00326f18 size=8 allocated by cstring.c:27 at 0x00326f20 is corrupt
    ERROR: cmockery.c:1379 Failure!

Бам! 5 из 6 тестов сломаны. Проанализируем полученное. 

Тест `string_c_str_test` выявил, что функция `string_c_str` не добавила 0 в конец строки, хотя должна была:

    string_c_str_test: Starting test
    difference at offset 1 0x00 0x62
    1 bytes of 0x0040f014 and 0x0012fe7c differ
    ERROR: cstring_unittest.c:19 Failure!
    string_c_str_test: Test failed.

Тест `string_append_ch_test` выявил, что функция добавления символа в конец строки не работает:

    string_append_ch_test: Starting test
    "ab" != "b"
    ERROR: cstring_unittest.c:39 Failure!
    string_append_ch_test: Test failed.

Тест `string_heap_allocation_test` выявил, что у нас имеется неосвобожденный блок памяти (утечка?). Конечно, мы же "забыли" освободить память в функции `string_delete()`:

    string_heap_allocation_test: Starting test
    Blocks allocated...
      0x00326ee0 : cstring.c:27
    ERROR: string_heap_allocation_test leaked 1 block(s)
    string_heap_allocation_test: Test failed.

Тест `string_from_c_str_test` выявил, что мы "вылезли" за границы выделенного куска памяти. Мы записали что-то мимо. Это болезненная ошибка. Конечно, `cmockery` не всегда может находить такие ляпы. Например, если переменная выделена с стеке, а не в куче, то проблема не вскроется. Тут уже помогут только динамические отладчики типа [valgrind][]:

[valgrind]: http://valgrind.org/

    string_from_c_str_test: Starting test
    Blocks allocated...
      0x00326ee0 : cstring.c:27
    Guard block of 0x00326f18 size=8 allocated by cstring.c:27 at 0x00326f20 is corrupt
    ERROR: cmockery.c:1379 Failure!
    string_from_c_str_test: Test failed.

Тест `string_resize_test` показал, что функция изменения размера строки не работает как положено:

    string_resize_test: Starting test
    0x1 != 0x2
    ERROR: cstring_unittest.c:29 Failure!
    string_resize_test: Test failed.

В целом, очень неплохие результаты. 

Теперь представьте, что вы решили переписать реализацию библиотеки под новый процессор, чтобы работало в десять раз быстрее. Но как проверить результат? Элементарно. Запустите старые тесты. Если они работают, то по крайней мере с большой вероятностью вы не сломали старую функциональность. И, кстати, чем более тщательно написаны тесты, тем более ценны они. Чем более критична какая часть системы для стабильности системы в целом (например, библиотека строк или каких-то базовых контейнеров), тем более тщательно они должны быть покрыты тестами.

Конечно, уровень комфорта при написании тестов на С и их отладке очень далек даже от С++, но это не может быть оправданием для отказа от тестирования. Честно могу сказать, часто результатом работы "сломанного" теста в С, который неверно работает с памятью, например, может является просто зависание, а не красивый отчет, что тест "не работает". Но даже такой "знак" очень важен и дает понять, что что-то сломано. Пусть лучше повиснет тест, нежели готовый продукт у заказчика. 

Под занавес приведу список основных функций-проверок (`assert`-фукнции), которые доступны в `cmockery`:

* `assert_true()`, `assert_false()` — проверка булевых флагов 
* `assert_int_equal()`, `assert_int_not_equal()` — сравнение для типа `int`
* `assert_string_equal()`, `assert_string_not_equal()` — сравнение для типа `char*` (для С-строк, заканчивающихся нулем) 
* `assert_memory_equal()`, `assert_memory_not_equal()` — сравнение кусков памяти 
* `assert_in_range()`, `assert_not_in_range()` — проверка нахождения числа в указанном интервале 
* `assert_in_set()`, `assert_not_in_set()` — проверка нахождения строки `(char*)` среди заданного набора строк 
* `fail()` — безусловное завершения теста с ошибкой

**Вывод**

Unit-тестирование в С порой сопряжено с трудностями, но оно возможно. И нет причин от него отказываться.
