---
layout: post
title: "GitHub as a blog engine"
language: english
date: 2011-12-18 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/12/github-github-as-blog-engine-english.html
categories: 
- english
---
To say that Blogspot (Blogger) infuriates me is to say nothing. The only benefit of it is fast indexing by Google.

Artemy Lebedev said that he despises all this [SEO][] bullshit because it is much more productive to focus on creating great posts rather than thinking how to attract more readers. His [LJ][Lebedev's LJ] uses a default template without even minor tweaks to make it looking “cool”. Despite of this his blog is in Russian Top 10.

[SEO]: http://en.wikipedia.org/wiki/Search_engine_optimization
[Lebedev's LJ]: http://tema.livejournal.com/

Nobody reads blogs directly nowadays. Everybody uses Google Reader or other aggregators making the design of blogs absolutely pointless.

Anyway let’s leave odious Lebedev and come back to our techy blogs. Tom Preston-Werner, one of the Github founders, [said that he wanted to write posts][Blogging as a hacker] but not tweaking different templates or keeping the version of WordPress or Mephisto up to date.

[Blogging as a hacker]: http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html

A similar thought haunts me from the day one of using Blogspot. Only recently I have sorted a way of creating post by using [ReST][]. Now I write posts in this markup and convert to HTML before publishing by a few handcrafted scripts. Unfortunately hosting for images is not automated in anyway.

[ReST]: http://docutils.sourceforge.net/docs/user/rst/quickref.html

Many times I wanted to migrate to a standalone platform, for example, WordPress. But my laziness and unwillingness to spend even a second on its maintenance always stopped me.

At the moment I have another attack of hate to Blogspot and as a consequence look for alternatives.

Surprisingly I never considered using [static blog engines][].

[static blog engines]: http://www.subspacefield.org/~travis/static_blog_generators.html

What if just simply migrate to [GitHub Pages][]? It converts one of your repositories to a website which can be also processed by [Jekyll][], a static engine from Tom Preston-Werner.

[GitHub Pages]: http://pages.github.com/
[Jekyll]: http://jekyllrb.com/

I could kill a few birds with one stone – to use a proper markup language, [Markdown][] or [Textile][], instead of bloody HTML and to manage publishing by git. Of course ReST is better but I can cope with it.

[Markdown]: http://daringfireball.net/projects/markdown/syntax
[Textile]: http://en.wikipedia.org/wiki/Textile_(markup_language)

Also GitHub Pages can be integrated with your own domain if needed.

Comments and discussions. [Disqus][] seems to be an easiest way to sort it without any hassle.

[Disqus]: http://disqus.com/

Google Analytics perfectly works with any engine where you can insert their JavaScript hook into pages.

What is still missing?

Sometimes people still visit blogs directly, for instance, to find previous posts or explore “social” details. In this case all these bells and whistles in a form of JavaScript gadgets are very useful and save a lot of time. Blogspot allows adding them in a few clicks.

But coming back to the question at the beginning – do I really need them? If the content is interesting the audience will inevitably find you. A word of mouth in a form of Twitter or Facebook will attract people. But if the content is crap all those bells and whistles (and SEO) will not help.
