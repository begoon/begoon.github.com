---
layout: post
title: "NOR Machine in Ruby"
language: english
date: 2012-03-07 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2012/03/nor-machine-in-ruby-english.html
categories: 
- norcpu
- english
---
My [article about a virtual CPU, a machine, computing only one instruction - NOR][], in The Pragmatic Bookshelf magazine.

[article about a virtual CPU, a machine, computing only one instruction - NOR]: http://pragprog.com/magazines/2012-03/the-nor-machine

The idea was previously described in a series of posts:

* NORCPU hackme challenge (part 1, part 2)
* One-command NORCPU program hacking challenge: analysis and solutions
* CPU executing just one operation

The article discovers an implementation in Ruby. Now NOR assembly code looks almost as a regular assembler language. I was amazed how powerful Ruby is in creating domain specific languages (DSL). Mostly because it allows to omit parentheses in function calls.
