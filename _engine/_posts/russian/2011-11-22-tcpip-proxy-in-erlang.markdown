---
layout: post
title: "TCP/IP proxy на Erlang'e"
language: russian
date: 2011-11-22 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/11/tcpip-proxy-erlange.html
categories: 
- erlang
- russian
---
По мотивам [недавнего поста про изучение новых языков][Задача для освоения новых языков], я таки добил версию на Erlang'е. Если тут есть спецы по языку, буду признателен за критику.

Программа по функциям идентична [версии на Питоне][Мультипотоковый отладчик TCP/IP соединений] за исключением отсутствия дублирования лога в файл и продвинутого разбора флагов командной строки.

И так: программа многопоточна, и журналирование также происходит в отдельном потоке для обеспечения целостности многострочных дампов.

Про Эрланг. После многократных и пока полностью неуспешных заходов на Хаскелл и после все еще неудачных попыток на Lisp или Scheme написать что-то более менее реальное и жизненное, Эрланг был реальным прорывом для меня.

Удивительно, невозможность изменять переменные (представьте, что программируя на С++ надо все переменные делать `const`) является фантастическим способом борьбы с опечатками при cut-and-paste. Также когда делаешь циклы через хвостовую рекурсию, сразу осознаешь, как эффективно работать со списками, чтобы их не копировать, а всегда "таскать" за хвост или голову.

Ну а концепция легких потоков и обмена сообщениями между ними (как в Go), приправленная глобальной иммутабельностью, позволяет легко писать надежные многотопочные программы.

Например, истересен способ реализации многопотокового TCP/IP сервера. Обычно при его программировании есть распростраенный прием: один главный поток, принимающий соединения, и когда соединение принято, создается новый поток-исполнитель, который обрабатывает соединение и после этого умирает.

В Эрланге можно сделать иначе (функция `acceptor()`). Поток, ожидающий входящего соединения, после его получения рождает свой клон для ожидания следующего соединения и затем сам обрабабатывает запрос.

Для меня это было немного необычно.

{% codeblock lang:erlang %}
-module(tcp_proxy).

-define(WIDTH, 16).

main([ListenPort, RemoteHost, RemotePort]) ->
    ListenPortN = list_to_integer(ListenPort),
    start(ListenPortN, RemoteHost, list_to_integer(RemotePort));

main(_) -> usage().

usage() ->
    io:format("~ntcp_proxy.erl local_port remote_port remote_host~n~n", []),
    io:format("Example:~n~n", []),
    io:format("tcp_proxy.erl 50000 google.com 80~n~n", []).

start(ListenPort, CalleeHost, CalleePort) ->
    io:format("Start listening on port ~p and forwarding data to ~s:~p~n",
              [ListenPort, CalleeHost, CalleePort]),
    {ok, ListenSocket} = gen_tcp:listen(ListenPort, [binary, {packet, 0},
                                                    {reuseaddr, true},
                                                    {active, true}]),
    io:format("Listener socket is started ~s~n", [socket_info(ListenSocket)]),
    spawn(fun() -> acceptor(ListenSocket, CalleeHost, CalleePort, 0) end),
    register(logger, spawn(fun() -> logger() end)),
    wait().

% Infinine loop to make sure that the main thread doesn't exit.
wait() -> receive _ -> true end, wait().

format_socket_info(Info) ->
    {ok, {\{A, B, C, D}, Port}} = Info,
    lists:flatten(io_lib:format("~p.~p.~p.~p:~p", [A, B, C, D, Port])).

peer_info(Socket) -> format_socket_info(inet:peername(Socket)).

socket_info(Socket) -> format_socket_info(inet:sockname(Socket)).

acceptor(ListenSocket, RemoteHost, RemotePort, ConnN) ->
    case gen_tcp:accept(ListenSocket) of
      {ok, LocalSocket} ->
          spawn(fun() -> acceptor(ListenSocket, RemoteHost, RemotePort, ConnN + 1) end),
          LocalInfo = peer_info(LocalSocket),
          logger ! {message, "~4.16.0B: Incoming connection from ~s~n", [ConnN, LocalInfo]},
          case gen_tcp:connect(RemoteHost, RemotePort, [binary, {packet, 0}]) of
            {ok, RemoteSocket} ->
              RemoteInfo = peer_info(RemoteSocket),
              logger ! {message, "~4.16.0B: Connected to ~s~n", [ConnN, RemoteInfo]},
              exchange_data(LocalSocket, RemoteSocket, LocalInfo, RemoteInfo, ConnN, 0),
              logger ! {message, "~4.16.0B: Finished~n", [ConnN]};
            {error, Reason} ->
              logger ! {message, "~4.16.0B: Unable to connect to ~s:~s (error: ~p)~n",
                       [ConnN, RemoteHost, RemotePort, Reason]}
          end;
      {error, Reason} ->
          logger ! {message, "Socket accept error '~w'~n", [Reason]}
    end.

exchange_data(LocalSocket, RemoteSocket, LocalInfo, RemoteInfo, ConnN, PacketN) ->
    receive
        {tcp, RemoteSocket, Bin} ->
            logger ! {received, ConnN, Bin, RemoteInfo, PacketN},
            gen_tcp:send(LocalSocket, Bin),
            logger ! {sent, ConnN, LocalInfo, PacketN},
            exchange_data(LocalSocket, RemoteSocket, LocalInfo, RemoteInfo, ConnN, PacketN + 1);
        {tcp, LocalSocket, Bin} ->
            logger ! {received, ConnN, Bin, LocalInfo, PacketN},
            gen_tcp:send(RemoteSocket, Bin),
            logger ! {sent, ConnN, RemoteInfo, PacketN},
            exchange_data(LocalSocket, RemoteSocket, LocalInfo, RemoteInfo, ConnN, PacketN + 1);
        {tcp_closed, RemoteSocket} ->
            logger ! {message, "~4.16.0B: Disconnected from ~s~n", [ConnN, RemoteInfo]};
        {tcp_closed, LocalSocket} ->
            logger ! {message, "~4.16.0B: Disconnected from ~s~n", [ConnN, LocalInfo]}
    end.

logger() ->
    receive
        {received, Pid, Msg, From, PacketN} ->
            io:format("~4.16.0B: Received (#~p) ~p byte(s) from ~s~n",
                      [Pid, PacketN, byte_size(Msg), From]),
            dump_bin(Pid, Msg),
            logger();
        {sent, Pid, ToSocket, PacketN} ->
            io:format("~4.16.0B: Sent (#~p) to ~s~n", [Pid, PacketN, ToSocket]),
            logger();
        {message, Format, Args} ->
            io:format(Format, Args),
            logger()
    end.

dump_list(Prefix, L, Offset) ->
    {H, T} = lists:split(lists:min([?WIDTH, length(L)]), L),
    io:format("~4.16.0B: ", [Prefix]),
    io:format("~4.16.0B: ", [Offset]),
    io:format("~-*s| ", [?WIDTH * 3, dump_numbers(H)]),
    io:format("~-*s", [?WIDTH, dump_chars(H)]),
    io:format("~n", []),
    if length(T) > 0 -> dump_list(Prefix, T, Offset + 16); true -> [] end.

dump_numbers(L) when (is_list(L)) ->
    lists:flatten([io_lib:format("~2.16.0B ", [X]) || X <- L]).

dump_chars(L) ->
    lists:map(fun(X) ->
                if X >= 32 andalso X < 128 -> X;
                   true -> $.
                end
              end, L).

dump_bin(Prefix, Bin) ->
    dump_list(Prefix, binary_to_list(Bin), 0).
{% endcodeblock %}

В работе может выводить примерно следующее:

    alexander:erlang/>./tcp_proxy.sh 50000 pop.yandex.ru 110
    Start listening on port 50000 and forwarding data to pop.yandex.ru:110
    Listener socket is started 0.0.0.0:50000
    0000: Incoming connection from 127.0.0.1:51402
    0000: Connected to 213.180.204.37:110
    0000: Received (#0) 38 byte(s) from 213.180.204.37:110
    0000: 0000: 2B 4F 4B 20 50 4F 50 20 59 61 21 20 76 31 2E 30 | +OK POP Ya! v1.0
    0000: 0010: 2E 30 6E 61 40 32 35 20 67 55 62 44 54 51 64 5A | .0na@25 gUbDTQdZ
    0000: 0020: 6D 6D 49 31 0D 0A                               | mmI1..
    0000: Sent (#0) to 127.0.0.1:51402
    0000: Received (#1) 11 byte(s) from 127.0.0.1:51402
    0000: 0000: 55 53 45 52 20 74 65 73 74 0D 0A                | USER test..
    0000: Sent (#1) to 213.180.204.37:110
    0000: Received (#2) 23 byte(s) from 213.180.204.37:110
    0000: 0000: 2B 4F 4B 20 70 61 73 73 77 6F 72 64 2C 20 70 6C | +OK password, pl
    0000: 0010: 65 61 73 65 2E 0D 0A                            | ease...
    0000: Sent (#2) to 127.0.0.1:51402
    0000: Received (#3) 11 byte(s) from 127.0.0.1:51402
    0000: 0000: 50 41 53 53 20 70 61 73 73 0D 0A                | PASS pass..
    0000: Sent (#3) to 213.180.204.37:110
    0000: Received (#4) 72 byte(s) from 213.180.204.37:110
    0000: 0000: 2D 45 52 52 20 5B 41 55 54 48 5D 20 6C 6F 67 69 | -ERR [AUTH] logi
    0000: 0010: 6E 20 66 61 69 6C 75 72 65 20 6F 72 20 50 4F 50 | n failure or POP
    0000: 0020: 33 20 64 69 73 61 62 6C 65 64 2C 20 74 72 79 20 | 3 disabled, try
    0000: 0030: 6C 61 74 65 72 2E 20 73 63 3D 67 55 62 44 54 51 | later. sc=gUbDTQ
    0000: 0040: 64 5A 6D 6D 49 31 0D 0A                         | dZmmI1..
    0000: Sent (#4) to 127.0.0.1:51402
    0000: Disconnected from 213.180.204.37:110
    0000: Finished
    0001: Incoming connection from 127.0.0.1:51405
    0001: Connected to 213.180.204.37:110
    0001: Received (#0) 38 byte(s) from 213.180.204.37:110
    0001: 0000: 2B 4F 4B 20 50 4F 50 20 59 61 21 20 76 31 2E 30 | +OK POP Ya! v1.0
    0001: 0010: 2E 30 6E 61 40 33 30 20 70 55 62 41 72 52 33 74 | .0na@30 pUbArR3t
    0001: 0020: 6A 65 41 31 0D 0A                               | jeA1..
    0001: Sent (#0) to 127.0.0.1:51405
    0001: Received (#1) 6 byte(s) from 127.0.0.1:51405
    0001: 0000: 51 55 49 54 0D 0A                               | QUIT..
    0001: Sent (#1) to 213.180.204.37:110
    0001: Received (#2) 20 byte(s) from 213.180.204.37:110
    0001: 0000: 2B 4F 4B 20 73 68 75 74 74 69 6E 67 20 64 6F 77 | +OK shutting dow
    0001: 0010: 6E 2E 0D 0A                                     | n...
    0001: Sent (#2) to 127.0.0.1:51405
    0001: Disconnected from 213.180.204.37:110
    0001: Finished

Вывод: Эрланг - прекрасный вариант для начала функциональной карьеры.

Посты по теме:

* [Задача для освоения новых языков][]
* [Мультипотоковый отладчик TCP/IP соединений][]

[Задача для освоения новых языков]: /blog/russian/2011/11/19/problem-to-try-new-languages/
[Мультипотоковый отладчик TCP/IP соединений]: /blog/russian/2009/09/04/multi-threaded-tcpip-debugger/
