---
layout: post
language: english
title: "How to search in this blog?"
date: 2012-04-10 16:59
---
As noted, the posts in this blog have no tags anymore. Technically the tags are still supported, but not displayed (no individual feeds per tag, or a cloud of tag, or other kinds of navigation).

Why?

I've decided to change the approach and implemented Google's way: Don't sort. Search!

Now, on the [main page][] there is a search. The search allows to filter out the posts containing particular word(s) in the title or body.

[main page]: /english/

The search is based on the reverted index, without sorting by relevance. The posts, containing required words, are displayed sorted by default by date.

Try to search for "maximite" or "ruby nor". If there are several words are given in the search, it'll show the posts containing **all** these words. The words, which are shorter that 3 characters, are ignored.

For me - this is very convenient!

Checked in Chrome and Safari on Mac.
