---
layout: post
language: english
date: 2012-04-23 00:02
title: "Goblog: A handmade static blog engine in Go running this blog"
categories:
- english
- jekyll
- octopress
---
I love writing, playing with examples, testing, thinking. But I don't like fiddling with formatting, uploading pictures, composing, etc.

Because of laziness I began using Blogspot. It gives plenty of bells and whistles: templates, widgets, instant indexing by Google, statistics, even comments become to be a tree at some point. Everything seems to be great, but alas, the online Blogspot editor isn't designed to create programmer posts. When it requires to insert a code or a table, sufferings begin. For example, for my another blog, not about programming, called "[Boiled eggs, sir!][]", "the capabilities" of Blogspot are more or less enough.

[Boiled eggs, sir!]: http://english-eggs.blogspot.com

I want to keep sources of the posts in a nice and clear format, not spoiled by HTML. It turned out that the posts sources are spread across my computer here and there, sometimes in multiple copies. You begin creating a post simply in an editor only formatting paragraphs, without links and images, and eventually you save the final version. Then you compose HTML during that the post body maybe also changed. Thus I'm lazy to update the original, non-HTML version, so finally, only the spoiled by HTML version remains up to date. But this is not the end of the store still. Often after publishing you spot on a typo, go to the Blogspot online editor and fix it right on the page. Again, that very first document and its local, prior to uploading the HTML version, don't have all the corrections. Ultimately, only the online edition in Blogspot is relevant. Of course, it is possible to export the entire blog from Blogspot (maybe even automatically, on regular basis) and back them up, but again, everything will be in the HTML format.

Some time ago I began using [ReST][]. The life had become a bit easier. ReST allows to write text in the more or less predictable layout (paragraphs, links, code), and then HTML is generated from it, and then later pasted (again, manually) into the Blogspot editor. All my attempts using [Google Command Line][googlecl], in fact, failed. The problem of the outdated original documents (after online fixed) still stood. Furthermore, ReST didn't solve the problem with pictures. I had to upload them somewhere in advance to do the a proper local preview.

[ReST]: http://docutils.sourceforge.net/rst.html
[googlecl]: http://code.google.com/p/googlecl/

I almost cannot explain why, but the idea of dynamic blog engines like WordPress scared me. Use of a database to keep posts seemed to me unnecessarily complicated.

I was almost ready to choose an intermediate solution -- [Doku Wiki][], for example, [vak.ru][]. This engine is dynamic, but it stores the posts as files. Plus, it supports versioning. Doku can be used as the engine for the whole site, not only the blog. Though its design is unsightly, but pictures and other arbitrary attachments are handled by Doku automatically.

[Doku Wiki]: http://www.dokuwiki.org/dokuwiki
[vak.ru]: http://vak.ru/doku.php/proj

There was another option, which I almost signed up for -- [TiddlyWiki][]. TiddlyWiki is my favorite tool on Windows for notes. Why only Windows? Because on Mac I simply use regular plain text files in Documents or Desktop, and [Spotlight][] provides the instant search. Therefore on Mac the instant search, the killer feature of TiddlyWiki, didn't make any sense. But I digressed.

[TiddlyWiki]: http://www.tiddlywiki.com/
[Spotlight]: http://en.wikipedia.org/wiki/Spotlight_(software)

It turns out, there are TiddlyWiki fans which converted it to a blog engine, a static-dynamic mutant.

For instance, here is an example of a blog running TiddlyWiki -- [Rich Signell's Work Log][]. Esoterics, in my opinion. It isn't quite clear even how to implement comments, at least Disqus. But surprisingly, there is public hosting based on Tiddly -- [tiddlyspot][]. 

[Rich Signell's Work Log]: http://rsignell.tiddlyspot.com/
[tiddlyspot]: http://tiddlyspot.com/

Finally, I had got hooked on purely static blog engines. The charm of it is that such blog can be hosted anywhere. Neither database nor even no server scripting is required. But further -- it is more. GitHub and Heroku provide not only free hosting but also git as the CMS.

For example, there is a static blog engine called [Jekyll][]. In Jekyll posts are created in Markdown or Textile, therefore the formatting issue is solved. No ugly HTML anymore. In fact, the engine can drive the entire website, not only the blog, plus some source files are deployed as a blog.

The comments, as the main dynamics in blogs, can be implemented via, for instance, [Disqus][]. By the way, there is a quite popular pure zen approach to the comments -- static ones (to me, such word combination is the oxymoron in the first place). With the static comments there is a comment entering form somewhere on the page along with the *statically* rendered existing comments. You enter a comment and submit. Then it gets sent to the blog owner. He or she approves (or rejects) it, clicks somewhere, and the comment is placed to a file. Then the blog is re-compiled and finally deployed to public. Obviously, it is far from real-time, which is the heart of commenting, in my humble opinion.

[Disqus]: http://disqus.com

I very much appreciate discussion, and such approach is not for me. I use Disqus. By the way, all the comments can be easily exported from Disqus, and, for instance, converted to a static form. 

But let's go back to Jekyll. GitHub directly supports it (its author is the GitHub co-founder) and can render Jekyll projects for you (of course, you still can render locally). You simply `git push` your stuff to GitHub, and after a moment it becomes visible in GitHub Pages.

Heroku works slightly different. Heroku hosts Ruby, therefore a Heroku project is a bunch of pages, plus a mini web server application serving them. Looks a bit scary, but such server in Ruby is very simple:

{% codeblock lang:ruby %}
require 'bundler/setup'
require 'sinatra/base'

class SinatraStaticServer < Sinatra::Base  

  get(/.+/) do
    send_sinatra_file(request.path) {404}
  end

  def send_sinatra_file(path, &missing_file_block)
    file_path = File.join(File.dirname(__FILE__), 'public',  path)
    file_path = File.join(file_path, 'index.html') unless file_path =~ /\.[a-z]+$/i  
    File.exist?(file_path) ? send_file(file_path) : missing_file_block.call
  end
end

run SinatraStaticServer
{% endcodeblock %}

[Jekyll]: http://jekyllrb.com/

As strangely enough it sounds, Heroku as blog hosting is simpler than GitHub. Additionally, your git repository on Heroku remains private, whereas on GitHub by default it is public. I don't see any problems with it though, because it is all available anyway to everybody via the web site, but some people prefer keeping blog guts or bits of unfinished work in private.

Also, both GitHub Pages and Heroku support a proper second level domain if you have one.

Well, I had chosen Jekyll and Heroku hosting. Alas, vanilla Jekyll has no HTML templates or themes, and you have to design it. If you're lazy, you can try [Octopress][].

[Octopress]: http://octopress.org/

Octopress is a static blog engine based on Jekyll. "Based" means, this is Jekyll plus a bunch of useful plugins, a very nice HTML5-compatible theme, and scripts helping in deployment to GitHub Pages and Heroku,

So, I had installed Octopress, tried a couple of posts, rendered locally, deployed to GutHub and Heroky. Everything was amazing, I had began the most tedious part -- converting posts from lovely Blogspot. In fact, it was almost pure manual cut-and-paste work. Three weeks of struggle, and my poor three hundred posts were done.

Everything was ready to launch my nice or shiny static blog. But here I had met my main disappointment. The precious Jekyll, written in Ruby, rendered my hundred posts (attention!) 15 minutes (on Mac Air). As you can understand, at the beginning I had to rebuild a hundred of times -- design changes, formatting etc. So, 15 minutes wasn't even close to any acceptable time, at all.

At random, I found a bottle neck in Jekyll/Octopress -- the majority of those 15 minutes were spent generating the RSS file, `atom.xml`. For some reason, in original templates, that RSS filed included only the latest twenty posts. But my blog is small, and I included all posts there. It had caused that 15 minutes build.

All this seemed to me an absurdity (at all my love to Ruby). After some analysis (at that time I began to understand how Jekyll worked, more or less) and unwillingness to fix Jekyll trying to speed it up, I asked a question -- what if I develop the static engine by myself? using Jekyll's principles? After all it is only work with files, strings, and templates. Besides, I wanted to blog in two languages, but Jekyll didn't support that. Having my own engine seemed to be a very cool idea because I would free to implement exactly that I wanted. 

Instrumentation? As a real man in C++/boost? Perhaps. I suspect it would work very fast, but it is boring. I'd chosen Go. It is natively compiled, has simplified memory management (thanks to the garbage collector), regular expressions, maps, templates, [Markdown library][]. Everything, except the later, is out of the box. There should not be any performance issues. Here just the first release of Go had been arrived, now installation on both Windows and Mac became much easier.

[Markdown library]: https://github.com/russross/blackfriday

So, after three nights, my own wheel had been made -- [Goblog][Project demin.ws]. The project is fully open. The web site and its source are in the same repository.

[Project demin.ws]: https://github.com/begoon/begoon.github.com

## Architecture

There are two main locations: a project and a target web site/blog. The first contains source files. In the process of assembly the project files are copied to the target directory preserving the relative directory structure. By default, the files are copied "as is", as binaries. If a file has one of the following extensions: `html`, `xml`, or `js`, it is processed by [Go template library][]. Files with the `markdown` extension are also processed by the [Markdown library].

[Go template library]: http://weekly.golang.org/pkg/text/template/

Directories:

* `<root>` -- Here is the compiled/built web site as it is visible at [http://demin.ws/][site].
* `<root>/_engine` -- This is the project: source files and the blog generator.

[site]: http://demin.ws/

Subdirectories and files in `_engine`:

* `_includes` -- Include files available by <code>&#123;{include "filename"}}</code> macro.

* `_layouts` -- Layouts (see below).
        
* `_site` -- Actually, the source directories and files. This directory is the root of a future site. Files from here are copied to the target directory. Some files are processed by templates.

* `_posts` -- Posts. These files are process specially. Besides templates, they are renamed according to the blog structure, where the date is included to URL: `domain/blog/year/month/day/post-title`.

The posts are Markdown files having a special preamble and name. These files are deployed to a separate directory, `/blog`. The post meta information is collected and propagated to the template place holders. Also the post sources are used to [build the reverted index][build_language_index()] of search.

[build_language_index()]: https://github.com/begoon/begoon.github.com/blob/9f088a83e86e54112696dd3954681b0450f40d91/_engine/main.go#L601

## Layouts

The concept of layouts is grabbed from Jekyll. If a post or a page has the `layout` attribute in its preamble ([for example][Post example]), a layout of the given name is loaded (from `_layouts` directory), the post body is put to the `Page.child` place holder, the layout is rendered, and the result becomes the final HTML page of the post. This is incredibly useful for similar pages, like posts. The layouts can be nested.

[Post example]: https://raw.github.com/begoon/begoon.github.com/master/_engine/_posts/english/2009-01-24-why-i-have-started-this-blog.markdown

## Generator

Now, the generator -- [main.go][].

To build the blog, I go to the `_engine` directory and do:

    make

It prints roughly the following:

    _engine$ make
    gofmt -w=true -tabs=false -tabwidth=2 main.go
    go run main.go 
    Go static blog generator  Copyright (C) 2012 by Alexander Demin
    Words in russian index: 18452
    Words in english index: 3563
    15.672979s
    Processed 344 posts.

If no errors, in the root directory (in `..` with regard to `_engine`) the compiled files should be created, ready for deployment. On my Mac Air the build takes 15 seconds (hello, Jekyll/Octopress and goodbye). The entire project is under git, so it is clear anytime which files are new, deleted, or changed.

Then the built site can be viewed locally (see below).

When you are happy with changes, let's add and submit them (the sources from `_site/` along with the assembled files) locally:

    git add ../*
    git commit -m "New post about ..."

At last, let's deploy to GitHub:

    git push

Almost immediately the files become visible at [demin.ws][]. 

[demin.ws]: http://demin.ws/

In [Makefile][] there is a couple of extra commands making life easier.

[Makefile]: https://github.com/begoon/begoon.github.com/blob/master/_engine/Makefile

## Local testing

To check/preview the site locally I temporarily add `127.0.0.1 demin.ws` to `/etc/hosts` and launch a mini web server. Remember, how it looked in Ruby? Tiny, right? Check out this:

{% codeblock lang:go %}
package main
import "net/http"
func main() {
  panic(http.ListenAndServe(":80", http.FileServer(http.Dir(".."))))
}
{% endcodeblock %}

Nice? Now run it:

    go run server.go&

It may require `sudo` to acquire the port 80.

Generally speaking, there is no need touching `/etc/hosts`, just use `localhost:80`. Only for checking the RSS file, `atom.xml`, having full URLs, you have to fiddle with hosts.

## Syntax highlighting

As a Markdown extension I have a special tag for blocks of code:

    {% codeblock lang:xxx %}
    ...
    {% endcodeblock %}

I inherited the idea from Octopress. Markdown library already has the syntax for code:

    ``` xxx
    ...
    ```

where `xxx` is a language.

My own tag aims to add additional attributes easier, for example, turning on the line number, tabs conversion, etc.

Then I had to decide how to highlight the syntax. I tried a couple of online libraries, which color right on the page, but all of them had minor glitches here and there, and I went for static coloring. 

The first, which came to my mind, was [pygments][]. It seemed okay, but thanks to the Python, it worked really slow. The total built time had increased from 15 seconds to two minutes. The main time was spent for a code coloring. I started thinking about a cache for the already highlighted code and similar nonsense, but after a little research the problem was solved radically.

[pygments]: http://pygments.org/

I just needed a colorizer, implemented in a language suitable for this problem. I found two options: [GNU Source-highlight][] and [Highlight][]. Both are in C++, the both worked almost instantly.

For example, a guy [compared pygments vs syntax-highlight][Adding Color to the Console: Pygments vs. Source-highlight].

[Adding Color to the Console: Pygments vs. Source-highlight]: http://petereisentraut.blogspot.co.uk/2009/07/adding-color-to-console-pygments-vs.html

I liked Highlight because it supports more languages (for example, the first one even didn't support Go). After migration to Highlight, the built time came to normal, ~15-16 seconds, and I was satisfied.

The colorizer is invoked from the regular expression callback parsing the `{% codeblock %}` tag (function [highlight()][]).

[highlight()]: https://github.com/begoon/begoon.github.com/blob/9f088a83e86e54112696dd3954681b0450f40d91/_engine/main.go#L656

## Markdown editors

There are plenty of editors having Markdown preview. I use [MarkdownPad][] for Windows and [Marked][] on Mac.

[MarkdownPad]: http://markdownpad.com/
[Marked]: http://markedapp.com/

## Tag (categories)

At the moment I have decided not to use tags at all. Based on a personal experience, I have realised that I never use tag neither in my blog nor in others. Besides, views on the post categorization changes over time, and at times you have to maintain a completely outdated tag just for the sake of uniformity. For example, what is the point of the `c++` tag in my blog? Who on Earth even used it?

But the minimalism isn't a way to make life more complicated. On the contrary, I search in my old posts all the time. With Blogspot I went to the front page and used &#8984;-F (sorry, CTRL-F) to search across the post titles. Exactly for this purpose I started placing almost all informative posts into the right column on the front page.

In the new blog everything "works" similar with the post catalog on the front page. During the migration I had improved some titles to be more informative for search.

But! All of this doen't matter anymore because of the [fully functional context search capability][How to search in this blog?] in the new blog.

[How to search in this blog?]: /blog/english/2012/04/10/search-in-this-blog/

## Sanity checks

One of annoying inconveniences of Jekyll is that it never checks anything in the content. But I passed though it fully converting posts from Blogspot: broken links, missing quotes, bad dates and so on. That's why the Goblog checks everything -- formats, links, overall semantics, and it stops the build in the case of an error. When I added the [check_links()][] function, I had found a bunch of dead links.

[check_links()]: https://github.com/begoon/begoon.github.com/blob/9f088a83e86e54112696dd3954681b0450f40d91/_engine/main.go#L581

## Two languages

There was another issue with Jekyll -- an absence of bilingualism. I want at least two languages in the blog, bit I didn't want to hard code the "transparent" support of Russian and English. So, I added the concept of the language to each post (or a file), and the language attribute is propagated to templates. Goblog doesn't know about particular languages, but it allows to figure it out in templates.

For example, the [front page in Russian][] and the [front page in English][].

[front page in Russian]: https://github.com/begoon/begoon.github.com/blob/master/_engine/_site/index.html

[front page in English]: https://github.com/begoon/begoon.github.com/blob/master/_engine/_site/english/index.html

## Minor issues

I don't like web programming: javascript, css, html, or web design, which I cannot do at all. But I had to do it for Goblog (Octopress was much easier in this). I based my design on the [Jekyll's author site][]. The design is very simple. Besides, many people read the blog via RSS anyway and go the blog web site for commenting only. Hence, I need the properly working RSS feed and the post page providing comfortable reading, without fancy fonts and weird formatting.

[Jekyll's author site]: http://tom.preston-werner.com/

## Conclusion 

Do you think, I'll start convincing you to use my engine? Not at all. I tried to make it flexible and not hard coded specifically to this blog, but I had to migrate my old posts from Blogspot and comments, support two languages etc. At the result there are a couple of places still hard coded (especially in the area of Disqus links).

I can only recommend trying to implement the personal blog engine by yourself. Why? First, it usually takes a few nights only. Second, you will implement the only required bared minimum without complicated and unnecessary bell and whistles. Third, it is fun.

&#9632;

Related links:

* [GNU Source-highlight][]
* [Highlight][]
* [Adding Color to the Console: Pygments vs. Source-highlight][]

[GNU Source-highlight]: http://www.gnu.org/software/src-highlite/
[Highlight]: http://www.andre-simon.de/doku/highlight/en/highlight.html
[Adding Color to the Console: Pygments vs. Source-highlight]: http://petereisentraut.blogspot.co.uk/2009/07/adding-color-to-console-pygments-vs.html

[main.go]: https://github.com/begoon/begoon.github.com/blob/master/_engine/main.go
