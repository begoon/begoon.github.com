---
layout: post
title: 'Bruce Tate, "Seven languages in seven weeks"'
language: english
date: 2012-02-02 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/02/iased-review-of-seven-languages-in.html
categories: 
- book
- english
---
I've finished accelerated reading of "[Seven languages in seven weeks][]" by Bruce Tate.

[Seven languages in seven weeks]: http://pragprog.com/book/btlang/seven-languages-in-seven-weeks

{% img /images/covers/english/7-languages-in-7-weeks-cover.jpg %}

In my case it was "Seven languages in seven evenings". For each language there is an introduction, which makes sense only if a language is brand new for you. There are also interviews with creators of the languages. One of the asked interesting questions was about what the author would like to change in the language if he could re-design it from scratch now.

Languages:

* Ruby
* Io
* Prolog
* Scala
* Erlang
* Clojure
* Haskell

The reviews of each chapter below are my subjective views two things at once: a programming language and a material about it. Why? For familiar languages it hardly makes any sense to describe the language per se, but to note interesting distinctive features could be useful. But if a languages is a green field, it is worth describe it in general.

**Ruby**

The Ruby chapter was quite useless for me because I thoughtfully read "[Programming Ruby 1.9][]", and have been hooked. Ruby is an amazing scripting language. Each time when programming in Ruby I feel so delighted similar to when I tried PHP first time after Perl.

[Programming Ruby 1.9]: http://pragprog.com/book/ruby3/programming-ruby-1-9

Ruby's creator, [Yukihiro Matsumoto][], says in the interview, that if he could re-design Ruby today, he'd like to change the concept of multi-threading to [Actor][].

[Yukihiro Matsumoto]: http://en.wikipedia.org/wiki/Yukihiro_Matsumoto
[Actor]: http://en.wikipedia.org/wiki/Actor_model

In short, "Actor" is when concurrent threads don't share memory and don't use mutex or semaphores for synchronization. Instead, they send and receive messages to each other, and messaging is provided by runtime and built-in to the languages syntax. Examples: Scala, Go, Erlang, Io.

**Io**

[Io][] is a very small, compact language, based on prototypes like JavaScript, where there is no distinction between classes and objects.

[Io]: http://iolanguage.com/

There is an interesting concurrency feature in addition to actors and coroutines (cooperative multi-threading as in [Lua][Coroutines in Lua]), called futures. "Futures" are similar to the actor. There the only difference is when the caller thread tries to use the result of the future, it will be blocked until the future completes and gives the result back.

[Coroutines in Lua]: http://www.lua.org/manual/5.2/manual.html#2.6

An example from the book:

{% codeblock lang:io %}
// Fire up the future.
futureResult := URL with("http://google.com/") @fetch
writeln("Continue immediately when future is running in background.")
// This line will be executed immediately after spawning the future.
writeln("fetched ", futureResult size, " bytes")
// But this line will be blocked until the future returns.
{% endcodeblock %}

**Prolog**

I've been gnawing this animal for years. But thanks to Erlang recently, all this functional stuff in general is now giving up for me, and monsters like Prolog or Haskell don't look so scary anymore.

It turned out that the depth of the material about Prolog has matched precisely with my level. The eight queens problem and a Sudoku solver were excellent examples for me.

Shortly, a program in Prolog is a pile of facts and rules. Then the Prolog runtime performs a depth-first search amongst possible results and tries to find those satisfying all the given facts and rules.

In fact, the Sudoku solver program is a set of variables, representing the Sudoku field, and a list of rules (summations by columns, rows and squared groups) according to the rules of Sudoku. Then Prolog performs an exhaustive search to find the values and their combinations satisfying the rules.

Of course, this is very much a superficial glance, but this has given me much more understanding of Prolog.

**Scala**

I will note only a few facts interesting to me.

Multi-threading is based on actors. After Erlang and Go you understand how good and handy it is.

I think that Scala has all possible bells and whistles even invented for programming languages. But sometimes it has not only good consequences.

**Erlang**

I'm a big fan of Erlang and already read a few big books. That's why this book hasn't given to me anything new. But for novices this introduction may give quite solid view on Erlang functional approach and concurrency model.

**Clojure**

Clojure is a Lisp-based language driven by Java VM.

It has an interesting feature called [STM, software transactional memory][STM]. In STM a piece of code is declared to be a transaction. It is executed atomically or all the changes of variables are rolled back.

[STM]: http://en.wikipedia.org/wiki/Software_transactional_memory

And finally, Haskell

Haskell is a taught guy. The introduction in this book is very light and minimal, just to remember the word "Haskell". I read "[Programming in Haskell][]" and currently I'm on "[Real World Haskell][]", that's why I simply skimmed the chapter in this book.

[Programming in Haskell]: http://www.amazon.co.uk/Programming-Haskell-Graham-Hutton/dp/0521692695
[Real World Haskell]: http://www.amazon.co.uk/Real-World-Haskell-Bryan-OSullivan/dp/0596514980

Okay, to sum up. This book is to be read just once, to broaden your outlook.
