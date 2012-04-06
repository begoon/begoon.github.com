---
layout: post
title: "It is worth to use STL string?"
language: english
date: 2009-08-15 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/08/is-it-good-to-use-stdstring.html
categories: 
- cplusplus
- stl
- english
---
Quite often I have to argue with colleagues regarding `std::string`. Is it worth using it at all or our own string class implementation could be better?

Amusingly, the majority of people, which I asked to sketch out more or less efficient implementation of the string class, wrote roughly the following:

{% codeblock lang:cpp %}
class String {
 public:
  explicit String(const std::string& value) { 
    init(value.c_str(), value.length()); 
  }
  String(const String& value) { init(value.data_, value.sz_); }
  ~String() { free(data_); }

  String& operator=(const String& value) {
    if (this != &value) {
      if (value.sz_ > sz_) data_ = (char*)std::realloc(data_, value.sz_);
      sz_ = value.sz_;
      std::memcpy(data_, value.data_, sz_);
    }
    return *this;
  }

 private:
  void init(const char* data, size_t sz) {
    sz_ = sz;
    data_ = (char*)malloc(sz_);
    std::memcpy(data_, data, sz_);
  }
  char* data_;
  size_t sz_;
};
{% endcodeblock %}

Obviously with such implementation of the assignment operator the string can only increase memory utilisation, not reduce. It's done deliberately to save some extra time on assigning.

Practically nobody thought immediately about a moving operation, for example, a swap. For some reason the presence of a copy constructor and an assignment operator was considering to be sufficient.

I've written a test. The test sorts an array of long strings. The strings are represented in four ways: a `std::string` object, a `std::string` pointer, an object of my homemade `String` class (see above) and a pointer to `String`.

Apparently, use of the pointer should be the most efficient method because in this case `std::sort()` swaps only pointers but not objects.

But it would be interesting to compare how my simple implementation performs against `std::string`.

So, `std_string.cpp`:

{% codeblock lang:cpp %}
#include <iostream>
#include <sstream>
#include <string>
#include <vector>
#include <algorithm>
#include <cstdlib>
#include <cstring>
#include <cassert>

#include "gtest/gtest.h"

static const int N = 100;

// This homemade class implements the more or less efficient 
// string in terms of copying.
class String {
 public:
  // "explicit" disables any implicit cast making sure 
  // which constructor exactly is being called.
  explicit String(const std::string& value) { 
    init(value.c_str(), value.length()); 
  }
  String(const String& value) { init(value.data_, value.sz_); }
  ~String() { free(data_); }

  // Perhaps this method is only one attempt to use memory allocation
  // efficiently.
  String& operator=(const String& value) {
    if (this != &value) {
      // Memory is re-allocated only if a source is longer the current
      // string. It's clear that this implementation will only increase 
      // memory allocated by the string.
      if (value.sz_ > sz_) data_ = (char*)std::realloc(data_, value.sz_);
      sz_ = value.sz_;
      std::memcpy(data_, value.data_, sz_);
    }
    return *this;
  }

  friend class StringCmp;
  friend class StringPointerCmp;

 private:
  void init(const char* data, size_t sz) {
    sz_ = sz;
    data_ = (char*)malloc(sz_);
    std::memcpy(data_, data, sz_);
  }
  char* data_;
  size_t sz_;
};

std::vector<std::string> std_strings;
std::vector<std::string*> std_strings_p;
std::vector<String> strings;
std::vector<String*> strings_p;

// Functor to compare two std::string.
class StlStringCmp {
 public:
  bool operator()(const std::string& a, const std::string& b) {
    return a < b;
  }
};

TEST(SortingStlString, StlString) {
  std::sort(std_strings.begin(), std_strings.end(), StlStringCmp());
}

// Functor to compare two std::string*.
class StlStringPointerCmp {
 public:
  bool operator()(const std::string* a, const std::string* b) {
    return *a < *b;
  }
};

TEST(SortingStlString, StlStringPointer) {
  std::sort(std_strings_p.begin(), std_strings_p.end(), StlStringPointerCmp());
}

// Functor to compare two String.
class StringCmp {
 public:
  bool operator()(const String& a, const String& b) {
    assert(a.sz_ == b.sz_);
    return std::memcmp(a.data_, b.data_, a.sz_);
  }
};

TEST(SortingStlString, String) {
  std::sort(strings.begin(), strings.end(), StringCmp());
}

// Functor to compare two String*.
class StringPointerCmp {
 public:
  bool operator()(const String* a, const String* b) {
    assert(a->sz_ == b->sz_);
    return std::memcmp(a->data_, b->data_, a->sz_);
  }
};

TEST(SortingStlString, StringPointer) {
  std::sort(strings_p.begin(), strings_p.end(), StringPointerCmp());
}

int main(int argc, char* argv[]) {
  // The filler to make strings long enough making their copying expensive.
  std::string big(1024 * 1024, '?');
  for (int i = 0; i < N; ++i) {
    // All strings are the same length. The comparison functions rely on it.
    std::stringstream fmt;
    fmt << N * 2 - i << big;
    std_strings.push_back(fmt.str());
    std_strings_p.push_back(new std::string(fmt.str()));
    strings.push_back(String(fmt.str()));
    strings_p.push_back(new String(fmt.str()));
  }

  testing::InitGoogleTest(&argc, argv);
  // Enforce to print out tests' timing.
  testing::GTEST_FLAG(print_time) = true;
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Compile:

    cl /O2 /EHsc /I. std_string.cpp gtest-all.cc

Run:

    [==========] Running 4 tests from 1 test case.
    [----------] Global test environment set-up.
    [----------] 4 tests from SortingStlString
    [ RUN      ] SortingStlString.StlString
    [       OK ] SortingStlString.StlString (203 ms)
    [ RUN      ] SortingStlString.StlStringPointer
    [       OK ] SortingStlString.StlStringPointer (0 ms)
    [ RUN      ] SortingStlString.String
    [       OK ] SortingStlString.String (891 ms)
    [ RUN      ] SortingStlString.StringPointer
    [       OK ] SortingStlString.StringPointer (0 ms)
    [----------] 4 tests from SortingStlString (1125 ms total)

    [----------] Global test environment tear-down
    [==========] 4 tests from 1 test case ran. (1125 ms total)
    [  PASSED  ] 4 tests.

Apparently, the tests using pointers work equally fast but when the objects are in use, `std::string` has overrun my homemade implementation 4 times - 203 ms vs 891 ms. 

It's simply to figure out why. To swap elements `std::sort()` uses the template function `std::swap()` which exchanges objects without physical copying the string contents.

Eventually I've convinced myself that in most cases `std::string` solves all problems. But what about adding more functionality to the `std::string`? For instance, a word search.

The problem is that the destructor of `std::string` isn't virtual (maybe from considerations of efficiency), but an inheritance from a class with the non-virtual destructor isn't right undertaking in C++.

The STL author, Alexander Stepanov, in his article [Notes for the Programming course at Adobe][], advises to implement additional functionality for standard STL containers as template algorithms. There are many advantages doing so, for example, any string parser implemented via iterators as a template algorithm becomes usable automatically for all other containers having the same iterators.

[Notes for the Programming course at Adobe]: http://www.stepanovpapers.com/notes.pdf

Interestingly what Stepanov says about the `length()` function of STL containers (in the article above he describes the process of creation the efficient container step by step):

> While we could make a member function to return length, it is better to make it a global friend function. If we do that, we will be able eventually to define the same function to work on built-in arrays and achieve greater uniformity of design. I made size into a member function in STL in an attempt to please the standard committee. I knew that begin, end and size should be global functions but was not willing to risk another fight with the committee.
>
> **Alexander Stepanov**

Summarizing, it's worth to just trust `std::string`. For majority of problems it performs pretty well, and its functionality can be extended by template algorithms.
