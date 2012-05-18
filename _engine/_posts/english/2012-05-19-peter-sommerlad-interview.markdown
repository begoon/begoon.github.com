---
layout: post
title: "Interview with Peter Sommerlad"
language: english
date: 2012-05-19 12:43
comments: true
categories: 
- english
---
![](/images/blog/peter-sommerlad.jpg)

> When you have a class where you believe you need to write a copy constructor and copy-assignment operator you are doing something wrong. // **Peter Sommerlad**

- - -

Today my guest is [Peter Sommerlad][]. I was lucky to attend his sessions at the ACCU 2012 conference recently. Peter is a C++ veteran and a contributor to the C++ standard. He is a professor at HSR Rapperswil, Switzerland, and director of IFS Institute for Software (http://ifs.hsr.ch). With a team of assistants and students he develops various tools and frameworks for C++ and other languages based on Eclipse.

[Peter Sommerlad]: http://wiki.hsr.ch/PeterSommerlad

Now we'll have a chance to ask Peter a few questions, which could hide behind his talks and presentations but still be very interesting for the readers.

### Hi Peter, thanks for the interview. I won't be original here, but I cannot skip this question. What happened in the past that you turned to computers and become a programmer? Please, tell us your story.

I was very good at maths in school and in the last year I could take an additional course that included programming a programmable calculator, a HP 33 which had a stack for operands. In contrast to some of my friends who had a Casio, a TI-59 or even a Commodore V(I)C 20 home computer, I had not yet any idea of programming. However, with some explanations by our teacher I was able to "port" a TI-59 register-based lunar lander I found in a magazine to the HP 33 provided by the school. Once I got the hang of it, I "invented" a simple game: a ballistic shooting game. Goal was to hit a target at a random distance that was obstructed by a random generated wall in between. Something like Angry Birds but in in 1982 on a pocket calculator with a 10 digit seven segment LED display. You needed a lot of imagination to understand the game. You input 2 numbers: angle and velocity and the program would tell you if you hit the wall or by what distance you missed the goal. That was the first program I remember to have written myself.

That course on programming the HP 33, and the suggestion by my older sister who knew someone studying "Informatik" who earned good money while still a student made me drop my plans to sign up for a maths major and start out to study computer science (named Informatik in German) in Frankfurt/Main. Before I started university I got my first "real but home-" computer, a Sinclair ZX Spectrum, with enormous 48kBytes and cassette tape mass storage. That meant programming in BASIC where according to our maths teacher the "computer will assign the memory automatically to the named variables and you no longer needed to remember what you placed into register R1 and R2". One of the first programs on my ZX Spectrum was drawing a red heart shape on the screen (yes, filling irregular shapes was a big problem then). I showed that my then girlfriend, but I am not sure she really appreciated that, since the computer got sometimes a bit more attention than she. I remember that, because from time to time I get reminded by her of that episode (we are now married for more than 20 years :-).

Then came university time and I had to learn assembly programming in the first semester on a Univac 1100. After the lecture on indirect addressing, one of my mates and me wrote a 2 statement program that created an endless indirect load to itself. Running it caused a "watchdog error" to occur after 2 seconds of CPU time (which was much on a mainframe then and meant all other programs were suspended for 2 seconds). After starting the program about 3 times, a guy from the operating team bursted into the computer room and shouted who was the one with our account. We slowly raised our hands and he took us to his office. After asking what we were doing and our explanation, he told us that he learned something. We had to promise never to run that program again and also never to tell that to our fellow students and got away with it. In the second semester came Pascal and now "real" programs. Pointers (in Pascal) were the first hurdle, because they were introduced without any application or motivation, such as a linked list. Only after that I was able to grok them. Some semesters later I started a job as a programmer in a small programming shop run by older fellow students. There I could actually apply my learning and got a lot of practice in solving real problems in a variety of languages, like dBaseII, Dataflex, UCSD Pascal, and Microsoft Pascal. For example, I implemented a B*-index based "data base" framework in Microsoft Pascal running on DOS.

I guess a very great impact was access to UNIX source code, especially the tools like make, awk, etc, during my diploma thesis project. I wrote a Modula-2 front end in C with lex and yacc. To be able to work at home, I had to port all the tools I needed on my 16 bit DOS computer. That required to understand the code's inner working and structure and thus I learned from Dennis Ritchie and his colleagues a lot. It grew my taste for simple and elegant code.


### Do you remember that "First Book" you read about computers and programming? And also what is your the most influential book across the entire career?

One of the first books on programming that I remember was Jensen/Wirth "Pascal User Manual and Report" and then Wirth's "Algorithms and Data Structures = Programs". However, the latter contained many bugs when the code was blindly typed in, for example, in the version I got, merge sort was not stable, so in principle that is a stable sorting algorithm.

However, there are so many books that influenced my thinking about programming it is hard for me to pick just one. But I can pick one that I co-authored: Pattern-oriented Software Architecture: A System of Patterns aka POSA1. First, while writing it I learned so much about software, architecture and teams. As well after publishing and while presenting parts of its material on conferences I met so many influencing people who clearly shaped me heavily. Some of them I call friends today.


### I was excited about your saying at the ACCU, that before using some cool and sexy features of C++, I must be given a C++ driving license by you. I had found this idea to be very useful and practical for teaching C++ and also setting up company coding standards. But how do you split the language to "allowed and recommended to everybody" features and "off-license" ones?

That is a tough question to answer. I was referring to C++11 and many language features that people learned in the past are no longer that relevant for non-library programmers. But I'd like to give you an example.

Stroustrup's "The C++ Programming Language" introduces a class Vector that manages its memory by a pointer as one of the examples for building classes. Writing such a class in a correct, exception safe way is very hard and even C++ experts make mistakes. A reader of that book might be tempted to build his own vector or string class (women are typically not that way) which is first wrong and second completely unnecessary. If put in his first project's code and used throughout it also introduces a maintenance burden in the long run. 

It is something like the situation with Wirth's algorithms and data structures. "All" students who had a hard time learning that will program a linked list as the first thing in their first job, because they will "need" it anyway. While that might have been true in C, we now have much better data structures in libraries that belong to our languages (not only C++). I could start ranting about the Java library's quality, but I leave that to my colleague who is teaching algorithms and data structures in Java at our university.

Now, after we learned what not to do, I recommend to use C++'s standard library, especially the algorithms, because loops is also what you learned and what is encapsulated there. With C++11 we no longer have to do resource management by hand, but we can use std::vector, std::string, std::shared_ptr/std::unique_ptr, etc, which will do all resource management for us and allows the compiler generated default constructors and destructors to be correct automatically. When you have a class where you believe you need to write a copy constructor and copy-assignment operator you are doing something wrong. With boost this is almost also always true in C++03.

To sum up, unless you have acquired a deep understanding on library implementation practices, use libraries instead of inventing your own. Even then, avoid unnecessary DIY resource management. After myself learning more and more about how hard it is to implement the standard library components correctly and portable, I greatly appreciate those who have the experience and patience to do so. That is actually close to rocket science. But typical problems to be solved by C++ do not require that, when you use the standard library and other libraries provided by theses rocket scientists. But remember, we are on the edge of tourist space travel.

### You contributed to the C++ 2011 standard. What were you involved to?

Not much, because I was late in the game. However, I managed to obtain funding from our school thanks to our headmaster Prof. Hermann Mettler to host the C++ standardization committee meeting in Rapperswil in August 2010. Some sentences in the section about std::async have been (re-)written by me with the support from many others in the committee and some other mostly editorial corrections. However, while writing my book on Simple C++ I often have to refer to the standard document and find minor mistakes regularly that will influence a future version when fixed by the editor.

### Is there something in C++ 2011 which you really hate?

How do you define hate? I can accept the standard like it is, because I know how it is actually produced. All the deficits that might annoy me are a target for fixing and working on the next version of the standard and I can work on that to do so. Sometimes you also have to accept the compromises the committee has to come up with.

If I would have been involved earlier and one of the features I championed would have been forcefully put down by my fellows I might be upset. May be, after thinking about that, I do not like that const is consistently put to the left, where logic tells me it should be put to the right. Both versions are syntactically allowed. I asked some people, if I should submit a paper to change that for a future version I was more or less forcefully held back by the elders. 

### Let's talk about TDD. I know you developed a unit testing framework called CUTE. I believe, you did have some major reasons developing your own library. Why CUTE? Which interesting features does it provide?

First, it is header only and thus gives no hurdle such as linking to start with, especially for my students. I wrote an article on why I wrote it and it was published in an [ACCU Overload magazine #75][1] (a slightly update version is available on http://wiki.hsr.ch/PeterSommerlad/wiki.cgi?CuTe). Main reason was that I was disappointed by CppUnit and also by another unit testing framework that I myself wrote for my work in the 1990s. Inspired by Kevlin Henney I tried to utilize the standard library and minimize the use of macros, even though, this meant, tests must be registered "manually" and aren't "automagically" registered by static initializers (that GoogleTest will employ in its macros). I wanted to avoid relying on static initializers, because I have been bitten by them in the past with shared libraries and their inter-dependencies. The burden of test registration is mitigated by our CUTE Eclipse CDT plug-in (http://cute-test.com). The plug-in will generate the test registration code for you and even analyses if you forgot to register a test function and provides a quick fix doing so. Also nice is the diff viewer for failed ASSERT_EQUAL() checks, but that requires your values to be streamable on a std::ostream&. That provides a slight hurdle for embedded developers who want to run the testing framework on an embedded target, because of the sometimes prohibitive size of the iostream code. However, I plan to release a version of CUTE later this year that allows to configure if diff output should be provided or not, enabling a run on an embedded target that doesn't allow iostreams.

Two of my students implemented the first TDD support for Eclipse CDT and it was productized by one of my assistants as part of our CUTE plug-in (http://cute-test.com). The TDD support will automatically generate variable definitions from using an unknown variable in code. It will furthermore generate class or enum types from using an unknown type in a declaration and it will also create (member-) function definition frames from calling an unknown function. This is very handy when either writing code in a test-driven or top-down design style. Soon the CUTE plug-in will integrate another student's work: Mockator. Mockator generates code and build-system settings within Eclipse CDT to enable dependency injection in existing C and C++ code by so-called seams. Seams were introduced by Michael Feathers in his great book "Working Effectively with Legacy Code". Based on these seams, Mockator can also generate test stubs and mocks for functions and types. You can read more about Mockator and its features in [ACCU's Overload magazine 108][2].

### "IDE vs Vi" holy war. I know you actively use and enhance Eclipse CDT for easier unit testing and refactoring. Do you think that IDEs are the only future because of massively growing complexity of software over the years? or it is still possible just using Vi and "make" efficiently and quickly develop sophisticated software?

I know vi since about 1985. I still use it regularly to create simple files, like one-off shell scripts. I love it for being available everywhere.

However, for serious programming a good IDE is today the tool of the trade. It is like using a powerful car compared to a children tricycle to travel hundreds of miles. Yes, there are people who are fast on a tricycle, however, a car is much more comfortable. May be a car is a bad metaphor and an agile helicopter would be better, since a good IDE such as Eclipse CDT allows to quickly navigate code that it is very easy to understand an existing code base even if it is huge. Definitions and declarations are a mouse hover or a click away and the IDE usually keeps track where you come from, so you can easily get back. Any Java programmer who has used an IDE like Eclipse intensively will only consider programming in another language if similar IDE features are available. We are working hard to make Eclipse CDT at least as good for C++ than it is for Java. That is hard work and any financial sponsorship to our institute is welcome.

### Do you believe that sport programming and programming contests should be a mandatory discipline for any student reading computer science?

In our university's program we ask our students to perform a lot of lab exercises in programming. Also at least 3-4 major one term development projects are part of the bachelor degree. Doing lab exercises in a fun way can help students learn. For example, I often give exercises in C++ to solve a problem without explicit loops or recursion, only STL algorithms are allowed. A loop solution might be obvious, but figuring out a more elegant algorithm call helps a lot. 

However, some contests are set up in a way that only speed is important and not the long term effects of clean code. That is one of the reasons I either provide or ask for unit tests in my lab exercises. I even provide unit tests in exams for code to be written by the students.

### We usually learn by examples. Can you recommend where a beginner can look at the examples of very good modern code?

Such examples for C++11 are hard to find, since compilers aren't around so long. In addition, many current C++11 example code is used to demonstrate the new features such as move semantics without really having a use case that is benefiting from that. I'll try in my upcoming book to give good examples. Be aware, many C++ standard library implementations are much more complex than code you want to look at, because they have to cope with strange environments (macros), provide backward compatibility and need to compensate for compiler (version) deficiencies. Solving these problems are not typical for a beginner and give a wrong impression on how to write your own code. I'll try to lead by example, but even CUTE has some warts, because I wanted to support C++03 with boost, std::tr1 and C++11. 

### What is the software development for you: craft or art? Do you think that good software must have beauty sources? Or if the requirements are satisfied, the tests passed, the coding standard is complied -- the job is done, no art or beauty -- just the result.

Software creation is art but also a craft. It requires thorough learning and practice to master. Most of art always requires also craft. They can not be separated.

I believe in code beauty. But that is relative, what is often good for beginners often suffers from the expert's elegance. Knowing the tools available to you is essential to master them. Only knowing std::vector, for example, but not the STL's algorithms will provide you working code, but not elegance, even if that is only counted by a function's McCabe complexity (by the way another C++ CDT plug-in currently developed by students).

We were the first ones after Bill Opdyke to try to implement C++ refactoring. We co-created large parts of CDT's internals to support refactoring and code generation based on ASTs (abstract syntax tree). So running the tests is not enough, code must be cleanly refactored. I do a lot of code reviews, and I often see chances to simplify it. But I doubt that talent can be automated, it is a mixture of taste and experience. It requires not only seeing the smells but also their removal. On the other hand, if you look at Martin Fowler's smells and refactorings they often come in contrasting pairs.

Some coding standards even promote what I consider bad practice and introduce unnecessary complexity. For example, Google suggests that "out"-parameters for functions should be implemented as pointers, even in C++. The motivation behind that is, that at the call site one would need to write foo(&var) to pass the address of the variable deliberately. This is thought to improve code readability. However, while necessary in C due to the lack of references, this guideline just imposes C problems solved by C++ references onto C++ code. Within such a function, one must check that the passed in pointer is not nullptr (to use a C++11 term) and one never can be sure it is actually valid if the caller made a mistake, or one could ignore the problem at all and crash when a user passes nullptr. A C++ solution should declare the function to take a reference instead, like void foo(type & var); and an IDE will show that when you hover on the call site, without the additional need of marking it in the code by an ampersand. Using the language features effectively to write less and simpler code should be the guideline and not the protection of programmers sticking with legacy editors and not knowing their tool.

A coding standard or any rule is only good if it can actually be enforced. Tools like (PC-)lint help to do that. Often such classic tools are command-line and build-process based. More modern versions are integrated in an IDE and provide not only analysis but also quick-fixes for the found problems, for example, FindBugs for Java or FXCop for C#. Configuring them to avoid false positives without missing real problems is always an effort. To ease the application and use of lint, we created Linticator an Eclipse CDT plug-in that will automatically configure lint and run it and visualize its results within the IDE (http://linticator.com).

### Can you name three the biggest "no-no" for programmers in any area?

Being too self confident, instead do write (Unit) Tests and run them regularly. Any current software without automated tests is unprofessional in my view.

Lack of architecture or architectural knowledge is one of the big problems I often encounter when doing code reviews. This is often fostered by lack of understanding of good design.

A simple last thing: global variables also in the disguise as singletons. Pass in all dependencies from the outside as arguments. This will also show you, where you have too much coupling. Know the patterns to deal with that and writing unit tests helps you to avoid that early.

### Which programming language would you recommend as a very first one for beginners?

There are so many to choose from. I do not want to recommend one, because each will have its deficits. It is more important to learn more than one and those with different paradigms such as functional, object oriented, dynamically typed, statically typed, compiled, interpreted, virtual machine-based or machine language translated. An old saying is "you can write FORTRAN code in any language". This should not be done with multiple languages, but you need to learn and apply the language's idioms consciously.

### Today there are plenty of educational resources available online. You can even be officially graded online. Do you believe that on-site education is still important?

Yes. Interaction with students is so important. It is not only them getting feedback, but it also allows me to learn from them and improve my teaching. Both kinds of feedback are important and are more efficient when immediately. A remote learning environment can not provide that bi-directional feedback, but it can be a great help for those who can not be there for some reasons. But I believe it is very expensive to provide a good remote learning environment.

### In the martial arts they have the concept of schools, or styles, and they compete trying to prove the excellence. Is there something similar to the software development?

I know of people to use martial arts metaphors, such as coding dojos. I have no idea about martial arts, the only sport I like, except regular cardio-vascular exercise, is skiing. This is not a team sport but allows me to get into flow and forget everything. Intensive work can be like that. But software is a team sport and regular exercises of standard moves, aka, code katas can help to shape your subconsciousness in taste for good code and style, but only if you either have that already or get the feedback to develop that. A problem I see is, that many teachers of programming novices lack the (current) practical experience of programming (including myself, but at least I try to be exposed to code regularly).

### Hiring. If you need to hire a good C++ developer, how would you do that? The language is very complicated, so how would you asses a good developer?

I always have asked for code examples written by the person. Once I declined a very good PhD for exactly the reason that his code was badly written and "smelly".

Today, also the willingness to adapt to change and architectural taste is important. A candidate must understand Patterns and must know there are more than 23 GOF patterns. And better even understand that some of them like Singleton are better not employed in a software's design.

### Well, wrapping up. The final question: do you think in software development that we choose our profession, or the profession chooses us?

I started out by choosing my university subject. However, the great thing about software is that we are able to invent and create our own tools. It is like if a baker would be able to create a new oven or dough mixer by baking it. So after learning a bit of it, I actually got chosen by my profession. I am doing it for about 30 years now, teaching it for about 25 years (I started teaching programming while still university student), writing articles and books about it since about 18 years and still love doing all that. I have as my goal to make this world a better world for programmers and thus hope to rid our world from bad software. I understand that I will not achieve that, but it gives me a lot of direction.

&#9632;

**Thanks Peter for you time. Looking forward for your new software and talks.**

[1]: http://accu.org/var/uploads/journals/Overload75.pdf
[2]: http://accu.org/var/uploads/journals/overload108.pdf

*// May 16, 2012*

*// Peter Sommerlad, Alexander Demin*
