---
layout: post
title: "Number of crossings in bipartite graph"
language: english
date: 2011-05-24 01:00
comments: true
blogspot: http://meta-coding.blogspot.com/2011/05/number-of-crossings-in-bipartite-graph.html
categories: 
- problem
- english
---
Given a [bipartite graph][]: "n" vertices on the left, "m" on the right and edges. The question is: how many edges in this graph are crossed?

[bipartite graph]: http://en.wikipedia.org/wiki/Bipartite_graph

In this example n=5, m=4, ten edges: 1-1, 1-2, 2-1, 2-2, 3-3, 4-1, 4-3, 5-1, 5-2, 5-4, a number of crossings: 10.

{% img /images/blog/bipartite-graph.gif %}

Crossings are always considered in pairs. For example, if three edges are crossed in one physical point, formally there are still three crossings, not one.

O(n*m) solution exists.
