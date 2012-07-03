---
layout: post
title: "Can Java be faster C++?"
language: english
date: 2012-07-03 22:20
comments: true
categories: 
- benchmark
- cplusplus
- english
- java
---
I have a friend, [Stas][]. As true programmers we periodically argue on a million dollar question: what is faster, C++ (me) or Java (he), especially along with having various amounts of various drinks. Undoubtedly, not the technology, a social part of such disputes is the main one. But sometimes, sober-headed, when I think about such comparison, I cannot convince even myself that Java can work faster or at least with the same speed as C++.

[Stas]: http://stas-blogspot.blogspot.com/

Let's assume that:

- We compare C++ 2011 generating native code and vanilla Java 7 generating JVM code. The JVM code will be compiled into machine code by the JIT compiler later on at runtime when the code is executed first time.
- Suppose, both C++ and Java compilers generate the most effective code as language semantics in a maximum.

Denote `A` to be the linear machine code execution speed, `B` -- the speed of compiling bytecode into  machine code. So, the overall execution speed is:

    V(C++) = A1 + B1
    V(Java) = A2 + B2

Obviously, `B1 = 0`, because C++ generates native code and doesn't require extra work at all at runtime. But `B2` is *always* greater than zero by definition. Regardless how effective the JIT compiler is, it *always* requires some time to compile bytecode into native code. Furthermore, it doesn't compile all at once. It compiles "just-in-time" when the code is actually executed. There is always a non-zero probability that the program execution flow may be paused by the JIT compiler. Even we assume that the JIT compiler uses sophisticated code prediction algorithms to reduce `B2` as much as possible, it cannot eliminate `B2` completely. 

Now let's have a look at `A1` and `A2`. These parameters define how fast the generated code is. In my personal, totally subjective and biased view, C++ (not C) has more chances for better optimization because of the templates (the compiler has full language semantics to inline) and the native machine code generation (the compiler can use the most effective machine instructions in each situation). Unfortunately, I'm not an expert in Java generics. I have just heard that they are not "native" citizens in Java. Also the Java compiler has to generate portable bytecode and cannot optimize on each particular platform. I hope, the JIT compiler tries to optimize it at runtime but there is no semantics information available anymore. Then the JIT compiler faces the trade-off between the speed and quality of compilation. C++ doesn't have this problem because the compilation phase can be as long as necessary.

Well, I cannot convince even myself that Java can be faster than C++. I'd like to, but I have no arguments.

With Stas we did a few straightforward benchmarks based on QuickSort. Java worked ~10% slower on average.

Prior to C++ 2011 we could say that C++ had no a well-defined memory model and a standard library for concurrency. It might allow Java to beat C++ using multi-threading and concurrency. But now C++ has these features. In general either C++ or Java provide pretty low-level API for concurrency comparing, for instance, to goroutines in Go or actors in Scala (though `std::async()` is quite powerful feature now in C++).

Agreed, 10% don't always play the key role. Sometimes, advanced mechanisms of introspection, IDEs, managed execution, code hot swapping, etc. -- in fact, everything what the Java *platform* provides, are more important than just byte threshing. But there is nothing about speed, right?
