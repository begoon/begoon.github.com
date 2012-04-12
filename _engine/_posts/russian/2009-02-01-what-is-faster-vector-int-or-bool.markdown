---
layout: post
title: "Кто быстрее: vector<bool> или vector<int>"
language: russian
date: 2009-02-01 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/blog-post.html
categories:
- cplusplus
- benchmark
- russian
---
Я много раз слышал, что стандартный класс `std::vector`, специализированный для хранения типа `bool`, то есть `std::vector<bool>`, который по задумке создателей должен работать заметно быстрее своего смыслового аналога `std::vector<int>`, на самом деле нет так и хорош. Но тут, как говориться, бабушка на двое сказала, так как с одной стороны операция с базовым типом процессора `int` обычно является почти самой быстрой атомарной операцией, а другой стороны тип `bool` может быть упакован в тот же "быстрый" `int` пачкой по 32 или 64 штуки за раз, и можно оперировать сразу группой значений. В общем, целое поле для оптимизации.

Я люблю все проверять лично, так что привожу результаты своей проверки.

Итак, объект — программа нахождения простых чисел [Решето Эратосфена][]. Классический алгоритм для проверки на вшивость всяких оптимизаторов. На оригинальность и оптимальность кода не претендую.

[Решето Эратосфена]: http://ru.wikipedia.org/wiki/%D0%A0%D0%B5%D1%88%D0%B5%D1%82%D0%BE_%D0%AD%D1%80%D0%B0%D1%82%D0%BE%D1%81%D1%84%D0%B5%D0%BD%D0%B0

`era.cpp`:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>
#include <cmath>

int main(int argc, char* argv[]) {
  // Получаем предельное значение эксперимента из командной
  // строки. По умолчанию - 100. Это основной, влияющий
  // на время работы алгоритма, параметр.
  long n = argc > 1 ? std::atoi(argv[1]) : 100;
  // Корень квадратный из максимума, округленный до большего
  // целого.
  long sqrt_n = static_cast<long>(std::sqrt(static_cast<double>(n))) + 1;

  // Массив-вектор для хранения значений. Это центр внимания нашего
  // эксперимента. Макрос TYPE задает тип элементов вектора и должен
  // быть задан в опциях при компиляции: -DTYPE=int или
  // -DTYPE=bool соответственно.
  std::vector<TYPE> S(n, true);

  // Собственно, решето Эратосфена.
  for (int i = 2; i < sqrt_n; ++i)
    if (S[i])
      for (int j = i*i; j < n; j += i)
        S[j] = false;

  // Подсчет количество найденных простых чисел. Делаем это для
  // самопроверки.
  int count = 0;
  for (int i = 2; i < n; ++i)
    if (S[i])
      count++;

  // Печатаем найденное количество.
  std::cout << count << std::endl;

  return 0;
}
{% endcodeblock %}

Эксперимент я проводил на ноутбуке с процессором Core 2 1ГГц. Для конкретно этой машины я выбрал предел поиска в 10000000. При этом значении времена работы программы с одной стороны небольшие (удобно для повторения замеров), но другой стороны — весьма показательные.

Теперь компилятор. В забеге принимали участие:

* GNU g++ 3.4.4 (cygwin)
* Borland/Codegear bcc32.exe 5.93 (Codegear Studio 2007)
* Microsoft cl.exe 14.00 (Visual Studio 2005)
* Microsoft cl.exe 15.00 (Visual Studio 2008)

Операционная система Windows XP SP3.

Каждый компилятор получил свои максимально полные опции оптимизации на скорость, так как глупо говорить об эффективности программы на С++ без включенной оптимизации компилятора (ни тебе inline-функций, ни использования регистров процессора и т.д.) Но для целостности картины результаты без оптимизации тоже приведены (и будет позже ясно почему).

Для компилирования примера я сделал скрипт, которой компилирует исходную программу каждым компилятором по очереди с использованием типа `bool` и `int`, с оптимизацией и без. Итого по четыре варианта на каждый компилятор.

`build.cmd`:

{% codeblock lang:bash %}
bcc32 -DTYPE=bool -eera-bcc32-bool.exe era.cpp
bcc32 -DTYPE=int -eera-bcc32-int.exe era.cpp
bcc32 -O2 -DTYPE=bool -eera-bcc32-bool-opt.exe era.cpp
bcc32 -O2 -DTYPE=int -eera-bcc32-int-opt.exe era.cpp

g++ -DTYPE=bool -o era-g++-bool.exe era.cpp
g++ -DTYPE=int -o era-g++-int.exe era.cpp
g++ -O3 -funroll-all-loops -fomit-frame-pointer -mtune=nocona -DTYPE=bool -o era-g++-bool-opt.exe era.cpp
g++ -O3 -funroll-all-loops -fomit-frame-pointer -mtune=nocona -DTYPE=int -o era-g++-int-opt.exe era.cpp

call cl2008.cmd
cl /EHsc /DTYPE=bool /Feera-cl2008-bool.exe era.cpp
cl /EHsc /DTYPE=int /Feera-cl2008-int.exe era.cpp
cl /EHsc /arch:SSE2 /O2 -DTYPE=bool /Feera-cl2008-bool-opt.exe era.cpp
cl /EHsc /arch:SSE2 /O2 -DTYPE=int /Feera-cl2008-int-opt.exe era.cpp

call cl2005.cmd
cl /EHsc /DTYPE=bool /Feera-cl2005-bool.exe era.cpp
cl /EHsc /DTYPE=int /Feera-cl2005-int.exe era.cpp
cl /EHsc /arch:SSE2 /O2 -DTYPE=bool /Feera-cl2005-bool-opt.exe era.cpp
cl /EHsc /arch:SSE2 /O2 -DTYPE=int /Feera-cl2005-int-opt.exe era.cpp
{% endcodeblock %}

При скрипты `cl2005.cmd` и `cl2008.cmd` я уже [писал][Скрипты для Visual Studio].

[Скрипты для Visual Studio]: /blog/russian/2009/01/29/scripts-for-visual-studio-command-line/

После компиляции должны получиться 16 исполняемых файлов с сообразными именами.

Далее, запуск. Для этого можно использовать следующий скрипт (`run.cmd`).

{% codeblock lang:bash %}
ntimer -1 era-cl2005-bool.exe 10000000
ntimer -1 era-cl2005-int.exe 10000000
ntimer -1 era-cl2005-bool-opt.exe 10000000
ntimer -1 era-cl2005-int-opt.exe 10000000

ntimer -1 era-cl2008-bool.exe 10000000
ntimer -1 era-cl2008-int.exe 10000000
ntimer -1 era-cl2008-bool-opt.exe 10000000
ntimer -1 era-cl2008-int-opt.exe 10000000

ntimer -1 era-bcc32-bool.exe 10000000
ntimer -1 era-bcc32-int.exe 10000000
ntimer -1 era-bcc32-bool-opt.exe 10000000
ntimer -1 era-bcc32-int-opt.exe 10000000

ntimer -1 era-g++-bool.exe 10000000
ntimer -1 era-g++-int.exe 10000000
ntimer -1 era-g++-bool-opt.exe 10000000
ntimer -1 era-g++-int-opt.exe 10000000
{% endcodeblock %}

Для измерения времени работы я использовал программу [ntimer][]. Ее нужно скачать, распаковать и положить `ntimer.exe` в текущий каталог. Будучи запущенной с ключом "-1" эта программа печатает времена в одну строку. Нас интересует самое первое печатаемой ей время.

[ntimer]: /downloads/ntimer.zip

Барабанная дробь! Запускаем...

Таблица с временами работы (по порядку):

    Компилятор             Версия Тип элемента Оптимизация Время (сек.)
    ---------------------- ------ ------------ ----------- ------------
    Visual Studio 2005     14.00  bool         Выкл        23.750
    Visual Studio 2005     14.00   int         Выкл         1.750
    Visual Studio 2005     14.00  bool          Вкл         1.171
    Visual Studio 2005     14.00   int          Вкл         1.312
    Visual Studio 2008     15.00  bool         Выкл        23.062
    Visual Studio 2008     15.00   int         Выкл         1.703
    Visual Studio 2008     14.00  bool          Вкл         2.390
    Visual Studio 2008     14.00   int          Вкл         1.312
    Borland/Codegear 2007   5.93  bool         Выкл         8.375
    Borland/Codegear 2007   5.93   int         Выкл         1.296
    Borland/Codegear 2007   5.93  bool          Вкл         8.156
    Borland/Codegear 2007   5.93   int          Вкл         1.328
    gcc (cygwin)           3.4.4  bool         Выкл         4.640
    gcc (cygwin)           3.4.4   int         Выкл         3.109
    gcc (cygwin)           3.4.4  bool          Вкл         0.984
    gcc (cygwin)           3.4.4   int          Вкл         1.343

А теперь в отсортированном виде по возрастанию времени:

    Компилятор             Версия Тип элемента Оптимизация Время (сек.)
    ---------------------- ------ ------------ ----------- ------------
    gcc (cygwin)           3.4.4  bool          Вкл         0.984
    Visual Studio 2005     14.00  bool          Вкл         1.171
    Borland/Codegear 2007   5.93   int         Выкл         1.296
    Visual Studio 2005     14.00   int          Вкл         1.312
    Visual Studio 2008     14.00   int          Вкл         1.312
    Borland/Codegear 2007   5.93   int          Вкл         1.328
    gcc (cygwin)           3.4.4   int          Вкл         1.343
    Visual Studio 2008     15.00   int         Выкл         1.703
    Visual Studio 2005     14.00   int         Выкл         1.750
    Visual Studio 2008     14.00  bool          Вкл         2.390
    gcc (cygwin)           3.4.4   int         Выкл         3.109
    gcc (cygwin)           3.4.4  bool         Выкл         4.640
    Borland/Codegear 2007   5.93  bool          Вкл         8.156
    Borland/Codegear 2007   5.93  bool         Выкл         8.375
    Visual Studio 2008     15.00  bool         Выкл        23.062
    Visual Studio 2005     14.00  bool         Выкл        23.75

Итак, на первом месте `gcc` в режиме `bool` с оптимизацией. На втором месте Visual Studio снова в режиме `bool` и оптимизацией. Интересно выступил борландовый компилятор, получив третье место, причем без оптимизации. Так как априори борландовый `bcc32.exe` считается весьма посредственным компилятором в плане качества кода и оптимизатора, то полученное им третье место весьма и весьма странно.

Конечно, пытливый читатель сразу заметит, что я как-то очень лихо проскочил один очень важный вопрос, а именно — версию STL. Не могу поручиться, что каждый из этих компиляторов поставляется с абсолютно неизменной и, как принято считать, "стандартной" версией этой библиотеки. Каждая фирма что-то меняет всегда под себя.

В итоге, я так и не получил однозначного ответа на изначальный вопрос — пользоваться ли `std::vector<int>` вместо `std::vector<bool>` или нет. Слишком много побочных факторов. Поэтому я бы посоветовал, если вы встали перед такой же дилеммой в вашем проекте, провести эксперимент на месте с вашим конкретным компилятором, вашей версией STL, на вашей конкретной платформе и т.д., то есть с учетом всех ваших факторов. Можно использовать приведенные мной программы и скрипты. Если у вас будут интересные и неоднозначные результаты, пишите.
