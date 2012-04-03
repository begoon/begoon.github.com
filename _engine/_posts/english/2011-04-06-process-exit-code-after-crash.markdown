---
layout: post
title: "Process exit code after crash"
language: english
date: 2011-04-06 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/04/process-exit-code-after-crash.html
categories: 
- english
---
Just come across an interesting bug. Being executed from a Makefile script a unit test runner crashed. It looked like another memory corruption. But the consequence was more interesting. That Makefile kept going regardless the crash of the unit test runner. It means the runner still returned zero exit code instead of non-zero.

We fixed that bug (including Makefile problem) but a generic question occured: what exit code is returned to the parent when the process crashes before executing [exit()][]?

[exit()]: http://linux.die.net/man/3/exit

In UNIX there are special macros inspecting the status returned from [wait()][]. But all UNIXes are different and there is Windows as well.

[wait()]: http://linux.die.net/man/2/wait

Eventually I wrote a simple self-killing program:

{% codeblock lang:cpp %}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(int argc, char* argv[]) {
  char cmd[80];
  int r;
  sprintf(cmd, "%s ?", argv[0]);
  if (argc > 1) {
    if (argv[1][strlen(argv[1]) - 1] == '1')
      *(char *)0 = 0;
    exit(0x77);
  }
  printf("Normal: %08X\n", system(cmd));
  cmd[strlen(cmd) - 1] = '1';
  printf("Crash : %08X\n", system(cmd));
  return 0;
}
{% endcodeblock %}

And run it on different systems.

Windows 7, Visual Studio 2010, `cl crash.c && crash`:

    Normal: 00000077
    Crash : C0000005

Linux x86_64 (`cc -o crash crash.c && ./crash`):

    Normal: 00007700
    Crash : 0000000B

Signal 0x0B (13), by the way, is `SIGSEGV`, segmentation violation.

Solaris SPARC 5.10:

    Normal: 00007700
    Segmentation Fault - core dumped
    Crash : 00008B00

HP-UX Itanium 2:

    Normal: 00007700
    sh: 25112 Memory fault(coredump)
    Crash : 00008B00

AIX 5.2:

Normal: 00007700
Crash : FFFFFFFF

Here seems the exit code wasn't even propagated to `system()`.

Conclusion: it (as usually) really depends on the operating system.
