---
layout: post
title: 'Кто быстрее: std::endl или "\n"?'
language: russian
date: 2012-04-25 23:28
comments: true
categories: 
- russian
- cplusplus
- stl
---
До сегодняшнего дня я свято верил, что в потоках `std::endl` -- это всегда правильнее, чем `\n`. Переносимость, и все такое. Но, увы.

Код с `std::endl`:

{% codeblock lang:cpp %}
#include <string>
#include <iostream>

int main() {
  for (int i = 0; i < 1000000; ++i) {
    std::string s(1, 'x');
    std::cout << s << std::endl;
  }
  return 0;
}
{% endcodeblock %}

Компилируем и запускаем:

    clang++ -o endl -O3 endl.cpp && time ./endl >rubbish

    real	0m4.518s
    user	0m1.080s
    sys	0m3.311s
    
Код с `\n`:

{% codeblock lang:cpp %}
#include <string>
#include <iostream>

int main() {
  for (int i = 0; i < 1000000; ++i) {
    std::string s(1, 'x');
    std::cout << s << '\n';
  }
  return 0;
}
{% endcodeblock %}

Компилируем и запускаем:

    clang++ -o endl -O3 endl.cpp && time ./endl >rubbish

    real	0m0.263s
    user	0m0.236s
    sys	0m0.008s    

Разница очевидна.

`std::endl` всегда `flush`ит поток, сбрасывая буфера. `\n` же просто пихает в поток символ начала новой строки, и большинстве случаев это и требуется. А когда надо, можно отдельно вызвать `std::flush`, один раз.
