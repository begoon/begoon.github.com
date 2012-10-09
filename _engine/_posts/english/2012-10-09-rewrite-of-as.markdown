---
layout: post
title: "How to rewrite a project from Pascal to C, or a macro-assembler for Intel 8080"
language: english
date: 2012-10-09 10:13
comments: true
categories: 
- 8080
- 8085
- as
- asl
- english
---
Let's look at the code:

    BEGIN
       if (Hi(Code) == 0)
        BEGIN
         BAsmCode[0] = Lo(Code); CodeLen = 1;
         return True;
        END
       else if (MomCPU <= CPU1802)
        BEGIN
         WrError(1500);
         return False;
        END
       else
        BEGIN
         BAsmCode[0] = Hi(Code); BAsmCode[1] = Lo(Code); CodeLen = 2;
         return True;
        END
    END

(grabbed from [code1802.c][]).

[code1802.c]: https://github.com/begoon/asl/blob/master/code1802.c#L46

Frankly, it is not easy to recognize the language. Of course, this is C but
initially it was Pascal, and then the author had converted in to C trying to
minimize the amount of changes.

The project is called "[Macro-assembler AS][]", by Alfred Arnold. I use it
as an Intel 8080 macro-assembler available on Mac, Linux and Windows.
Frankly I haven't seen anything better so far.

[Macro-assembler AS]: http://john.ccac.rwth-aachen.de:8000/as/

As the author [explains][Why Pascal], the project was started in Turbo Pascal,
but after Borland had abandoned the DOS version but free implementation of the
modern Pascal didn't exist yet, he decided to convert the sources into C
and continue development in C. Despite of overall doubtfulness of such
approach, to me, the author had managed it very well. The project hadn't
die as it usually happens with big projects after rewrite. But though I
have cloned it for myself and started using successfully, I doubt
that I want to contribute because it requires coding in this weird
"Pascal on C steroids" dialect. Alas, this is inevitable due to that
conversion, otherwise the project may turn into mess. If to surf amongst
[the sources of AS][asl] it is easy to find a lot of tricks like "how
to make C to be Pascal".

[Why Pascal]: http://john.ccac.rwth-aachen.de:8000/as/as_EN.html#sect_I_1_
[asl]: https://github.com/begoon/asl

Nevertheless, all the best to Alfred with his great project. Again, the 
project moves forward and becomes better.

By the way, Alfred has a very cool collection of [old hardware][] which makes
me feel envy. 

[old hardware]: http://john.ccac.rwth-aachen.de:8000/alf/index.html#collection
