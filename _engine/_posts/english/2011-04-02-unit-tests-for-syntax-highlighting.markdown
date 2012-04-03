---
layout: post
title: "Unit tests for syntax highlighting"
language: english
date: 2011-04-02 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/04/unit-testing-against-regression.html
categories: 
- testing
- english
---
Quite often people argue whether all those efforts to use unit tests are worth those benefits in code maintenance and regression bugs. Despite of many pros and cons being said there could be situations when it is not obvious that is better, but I can give a very representative example below.

At the moment I'm working on a project customizing putty to support of-the-fly syntax highlighting for a proprietary programming language. The main difficulty is that the language has very complicated and not well defined and irregular grammar with lots of ambiguities.

As a result what I'm doing is fixing different special cases here and there. But syntax highlighting is complicated in general - you fix one thing and easily break ten others at the same time.

After some time of maintenance I gave up and I spent a day setting up [cmockery][] and all the rest of unit testing plumbing. Then I remade all code examples I used to verify everything manually in a form of unit tests.

[cmockery]: http://code.google.com/p/cmockery/

Once I've done that life become simpler. Now after every change I can automatically check by running tests that all previous cases are not broken. I'm confident to change things without being afraid of regression. Of course I spent an extra day to two developing, debugging and configuring unit tests infrastructure but it has paid off already, fully or even more.

Every new feature or bug fix I start from creating a test demonstrating how it should work, and, obviously, this test must fail. Then I implement a bit of functionality to make this test working. I cannot image how I might develop this project further without unit tests.

By the way, this is a classical approach when tests are written beforehand. And the main code complements the tests afterwards.
