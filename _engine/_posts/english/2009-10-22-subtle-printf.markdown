---
layout: post
title: "Subtle printf()"
language: english
date: 2009-10-22 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/10/subtle-printf.html
categories: 
- cplusplus
- english
---
Yesterday I'd come across an interesting glitch which confused me for a while.

I was debugging a brand new online assembler for my [Radio-86RK emulator][]. That debugging meant some dancing around HTML.

[Radio-86RK emulator]: http://code.google.com/p/radio86

To build a final HTML file from a bunch of tiny files I used a very simple program. Here is a bit of code from it:

{% codeblock lang:cpp %}
...
  while (!feof(f)) {
    char line[1024];
    *line = 0;
    fgets(line, sizeof(line), f);
    printf(line);
  }
...
{% endcodeblock %}

Implied that this code should copy all lines from a file `f` to the standard output.

Even if we don't care about using a buffer with a constant length and rest of other C-like features, this code has one serious drawback which embarrassed me for a quite awhile. It worked okay until I had started to play with percent widths and heights of HTML objects.

Instead of getting:

    <table width="100%">

I was ending up with:

    <table width="100">

You have probably already guessed why. But to tell the truth I had been investigating this up to half an hour.

So instead of:

{% codeblock lang:cpp %}
printf(line);
{% endcodeblock %}

I had to write:

{% codeblock lang:cpp %}
printf("%s", line);
{% endcodeblock %}

Otherwise all percentage characters are treated as formatters because the first parameter of `printf()` is a format and all non-escaped `%` characters will be deleted. That is what was happening to me.

Conclusion (following after the first one - "serves you right"): It is much safer to write in C++ and use STL streams for formatting.
