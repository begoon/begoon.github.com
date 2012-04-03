---
layout: post
title: "Stuck process detector"
language: english
date: 2012-01-05 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/01/stuck-process-detector-english.html
categories: 
- english
---
There is a problem — how to automatically detect stuck long running server processes? Say if a process is stuck it means there is a deadlock or it is spinning in an infinite loop.

An idea — periodically take a snapshot of the process stack trace. For instance:

    #0  0x991a8c22 in mach_msg_trap ()
    #1  0x991a81f6 in mach_msg ()
    #2  0x968870ea in __CFRunLoopServiceMachPort ()
    #3  0x96890214 in __CFRunLoopRun ()
    #4  0x9688f8ec in CFRunLoopRunSpecific ()
    #5  0x9688f798 in CFRunLoopRunInMode ()
    #6  0x92158a7f in RunCurrentEventLoopInMode ()
    #7  0x9215fd9b in ReceiveNextEventCommon ()
    #8  0x9215fc0a in BlockUntilNextEventMatchingListInMode ()
    #9  0x90010040 in _DPSNextEvent ()
    #10 0x9000f8ab in -[NSApplication nextEventMatchingMask:untilDate:inMode:dequeue:] ()
    #11 0x9000bc22 in -[NSApplication run] ()
    #12 0x902a018a in NSApplicationMain ()
    #13 0x0012e356 in main ()

For Linux, HPUX and Solaris there is a tool called `pstack`, and `procstack` on AIX. I’m sure it is possible to do the same on Windows because Process Explorer can do it.

Comparing the current stack trace with the previous one we can measure how much it has been changed. If the stack wasn’t changed at all or only a few deepest lines were changed (for example, inside the kernel), we may assume that this process is stuck. The deadlock on a file or database is even simpler because the code will be blocked on a function inside the kernel.

Of course, such detector has to be adjusted for specifics of the monitored processes. But it can be configurable via regular expressions or a script language as Lua, for instance.

The good thing is that such monitor doesn’t require any changes in the target software, and can be implemented on any language suitable for easy text parsing, for example, Ruby or Python.

Am I reinventing a wheel?
