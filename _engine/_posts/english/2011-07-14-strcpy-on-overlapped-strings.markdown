---
layout: post
title: "strcpy() on overlapped strings"
language: english
date: 2011-07-14 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/07/overlapped-strcpy.html
categories: 
- english
---
Consider the code:

{% codeblock lang:cpp %}
#include <string.h>
#include <stdio.h>

int main(int argc, char* argv[]) {
  char b[32];
  strcpy(b, "123456789012345");
  strcpy(b + 1, b);
  printf("[%s]\n", b);
  return 0;
}
{% endcodeblock %}

There is a problem here because the parameters of `strcpy()` overlap.

This is an unpredictable behaviour because `strcpy()` doesn't guarantee the order of moving bytes (from left to right or vice versa) but the result depends on it.

Check on different compilers and platforms.

**Visual Studio 2010 64-bit**

    [1123446788012245]

The result is corrupted every four bytes. Obviously, it has been copied 32 bit words.

**Linux 64-bit**

    [1123456788012345]

The result is now different. Compiler and libc:

    ldd --version
    ldd (GNU libc) 2.5

    gcc --version
    gcc (GCC) 4.1.2 20080704 (Red Hat 4.1.2-50)

`man strcpy` says:

    The strings may not overlap...

Why not "must not"?

**Solaris (SPARC)**

    [1123446788012245]

Compiler and libc:

    cc -V
    cc: Sun C 5.8 2005/10/13

    version /usr/lib/libC*
    version of "/usr/lib/libC.so.3": SC2.0.1 12/20/94 Sun C++ 3.0.1 patch 100962-09
    version of "/usr/lib/libC.so.5": Sun SUNWlibC SunOS 5.10 Patch 119963-06 2006/04/21
    version of "/usr/lib/libCrun.so.1": Sun SUNWlibC SunOS 5.10 Patch 119963-06 2006/04/21
    version of "/usr/lib/libCstd.so.1": Sun SUNWlibC SunOS 5.10 Patch 119963-06 2006/04/21

**AIX**

    [1111111111012245]

This result is clearly wrong. The man pages are pretty clear on it:

*String movement is performed on a character-by-character basis and starts at the left. Overlapping moves toward the left work as expected, but overlapping moves to the right may give unexpected results.*

Compiler and libc:

    lslpp -L | grep Compiler
    vacpp.cmp.core            8.0.0.20    C     F    IBM XL C/C++ Compiler

    lslpp -L | grep libc
    bos.rte.libc               5.3.9.1    C     F    libc Library

**HP-UX**

    [1123456789012345]

Compiler:

    what `which cc`

    HP C/aC++ for Integrity Servers B3910B A.06.22 [Nov 14 2008]

This result is correct but man pages warn in a funny way:

*Character movement is performed differently in different implementations, so moves involving overlapping source and destination strings may yield surprises.*

**Conclusion**: `strcpy()` is bad, due to many reasons.
