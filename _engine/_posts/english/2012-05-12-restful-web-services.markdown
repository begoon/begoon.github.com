---
layout: post
title: 'Fuss about REST, or Richardson L., Ruby S., "RESTful Web Services"'
language: english
date: 2012-05-12 19:49
comments: true
categories: 
- book
- english
- rest
---
Kill me, but I don't understand why people write books about REST. Why you torture yourself, the keyboard, and finally your readers with a topic which can be explained in a few sentences?

[Leonard Richardson, Sam Ruby, "RESTful Web Services"][]

[Leonard Richardson, Sam Ruby, "RESTful Web Services"]: http://shop.oreilly.com/product/9780596529260.do

{% img /images/covers/english/restful-web-services-cover.gif %}

So, skipping a tedious chapter of HTTL libraries in Ruby, Python, Java and curl, more tedious chapter on HTML4, XHTML, HTML5, Atom, XML, a little less tedious chapter about a couple of Ajax libraries, extremely tedious chapter with standard HTTP response codes, unrealistically tedious chapter about standard HTTP headers, the essence of the book can be expressed very briefly. This is my summary of the entire book.

Developing a web-service you should follow some recommendations:

0. (Main one) Designing a URL structure you put as much meaning into there as possible. You should treat URLs as a query language for your data, which is readable and writable by **human**. For example, instead of `http://domain/engine.php?func=123&id=test` for get user details it should be something like `http://domain/users/test`.
1. Use all standard HTTP commands and response codes: not only GET and POST, but also PUT, DELETE, OPTION, HEAD, and not only 200 and 500, but the range of the standard [HTTP response codes][].
2. HTTP response should contain links to other resources reachable from the current one.

[HTTP response codes]: http://en.wikipedia.org/wiki/List_of_HTTP_status_codes

That's it! Now you know the whole book.

This is a rare situation when I'm seriously considering money back. Unfortunately I cannot re-sell because it's a bloody e-book. 
