---
layout: post
title: "Cross platform Perforce source patcher"
language: english
date: 2009-09-28 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/09/cross-platform-perforce-source-patcher.html
categories: 
- perforce
- english
---
It's almost impossible to imagine modern software development without using version control systems. There are quite a few players on the market - open sourced, proprietary and in between. One of the last ones is Perforce. This is a commercial product but it's available for personal home use. I work for the big software house in the UK and we intensively use Perforce as SCM backend. Perforce is quite handy and flexible SCM despite of a few minor problems but I would say in general these are conceptual issues which are coming from the different approaches I might have vs. Perforce authors on how the source version control should or should not be implemented. 

For instance, the specifics of the development in our company are that we support and develop our products on many platforms such as Linux, SunOS, AIX, HP-UX, Tru64, Windows etc. Talking about platforms, even for UNIX family the development of portable software is quite a challenging problem. For example, multithreading and networking are not straightforward enough to be implemented portably right away. Every time a new piece of code or a patch is coming up it must be verified on all supported platforms starting from just compilation up to unit testing and QA. 

Unfortunately Perforce is not quite flexible in this instance. Here is an example of the obvious development cycle: The piece of code is initially developed and tested on one machine, therefore any added, changed, deleted or integrated files are in the "submit pending" list on this machine. When the developer is about to check it in, unfortunately for him and fortunately for other team members, he must check his new code on other development boxes. Perforce does not provide the mechanism of the "soft-submit" or allow temporary check-in of the new code with subsequent check-out on another machine for testing purposes. This process also becomes really painful when the amount of the pending code is quite large, the number of machines where you have to check the code is also not just one or two, and on top of it the number of iterations for "change-submit-check-revert" is exceeding a few dozens per day. 

The tool I am going to tell you about aims to salvage this issue. It allows transferring your current Perforce pending list from one development box to another in split second. 

The following assumes that the reader is a bit familiar with using Perforce. 

Of course a normal UNIX user will offer some kind of simple scripts to automate the process, which was my thinking initially as well. Unfortunately the scripting is not 100% portable due to so many different shells involved (ksh, bash, csh). If that wasn't enough unfortunately Windows "scripting" is also involved into the process, and its behaviour is far from UNIX way even with the use of Cygwin. My first version of the tool was written on Korn shell but it was not really portable between UNIX and Windows. The second version was written on Python and it would be just fine apart from Python not being easily available on all development boxes in case the development involves a little bit dodgy platforms such as HP-UX and AIX. 

Finally I ended up with the third version completely rewritten on pure ANSI C. The final name is `p4p` (P4 Patcher). The idea is for the tool to be distributed in source and compiled on the target platform just before use. Also, the tool is targeted to provide maximum debugging and error related information on the runtime. It helps the end user (the developer) to fix the tool if it does not work properly on any particular platform. I have been successfully using the tool on Linux, SunOS, AIX, HP-UX and Windows. The most exciting thing is that I can easily transfer the pending change list between all these platforms. 

I put the source to the Google Code - [p4patch][] and it can be checked out from there. You will then have to compile and run it on other development machines.

[p4patch]: http://code.google.com/p/p4patch

So let's step away from the theory and look into something real. Let's assume you have a bunch of files ready to submit on your box. The Perforce `p4 opened` command shows that list. 

Here is the crush course for your next steps:

* Get the source [p4p.c][]
* Compile it under your platform (on a remote machine and on your local one)

[p4p.c]: http://code.google.com/p/p4patch/source/browse/p4p.c

Linux, AIX, HP-UX:

    ./compile-unix.sh
    
Solaris:

    ./compile-solaris.sh
    
Windows:

    compile-vs2008.cmd
    
Run the p4patch server on the remote machine (e.q. 192.168.1.9): 

    p4p server
    
Generate a patch archive on the local machine via `p4p diff` (`patch.tar` will be created). This command uses `p4 opened` to get the list of the files included into the patch and packs them into a TAR archive. The file list can be provided explicitly via `-o` option. 

By `p4 opened | grep ...` you can generate your own customized list.

Apply the patch on the remote machine:

    p4p patch -h 192.168.1.9
    
List opened files on the remote machine: 

   p4p exec -h 192.168.1.9 -p4 opened
   
See the diff on the remote machine: 

   p4p exec -h 192.168.1.9 -p4 diff
   
Revert a patch on the remote machine: 

   p4p revert -h 192.168.1.9
   
Display the P4 version on the remote machine: 

   p4p exec -h 192.168.1.9 -p4 -V

While p4p server is running on the remote machine you can fully control the remote P4 client and also apply/revert your patch. The patch itself is the standard TAR file containing files affected by your patch and the file list. 

When p4p applies the file change on the remote machine it always tries to preserve the current line ending used on the remote platform. 

If several people work on one machine in parallel they cannot share the same TCP/IP port for the p4p listener. They need their own port number. The default p4p port number is 20050. If you want to use your own port, follow these commands (i.e., assuming that you plan to 30001 as your port): 

Run the server on your port:

    p4p server -l 30001
    
Client side:

Apply the patch on the remote machine:

    p4p patch -h 192.168.1.9 -p 30001
    
List opened files on the remote machine: 

    p4p exec -h 192.168.1.9 -p 30001 -p4 opened
    
See the diff on the remote machine: 

    p4p exec -h 192.168.1.9 -p 30001 -p4 diff
    
Revert a patch on the remote machine: 

    p4p revert -h 192.168.1.9 -p 30001
    
Display the P4 version on the remote machine: 

    p4p exec -h 192.168.1.9 -p 30001 -p4 -V
    
If your find that p4p cannot start the server perhaps somebody else uses the same port. Choose another port is this case. p4p started with `-?` switch prints all options available.

Finally I would give my point of view on the workflow using Perfoce on several boxes at the same time.

I always try to preserve the cross-platform consistency of a change set. It means when I have finished to polish a change set on my main working box (let's say Windows) and it works okay, then I use p4p to push this change set to another box (say Linux) and debug it there. If any changes needed for Linux I do it on the MAIN box (here it is Windows) and then push it again to the Linux. p4p works almost instantly so this process of pushing changes from the main box is very comfortable. Then I step to the next platform and so on (HP-UX, AIX etc). When I get it working on all boxes (it works, tests are passing etc.) I submit that change set from the MAIN box. 

I try to avoid working on the same change set on different platforms (I mean "working" as doing source changes).

Hope all the this will help to improve your Perforce workflow.
