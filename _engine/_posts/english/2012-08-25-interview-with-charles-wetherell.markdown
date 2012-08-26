---
layout: post
title: "Interview with Charles Wetherell"
language: english
date: 2012-08-25 20:01
comments: true
categories: 
- english
- interview
---
Today my guest is Charles Wetherell, the author of "Etudes for Programmers", published in 1978. It remains a source of fascinating and realistic problems for computer science students in a wide range of disciplines. Charles is now a Computer Scientist at Oracle and he agreed to write about himself and "Etudes". Thanks, Charles, for the interview. 

- - - 

![](/images/blog/charles-wetherell.jpg)

> Programs should always have the form of paragraphs of comments that describe the intention of the program followed by paragraphs of code that implement that intention. All of the formatting should be designed to make readers as able as possible to read the code easily; the compiler doesn't care. In particular, follow conventions of mathematics and your native language, not those you found in some random language manual. Write the comments first and then write the code, not the other way around. If you don't know what you want to achieve and why, any code you write is, by definition, incorrect.

- - - 

**"Etudes" is very different from other computer science and programming textbooks. "Etudes" covers most of the important areas in a quite an unusual way. How did you come up with the idea to collect realistic problems from various areas and  put them in a play situation? Could you tell us a little story about how and why the "Etudes" were born?**

From 1974 to 1979, I was teaching at UC Davis. There was a new Computer Science graduate group there formed to give degrees in Computer Science, but it was really just a loose collection of faculty members from several departments. The department of Applied Science hired me as the first professor with a computer science degree to pull the program together. Along with a small group of other professors and adjunct instructors, we designed a new curriculum, put degree programs in place, and began teaching a number of new or redesigned courses.

During this redesign, I got the other faculty to agree that students needed to know how to work in the real world as well as to learn the theory surrounding computer science. By "work" in the real world, I don't mean that I wanted to teach them "job relevant" topics; in my experience, such knowledge becomes obsolete quickly. Rather, I wanted to have them work on problems that included making imprecise specifications precise, on problems whose requirements were unclear, on problems that had real world application, on problems that required working with other people. For example, in the compiler construction course, students were required to work in two or three person teams and the same grade was assigned to everybody on a team. Part of the assignment was to write up how they divided their work and whether they thought the division was successful.

After a bit, we decided to teach a programming projects course to consolidate student knowledge of how to build complete applications. We thought of a few projects and I wrote them up. But when I looked around for more, I could only find one book that had only "toy" exercises in it -- for example, print a table of all the possible binary Boolean operators. I also found one or two problems that Carnegie-Mellon used in one of its courses. So before long, I was writing "Etudes". As it turned out, I left UC Davis soon after the book was published, so I don't really know if they continued to use it in the projects course.

**How long did it take to write the book?**

"Etudes" took about 18-24 months start to finish. I had written up a few chapters for course work already. Contract negotiation was very fast, as I remember; perhaps only a month or so. I spent about a year writing the remaining chapters. Of course, I had to fit that around my other work. Then there was perhaps six months of review and revision. Once everything was in place, I only had to wait a month or two after final galley proofs went in to see my first copy.

**Why didn't you publish any other books after "Etudes"? Why wasn't "Etudes" republished?**

I left UC Davis to go work at Bell Labs. While I was there, I ran a project that built one of the first Ada compilers. We published technical papers, but there wasn't a lot of time to write another book. After Bell Labs, I came out to Silicon Valley for a startup and, again, there wasn't a lot of time for book writing. I also started a family and taking care of kids is (as most parents know) fairly time-consuming. And then you know how it goes.

Back in the early 70's, Juris Hartmanis (one of my favorite teachers) told me that if you wrote a computer science textbook, you would make enough money to buy a new car. The reason was that there were at the time enough libraries who would all buy a copy of the book that the minimum income would be enough to buy at least a Volkswagen (VW Bugs were still around then!). If you got lucky, you might be able to buy a Mercedes Benz. And, of course, if you wrote something like Samuelson's "Economics", you could buy a new Lamborghini every year.

But for textbooks to do well, they have to be adopted in courses. Unfortunately, only a few colleges in the US adopted "Etudes". So there wasn't a lot of income from it. And the publisher had no real incentive to publish a new edition. There were a lot of individual people who bought copies, but that doesn't help for textbooks.

One odd thing did happen, though. Right after "Etudes" was published, the Soviet academic publishing office reviewed it and decided to buy the copyright so that it could publish "Etudes" in Russia and the other Soviet Union states. This was a real diplomatic breakthrough, actually; quite commonly, the Soviet Union had simply ignored copyrights in the past. The payment from the Soviet purchase was a pleasant surprise.

Unfortunately, though, not a very profitable one. They paid $1,200 for the rights and that wasn't a lot of money even in the late 70's. I got half or $600. The good part was that "Etudes" was translated into Russian and used widely in the Soviet computer science curriculum. I work, for example, with two Russians who used it as undergraduates. Alexander, you are a third! I think that there were at least 60,000 Russian copies published.

And what kind of car did I buy? Actually, I bought a brand new piano that's still sitting in my living room.

**How did you find topics for the etudes?**

There were several ways. One or two were problems I had in practical life. For example, the gasoline mileage etude and the investment etude came from things I worked on for myself. Some came from my interest in playing games with computers and ideas in artificial intelligence; obviously, the kalah and the management game were of that sort. The language problems at the end were revisions of the materials from our compiler course. Some of the problems are straight computer science just dressed up: the Turing machine, the map coloring, the format scanner.

Chapter 4 on automatic text formatting was inspired by a colleague at Lawrence Livermore Laboratory. He had written one of the very first automatic formatters and I had used it when writing my dissertation and the drafts for "Etudes". Remember, this was before Unix was well-known and even "nroff" was pretty fancy stuff. So a problem that introduced the topic seemed reasonable.

The problem solutions were just those that "fit" within the production confines of the book. And I wanted students to see what "real" code looks like. Notice that the last problem even says that the solution is incomplete.

**For each etude in the book you recommend how long it should take. Since 1978 programming languages have been "slightly" changed and become "a little bit" more powerful. But even nowadays, your timings recommendations look quite aggressive. Did you "play" the etudes yourself working over the book? Do you have your favorite one?**

In retrospect, this was a big flaw. The durations are aggressive even now, even with very good languages like Ruby (my current favorite) that would do a lot of the work for you. Remember that when "Etudes" was written, Unix was just becoming broadly available, Basic, Fortran, and Pascal were probably the most common teaching languages, and C was only just becoming known. There were essentially no terminals to program on (although my students actually did mostly have terminals because of their associations with Lawrence Livermore Laboratory) so that students still prepared program card decks.

I'm not sure I have a favorite etude. I like the TRAC interpreter. It teaches a lot about the fundamental topics of programming languages, topics that are often ignored in course work. As "Etudes" mentions, TRAC and Strachey's GPM are languages that were invented simultaneously and independently; the two author's published papers appeared within a few months of one another. The two languages are very similar and both show how a focus on text manipulation can solve large problems. It is particularly rewarding to study them together and to understand how they agree and differ. I also like the EC loader etude because I think it solves problems in programming language translation that are still common; why techniques like this are not still in use is beyond me.

I did not actually get a chance to do a lot of problems when I was writing the book. However, when I went to work at Bell Labs, I had to teach myself Unix and all its tools. So I decided to try programming the gas mileage etude in "awk". Oddly enough, I discovered a bug in "awk" itself that I reported to Brian Kernighan. He commented that he knew there was a problem, but nobody else had been able to pin it down. The bug turned out to be a computer science classic: "awk" was using some allocated memory after it had already been freed.

**I cannot skip a question about the etude about the Vigenere cipher. There were a couple of setups in that chapter, like a "tiny" typo in the form of a missing line in the crypto text, and also a slightly wrong hint about how to crack the cipher. Of course, it did not stop people from cracking it at all, and it turned out that those "accidental complications" made this etude even more attractive. Could you shed some light on what happened there?**

This is embarrassing. As it turns out, the publisher reset all the copy text before the book was printed, but I supplied the illustrations directly. Unfortunately, I supplied a bad illustration for the actual code text to crack. It wasn't until the Russian translation that anybody noticed (or, at least, told me about it). Any lack of clarity in the text itself was just because of my writing. If that is the only problem in the text of the book itself, I would be very happy.

**I presume that the preparation and maybe solving the problems in "Etudes" was not a straightforward process.  Were there other "gotchas" or Easter Eggs in "Etudes"?**

There are no other intentional "gotchas". When I tried the mileage problem, I realized that it might not be as well specified as it might be. There are probably some other places that could be clarified.

Actually, writing was not too bad. Of course, making the solved problems be suitable took a lot more work than a student might put in; I didn't want to look silly to the readers.

Fortunately, I had a lot of help and that made a big difference. The text and the illustrations were originally produced using innovative formatting and drawing programs developed by Hank Moll and John Beatty. This made the work much easier. I wrote the book itself on "coding sheets", paper specially marked to make it easy to keypunch cards. The sheets then went to our keypunch team who actually did a lot of proofreading as they went along. When they thought I had made a mistake (or had made an outrageous pun), they would punch both an original and a correction card so that I could choose which was correct.

My publisher asked several outside reviewers to read and comment on the book drafts. One reviewer of the complete book draft made comments on almost every line. He made the book much better than it would otherwise have been. At the time, I didn't know who this reviewer was. Later, I found out it was Steve Muchnick (well known for his compiler optimization book). I cannot thank him enough.

**If you write "Etudes" today, which topics would you add?**

Digital signatures and public key cryptography protocols would probably be a new topic. I would probably tune up the multiple precision arithmetic chapter. I would almost certainly change the compiler/language chapters to include more modern ideas. One thought (due originally to John Fletcher) would be to have a pair of etudes to write a Lisp interpreter in Ruby (maybe) and a simple Ruby system in Lisp. Or something else of the sort.

I would probably drop one or two of the simpler etudes. There is a lot of new artificial intelligence problems (particularly in genetic programming) that would be suitable. There are new ideas in data structures that would be fun to explore (how much better are red-black trees than simple-minded binary trees in terms of performance?). Honestly, though, I can't tell what would make a good problem until I work on it for a while. 

**Most of the etudes were about implementation rather than figuring out a way to attack a problem in the first place, because you almost always gave quite solid background and enough details of a solution. Do you believe that it is also important to give students problems without even a clue of the solution? How such problems may look like? And how would you measure a degree of success of the solution?**

In the real world, you are always faced with some problem to solve and the first issue is figure out what the problem really is. It is good to train students to do that analysis -- and in the real world, that skill is rare -- but that wasn't really the idea in "Etudes". That would be a course in itself. The point of "Etudes" was to give students a reasonable problem setup and to have them practice full application development. There is still a lot of room for student choices. For example, the solved problems make points about the quality of the code, the presentation of results to humans, and the performance of the final application.

There is a probably a course with problems like you propose, but then the course lectures would have to teach analysis techniques and the book itself would have to include materials on analysis. That's a different book.

**Charles, regarding your interests and work apart from "Etudes", I know your background is compilers. For instance, you developed a compiler for the XPL language. What do you currently work on at Oracle? Still hands on programming?**

I am still a programmer. One of the things I like about computer science is that you can actually build the things you think about.

My basic background has always been the theory, design, and implementation of programming languages. When I was an undergraduate, computer science didn't exist yet so my undergrad degree is in applied mathematics. But my undergraduate thesis was on adding new features to TRAC (does that remind you of one of the "Etudes"?). I have been responsible for XPL, for a complete Ada compiler system, for the LR parser generator (with Al Shannon), for a proposal of array operations in Fortran, for a new dataflow language (with Jim McGraw), and (more recently) for the new code generator and optimizer in the Oracle programming language PL/SQL. Lately I have been working on some special projects at Oracle in the area of programming languages. If they work out, you'll see the papers on them.

**Looking at the topics in your book, it is not easy to guess which area of computer science is your favorite one. Even in the section about compilers you offered an interactive functional TRAC along with a regular procedural language. Do you have favorite areas of computer science?**

My favorite computer science topics are:

1. Programming languages, particularly the specification of their semantics.

2. Data structures and algorithms and their performance.

3. Games and artificial intelligence.

In practice, my professional career has mostly been spent on the first topic. I have spent a lot of time working on compiler/language/application performance. This is the second topic, of course. When I was in middle school, I was already interested in computers and I already liked games. That's where the third interest comes from. For me, computers are the world's greatest toys and always have been. But I won't see all the advances that my younger son with his iPad now takes for granted.

You can see the outgrowth of my interest in computer games in a couple of papers I wrote (with some friends) about Kriegspiel, a variant of chess. The papers are published in the "Computer Journal". One of these is a complete program to check the legality of moves in chess and Kriegspiel. At the time the paper was written, there were a few example programs for students, but these were not very careful and missed some of the more subtle rules of chess. There were, of course, chess programs available, but this was long before open source software and at a time when a few chess programmers were trying to make a living selling chess products. So they obviously didn't publish their secrets. So far as I know, this was the first published paper to provide a complete rules checker and I haven't seen one since; it may still be the only refereed publication of a rules checker. You can find an audio interview about the project at the Computer Museum here in Silicon Valley.

My approach to computer science is generally to see if I can find some good theoretical model for a problem and then understand how to apply that in practice.

**Over the years, have you met that programming language which you liked most for some reason?**

Right now, I like Ruby a lot. I have written great gobs of C, but I don't like its lack of security. Back in the day, I liked XPL which seemed like a reasonable version of C (of course, it was developed independently) with much more safety.

When I was a grad student, I wrote one long Snobol program. I used it to model some research that had been done in code optimization. It was possible to turn constructive proofs of theorems directly into Snobol routines. That was eye-opening. It has made me partial to languages that have interesting inference mechanisms.

I'd like to have a chance to learn and use Haskell or one of its friends for a good project. I think it would teach me a great deal. I should note that writing a toy program in a language is not the same as knowing the language. I have been doing Ruby for a year now on one project and I still learn something new every day.

**When languages like C were invented, people wanted to be close to the metal. Understanding how the metal worked was the must for any professional programmer, and as a consequence, it dictated a manner of teaching programming. How would you teach programming nowadays? Not computer science in general but hands on programming?**

I never understood the focus on hardware although I started doing assembly language on a machine that didn't even have mnemonic op codes in the first assembler I used.

Actually, I think you asked the wrong question. The problem is not "programming", but problem analysis and application development. You can program anything in any language; the question is whether the language is a good "human" fit to the problem and whether or not it is efficient enough.

Thus, I would teach principles of programming languages and then ask students to try and understand those principles in each of a number of languages. For example, did you know that Fortran always includes an interpreter? (For format statements, of course!) And what's more, in Fortran 77, you need to implement call-by-name as part of that interpreter. You also probably want to use exceptions to build your interpreter. So the basic concepts pop up in surprising places.

(By the way, that tells you why the formatting etude is in the book. Over the years, I built two separate Fortran format interpreters.)

**We started this interview from the book. Did you have your own "version" of "Etudes"? Any books and people significantly influenced on you as a programmer and scientist?**

When I was in high school, a friend of my parents helped me get a summer job. That job turned into work at the local school system's data processing center. In those days, data processing meant cards, card sorters, card punchs, and the like. But the next summer, the school system bought an IBM 1401. Because nobody else knew more than me about it, my supervisor let me be one of the programmers. Within a few weeks, I was writing payroll programs for a large public system.

This experience helped me get a part-time job in college also working with 1401's. From then on, my life was working on computers and I decided to go to grad school in computer science instead of getting a full-time job. With more good luck than prior knowledge, I went to Cornell. The faculty there was incredibly helpful. Probably the two faculty members who taught me the most were Juris Hartmanis and John Hopcroft. I still think that Hopcroft's language theory book is a classic (in the first or second editions). But everybody on the faculty there was extremely concerned that their students did well. And, if you look at the Cornell graduates from the late 60's through the mid-70's, you'll see a really wide range of talent went through the program.

So far as books go, my favorites are probably those by Knuth. I really recommend reading the "Art of Computer Programming". You won't understand most of it the first time. My theory is that you read it over and over, a few pages at a time. Each time you look at it, a little more sinks in.

I also read all of Newman's "The World of Mathematics" which I first saw in the 10th grade. This gave me a lot of historical background in math and mentioned enough about computers that I was helped along. I think this is still a useful introduction for young people (not to mention old people!).

**Everybody comes to the world of computers differently. Maybe nowadays it is much easier because computers are everywhere. How did it happen that you chose computers as your profession in the days of mainframes and punch cards?**

Well, some of the answer is in the previous question. My father owned a small hand-crank desk calculator with a design similar to that described by Felix Klein in his mathematical education book. My father's came from the Orient (he got it during WWII, I assume), had no instructions, and was covered in Japanese symbols -- but fortunately Arabic numerals. I spent many hours figuring it out.

When I was in middle school, I already liked computers and mathematics. Sometime along in there I got a toy "computer" that was made out masonite, old-fashion clasp paper clips, screws, light bulbs, batteries, and wires. It was really what would be called a gate simulator today, but you could build some very simple circuits with switched inputs and lit-up light bulbs as outputs. I was fascinated. I also found some other books about early computers and they were very interesting to me.

In my first year of high school, I went to NSF summer camp where we took some college course in algebra and group theory, learned (well, in my case, was mystified by) some finite differences, and got to program a computer. I also learned to play bridge because two of girls wanted to have a fourth (when you are in high school, girls are a powerful incentive!).

So by the time I got out of college, between the experiences I have described and some college courses (notably with Tom Cheatham), I was pretty much hooked.

**Wrapping up, there is a saying about the three things a man must do. Can you name your three things a programmer must (or should) implement?**

I'm not sure I have three things that I think programmers should implement. But I know some things that I think every programmer should either know or be able to do.

1. Some ability to do formal mathematics. The level necessary to understand Hopcroft and Ullman combined with a little graph theory is enough. Discrete mathematics is essential; calculus is only necessary for folks working in special application areas.

2. Some ability to write clearly in their native language. Dijkstra said that if a person couldn't write their own language, they couldn't write a correct program. (Well, that's what I hope Dijkstra said!). Writing programs is essentially the same as writing a non-fiction essay. If you can't make the step-by-step connections clearly in your own language, why would we think you could in C, for example?

3. Remember that a program is primarily for communication with humans, not computers. When you write a program, the computer will do whatever you say. You must convince the humans who read the program that what you have asked the computer to do is the correct thing to do. Remember, the computer doesn't care about correctness. 

4. (Bonus answer -- 4 for the price of 3). The answer to the last question means that programs should always have the form of paragraphs of comments that describe the intention of the program followed by paragraphs of code that implement that intention. All of the formatting should be designed to make readers as able as possible to read the code easily; the compiler doesn't care. In particular, follow conventions of mathematics and your native language, not those you found in some random language manual. Write the comments first and then write the code, not the other way around. If you don't know what you want to achieve and why, any code you write is, by definition, incorrect.

If you look at the last "Etudes" chapters, I hope that you can see that even back then, I was trying to apply these principles.

**Thanks, Charles for the interview answers. We (fans of "Etudes") still hope for your new books or other publications and wish you all the best. In meanwhile, if you, my dear readers, have not seen "Etudes" so far, please grab a copy and take a look. It is worth it.**

&#9632;

*// Charles Wetherell, Alexander Demin*

*// August 2012*

P.S. If you have questions to Charles, please, put them in comments below.
