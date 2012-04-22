---
layout: post
language: english
date: 2012-04-14 17:27
title: "How to return a vector from a function: by value or by reference?"
categories:
- cplusplus
- benchmark
- stl
- english
---
Let's imagine there is a function creating a `vector`. This function needs to return this vector to the caller. What's the better way doing it?

From clarity perspective the best way is:

{% codeblock lang:cpp %}
std::vector<int> create_vector(const size_t N) {
  std::vector<int> v;
  v.resize(N, 0xDEADC0DE);
  return v;
}
{% endcodeblock %}

Here the vector instance is being returned *by value*, which means potential deep copying of the object to the context of the caller.

Immediately a question raises: if the vector is huge, such deep copying can be expensive but absolutely redundant. A "more clever" approach could be:

{% codeblock lang:cpp %}
void create_vector(const size_t N, std::vector<int>* v) {
  v->resize(N, 0xDEADC0DE);
}
{% endcodeblock %}

Here the vector is passed by pointer which guarantees the absence of deep copying. But this code looks quite bad. 

Let's compare the performance of these two approaches on the 100MB vector of ints. The compiler:

    Apple clang version 3.1 (tags/Apple/clang-318.0.45) (based on LLVM 3.1svn)
    Target: x86_64-apple-darwin11.3.0
    
By value:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

std::vector<int> __attribute__((noinline))
create_vector(const size_t N) {
  std::cout << "by value" << std::endl;
  std::vector<int> v;
  v.resize(N, 0xDEADC0DE);
  return v;
}

int main(int argc, char* argv[]) {
  for (size_t i = 0; i < 10; ++i) {
    const size_t N = 1024 * 1024 * 100;
    std::vector<int> v = create_vector(N);
    if (v[i] != 0xDEADC0DE) {
      std::cout << "Test is rubbish" << std::endl;
      return 0;
    }
  } 
  return 0;
}
{% endcodeblock %}

Run:

    clang++ -O3 -o by_value by_value.cpp && time ./by_value
    
Result:

    0m4.933s
    
Now by pointer:

{% codeblock lang:cpp %}
#include <iostream>
#include <vector>

void __attribute__((noinline))
create_vector(const size_t N, std::vector<int>* v) {
  std::cout << "by pointer" << std::endl;
  v->resize(N, 0xDEADC0DE);
}

int main(int argc, char* argv[]) {
  for (size_t i = 0; i < 10; ++i) {
    const size_t N = 1024 * 1024 * 100;
    std::vector<int> v;
    create_vector(N, &v);
    if (v[i] != 0xDEADC0DE) {
      std::cout << "Test is rubbish" << std::endl;
      return 0;
    }
  } 
  return 0;
}
{% endcodeblock %}

Run:

    clang++ -O3 -o by_pointer by_pointer.cpp && time ./by_pointer
    
Result:

    0m4.852s

Time is both cases is the same. It turns out that it's worth to choose the first one. It looks nicer and cleaner, and it's as fast as "by pointer".

There are two explanations. The first, probably the main one, is [RVO, Return value optimization][RVO]. In RVO the compiler figures out that the local instance of the vector is supposed to be a return value, and it allocates it directly in the caller context. So it doesn't need to copy it afterwards. In fact, the compiler implements passing by reference, but it does it implicitly, without spoiling the beauty of the source code. This trick works for any classes, not only from STL.
    
[RVO]: http://en.wikipedia.org/wiki/Return_value_optimization

But the optimization isn't guaranteed thing, and there is one more tool. The standard STL containers are implemented such way that even on deep copying they only copy by value a small control structure, and the payload is "moved" by flipping pointers. It's small overhead, but perhaps it's worthwhile for the sake of preserving the code clarity.  

Also in the context of move semantics in C++11 there won't be unnecessary copying at all if the class is "properly" implemented (which is true for STL classes).

Conclusion: use STL containers where ever possible and trust the compiler. Sometimes, of course, the compiler is wrong, but such cases are much less than vice versa. 
