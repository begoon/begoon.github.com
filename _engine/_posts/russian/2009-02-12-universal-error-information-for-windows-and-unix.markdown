---
layout: post
title: "Универсальная информация об ошибках в Windows и UNIX"
language: russian
date: 2009-02-12 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/windows-unix.html
categories:
- cplusplus
- russian
---
Достоверная информация об ошибках во время исполнения программы является залогом простой ее эксплуатации и поддержки. Вместо выслушивания от клиента стенаний на тему "я тут что-то нажал... а тут все не работает..." можно просто попросить его прислать файл журнала программы (log), и с большой вероятностью этого будет достаточно для локализации проблемы. С логическими ошибками бизнес логики программы все понятно — тут все зависит от вас, и вы точно знаете, какая ошибка произошла. Хуже обстоит дело с ошибками системными. Тут надо максималько точно опросить систему, что произошло, и по возможности, получить расшифровку когда ошибки.

Как я уже писал, я работаю одновременно на совершенно разных платформах — от виндов до встраеваемого QNX'а. Поэтому мне всегда хочется иметь максимально простые и переносимые исходники (и желательно с минимумом нестандартных зависимостей), чтобы модули можно было просто кидать из проекта в проект, с платформы на платформу, не допиливая каждый раз что-то напильником.

Итак, привожу ниже класс, который я использую для получения информации об ошибке, произошедшей в операционной системе. Можно узнать код ошибки и его текстовое объяснение, если оно предоставляется. Это не бог весть какой сложный и оригинальный класс, но у меня он работает без каких-либо "допиливаний" на Windows 32- и 64-бит, Linux 2.6 32- 64-бит SPARC и Intel, Sun OS 5.10 SPARC и Intel, AIX, HP-UX и HP-UX IA64. К тому же, этот класс безопасен для мультипотокового использования (что лично для меня, например, очень важно).

Итак, класс `SystemMessage`. Все члены статические, так что можно работать с ними без создания экземпляра класса.

Пространство имен, как обычно, ext, так что измените, если необходимо.

Файл `systemmessage.h`:

{% codeblock lang:cpp %}
#ifndef _EXT_SYSTEM_MESSAGE_H
#define _EXT_SYSTEM_MESSAGE_H

#include <string>

namespace ext {

class SystemMessage {
public:
  // Эта функция возращает код ошибки.
  static int code();
  // Эта функция по коду ошибки возвращает ее текстовое описание, если
  // таковое предоставляется операционной системой. Если нет, то 
  // возвращается строка "?".
  static std::string message(int code);
};

} // namespace ext

#endif // _EXT_SYSTEM_MESSAGE_H
{% endcodeblock %}

Файл `systemmessage.cpp`:

{% codeblock lang:cpp %}
#include "SystemMessage.h"

#ifdef WIN32
#include <windows.h>
#else
#include <string.h>
#include <unistd.h>
#include <errno.h>
#endif

namespace ext {

int SystemMessage::code() {
#ifdef WIN32
  return GetLastError();
#else
  return errno;
#endif
}

// Если система по какой-то причине не имеет функции strerror_r,
// то придется лазить напрямую в таблицу сообщений об ошибках.
// Для этого надо при компиляции определить макрос LIBC_NO_STRERROR_R.
// Пока я видел такое только на HP-UX IA64 v2.
#ifndef WIN32
#ifndef LIBC_NO_STRERROR_R
extern "C" int sys_nerr;
extern "C" char* sys_errlist[];
#endif
#endif

std::string SystemMessage::message(int code) {
  char msg[1024];

#ifdef WIN32

  // Версия для Windows
  FormatMessage(
    FORMAT_MESSAGE_FROM_SYSTEM |
    FORMAT_MESSAGE_IGNORE_INSERTS,
    NULL,
    code,
    MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
    msg,
    sizeof(msg) - 1,
    NULL
  );

  char* p = msg + strlen(msg);
  
  // Обрезаем c конца '\r', '\n' и '.'
  for(p = msg + strlen(msg) - 1; 
    p >= msg && (*p == '\n' || *p == '\r' || *p == '.'); --p) 
      *p = 0;

#elif LIBC_NO_STRERROR_R

  // Если UNIX-платформа не имеет функции strerror_r, то делаем ее
  // работу вручную. Пока я встретил такое только на HP-UX IA64 v2.
  if (code < 0 || code >= sys_nerr)
    return "?";

  strncpy(msg, sys_errlist[code], sizeof(msg) - 1);

  // Если сообщение об ошибке длинее чем sizeof(msg)-1, то '\0'
  // не будет скопирован, поэтому добавляем его вручну.
  msg[sizeof(msg) - 1] = 0;

#else

  // Для нормальной UNIX-системы просто вызываем strerror_r.
  if (strerror_r(code, msg, sizeof(msg) - 1) < 0)
    return "?";

#endif

  // Поможем компилятору по возможности оптимизировать 
  // возвращаемое значение как rvalue.
  return std::string(msg);
}

} // namespace ext
{% endcodeblock %}

Теперь посмотрим это в работе.

Я как-то пока не придумал, как универсально написать unit-тест для этого класса, так как предсказуемые результаты будут все равно различны для каждой платформы. А писать тесты под все платформы как-то топорно. Хочется гармонии, а тут пока ее нет. Если кто имеет идею, как универсально тестировать этот класс на всех платформах — поделитесь, пожалуйста.

Тестовая программа `systemmessage_test.cpp`:

{% codeblock lang:cpp %}
#include <iostream>
#include <fstream>

#include "systemmessage.h"

int main(int argc, char* argv[]) {
  // Пытаемся открыть заведомо несуществующий файл.
  std::ifstream is("__non_existing_file__");

  // Печатаем ошибку.
  int error = ext::SystemMessage::code();
  std::cout 
    << error << ", " 
    << ext::SystemMessage::message(error) 
    << std::endl;

  return 0;
}
{% endcodeblock %}

Компилируем в Visual Studio:

    cl /EHsc /Fesystemmessage_test_vs2008.exe /DWIN32 systemmessage_test.cpp systemmessage.cpp

Запускаем `systemmessage_test_vs2008.exe`:

    2, The system cannot find the file specified

Получили примерно ожидаемое виндовое сообщение об ошибке.

Теперь компилируем в Cygwin:

    g++ -o systemmessage_test_cygwin.exe systemmessage_test.cpp systemmessage.cpp

Запускаем `systemmessage_test_cygwin.exe`:

    2, No such file or directory

Получили сообщение об ошибке в стиле UNIX.

Повторюсь, в данном классе нет ничего удивительного и сложного. Просто это весьма универсальный и переносимый исходник.

И небольшая ремарка. В мире UNIX существует два диалекта функции `strerror_r`: XSI-версия (когда определен макрос `_XOPEN_SOURCE`, и он равен 600) и GNU-версия (доступная в libc, начиная с версии 2.0). Разница в том, что первая (XSI-версия) просто кладет сообщение об ошибке в предоставленный буфер и также возвращает код успешности или неуспешности своей работы в виде `int`'а. Нормальный UNIX-подход. Вторая версия (GNU) возвращает не `int`, а, собственно, указатель на строку с ошибкой, причем указываеть он может как на предоставленный функции буфер, так и куда-то еще, например, на какой-то внутренний буфер. Данный класс рассчитан на работу с XSI-версией функции `strerror_r`. Поэтому, если вдруг при компиляции этого класс на UNIX-системах вы получите сообщение об ошибке в использовании этой функции, то определите макрос `_XOPEN_SOURCE` в значение 600 (`-D_XOPEN_SOURCE=600` для компилятора), тем самым будет принудительно использоваться XSI-версия этой болезной функции.
