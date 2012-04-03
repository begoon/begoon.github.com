---
layout: post
title: "MapReduce на Erlang'e"
language: russian
date: 2011-11-30 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/11/mapreduce-erlange.html
categories: 
- erlang
- russian
---
Я продолжаю погружение в Эрланг. Уже есть хитрый план переписать один из наших сервисов для мониторинга на Эрланге. Мы тут осваиваем облака Windows Azure и Amazon EC2 в качестве платформы для некоторых продуктов и внутренних задач типа QA, поэтому возможность использовать много ядер и машин без переписывания кода выглядить перспективно.

Итак, для начала простой, но реальный пример - есть проект ~2000 файлов. Надо составить список используемых переменных окружения. То есть найти вхождения строк `getenv(...)` и `GetVariable(...)` (это наш wrapper) и выдрать из них параметр.

Задача незамысловатая и давно решается программой на C++, которая даже обход каталогов не делает, а просто вызывает юниксовый `find`, генерирующий список файлов по маске, и затем по списку лопатит файлы. На 2000 файлах работает пару секунд в один поток.

Теперь Эрланг. Тут хочется замутить что-нибудь более кучерявое, чем последовательный обход файлов. MapReduce как раз в тему - можно составить список файлов, затем анализ каждого файла делать параллельно (Map), аккумулируя найденные имена переменных, и в конце обработать все полученные входждение (Reduce), в нашем случае просто подсчитать количество вхождения каждой переменной.

Фактически мой код повторяет пример из "[Programming Erlang][]" и использует модуль `phofs` (parallel higher-order functions) из этой же книги.

[Programming Erlang]: http://pragprog.com/book/jaerlang/programming-erlang

{% codeblock lang:erlang %}
-module(find_variables).
-export([main/0, find_variables_in_file/2, process_found_variables/3]).

-define(PATH, "/Projects/interesting_project").
-define(MASK, "\\..*(cpp|c)").

main() ->
    io:format("Creating list of files...~n", []),
    % Стандартная функция обхода файловой системы. Последний параметр -
    % функтор, накапливающий имена в списке.
    Files = filelib:fold_files(?PATH, ?MASK, true,
                               fun(N, A) -> [N | A] end, []),
    io:format("Found ~b file(s)~n", [length(Files)]),
    F1 = fun find_variables_in_file/2,   % Map
    F2 = fun process_found_variables/3,  % Reduce
    % Вызываем MapReduce через функцию benchmark, считающую время
    % выполнения.
    benchmark(fun() ->
        L = phofs:mapreduce(F1, F2, [], Files),
        io:format("Found ~b variable(s)~n", [length(L)])
    end, "MapReduce").

benchmark(Worker, Title) ->
    {T, _} = timer:tc(fun() -> Worker() end),
    io:format("~s: ~f sec(s)~n", [Title, T/1000000]).

-define(REGEXP, "(getenv|GetVariable)\s*\\(\s*\"([^\"]+)\"\s*\\)").

% Map. Анализ одного файла.
find_variables_in_file(Pid, FileName) ->
    case file:open(FileName, [read]) of
        {ok, File} ->
            % Заранее компилируем регулярное выражение.
            {_, RE} = re:compile(?REGEXP),
            % Данный обратный вызов пошлет родительскому контролирующему
            % потому сообщение с именем найденной переменной.
            CallBack = fun(Var) -> Pid ! {Var, 1} end,
            find_variable_in_file(File, RE, CallBack),
            file:close(File);
        {error, Reason} ->
            io:format("Unable to process '~s', ~p~n", [FileName, Reason]),
            exit(1)
    end.

% Reduce. Анализ данных. Данная функция вызывается контролирующим
% процессом MapReduce для каждого найденного ключа вместе со списком
% значений, ассоциированных с ним. В нашем случае это будут пары
% {VarName, 1}. Мы просто подсчитаем для каждого VarName количество
% пришедших пар, то есть количество найденных вхождений этой переменной.
% Это и есть наш незамысловатый анализ.

process_found_variables(Key, Vals, A) ->
    [{Key, length(Vals)} | A].

% Построчный обход файла.
find_variable_in_file(File, RE, CallBack) ->
    case io:get_line(File, "") of
       eof -> void;
       Line ->
         scan_line_in_file(Line, RE, CallBack),
         find_variable_in_file(File, RE, CallBack)
    end.

% Поиск строки в строке по регулярному выражению (скомпилированному ранее),
% и в случае нахождение вызов CallBack с передачей ему имени найденной
% переменной.
scan_line_in_file(Line, RE, CallBack) ->
    case re:run(Line, RE) of
        {match, Captured} ->
            [_, _, {NameP, NameL}] = Captured,
            Name = string:substr(Line, NameP + 1, NameL),
            CallBack(Name);
        nomatch -> void
    end.
{% endcodeblock %}

Для сборки программы нужен [модуль phofs][]. Он является универсальным, независимым от конкретных функций Map и Reduce.

[модуль phofs]: http://media.pragprog.com/titles/jaerlang/code/phofs.erl

И Makefile на всякий случай:

{% codeblock lang:makefile %}
target = find_variables

all:
    erlc $(target).erl
    erlc phofs.erl
    erl -noshell -s $(target) main -s init stop

clean:
    -rm *.beam *.dump
{% endcodeblock %}

Пузомерка. Как я уже сказал, программа на C++ вместе со временем вызова `find` на моей машине работает 1-2 секунды. Версия на Erlang'e работает ~20 секунд. Плохо? Смотря как посмотреть. Если анализ каждого файла будет более длительным (то есть программа будет основное время тратить на анализ файла, а не обход каталогов), то тут уже не совсем очевидно, какое из решений будет более практично при увеличении числа файлов и сложности анализа.

Я новичок в Эрланге, поэтому будут признателен за критику кода.

Посты по теме:

* [TCP/IP proxy на Erlang'e][]

[TCP/IP proxy на Erlang'e]: /blog/russian/2011/11/22/tcpip-proxy-in-erlang/
