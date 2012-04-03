---
layout: post
title: "Шестнадцатеричная печать в STL поток"
language: russian
date: 2009-02-14 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/stl_14.html
categories:
- cplusplus
- stl
- russian
---
Когда-то очень давно я написал элементарный манипулятор для шестнадцатеричной печати в стандарный поток. Все просто и тривиально. Но тем не менее я заметил, что таскаю этот микрокласс почти в кажный проект, где нужна отладочная печать. Обычно для шестнадцатеричной печати надо указывать сразу несколько итераторов, типа:

{% codeblock lang:cpp %}
std::cout << std::hex << std::uppercase << std::setfill('0') << std::setw(2) << 0xAA;
{% endcodeblock %}

Причем `std::setw()` надо повторять для каждого нового выводимого элемента. Я свел все это в один итератор, чтобы можно было просто написать (указав итератору ширину выводимого поля):

{% codeblock lang:cpp %}
std::cout << ext::Hex(2) << 0xAA;
{% endcodeblock %}

Итак, класс `Hex` (название пространства имен можно подкрутить по вкусу), файл `hex.h`:

{% codeblock lang:cpp %}
#ifndef _EXT_HEX_H
#define _EXT_HEX_H

#include <iostream>
#include <iomanip>

namespace ext {

class Hex {
public:
  Hex(int width) : __width(width) {}
  friend std::ostream& operator<< (std::ostream& os, const Hex& hex);
private:
  int __width;
};

inline std::ostream& operator<< (std::ostream& os, const Hex& hex) {
  std::hex(os);
  std::uppercase(os);
  os.width(hex.__width);
  os.fill('0');
  return os;
}

} // ext

#endif // _EXT_HEX_H
{% endcodeblock %}

Теперь можно писать так:

{% codeblock lang:cpp %}
std::cout << ext::Hex(0)  << 0x0a << std::endl;
std::cout << ext::Hex(1)  << 0x0a << std::endl;
std::cout << ext::Hex(1)  << 0xaa << std::endl;
std::cout << ext::Hex(2)  << 0xaa << std::endl;
std::cout << ext::Hex(4)  << 0xaa << std::endl;
std::cout << ext::Hex(8)  << 0x0a << std::endl;
std::cout << ext::Hex(16) << 0x0a << std::endl;
std::cout << ext::Hex(32) << 0x0a << std::endl;
{% endcodeblock %}

И результатом будет:

    A
    A
    AA
    AA
    00AA
    0000000A
    000000000000000A
    0000000000000000000000000000000A

На всякий случай, unit-тест. Чтобы не было сюрпризов при обновлении компилятора, STLport или чего-то еще. Тест всегда проверит, работает ли класс так, как вы от него ждете. Вы можете возразить — ну класс-то выеденного яйца не стоит, а тут для него тесты... Соглашусь. А еще я соглашусь, что сотни раз самые казалось бы ненужные на первый взгляд тесты для "очевидных" классов помогали обнаружить глюки на новой версии системных библиотек, новой версии компилятора, использовании "более мощных" параметров оптимизации и т.д. Время на написание тестов всегда окупается сполна, всегда. 

Традиционно, для компиляции тестов нам нужна [Google Test Framework][]. Как я уже [писал][Unit-тестирование для параллельных потоков], вы можете скачать [мою модификацию][GoogleTest 1.2.1]  этой библиотеки, которая сокращена до двух необходимых файлов `gtest/gtest.h` и `gtest-all.cc`.

[Google Test Framework]: http://code.google.com/p/googletest/
[GoogleTest 1.2.1]: /downloads/gtest-amalgamation-1.2.1.zip

Файл `hex_unittest.cpp`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"
#include "hex.h"
#include <sstream>

void testHex(int n, int w, const std::string& etalon) {
  std::stringstream fmt;
  fmt << ext::Hex(w) << n;
  EXPECT_EQ(etalon, fmt.str());
}

TEST(HexManip, Generic) {
  testHex(0x0A, 0, "A");
  testHex(0x0A, 1, "A");
  testHex(0xAA, 1, "AA");
  testHex(0xAA, 2, "AA");
  testHex(0xAA, 4, "00AA");
  testHex(0xAA, 8, "000000AA");
  testHex(0xAA, 16, "00000000000000AA");
  testHex(0xAA, 32, "000000000000000000000000000000AA");
}
Ну и головная программа:
#include "gtest/gtest.h"
int main(int argc, char* argv[]) {
  testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Компилируем.

Visual Studio:

    cl /EHsc /I. /Fehex_unittest_vs2008.exe runner.cpp hex_unittest.cpp gtest\gtest-all.cc

Cygwin:

    g++ -I. -o hex_unittest_cygwin.exe runner.cpp hex_unittest.cpp gtest/gtest-all.cc

Запускаем:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from HexManip
    [ RUN      ] HexManip.Generic
    [       OK ] HexManip.Generic
    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran.
    [  PASSED  ] 1 test.

Работает как положено.

При использовании `Hex` у себя в проекте не забудьте включить файл `hex_unittest.cpp` в ваш набор unit-тестов. Оберегите себя от ненужной траты времени в будущем.

Под занавес пара слов о производительности. Очевидно, что если вы выводите в поток десятки тысяч шестнадцатеричных чисел подряд, то разумнее будет использовать стандартные итераторы — настроить поток с помощью `std::hex`, `std::uppercase` и `std::setfill`, а потом вызывать только `std::setw` для каждого нового элемента. Но если вы печатаете разнородные данные, что часто требуется при отладке, то тогда итератор `Hex` будет в самый раз.

Другие посты по теме:

* [Unit-тестирование для параллельных потоков][]

[Unit-тестирование для параллельных потоков]: /blog/russian/2009/01/28/unit-testing-concurrent-threads/

