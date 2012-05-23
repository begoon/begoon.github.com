---
layout: post
title: 'Travis Swicegood, "Pragmatic Version Control using Git"'
language: english
date: 2009-11-14 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2009/11/git-helps-to-beat-cvs.html
categories: 
- book
- english
---
At work I am involved in the following routine: there is a branch of sources which stability is monstrously important. Not even saying about breaking the build every commit goes through a few stages of automated checks (compiling by several compilers on several platforms, running through a variety of analyzer etc). Then it has to be approved at least by four/five people who take the responsibility of the commit. The routine is quite painful and long even from a technical point of view. On top of it the procedure is lined up over the years and based on very old SCM and we will not it's called in vain. Therefore the possibility of merging and conflict resolution is manual mostly. It can normally do only check-out and check-in. 

As a consequence of the fact that every commit is prepared, debugged and tested a sizable time (the benefit is that there are bug fixes only which are typically small) and even formal aspect of an issue may take a couple of days, often happens that when it comes directly to the command "commit" all ends up with a conflict because someone has already managed to touch a piece of your code and pour it on the server. Then it needs to merge manually. And if the file is not one then a headache begins. 

Since I am only recently involved in this stuff after the second commit I've decided to simplify my life in terms of merging on a conflict. 

I've got the [git][] and now it looks this way: each bug fix lives in the separate git's repository (in fact, in a directory) with two main branches. In one I do patching and preserve entire history of it in git, and periodically I sync the second branch with the main repository. And if I've got new just synced changes in the second branch I merge the first one with it using just one magic command `git merge`. 

[git]: http://git-scm.org/

In terms of distributed SCMs I now mostly with the mercurial because Google Code supports it. But frankly speaking the git is extremely powerful tool (of course if Windows is not involved in the workflow because git's Windows port is horrible). 

At the beginning of using git there is lots of confusion. Personally I was absolutely misleading by the idea of the staging area (or the index). This is an intermediate chain between local files and the repository. So [git diff][] can show the three different things: the diff between the local files and the index (but not the repository as many people expect by default and it introduces git's newcomers to a screeching halt), the diff between the index and the repository and finally the diff between the local files and the repository. The index (or the staging area) allows to commit changed files selectively. Usually a commit affects only staged files (in the index). And the most interesting it is possible to stage (and eventually to commit) files partially. For example, I've added two brand new classes to a file but I am able to commit only one and commit the next one later. 

[git diff]: http://www.kernel.org/pub/software/scm/git/docs/git-diff.html

Do you already like it? 

For example, a rollback of all local changes could be done at least two ways (using [git checkout][] or via [git reset][]). Also to rollback of already committed change you also have as minimum two alternatives ([git reset][] или [git revert][]) depending on your wish to make this rollback visible in the history. 

[git checkout]: http://www.kernel.org/pub/software/scm/git/docs/git-checkout.html
[git reset]: http://www.kernel.org/pub/software/scm/git/docs/git-reset.html
[git revert]: http://www.kernel.org/pub/software/scm/git/docs/git-revert.html

The abundance of features and some of their dissimilarity to the generally accepted standards of SCM commands is a little daunting at the beginning. But after a while you get started to feel the git's power. For example, having the staging area and [git stash][] (when possible to freeze the state of local changes, do some quick hacking and then get that state back) are very unique features of git. 

[git stash]: http://www.kernel.org/pub/software/scm/git/docs/git-stash.html

In terms of GUI the [gitk][] provides all the necessary. 

[gitk]: http://www.kernel.org/pub/software/scm/git/docs/gitk.html

The only thing that you need to choose on taste alone is program for merging in a graphical mode to resolve conflicts. Here all are in their preferences. 

I would recommend a very good book to start with git.

Travis Swicegood, "Pragmatic Version Control using Git"

<a href="http://www.amazon.co.uk/gp/product/1934356158/ref=as_li_tf_il?ie=UTF8&tag=prodiy-21&linkCode=as2&camp=1634&creative=6738&creativeASIN=1934356158"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&Format=_SL160_&ASIN=1934356158&MarketPlace=GB&ID=AsinImage&WS=1&tag=prodiy-21&ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&l=as2&o=2&a=1934356158" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

This is the very good introduction into Git from the community of Linux kernel developers and from Linux Torvalds in particular.

{% youtube 4XpnKHJAok8 425 344 %}

I appreciate these books for primary involvement in the subject. 

This is a book for beginners, and if you're not a novice in the field of DVCS, then you swallow it in one evening and want a more in-depth knowledge of Git. It happened to me. I read the book for the evening, it formulated dozens of unanswered questions and allowed me to understand - what kind of questions I need answers for. 

You will find the excellent [live book about Git][Git live book] on the official website. Many chapters are accompanied with video tutorials.

[Git live book]: http://book.git-scm.com/

I usually do not keep the book for beginners because after you are interested in the subject any more or dig deeper and knowledge for beginners becomes useless. But I leave this one.

Using right and convenient tools greatly speeds work. And the time spent at the beginning to choice and to set up them definitely pays off in the future. 

Hope I was able to attract into the ranks of git users a few more enthusiasts. 

Once accustomed to the constant presence on hand a version control, you want it to be everywhere. Even when repairing a car.
