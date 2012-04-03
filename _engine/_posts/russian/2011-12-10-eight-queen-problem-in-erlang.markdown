---
layout: post
title: "Задача расположения восьми ферзей на Erlang'e"
language: russian
date: 2011-12-10 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/12/erlange.html
categories: 
- erlang
- problem
- russian
---
Знаю, что [баян][Eight queens puzzle], но для меня было весьма показательно.

[Eight queens puzzle]: http://en.wikipedia.org/wiki/Eight_queens_puzzle

Например, вот вариант, который я написал где-то за полчаса:

{% codeblock lang:erlang %}
-module(queens_classic).
-export([solve/0]).

solve() ->
    solve(lists:seq(1, 8), lists:seq(1, 15 + 15), 1, []).

print_board([]) -> io:format("~n", []);
print_board([H|T]) ->
    Line = [string:copies(". ", H - 1), "@ ", string:copies(". ", 8 - H)],
    io:format("~s~n", [Line]),
    print_board(T).

solve(_, _, Cols, Result) when Cols > 8 ->
    io:format("~p~n", [Result]),
    print_board(Result);

solve(Rows, Diags, Col, Result) ->
    lists:foreach(fun(Row) ->
                     D1 = Row + Col,
                     D2 = Row - Col + 8 + 15,
                     T = lists:member(Row, Rows) andalso
                         lists:member(D1, Diags) andalso
                         lists:member(D2, Diags),
                     if T ->
                         Rows1 = Rows -- [Row],
                         Diags1 = Diags -- [D1, D2],
                         solve(Rows1, Diags1, Col + 1, [Row | Result]);
                        true -> void
                     end
                  end, Rows).
{% endcodeblock %}

Выглядит ужасно, и стиль однозначно понятно какой: C/Python на стероидах (циклы, if'ы).

А вот над этим вариантом я провозился несколько часов:

{% codeblock lang:erlang %}
-module(queens).
-export([solve/0]).

solve() ->
    solve(1, []).

print_board([]) -> io:format("~n", []);
print_board([{_X, Y}|T]) ->
    Line = [string:copies(". ", Y - 1), "@ ", string:copies(". ", 8 - Y)],
    io:format("~s~n", [Line]),
    print_board(T).

solve(X, Taken) when X > 8 ->
    io:format("~p~n", [Taken]),
    print_board(Taken);

solve(X, Taken) ->
    L = [{X, Y} || Y <- lists:seq(1, 8), not under_attack({X, Y}, Taken)],
    row(L, Taken).

row([], _) -> [];
row([{X, Y}|L], Taken) ->
    solve(X + 1, [{X, Y} | Taken]),
    row(L, Taken).

under_attack(_, []) -> false;
under_attack({X, Y}, [{Xt, Yt}|L]) ->
    Y == Yt orelse abs(Y - Yt) == abs(X - Xt) orelse
    under_attack({X, Y}, L).
{% endcodeblock %}

Вся работа со списками вручную без циклоподобных конструкций.

Печатает типа такого:

    [4,7,5,2,6,1,3,8]
    . . . @ . . . .
    . . . . . . @ .
    . . . . @ . . .
    . @ . . . . . .
    . . . . . @ . .
    @ . . . . . . .
    . . @ . . . . .
    . . . . . . . @

    [5,7,2,6,3,1,4,8]
    . . . . @ . . .
    . . . . . . @ .
    . @ . . . . . .
    . . . . . @ . .
    . . @ . . . . .
    @ . . . . . . .
    . . . @ . . . .
    . . . . . . . @

    ...

Увы, но вот [эта версия][N queens solution with erlang] мне кажется более красивой с точки зрения фукнционального стиля.

[N queens solution with erlang]: http://www.redaelli.org/matteo-blog/2009/01/05/n-queens-solution-with-erlang/

На всякий случай Makefile для обоих вариантов:

{% codeblock lang:makefile %}
target = queens

all:
    erlc $(target).erl
    erl -noshell -s $(target) solve -s init stop

classic:
    erlc $(target)_classic.erl
    erl -noshell -s $(target)_classic solve -s init stop

clean:
    -rm *.beam *.dump
{% endcodeblock %}
