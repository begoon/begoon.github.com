---
layout: post
title: "What is sizeof for composite types"
language: english
date: 2010-02-24 00:00
comments: true
blogspot: http://meta-coding.blogspot.com/2010/02/sizeof-for-composite-types.html
categories: 
- cplusplus
- english
---
The simplest way to understand the value of `sizeof` for composite types (structures and classes) before digging in to the alignment is to remember that sizeof returns the difference between addresses of two consequent elements of an array containing instances of the type.
