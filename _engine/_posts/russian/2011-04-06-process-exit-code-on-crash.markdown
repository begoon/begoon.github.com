---
layout: post
title: "Код возврата процесса в случае его падения"
language: russian
date: 2011-04-06 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/04/blog-post.html
categories:
- russian
---
Был интересный баг - в процессе выполнения скрипта сборки выполнение тестов приводило к жесткому падению процесса. Там был какой-то явный баг с памятью. Но самое интересное дальше. Makefile после падения процесса, выполняющего тесты, продолжал работать, что означало завершение упавшего процесса с нулевым кодом, а должно было быть что-то явно ненулевое.

С багом мы разобрались (включая проблему в Makefile), но возник у меня общий вопрос: с каким именно кодом завершается процесс, если он упал, не успев выполнить [exit()][].

[exit()]: http://linux.die.net/man/3/exit

В UNIXах есть специальные макросы, которыми можно проинспектировать код возврата [wait()][]. Но, все UNIXы разные, и к тому же есть еще Windows.

[wait()]: http://linux.die.net/man/2/wait

В итоге я написал небольшую самопадающую программу:

{% codeblock lang:cpp %}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char* argv[]) {
  char cmd[80];
  int r;
  sprintf(cmd, "%s ?", argv[0]);
  if (argc > 1) {
    if (argv[1][strlen(argv[1]) - 1] == '1')
      *(char *)0 = 0;
    exit(0x77);
  }
  printf("Normal: %08X\n", system(cmd));
  cmd[strlen(cmd) - 1] = '1';
  printf("Crash : %08X\n", system(cmd));
  return 0;
}
{% endcodeblock %}

И запустил на некоторых характерных машинах.

**Windows 7, Visual Studio 2010**, `cl crash.c && crash`:

    Normal: 00000077
    Crash : C0000005

**Linux x86_64** (`cс -o crash crash.c && ./crash`):

    Normal: 00007700
    Crash : 0000000B

Сигнал `0x0B` (13) - это, кстати, `SIGSEGV`, segmentation violation, что, собственно, и произошло.

**Solaris SPARC 5.10**:

    Normal: 00007700
    Segmentation Fault - core dumped
    Crash : 00008B00

**HP-UX Itanium 2**:

Normal: 00007700
sh: 25112 Memory fault(coredump)
Crash : 00008B00

**AIX 5.2**

Normal: 00007700
Crash : FFFFFFFF

Тут, видимо, до `system()` код возврата не дошел совсем.

Вывод: все крайне зависит (как всегда) от операционной системы.
