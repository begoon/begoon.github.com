---
layout: post
title: "Скрипты на Lua в С++"
language: russian
date: 2009-06-12 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/06/lua.html
categories:
- cplusplus
- russian
---
[Lua][] отличный язык для встраеваемых сценариев. Продуманная структура языка, полный арсенал для процедурного и модульного программирования, а-ля функциональные возможности в виде функций-объектов и замыканий, работа со списками, кооперативная многопотоковость, зачатки объектно-ориентированности в достаточной мере для языка подобного рода, и вообще приятный синтаксис. Написан на стандартном С, поэтому отлично компилируется на разных платформах.

[Lua]: http://lua.org/

Есть великое множество оберток Lua для С++, но я не нашел ни одной, где не надо вообще вызывать С-шные функции Lua вручную из основной программы. Также для создания новых функций на С++, которые можно будет вызывать из Lua, должен быть только С++'ый подход.

Моя идея была в создании чисто плюсого интерфейса для Lua с максимально простой интеграцией в рабочий проект.

То, что пока вышло называется [luascript][].

[luascript]: http://code.google.com/p/luascript/

Для включения в свой проект надо скопировать библиотеку в подкаталог `luascript/` и добавить в проект два файла: `luascript/luascript.cpp` и `luascript/lua/lua-files.c`.

После этого можно писать вот такие куски кода:

{% codeblock lang:cpp %}
lua script;
script.set_variable<lua::string_arg_t>("a", "test");
script.exec("b = a .. '123';");
std::cout << script.get_variable<lua::string_arg_t>("b").value());
{% endcodeblock %}

Данный простой скрипт принимает строку через переменню `a`, добавляет к ней `123` и записывает результат в переменную `b`, которая потом подхватывается из С++.

Если надо добавить свою функцию, например, для проверки существования файла, можно написать так:

{% codeblock lang:cpp %}
class file_exists_func_t {
 public:
  // Регистрируем аргументы функции. В данном случае один аргумент типа "строка".
  static const lua::args_t* in_args() {
    lua::args_t* args = new lua::args_t();
    args->add(new lua::string_arg_t());
    return args;
  }

  // Регистрируем выходные параметры. В данном случае это просто bool.
  // Фукнция в Lua может возвращать не только одно значение, а несколько,
  // поэтому можно задать список типов выходных параметров.
  static const lua::args_t* out_args() {
    lua::args_t* args = new lua::args_t();
    args->add(new lua::bool_arg_t());
    return args;
  }

  // Задаем namespace и, собственно, имя фукнции. 
  // Получается "fs.file_exits()".
  static const std::string ns() { return "fs"; }
  static const std::string name() { return "file_exists"; }

  // Данный метод вычисляет значение функции.
  // Сначала надо разобрать входные параметры, вычислить функцию и
  // положить результы с массив выходных значений. Правильность
  // работы с типами аргументов, выходных данных и индексов в массивах,
  // их описывающих, лежит на плечах автора функции.
  static void calc(const lua::args_t& in, lua::args_t& out) {
    std::string filename = dynamic_cast<lua::string_arg_t&>(*in[0]).value();
    std::ifstream is(filename.c_str());
    dynamic_cast<lua::bool_arg_t&>(*out[0]).value() = is.good();
  }
};
...
try {
  // Создаем исполнителя скрипта.
  lua script;
  // Регистрируем нашу функцию "fs.file_exists()".
  script.register_function< file_exists_func_t >();
  // Устанавливаем переменную "fname" в "readme.txt".
  script.set_variable<lua::string_arg_t>("fname", "readme.txt");
  // Вызываем скрипт.
  script.exec("exists = fs.file_exists(fname);");
  // Получаем результат через переменную "exists".
  bool exists = script.get_variable<lua::bool_arg_t>("exists").value();
} catch (lua::exception& e) {
  std::cerr << "error: " << e.error() << ", line " << e.line();
}
{% endcodeblock %}

Что пока не поддерживается, так это параметры типа [таблица (хеш)][Lua Tables] для передачи их в функцию и получения их в качестве результата.

[Lua Tables]: http://www.lua.org/manual/5.1/manual.html#2.5.7

В каталоге `lib` лежат несколько мини примеров на Lua. Например, вот так можно вызвать внешнюю функцию для `base64` кодирования или декодирования:

{% codeblock lang:cpp %}
lua script;
script.exec("package.path = package.path .. ';./lib/?.lua'");
script.exec("require('base64'); a = base64.encode('test');");
// Данный пример напечатает "dGVzdA==".
std::cout << script.get_variable<lua::string_arg_t>("a").value();
{% endcodeblock %}

[Исходники][] доступны для просмотра в онлайне, или через [Mercurial][].

[Исходники]: http://code.google.com/p/luascript/source/browse/
[Mercurial]: http://code.google.com/p/luascript/source/checkout

Сборка.

Пока я проверял только в Студии 2008. [Тестовый проект][] включает в себя библиотеку, [lua 5.1.4][], Google Test 1.3.0 и несколько тестов, чтобы почувствовать вкус библиотеки. Все в одном флаконе.

[Тестовый проект]: http://luascript.googlecode.com/files/luascript-0.0.1.zip
[lua 5.1.4]: http://www.lua.org/ftp/lua-5.1.4.tar.gz

Те, у кого есть [SCons][], могут собрать, набрав `scons -Q`. У кого нет, могут запустить скрипт `compile-vs2008.cmd`. Собранный runner для тестов `luascript_unittest_vs2008.exe` должен работать без ошибок. Посмотрев сами тесты в файле `luascript_unittest.cpp` можно в целом понять, как работать с библиотекой. Документация, конечно, будет, но пока так.

[SCons]: http://www.scons.org/

Общие замечания.

Забавно, в этих исходниках я попытался в качестве эксперимента максимально работать по [стандарту кодирования Google][Google C++ Coding Standard]. Из основного, что затронуло лично меня, это:

* Отступ в 2 пробела (естественно, никаких табов). Для слов `public`, `protected`, `private` отступ в один пробел.
* Максимальная экономия вертикального места (по возможности не лепить лишних пустых строк).
Открывающая скобка `{` практически всегда на той же строке (для классов, функций, циклов, условий и т.д.). Я раньше так не делал для классов и функций.
* Никаких `cast`'ов в стиле С, даже для элементарных типов. Только приведения в стиле С++. Мне это очень нравится.
* Забота о длинных строках. Как только можно избегать строк длинее 80 символов.
В именах закрытых членов класса использовать не "__" в качестве префикса, а "_" в качестве суффикса.

Это был снова эксперимент на Google Code и в opensource'e в целом. Если честно, то выкладывание исходников на публику страшно оздоравливает код, причем по всем статьям.

Данный проект не такой сухой как ранее выложенный [SerialCom][Хостинг на Google Code: SerialCom]. Я с ним более менее активно работаю, так что должны быть точно улучшения. На работе, например, я его примастырил для гибко сконфирурированного фильтрования при журналировании. Есть, конечно, проблемы с производительностью (интерпретатор, все-таки, хоть и с виртуальной машиной), но есть пути улучшения.

Посты и ссылки по теме:

* [Хостинг на Google Code: SerialCom][]
* [Стандарт кодирования для С++ от Google][Google C++ Coding Standard]

[Google C++ Coding Standard]: http://google-styleguide.googlecode.com/svn/trunk/cppguide.xml
[Хостинг на Google Code: SerialCom]: /blog/russian/2009/06/07/googlecode-hosting-serialcom/
