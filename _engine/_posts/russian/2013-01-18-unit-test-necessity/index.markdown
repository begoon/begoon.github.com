@language: russian
@date: 2013-01-18 22:00
@tags: clang, cmockery, testing

Пример того, почему удобно жить с unit-тестами
==============================================

Нужна мне была функция, которая бы при низкоуровневой отладочной печати
умела распечатать строку, заменив непечатаемые коды (меньше 32 и больше 126)
кодами. Все крайне тривиально.

Имеем:

    1234\x04\x1fooo\xff

Печататься должно:

    1234<04><1f>ooo<ff>

Рождается функция:

``` c
// This function converts all non-ASCII characters (with codes less than 32
// and greater than 126) into the <xx> form where "xx" is a hexadecimal code
// of the character.
void MakeAllPrintable(const char* from, char* to, int to_capacity) {
  const static char hex[] = "0123456789abcdef";
  for (; *from && to_capacity > 1; ++from) {
    const unsigned char c = *from;
    if (c < 32 || c > 126) {
      if (to_capacity < 4 + 1)
        break;
      *to++ = '<';
      *to++ = hex[(c >> 4) & 0xf];
      *to++ = hex[c & 0xf];
      *to++ = '>';
    } else {
      *to++ = c;
    }
  }
  *to = '\0';
}
```

Увы, это С, а наша системы сборки частей на С, хоть и имеет cmockery, но
добавление тестов всегда связано с ручным прописываением имен фунцкий, а это
будет означать пересборку еще и makefile'ов, а это будет означать проверку
этой пересборки на всех типах ОС, и в этоге на подготовку уйдет час или больше.
А если потихоньку просто добавить функцию без теста, то 5 минут, так как 
изменится только один исходник. Мои мысли: "Ну я, типа, такой катаный
колобок, врядли налажаю в столь простой функции. Так что можно без тестов.".
И, конечно, налажал. Код выше имеет конкретный косяк. Он бы, естественно,
всплыл, может даже на code review, но в итоге я отогнал все ренегатские
мысли, сделал всю рутину и сел за тесты, хотя по уму, я их должен быть 
писать до.

Очевидно, что вполне логичный (предпоследний) тест, там, где последний параметр
5, сразу показал, что я забыл проверку максимальной длины буфера (эдакая
назадача!):

``` c
void test_MakeAllPrintable(void **state) {
  char buf[16 * 1024];

  MakeAllPrintable("", buf, sizeof(buf));
  assert_int_equal(strlen(buf), 0);

  MakeAllPrintable("abc", buf, sizeof(buf));
  assert_string_equal(buf, "abc");

  // This check verifies that the function always cleans the buffer at start.
  MakeAllPrintable("", buf, sizeof(buf));
  assert_int_equal(strlen(buf), 0);

  // This check verifies that the function doesn't overwrite the given buffer
  // and always reserves the last byte for '\0'.
  MakeAllPrintable("12345678", buf, 5);
  assert_string_equal(buf, "1234");$
  MakeAllPrintable("1\x01\r\n\t\x1f 2\x7e\x7f\x80\xff", buf, sizeof(buf));
  assert_string_equal(buf, "1<01><0d><0a><09><1f> 2~<7f><80><ff>");
}
```

А вот как код должен был выглядеть:

``` c
// This function converts all non-ASCII characters (with codes less than 32
// and greater than 126) into the <xx> form where "xx" is a hexadecimal code
// of the character.
void MakeAllPrintable(const char* from, char* to, int to_capacity) {
  const static char hex[] = "0123456789abcdef";
  for (; *from && to_capacity > 1; ++from) {
    const unsigned char c = *from;
    if (c < 32 || c > 126) {
      if (to_capacity < 4 + 1)
        break;
      *to++ = '<';
      *to++ = hex[(c >> 4) & 0xf];
      *to++ = hex[c & 0xf];
      *to++ = '>';
      to_capacity -= 4;   // (!!!)
    } else {
      *to++ = c;
      --to_capacity;      // (!!!)
    }
  }
  *to = '\0';
}
```

Пример, безусловно, примитивный, но очень показательный. Принцип простой:
"нет тестов, нет кода". Когда жизненный цикл проекта более нескольких дней,
тесты обязаны быть частью кода, и по мне, не должно быть разделения на
production code и test code по большому счету, так как первое без второго 
не существует.
