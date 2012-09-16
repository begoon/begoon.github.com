---
layout: post
title: "Buy Round: My second iPhone app"
language: english
date: 2012-09-16 20:20
comments: true
categories: 
- english
- ios
- iphone
- project
---
The good half of this post in Russian was about explaining the great UK
pub culture and the concept of the round at the pub. This is quite pointless
information for English speaking readers, so I just jump straight to the
technical part.

I wanted a simple and quick app helping me to remember a list of drink in
the round. Plus, I wanted to write something for iOS in general. Eventually, I ended up with this:

<iframe width="640" height="360" src="http://www.youtube.com/embed/0ba2Oacm8Dg" frameborder="0" allowfullscreen></iframe>

Quick and dirty, but it solves the problem in 100%. I personally use this
app all the time. Unfortunately, AppStore has rejected it as the app having
too limited functionality. Well, bad for them, good for me. I have learned
a lot developing this app.

I had to learn the following classes:

* UITabBarController to manage two tab views.
* UIViewController to work with tables via UITableViewDataSource and
  UITableViewDelegate delegates.
* Object serialization via NSKeyArchiver to save the list of drink to a file.

The full project is available at GitHub - https://github.com/begoon/buyround. Please, feel free to checkout and build
it.

As I wrote previously about my first iPhone app - [US Visa][], the
quality of the artwork, especially, icons, plays the crucial role in the
success of a mobile application. I've googled one (below) but it is much
better to design your own one.

[US Visa]: /blog/english/2012/09/05/usvisa-my-first-iphone-app/

![](/images/blog/buyround/beer-114x114.png)

P.S. For the sake of making this post complete I've decided to attach a photo
of absolutely inhuman conditions of creating it.

![](/images/blog/buyround/about-buyround.jpg)
