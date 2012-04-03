---
layout: post
title: "Google C++ Testing Framework 1.4.0"
language: english
date: 2009-10-03 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/10/google-c-testing-framework-140.html
categories: 
- google test
- testing
- english
---
Yesterday Googlers announced the next version of my favourite testing framework for C++ [Google Testing Framework][] - 1.4.0.

[Google Testing Framework]: http://code.google.com/p/googletest

Any changes? Indeed.

The major feature coming is the "[The event listener API][]". In other words this is the way to customize the output produced by tests without any code changes in the library sources.

[The event listener API]: http://code.google.com/p/googletest/wiki/GoogleTestAdvancedGuide#Extending_Google_Test_by_Handling_Test_Events

For example, the standard output of the trivial test (file `runner.cpp`):

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

TEST(One, Simple) {
  EXPECT_EQ(1, 2);
}

int main(int argc, char** argv) {
  ::testing::InitGoogleTest(&argc, argv);
  return RUN_ALL_TESTS();
}
{% endcodeblock %}

is

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from One
    [ RUN      ] One.Simple
    runner.cpp(4): error: Value of: 2
    Expected: 1
    [  FAILED  ] One.Simple (15 ms)
    [----------] 1 test from One (15 ms total)

    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran. (31 ms total)
    [  PASSED  ] 0 tests.
    [  FAILED  ] 1 test, listed below:
    [  FAILED  ] One.Simple

     1 FAILED TEST

To customize the output we have to implement our own event listener (for instance, file `runner.cpp)`:

{% codeblock lang:cpp %}
#include "gtest/gtest.h"

using namespace ::testing;

// Our own event listener.
class LaconicPrinter : public ::testing::EmptyTestEventListener {
  // Called before a test starts.
  virtual void OnTestStart(const TestInfo& test_info) {
    printf("*** Test %s.%s starting.\n",
           test_info.test_case_name(), test_info.name());
  }

  // Called when an assert fails or SUCCESS gets called.
  virtual void OnTestPartResult(const TestPartResult& test_part_result) {
    printf("%s in %s:%d\n%s\n",
           test_part_result.failed() ? "*** Failure" : "Success",
           test_part_result.file_name(),
           test_part_result.line_number(),
           test_part_result.summary());
  }

  // Called after a test finishes.
  virtual void OnTestEnd(const TestInfo& test_info) {
    printf("*** Test %s.%s ending.\n",
           test_info.test_case_name(), test_info.name());
  }
};

TEST(One, Simple) {
  EXPECT_EQ(1, 2);
}

int main(int argc, char** argv) {
  ::testing::InitGoogleTest(&argc, argv);

  // Obtain the reference to the active listeners.
  ::testing::TestEventListeners& listeners =
      ::testing::UnitTest::GetInstance()->listeners();

  // Delete the default event listener.
  delete listeners.Release(listeners.default_result_printer());
  // Add our LaconicPrinter listener. Google Test will take care about it.
  listeners.Append(new LaconicPrinter);

  return RUN_ALL_TESTS();
}
{% endcodeblock %}

Now the output looks as:

    *** Test One.Simple starting.
    *** Failure in runner.cpp:31
    Value of: 2
    Expected: 1
    *** Test One.Simple ending.

Note that it could be several active listeners. But their output can be messed. Therefore we firstly remove the default listener from the list to avoid in influence on our listener's output.

In general the event listener interface has these methods:

{% codeblock lang:cpp %}
class EmptyTestEventListener : public TestEventListener {
 public:
  virtual void OnTestProgramStart(const UnitTest& unit_test);
  virtual void OnTestIterationStart(const UnitTest& unit_test, int iteration;
  virtual void OnEnvironmentsSetUpStart(const UnitTest& unit_test);
  virtual void OnEnvironmentsSetUpEnd(const UnitTest& unit_test);
  virtual void OnTestCaseStart(const TestCase& test_case);
  virtual void OnTestStart(const TestInfo& test_info);
  virtual void OnTestPartResult(const TestPartResult& test_part_result);
  virtual void OnTestEnd(const TestInfo& test_info);
  virtual void OnTestCaseEnd(const TestCase& test_case);
  virtual void OnEnvironmentsTearDownStart(const UnitTest& unit_test);
  virtual void OnEnvironmentsTearDownEnd(const UnitTest& unit_test);
  virtual void OnTestIterationEnd(const UnitTest& unit_test, int iteration);
  virtual void OnTestProgramEnd(const UnitTest& unit_test);
};
{% endcodeblock %}

Also there is the brand new flag `--gtest_shuffle` allowing to run tests in a random order. Via `--gtest_random_seed=SEED` flag it becomes feasible to control the randomness of this order. If SEED is 0 the current time is used to initialize the random generator.

Reporting is going to be more compatible the JUnit. Using `--gtest_output` allows to generate reports which can be easily picked up JUnit compatible tools, for instance, Hudson.

Very cool that now in Visual Studio each failing test reports are duplicated to the standard "Output" window. It is very nice that this change is based on [my code][Output window fix].

[Output window fix]: http://code.google.com/p/googletest/source/detail?r=283

In addition the `--gtest_print_time` option is turned on by default. Very handy.

There are also some minor improvements:

* CodeGear support
* internal `tuple` implementation getting rid of the boost dependency when `Compile()` is used
* minor compatibility improvement for Solaris, Windows Mobile and some other platforms

The joy, no doubt!

I have stopped to develop anything without tests long time ago and Google Test makes this process easier and faster.

I have already upgraded to the version 1.4.0, and you?
