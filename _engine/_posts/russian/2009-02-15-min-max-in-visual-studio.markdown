---
layout: post
title: "std::min() и std::max() в Visual Studio"
language: russian
date: 2009-02-15 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/stdmin-stdmax-visual-studio.html
categories:
- cplusplus
- visual studio
- russian
---
Простейший кусок кода (файл `minmax.cpp`):

{% codeblock lang:cpp %}
#include <algorithm>
int main() {
  int a = std::min(10, 20);
  return 0;
}
{% endcodeblock %}

Все тривиально и отлично компилируется и в Visual Studio, и в CodeGear/Borland Studio, и Cygwin. Но допустим потребовались какие-то функции из Windows API, и вы подключили файл `windows.h`:

Теперь компиляция в Visual Studio (я проверял в 2005 и 2008) будет падать со следующей ошибкой:

    minmax.cpp
    minmax.cpp(4) : error C2589: '(' : illegal token on right side of '::'
    minmax.cpp(4) : error C2059: syntax error : '::'

Постановка `#include <windows.h>` до `#include <algorithm>` проблемы не решает.

Очевидно, проблема в том, что кто-то переопределил значение слова min. Запустим препроцессор и проверим догадку:

    cl /P minmax.cpp

И что мы видим? А видим мы следующее (фрагмент файла `minmap.i`):

{% codeblock lang:cpp %}
#line 7 "minmax.cpp"
int main() {
  int a = std::(((10) < (20)) ? (10) : (20));
  return 0;
}
{% endcodeblock %}

Естественно, это каша с точки зрения синтаксиса, и компилятор ругается совершенно законно. 
Покопавшись в заголовочных файлах Windows SDK, в файле `WinDef.h`, который косвенно подключается через `windows.h`, я нашел корень зла:

{% codeblock lang:cpp %}
#ifndef NOMINMAX

#ifndef max
#define max(a,b)            (((a) > (b)) ? (a) : (b))
#endif

#ifndef min
#define min(a,b)            (((a) < (b)) ? (a) : (b))
#endif

#endif  /* NOMINMAX */
{% endcodeblock %}

Вот теперь ясно, что делать — надо определить макрос NOMINMAX, тем самым заблокировать определение `min` и `max`:

{% codeblock lang:cpp %}
#define NOMINMAX
#include <algorithm>
#include <windows.h>
int main() {
  int a = std::min(10, 20);
  return 0;
}
{% endcodeblock %}

Забавно, что в Cygwin и CodeGear/Borland исходный пример компилируется без проблем. В борландовой версии `windows.h` я нашел вот такой фрагмент:

{% codeblock lang:cpp %}
#if defined(__BORLANDC__)
...
#    if defined(__cplusplus)
#       define NOMINMAX              /* for WINDEF.H */
...
#    endif
...
#endif /* __BORLANDC__ */
{% endcodeblock %}

Эдак они заранее оградились от проблемы, принудительно запретив проблемные макросы.

**Вывод**: Порой промежуточные результаты работы препроцессора являются крайне полезной информацией.

На всякий случай напомню, как его запускать для перечисленных мной компиляторов: 

Visual Studio:

    cl.exe /P имя_исходника.cpp

Borland/CodeGear Studio:

    cpp32.exe имя_исходника.cpp

Cygwin:

    cpp.exe имя_исходника.cpp

Прочие флаги командной строки должны повторять флаги при обычной компиляции. Для препроцессора важны определения макросов (обычно это флаги `-D` и `-U`) и пути для поиска включаемых файлов (обычно это флаг `-I`).

Другие посты по теме:

* [Как обойтить без макроса NOMINMAX][]

[Как обойтить без макроса NOMINMAX]: /blog/russian/2009/03/05/how-to-do-without-nominmax/

