---
layout: post
title: "An interview with Anthony Williams"
language: english
date: 2012-07-24 22:23
comments: true
categories: 
- english
- interview
---
Today my guest is [Anthony Williams][], the author of the recently
released book "C++ Concurrency in Action". Residing in West Cornwall
and being able to see the sea from his office, Anthony develops and
maintains C++ libraries, participates in proposals for the C++
standard and runs a company called "[Just Software solutions][]".

[Anthony Williams]: http://www.boost.org/users/people/anthony_williams.html

- - - 

![](/images/blog/anthony-williams.jpg)

> Unless the multithreaded code is going to
be clearly faster, then writing single-threaded code will save you a
lot of headaches.

- - - 

[Just Software solutions]: http://www.justsoftwaresolutions.co.uk/

I recently purchased his book about concurrency in C++. To be honest I
haven't met better material so far about C++ 2011 memory model. Today
we have an opportunity to ask Anthony a few questions, and, of course,
particularly about C++.


**Hi Anthony, thanks for the interview, and let me begin from
afar. Programming, computers, C++... Why had you chosen this way? What
dragged you on this route of bits and bytes?**

I've always been interested in computers, and it turned out that I was
reasonably good at programming them. We had a Sinclair ZX81 at home,
and a BBC Micro at school when I was around 7 or 8, and it all started
from there. I used to examine the source code of the games to see how
they worked. When it came time to apply for jobs after my degree, I
was quite clear in my mind that I wanted to do programming. It
was fun, interesting, challenging, and you got paid for it!


**I suspect that C++ wasn't the first language you've learned. Have
you ever programmed in some unusual languages at early days?**

C++ wasn't around when I started programming, so no it wasn't the
first language I learned. I started with BASIC. All home computers had
some variety of BASIC built in, and it was a while before I realised
there was anything else. Some programs were written in machine code,
so I learnt that next --- converting Z80 assembly language to hex
codes by hand and typing them in as DATA statements of a BASIC loader
program.

I don't think I've programmed in anything that was really unusual, but
I've used quite a few languages for various different
systems. Programming a PIC with only 100 bytes of program space was a
challenge, and I don't suspect many people ever programmed the Psion
Organizer II, though the programming language for it was similar to
BASIC in many ways.


**Can you recall any influential or maybe even outstanding books that 
helped establish yourself in the career?**

Hmm. It would have to be the Z80 programming reference I had when I
was around 10 or 11. I can't remember the title, but I devoured that
book. I knew every instruction by heart, including the hex opcodes and
the clock counts. I found a similar guide to the 8086 on a shareware
disk when we got a PC, printed it out and devoured that too. 

These days my bookshelves have books like Design Patterns,
Refactoring, and The Art of Computer Programming, though I still like
to keep "close to the metal" with things like Intel's Software
Optimization Cookbook.


**Now C++, and concurrency. Missing on opportunity for a few
questions to the expert seems to be not such a good idea. So, to begin
with, what don't you like in the C++ 2011 concurrency support?**

Good question! I don't think there's anything that I can point at and
say "I don't like the way that works". I think it was a shame the
"is_ready()" function got removed from future and shared_future, since
it's useful, and you can achieve the same goal with
wait_for(seconds(0)) anyway.


**You're a maintainer of the Boost thread library. At the same time
you develop your own library for concurrency in C++ called
[just::thread][]. What is special in this library?**

[just::thread]: http://www.stdthread.co.uk/

Just::Thread is a strict implementation of the C++11 thread library,
highly optimized for the specific platforms targetted, whereas
Boost.Thread is aiming for portability, and doesn't have the same
interface or semantics in several cases. Though Boost.Thread is being
brought further in line with C++11, it still lacks std::async, which
is present in Just::Thread.

Just::Thread also has a special "checked" build which will identify
the call chain leading to a deadlock should one occur.


**Actors and the concept of sharing by communicating. It looks that the lack of this functionality doesn't allows the concurrency in C++11 to shine in full power. Can you recommend any libraries providing such functionality?**

The Just::thread Pro library currently in development will provide
actors. There is also an example in my book of using message queues to
create actor-style code.


**I recall your saying that multi-threading in computations is
tricky because it starts to make sense only after a certain volume. Do
you have any recommendations on when it's worth considering a
concurrent and multi-threaded solution, and when it isn't?**

Yes, there's an overhead to setting things up for multithreading. If
your computation is quick enough then you may well be better off
writing it single-threaded. Unless the multithreaded code is going to
be clearly faster, then writing single-threaded code will save you a
lot of headaches.

As ever, the key to optimizing for performance (and multithreading in
this scenario is just that --- an optimization) is to profile your
application. Where is it spending its time? Can you parallelize that
section? As Jason McGuiness demonstrated in his presentation at ACCU
2012, if you parallelize the wrong part of the code then it can be a
lot of effort for no gain whatsoever.


**Now, TDD. Where are you in this area? Have you embraced TDD and
now use it everywhere? Is TDD applicable for developing concurrency
libraries, for example, in C++?**

I like TDD, and use it all the time. It encourages you to work in
small steps, and the test suite you build up ensures that scenarios
you've tested already don't break as you address new scenarios.

It's a bit harder to do TDD when developing concurrency libraries, but
not impossible, and I still do it. The trick is in structuring your
test to check the right thing. You typically need some form of barrier
(I often use a std::promise with std::shared_future) so that you can
set up all your threads in the right state, and then say "go!" The
best way to test concurrent code is still to remove the concurrency
--- have well-defined communication mechanisms, and then test each
thread in isolation.


**Do you think that the code must be ideal, no trade-offs, no
tolerance to inaccuracy or lack of the beauty? How do you judge your
own code for being ready to release?**

You should always /aim/ for perfect code. If you don't, then it is
very easy to end up with slap-dash unmaintainable code.

However, you don't always get to write perfect code. Sometimes you
can't see a way to make it better, or the changes required are too
extensive for the time frame you have. It is always better to have
code that works correctly rather than code that looks pretty. If you
have extensive tests then you can refactor your code later to a better
structure without worrying about breaking it.

I judge code to be ready to release when I can't think of a
circumstance that would break it. If I can think of such a
circumstance then I write a test for that, and fix it.


**Can you name your three biggest "Never ever do that!" for programmers? and also for C++ programmers?**

Tricky! "Never" is a strong word.

Here's some things you should rarely do, in no particular order:

* Use global variables. Pass things you need as parameters or hold
  them as member variables rather than relying on globals, as globals
  make access patterns hard to understand.

* Use singletons. These are just global variables in disguise, and
  should be used with the same caution.

* Write multithreaded code without carefully thinking through the data
  access patterns from the separate threads. If you're going to write
  multithreaded code, take the time to do it properly. You'll save
  yourself a lot of effort in the long run.

For C++ specifically, you should rarely:

* Use malloc and free. This is C++, not C.

* Write code that requires you to use "delete". If you have to use
  "new" then you should probably be using a smart pointer such as
  std::shared_ptr or std::unique_ptr to manage the memory. Often
  you're better off using a container like std::vector to manage
  everything anyway.

* Overload operators in an unconventional manner. Sometimes it can be
  really useful (e.g. using << for stream insertion), but having a+b
  mean anything other than "adding" for the relevant data types is
  likely to yield confusion.


**You wrote a book. Please, shed some light on this process. Why
have you decided to write it in the first place, and how long did it
take to prepare "C++ Concurrency in Action"? What was the most
difficult part of it?**

I wrote "C++ Concurrency in Action" because the opportunity came up,
and I was one of those best-placed to write it, having been intimately
involved in the drafting of the relevant sections of the C++11
standard.

It has taken 4 years to put it all together. One of the reasons it
took so long is because the C++11 standard wasn't finished when I
started writing, and I had to add, remove and revise sections as the
draft standard evolved, but even without that it was a lot of
work. The hardest part was rewriting sections based on feedback from
reviews.


**Can you recommend other books about concurrency and multi-threading?**

"Patterns for Parallel Programming" by Mattson, Sanders and Masingill
is a good overview of how to structure parallel programs.

"The Art of Multiprocessor Programming" by Herlihy and Shavit is also
good, but much lower level. This covers things like visibility,
atomicity and consensus, and implementation of low-level structures
such as queues, spin locks and monitors.


**Now the question I ask everybody: sport programming and
programming contests. Is it important to any developer to spend some
time regularly solving puzzles? And have you even been involved in
developing or implementing sophisticated algorithms?**

I love puzzles. To an extent, programming is one big puzzle; that's
what makes it interesting.

I think puzzles use the same sort of thought processes as programming,
so regularly doing puzzles can improve your programming. Practising
anything helps make you better, so programming puzzles and contests
are good for that --- you have to break from your "normal" programming
routine to focus yourself on something different, and try things
out. I like the Intel Threading Challenge that they've been doing for
a couple of years now. Even if you don't enter, it can be good to do
the challenges --- they are fun, and really stretch you.

I did have a lot of fun once working on an algorithm for assisting
helicopter maintenance engineers tune helicopters. They take a series
of measurements from the helicopter with special equipment whilst it
is flying in a series of different conditions, and then the software
tells them what to adjust to make it fly better. Since helicopter
flights are expensive, the goal was to tune the helicopter with the
minimum possible set of test flights.

**Are you an IDE or Vi/make guy? Do you think that it is still
possible to develop sophisticated software simply in Vi, or all those
days passed and considering proper IDEs is an inevitable step in
enterprise software development?**

I use emacs and make. I haven't yet found an IDE that makes life
easier for me. I think there's a lot of potential in Eclipse/CDT,
especially with the enhancements that [Peter Sommerlad][Interview with Peter Sommerlad]'s team are adding, but I haven't found it enough to
switch yet.

[Interview with Peter Sommerlad]: /blog/english/2012/05/19/peter-sommerlad-interview/

**Do you think that "The Last Programming Language" exists? Or may
it exist at all? Is it C++?**

There is always scope for improvement in a programming language, and
any given language makes some things easy to express and others hard,
so I'm not sure that the "last" programming language could really
exist.

If we ever get a sufficiently advanced AI, then we'll end up using
natural languages rather than specific programming languages, but I
think that's a long way off yet.


**Let's talk about hiring. If you need to hire a good C++
developer, what kind of questions you'd prefer you ask?**

To some extent that depends on what I need from a new hire. If there's
time to train someone then specific C++ knowledge is not an issue, and
I'd want to focus on things that highlighted general "developer
aptitude".

If I needed someone who already knew C++ then I'd want to ask
questions that demonstrated that knowledge as well.


**Wrapping up, do you have a list of, say, three things which each developer must implement through his or her career?**

I'm not sure there are 3 things that *every* developer should
implement. However, there are definitely things to be learnt from
implementing basic data structures like lists and hash-maps, so I'll
take that as the first one.

For a second, I think a language parser can provide useful insight in
putting together data structures, even if it's a parser for a simple
configuration file language rather than something complicated like
C++. I think an arithmetic expression parser can be quite fun to write
as a simple exercise.

Finally, I think it is worthwhile writing a client-server
application. A web-app with Javascript code in the browser, and
something running on the server would work for this, but anything
where you are making calls from the client to the server over the
network will do. The point is to do something where making a server
call is considerably more expensive than making a local function
call, so you have to consider the cost when designing the API. If
there's a UI then it can also be an exercise in handling backend
latency whilst providing a "responsive" UI.


**Thanks, Anthony. Looking forward for your new talks and books, hope for your future appearances on conferences.**

&#9632;

*// Anthony Williams, Alexander Demin*

*// July 2012*
