---
layout: post
title: "Моя первая программа на Эрланге"
language: russian
date: 2010-09-12 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2010/09/blog-post.html
categories:
- erlang
- russian
---
Решал я тут одну [красивую задачу][acmp.ru 176]. Решение - рекурсивная функция, динамическое программирование.
Для эксперимента написал свою первую программу на Эрланге как решение этой задачи.

[acmp.ru 176]: http://acmp.ru/index.asp?main=task&id_task=176

Вот оригинал на C++ (рекурсия с кешированием):

{% codeblock lang:cpp %}
bignum f(int n, int k, int t, int& K, vector<vector<vector<bignum> > >& dp) {
  if (n == 0 && k == 0 && t == 0) return 1;
  if (n == 0 || k < 0) return 0;

  if (!(dp[t][n][k] == -1)) return dp[t][n][k];

  bignum ans = 0;

  if (k < K) {
    ans = ans + f(n - 1, k - 1, t, K, dp);
    if (t == 1 || (t == 0 && k < K - 1))
      ans = ans + f(n - 1, k + 1, t, K, dp);
  }

  if (t == 1 && k == K) {
    ans = ans + f(n - 1, k - 1, 0, K, dp);
    ans = ans + f(n - 1, k - 1, 1, K, dp);
  }

  dp[t][n][k] = ans;
  return ans;
}
{% endcodeblock %}

А теперь Эрланг:

{% codeblock lang:erlang %}
main(_) ->
  N = 50, K = 25,
  io:format("~w\n", [rbs(2*N, 0, 1, K)]).

rbs(0, 0, 0, _) -> 1;
rbs(0, _, _, _) -> 0;
rbs(_, K, _, _) when K < 0 -> 0;

rbs(N, K, 0, MAX_K) ->
  if 
    K < MAX_K-1 -> rbs(N-1, K-1, 0, MAX_K) + rbs(N-1, K+1, 0, MAX_K);
    K < MAX_K   -> rbs(N-1, K-1, 0, MAX_K);
    K =:= MAX_K -> 0
  end;

rbs(N, K, 1, MAX_K) ->
  if
    K < MAX_K   -> rbs(N-1, K-1, 1, MAX_K) + rbs(N-1, K+1, 1, MAX_K);
    K =:= MAX_K -> rbs(N-1, K-1, 0, MAX_K) + rbs(N-1, K-1, 1, MAX_K)
  end.
{% endcodeblock %}

Красиво, а?

Но вот увы, кеширование результатов пришлось делать тоже вручную, так как без нее программа имеет экспоненциальное время. Так что итоговый вариант выглядит так:

{% codeblock lang:erlang %}
#!/usr/bin/env escript

main(_) ->
  N = 50, K = 25,
  io:format("~w\n", [rbs(2*N, 0, 1, K)]).

rbs(0, 0, 0, _) -> 1;
rbs(0, _, _, _) -> 0;
rbs(_, K, _, _) when K < 0 -> 0;

rbs(N, K, 0, MAX_K) ->
  if 
    K < MAX_K-1 -> rbs_memo(N-1, K-1, 0, MAX_K) + rbs_memo(N-1, K+1, 0, MAX_K);
    K < MAX_K   -> rbs_memo(N-1, K-1, 0, MAX_K);
    K =:= MAX_K -> 0
  end;

rbs(N, K, 1, MAX_K) ->
  if
    K < MAX_K   -> rbs_memo(N-1, K-1, 1, MAX_K) + rbs_memo(N-1, K+1, 1, MAX_K);
    K =:= MAX_K -> rbs_memo(N-1, K-1, 0, MAX_K) + rbs_memo(N-1, K-1, 1, MAX_K)
  end.

rbs_memo(N, K, T, MAX_K) ->
  Name = rbs,
  case ets:info(Name) of
    undefined ->
      ets:new(Name, [public, named_table]);
    _ -> true
  end,
  Key = {N, K, T, MAX_K},
  case ets:lookup(Name, Key) of
    [] ->
      Val = rbs(N, K, T, MAX_K),
      ets:insert(Name, {Key, Val}),
      Val;
    [{_, Val}] -> Val;
    Else -> Else
  end.
{% endcodeblock %}

Странно, ведь можно было бы заложить кеширование прямо в языке. Ведь когда функция вызывается повторно с теми же самыми аргументами, то очевидно, что результат будет такой же (ибо Эрланг - это "чистый" функциональный язык, и side effects тут исключены). Но в целом функция кеширования весьма универсальна и ее можно быстро адаптировать для других ситуаций.

По времени выполнения эрланговый вариант не уступает C++. При это надо учесть, что Эрланге по умочанию арифметика "длинная", а в С++ мне пришлось использовать доморощенный класс `bignum`.
