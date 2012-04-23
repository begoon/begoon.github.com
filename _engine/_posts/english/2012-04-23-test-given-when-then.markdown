---
layout: post
title: "Test: Give, When, Then"
language: english
date: 2012-04-23 23:07
comments: true
categories: 
- english
- testing
---
After Kevlin Henney's training I'd realised that an unavailability of a specific unit testing framework in C++ isn’t an excuse to not doing TDD. Just a simple `assert` macro is enough for unit testing.

For instance, a mini project having one file, and you don’t want to drag the Google Test or cmockery in. I usually do something like this:

{% codeblock lang:cpp %}
#include <cassert>

void foo(...) {
  // something
}

...

#ifdef UNIT_TESTING
void Test_for_a_particular_use_case() {
  // Initialization
  ...
  assert(condition_1);
  ...
  assert(condition_N);
}
...
int main(...) {
  Test_for_a_particular_use_case();
  std::cout << “All tests passed.” << std::endl;
  return 0;
}

#else

int main(...) {
  // a proper main
}

#endif
{% endcodeblock %}

Of course, you still can forget to add your test to `main()`, and it seems working, but the test simply doesn’t run.

But! All this is trifles in comparison with the advantages which the tests provide.

### P.S.

By the way, I’ve noticed an interesting habit: when I’m writing a function working with files, I always create two:

{% codeblock lang:cpp %}
void FunctionDoingSomethingFromStream(std::istream* is) {
  ...
}

void FunctionDoingSomethingFromFile(const std::string& filename) {
  std::ifstream is(filename);
  return FunctionDoingSomethingFromStream(&is);  
}
{% endcodeblock %}

The first function is perfect for testing because you can pass in a mocked `std::istringstream`. The second doesn’t really need to be tested due to its simplicity. It may be tested though in QA, but not in unit testing during within build.

There is another interesting trick from Kevlin Henny. Usually a subject of testing (a class or a function) has a pre-condition and a post-condition. It’s worth to highlight these stages in comments by “Given”, “When” and “Then” words. For example:

{% codeblock lang:cpp %}
void Test_for_a_particular_use_case_to_check() {
  // Given:
  ClassToTest a;
  // When:
  a.do_this(...);
  a.do_that(...);
  a.setup_something(...);
  // Then:
  assert(condition_1);
  ...
  assert(condition_N);
}
{% endcodeblock %}

Such explicit split enforces proper test structuring: without loop and branches, and testing for only one scenario (for another scenario it will be another test).

&#9632;
