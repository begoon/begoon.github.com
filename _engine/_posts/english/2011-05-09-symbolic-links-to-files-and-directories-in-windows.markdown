---
layout: post
title: "Symbolic links to files and directories in Windows"
language: english
date: 2011-05-09 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/05/links-to-files-and-directories-in.html
categories: 
- windows
- english
---
To my shame, I thought that Windows still lives in the previous century without links in the file system. I knew about junctions, links to directories, which can be created, for instance, in FAR via Alt-F6.

But today, thumbing through "Windows Internals", I came across a paragraph about it.

So, there is a little log from the console (Windows 7).

    ver

    Microsoft Windows [Version 6.1.7601]

Create a file and a directory:

cd C:\Temp\links
C:\temp\links>mkdir folder
C:\temp\links>echo >file

Create a symbolic link to the directory:

    C:\temp\links>mklink /D link1 folder
    symbolic link created for link1 <<===>> folder

Create a junction to the directory (it isn't possible to point it to a file):

    C:\temp\links>mklink /J link2 folder
    Junction created for link2 <<===>> folder

Create a symbolic link slightly differently:

    C:\temp\links>mklink link3 folder
    symbolic link created for link3 <<===>> folder

Create a symbolic link to a file:

    C:\temp\links>mklink link4 file
    symbolic link created for link4 <<===>> file

Result:

    C:\temp\links>dir
     Volume in drive C has no label.
     Volume Serial Number is C021-6C9F

     Directory of C:\temp\links

    09/05/2011  18:26    <DIR>          .
    09/05/2011  18:26    <DIR>          ..
    09/05/2011  18:26                13 file
    09/05/2011  18:25    <SYMLINKD>     link1 [folder]
    09/05/2011  18:25    <JUNCTION>     link2 [C:\temp\links\folder]
    09/05/2011  18:25    <SYMLINK>      link3 [folder]
    09/05/2011  18:26    <SYMLINK>      link4 [file]
    09/05/2011  18:23    <DIR>          folder
                   3 File(s)             13 bytes
                   5 Dir(s)  208,278,925,312 bytes free

Note the interesting types of files: `<SYMLINKD>`, `<JUNCTION>`, `<SYMLINK>`. The book says the first two are identical in functionality, simply `<JUNCTION>` is older mechanism available in older versions of Windows and supporting links within the same volume only.

Also, note that even `link3` points to a directory, it doesn't behave as a regular directory (in contrast to `link1` and `link2` which work normally as directories). FAR, by the way, also doesn't see `link3` as a directory.

In general, such simple task as links in the file system, solved in UNIX more than twenty years ago, has been solved in Windows in traditional for this operating system way - there are multiple solutions with different level of compatibility.

By the way, "Windows Internals" is bloody fantastic, strongly recommend.

<a href="http://www.amazon.co.uk/gp/product/0735625301/ref=as_li_tf_il?ie=UTF8&tag=prodiy-21&linkCode=as2&camp=1634&creative=6738&creativeASIN=0735625301"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&Format=_SL160_&ASIN=0735625301&MarketPlace=GB&ID=AsinImage&WS=1&tag=prodiy-21&ServiceVersion=20070822" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&l=as2&o=2&a=0735625301" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />
