---
layout: post
title: "Кто быстрее: memset, bzero или std::fill"
language: russian
date: 2011-05-04 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/05/memset-vs-bzero-vs-stdfill.html
categories: 
- benchmark
- cplusplus
- stl
- russian
---
У нас тут идет второй день тренинг по С++ и unit-тестированию. Ведет [Kevlin Henney][]. Отличный дядка.

[Kevlin Henney]: http://www.boost.org/users/people/kevlin_henney.html

Все как обычно -- стараемся приучать к культуре разработки через тесты, ну и попутно склонить патриотов С к С++, убедив их, что на С++ можно таки писать также эффективно, как и на С. Да еще и в разы быстрее.

Зашла тема про `std::fill()`. Я вставил словечко, что мол `fill()` работает также быстро как и `memset()`, так как он используется в `fill()` для простых типов.

Написали программу, в которой есть интересный момент.

{% codeblock lang:cpp %}
#include <cstdlib>
#include <algorithm>

int main(int argc, char* argv[]) {
  int mode = argc > 1 ? std::atoi(argv[1]) : 1;
  int n = 1024 * 1024 * 1024 * 1;
  char* buf = new char[n];
  if (mode == 1)
    std::memset(buf, 0, n * sizeof(*buf));
  else if (mode == 2)
    bzero(buf, n * sizeof(*buf));
  else if (mode == 3)
    std::fill(buf, buf + n, 0);
  else if (mode == 4)
    std::fill(buf, buf + n, '\0');
  return buf[0];
}
{% endcodeblock %}

Обратите внимание на ветки 3 и 4. Они почти одно и то же, но не совсем.

В целом была мысль получить вот эту специализацию `fill()`:

{% codeblock lang:cpp %}
// Specialization: for one-byte types we can use memset.
inline void
fill(unsigned char* __first, unsigned char* __last, const unsigned char& __c)
{
  __glibcxx_requires_valid_range(__first, __last);
  const unsigned char __tmp = __c;
  std::memset(__first, __tmp, __last - __first);
}
{% endcodeblock %}

Итак, Makefile:

{% codeblock lang:cpp %}
all: build run

.SILENT:

target = memset_bzero_fill

build:
        g++ -O3 -o $(target) $(target).cpp

run: run-memset run-bzero run-fill-1 run-fill-2

go:
        (time -p ./$(target) $(mode)) 2>&1 | head -1 | cut -d' ' -f 2

run-memset:
        echo $@ `$(MAKE) go mode=1`

run-bzero:
        echo $@ `$(MAKE) go mode=2`

run-fill-1:
        echo $@ `$(MAKE) go mode=3`

run-fill-2:
        echo $@ `$(MAKE) go mode=4`
{% endcodeblock %}

Компилятор "gcc version 4.2.1 (Apple Inc. build 5666) (dot 3)".

Запускаем:

    run-memset 1.47
    run-bzero 1.45
    run-fill-1 1.69
    run-fill-2 1.42

Видно, как ветка 3 (`run-fill-1`) значительно тормозит, по сравнению с 4, хотя разница всего в типе последнего параметра - 0 и '\0'.

Смотрим ассемблер:

    (gdb) disass main
    Dump of assembler code for function main:
    0x0000000100000e70 <main+0>:    push   %rbp
    0x0000000100000e71 <main+1>:    mov    %rsp,%rbp
    0x0000000100000e74 <main+4>:    push   %r12
    0x0000000100000e76 <main+6>:    push   %rbx
    0x0000000100000e77 <main+7>:    dec    %edi
    0x0000000100000e79 <main+9>:    jle    0x100000ec3 <main+83>
    0x0000000100000e7b <main+11>:   mov    0x8(%rsi),%rdi
    0x0000000100000e7f <main+15>:   callq  0x100000efe <dyld_stub_atoi>
    0x0000000100000e84 <main+20>:   mov    %eax,%r12d
    0x0000000100000e87 <main+23>:   mov    $0x40000000,%edi
    0x0000000100000e8c <main+28>:   callq  0x100000ef8 <dyld_stub__Znam>
    0x0000000100000e91 <main+33>:   mov    %rax,%rbx
    0x0000000100000e94 <main+36>:   cmp    $0x1,%r12d
    0x0000000100000e98 <main+40>:   je     0x100000eac <main+60>   ; mode == 1
    0x0000000100000e9a <main+42>:   cmp    $0x2,%r12d
    0x0000000100000e9e <main+46>:   je     0x100000eac <main+60>   ; mode == 2
    0x0000000100000ea0 <main+48>:   cmp    $0x3,%r12d
    0x0000000100000ea4 <main+52>:   je     0x100000ed2 <main+98>   ; mode == 3
    0x0000000100000ea6 <main+54>:   cmp    $0x4,%r12d
    0x0000000100000eaa <main+58>:   jne    0x100000ebb <main+75>   ; mode != 4 -> выход

    ; Реалиазация через memset().

    0x0000000100000eac <main+60>:   mov    $0x40000000,%edx        ; mode = 1, 2 или 4
    0x0000000100000eb1 <main+65>:   xor    %esi,%esi
    0x0000000100000eb3 <main+67>:   mov    %rbx,%rdi
    0x0000000100000eb6 <main+70>:   callq  0x100000f0a <dyld_stub_memset>

    0x0000000100000ebb <main+75>:   movsbl (%rbx),%eax             ; выход
    0x0000000100000ebe <main+78>:   pop    %rbx
    0x0000000100000ebf <main+79>:   pop    %r12
    0x0000000100000ec1 <main+81>:   leaveq
    0x0000000100000ec2 <main+82>:   retq

    0x0000000100000ec3 <main+83>:   mov    $0x40000000,%edi
    0x0000000100000ec8 <main+88>:   callq  0x100000ef8 <dyld_stub__Znam>
    0x0000000100000ecd <main+93>:   mov    %rax,%rbx
    0x0000000100000ed0 <main+96>:   jmp    0x100000eac <main+60>

    ; Реализация на обычных командах.

    0x0000000100000ed2 <main+98>:   movb   $0x0,(%rax)             ; mode = 3
    0x0000000100000ed5 <main+101>:  mov    $0x1,%eax
    0x0000000100000eda <main+106>:  nopw   0x0(%rax,%rax,1)
    0x0000000100000ee0 <main+112>:  movb   $0x0,(%rax,%rbx,1)
    0x0000000100000ee4 <main+116>:  inc    %rax
    0x0000000100000ee7 <main+119>:  cmp    $0x40000000,%rax
    0x0000000100000eed <main+125>:  jne    0x100000ee0 <main+112>

    0x0000000100000eef <main+127>:  movsbl (%rbx),%eax             ; выход
    0x0000000100000ef2 <main+130>:  pop    %rbx
    0x0000000100000ef3 <main+131>:  pop    %r12
    0x0000000100000ef5 <main+133>:  leaveq
    0x0000000100000ef6 <main+134>:  retq
    
Видно, что благодаря оптимизации, ветки 1, 2 и 4 реализованы одинаково - через `memset()`. Вызов `fill()` в ветке 4 удалось свести к `memset()`.

Но вот ветка 3 реализована в виде ручного цикла. Компилятор, конечно, неплохо поработал -- цикл практически идеальный, но это все равно работает медленнее, чем хитрый `memset()`, который использует всякие ухищрения групповых ассемблерных операций.

Неверный тип нуля не дал компилятору правильно выбрать специализацию шаблона.

Мораль? И мораль тут не очень хорошая.

Мне кажется, что количество людей, которые напишут `std::fill(buf, buf + n, 0)`, разительно больше, чем `std::fill(buf, buf + n, '\0')`.

А разница весьма существенна.

Посты по теме:

* [fill_n vs memset][]

[fill_n vs memset]: /blog/russian/2010/06/20/fill_n-vs-memset/
