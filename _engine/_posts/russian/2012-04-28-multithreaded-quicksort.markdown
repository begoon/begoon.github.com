---
layout: post
title: "Многопоточный QuickSort"
language: russian
date: 2012-04-28 23:46
comments: true
categories: 
- quicksort
- russian
- stl
- threading
---
Я тут недавно жаловался, что C++, даже в редакции 2011, крайне недружелюбен в плане многозадачности и многопоточности. В качестве эксперимента я попробовал сделать многопоточный QuickSort. В этом алгоритме получается после фазы разбиения запустить сортировки подчастей параллельно.

Вот мой наивный велосипед:

{% codeblock lang:cpp %}
int naive_quick_sort(std::vector<Type>::iterator begin, std::vector<Type>::iterator end) {
  auto const sz = end - begin;
  if (sz <= 1) return 0;

  auto pivot = begin + sz/2;
  auto const pivot_v = *pivot;

  std::swap(*pivot, *(end - 1));
  auto p = std::partition(begin, end, [&](const Type& a) { return a < pivot_v; } );
  std::swap(*p, *(end - 1));

  if (sz > 4096) {
    auto left = std::async(std::launch::async, [&]() {
      return naive_quick_sort(begin, p);
    });
    naive_quick_sort(p + 1, end);
  } else {
    naive_quick_sort(begin, p);
    naive_quick_sort(p + 1, end);
  }
  return 0;
}

void quick_sort(std::vector<Type>& arr) {
  naive_quick_sort(arr.begin(), arr.end());
}
{% endcodeblock %}

Реализация крайне простая, но стоит отметить несколько моментов. Есть некая константа `4096`, которая определяет порог, когда отключается параллельное выполнение. Почему именно такое значение? Не знаю. Взято из воздуха с минимальным чувством здравого смысла. Когда же параллельность активна, то сортировка левого массива запускается через `async` в другом потоке, а правый сортируется как и раньше в текущем потоке. При выходе из контекста функции гарантируется, что задача, запущенная через `async`, будет завершена (ее завершения будут ждать).

Традиционно, пузомерка. Три кандидата:

* приведенная выше реализация (через `async`)
* она же, но в один поток (`if (sz > 4096)` заменить на `if (false)`)
* std::sort() (`naive_quick_sort(arr.begin(), arr.end())` заменить на `std::sort(arr.begin(), arr.end())`)

Сортируется массив из 50000000 элементов типа `int64` (со знаком). Делается 10 экспериментов, и считается среднее. Значения генерируются случайно:

{% codeblock lang:cpp %}
std::tr1::uniform_int<Type> uniform(
  std::numeric_limits<Type>::min(),
  std::numeric_limits<Type>::max());
std::mt19937_64 engine;

void generate(std::vector<Type>& v) {
  std::for_each(v.begin(), v.end(), [](decltype(v[0]) &i) {
    i = uniform(engine); 
  });
}
{% endcodeblock %}

Не спрашивайте, почему тут делается перегон из big endian туда и обратно. Это было сделано для сравнения с другой программой, на Java. При замерах времени учитывается только "чистое время".

Компилятор VS 2011, 64-bit. Процессор Intel Core i5 2.53GHz, 4 ядра.

    Итерация   Через async()   Один поток   std::sort()
    --------- --------------- ------------ ------------
     1         2512            6555         7309
     2         2337            6320         6977
     3         2450            6516         7180
     4         2372            6388         6933
     5         2387            7074         7189
     6         2339            7399         7040
     7         2434            6875         7040
     8         2562            7060         7187
     9         2470            7050         7145
    10         2422            6846         6898
    --------- --------------- ------------ ------------    
    Среднее    2428.5          6808.3       7089.8

Время указано в миллисекундах.

Получается где-то в три раза быстрее. Странное небольшое отставание `std::sort()` скорее всего связано в тем, что данные "хорошие", и на них моей простецкой реализации просто везет. Видно, что у времени `std::sort()` девиация гораздо меньше. Все-таки `stl::sort()` стабилен по времени вне зависимости от данных.

Есть ли в этой параллельности практическая польза? Думаю нет. Очень сложно оценить стабильность алгоритма на разных данных. Например, совершенно не ясно, как выбрать порог отключения многозадачности? Стоит ли использовать пул потоков?

Если кому интересно, внизу полный текст этого велосипеда, включая генератор данных.

Сборка и генерация данных:

    call "%VS110COMNTOOLS%..\..\VC\vcvarsall.bat" amd64 && ^
    cl /Ox /DWIN32 sort_async.cpp && ^
    sort_async generate
    
Осторожно! Генератор создаст данных на 8 гигов.
    
Сборка и эксперимент:
    
    call "%VS110COMNTOOLS%..\..\VC\vcvarsall.bat" amd64 && ^
    cl /Ox /DWIN32 sort_async.cpp && ^
    sort_async

Файл `sort_async.cpp`:

{% codeblock lang:cpp %}
#include <vector>                      
#include <iostream>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <iomanip>
#include <utility>
#include <numeric>
#include <future>
#include <random>
#include <ctime>
#include <cstdlib>

const int ITERATIONS_NUM = 10;
const int DATA_SIZE = 50000000;

typedef __int64 Type;

inline void endian_swap(Type& x) {
  x =
    (0x00000000000000FF & (x >> 56))
  | (0x000000000000FF00 & (x >> 40))
  | (0x0000000000FF0000 & (x >> 24))
  | (0x00000000FF000000 & (x >>  8))
  | (0x000000FF00000000 & (x <<  8))
  | (0x0000FF0000000000 & (x << 24))
  | (0x00FF000000000000 & (x << 40))
  | (0xFF00000000000000 & (x << 56));
}

std::tr1::uniform_int<Type> uniform(
  std::numeric_limits<Type>::min(),
  std::numeric_limits<Type>::max());
std::mt19937_64 engine;

void generate(std::vector<Type>& v) {
  std::for_each(v.begin(), v.end(), [](decltype(v[0]) &i) {
    i = uniform(engine); 
  });
}

void check_sorted(const std::vector<Type>& v, const std::string& msg) {
  for (auto i = 0; i < v.size() - 1; ++i) {
    if (v[i] > v[i + 1]) {
      std::cout << "\nUnsorted: " << msg << "\n";
      std::cout << "\n" << i << "\n";
      std::cout << v[i] << " " << v[i + 1] << "\n";
      std::exit(1);
    }
  }
}

std::string data_file_name(const int i, const std::string& suffix) {
  std::ostringstream fmt;
  fmt << "trash_for_sort_" << i << suffix << ".bin";
  return fmt.str();
}

void save_file(std::vector<Type> array, const std::string& name) {
  std::for_each(array.begin(), array.end(), [](decltype(array[0]) &i) {
    endian_swap(i);
  });
  std::ofstream os(name.c_str(), std::ios::binary|std::ios::out);
  auto const bytes_to_write = array.size() * sizeof(array[0]);
  std::cout << "Saving " << array.size() << " bytes to " << name << "\n";
  os.write((char *)&array[0], bytes_to_write);
}

int main_generate(int argc, char* argv[]) {
  std::cout << "Generation\n";
  std::vector<int> times;
  auto times_sum = 0.0;
  for (auto i = 0; i < ITERATIONS_NUM; ++i) {
    std::vector<Type> unsorted(DATA_SIZE);
    generate(unsorted);
    save_file(unsorted, data_file_name(i, ""));

    std::cout << "Sorting...\n";
    std::sort(unsorted.begin(), unsorted.end());
    check_sorted(unsorted, "check sorted array");
    save_file(unsorted, data_file_name(i, "_sorted"));
  }
  return 0;
}

void load_file(std::vector<Type>& array, const std::string& name) {
  std::cout << "Loading " << name;
  array.resize(DATA_SIZE, 0);

  std::ifstream is(name.c_str(), std::ios::binary|std::ios::in);
  auto const to_load = array.size() * sizeof(array[0]);
  is.read((char *)&array[0], to_load);
  if (is.gcount() != to_load) {
    std::cerr << ", Bad file " << name
      << ", loaded " << is.gcount() << " words but should be " << to_load << "\n";
    std::exit(1);
  }
  std::for_each(array.begin(), array.end(), [](decltype(array[0]) & v){
    endian_swap(v);
  });
}

int naive_quick_sort(std::vector<Type>::iterator begin, std::vector<Type>::iterator end) {
  auto const sz = end - begin;
  if (sz <= 1) return 0;

  auto pivot = begin + sz/2;
  auto const pivot_v = *pivot;

  std::swap(*pivot, *(end - 1));
  auto p = std::partition(begin, end, [&](const Type& a) { return a < pivot_v; } );
  std::swap(*p, *(end - 1));

  if (sz > 4096) {
    auto left = std::async(std::launch::async, [&]() {
      return naive_quick_sort(begin, p);
    });
    naive_quick_sort(p + 1, end);
  } else {
    naive_quick_sort(begin, p);
    naive_quick_sort(p + 1, end);
  }
  return 0;
}

void quick_sort(std::vector<Type>& arr) {
  naive_quick_sort(arr.begin(), arr.end());
}

#undef max

int main(int argc, char* argv[]) {
  if (argc == 2 && !std::strcmp(argv[1], "generate"))
    return main_generate(argc, argv);

  std::vector<int> times;
  auto times_sum = 0.0;
  for (auto i = 0; i < ITERATIONS_NUM; ++i) {
    std::vector<Type> unsorted;
    load_file(unsorted, data_file_name(i, ""));

    std::vector<Type> verify;
    std::cout << ", ";
    load_file(verify, data_file_name(i, "_sorted"));
    check_sorted(verify, "verify array");

    std::cout << ", Started";
    auto const started = clock() / (CLOCKS_PER_SEC / 1000);

    quick_sort(unsorted);

    auto const finished = clock() / (CLOCKS_PER_SEC / 1000);

    std::cout << ", Stopped, ";
    auto const duration = finished - started;
    std::cout << "Duration = " << duration;

    check_sorted(unsorted, "sorted array");

    const auto match = unsorted == verify;
    std::cout << (match ? ", OK" : ", DON'T MATCH");

    times.push_back(duration);
    times_sum += duration;

    std::cout << "\n";
  }

  auto const average = times_sum / ITERATIONS_NUM;
  auto const max_element = *std::max_element(times.begin(), times.end());
  auto const min_element = *std::min_element(times.begin(), times.end());
  auto const average_fixed = (times_sum - max_element - min_element) /
                             (ITERATIONS_NUM - 2);

  std::cout << "Average: " << average << "ms, " 
            << "Average without max/min: "
            << average_fixed << "ms." << std::endl;
}
{% endcodeblock %}
