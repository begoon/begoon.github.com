---
layout: post
title: "Проблемы с полиморфным delete на массивах"
language: russian
date: 2010-06-09 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/06/delete.html
categories:
- cplusplus
- russian
---
Имеем следующий код:

{% codeblock lang:cpp %}
#define T 2

class A {
  public:
    virtual ~A() { 
      p = 0;
    }
    int p;
};

class B: public A {
  int a;
};

int main() {
  A* a = new B[T];
  delete[] a;
  return 0;
}
{% endcodeblock %}

У меня эта программа однозначно падает с `Segmentation fault` на строке `delete[] a`. Проверено на Sun C++ на Солярисе, GCC на Линуксе и на FreeBSD. Вот, например, что происходит на BSD:

    Program received signal SIGSEGV, Segmentation fault.
    0x08048743 in main () at new_array.cpp:17
    17        delete[] a;

Забавно, что под Windows в VS2008 ничего особенного не происходит.

Как я понимаю, что в этой программе принципиально важно, чтобы она падала: деструктор класса `A` должен быть виртуальным, дочерний класс `B` должен быть больше по размеру (тут есть член `a`), константа `Т` должна быть 2 или более (то есть мы должны создавать несколько экземпляров класса `B`), и деструктор класса `A` должен что-нибудь писать в свои члены (тут есть `p = 0;`).

Что же тут происходит?

`new[]` создает массив экземплятор класса `B`. Оператор же `delete[]` получает на вход указатель типа `A*` и начинает вызывать деструкторы элементов. Так как деструктор класса `А` виртуальный, то в ход пускается таблица виртуальных функций. Итак, отработал деструктор для первого элемента `a[0]`. Далее `delete[]` хочет получить адрес следующего элемента массиве `a`. И для этого (внимание!) адрес следующего он вычисляется так: `a + sizeof(A)` (ему же на вход дали указатель типа `A*`). Но проблема в том, что `sizeof(A) < sizeof(B)` (это дает член класса `B::a`), и `a + sizeof(A)` будет указывать не на второй элемент в массиве `a`, а куда-то между первым и вторым элементом, так как реальный адрес второго элемента - `a + sizeof(B)`. И все бы ничего, но деструктор класс `A` пишет в член `p`, тем самым меняя содержимое памяти, а так как для второго элемента адрес вычислен неправильно (его `this` указывает непонятно куда), то куда реально попадет 0 в присваивании `p = 0;` уже никто не знает, но явно не туда, куда надо. Вот и `Segmentation fault`.

Другого объяснения у меня нет.

Если кто знает лучше, поправьте.

P.S. Забавно, что под виндами ничего страшного не происходит.

**Update**: В комментариях дали точное объяснение из стандарта: C++ 2003 5.3.5:

...In the second alternative (delete array), the value of the operand of delete shall be the pointer value which resulted from a previous array new-expression. If not, the behavior is undefined. [Note: this means that the syntax of the delete-expression must match the type of the object allocated by new, not the syntax of the new-expression.]

**Update 2**: [Объяснение][Mismatching scalar and vector new and delete], почему не глючит в Visual Studio.

[Mismatching scalar and vector new and delete]: http://blogs.msdn.com/b/oldnewthing/archive/2004/02/03/66660.aspx
