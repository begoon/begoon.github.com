---
layout: post
title: "TCP/IP proxy на Go"
language: russian
date: 2012-04-21 15:30
comments: true
categories: 
- go
- russian
---
Я снова вернулся к любимой [задаче для освоения новых языков][Задача для освоения новых языков]. После [написания движка для блога на Go][Goblog: Самодельный статический движок для блога на Go], захотелось снова поразмять пальцы, болезный TCP/IP proxy/debugger теперь написан на Go.

[Goblog: Самодельный статический движок для блога на Go]: /blog/russian/2012/04/17/static-blog-engine-goblog/

Вкратце, TCP/IP proxy - это программа, которая умеет принимать соединения и "пробрасывать" их на указанный адрес. Попутно ведутся логи переданных данных. Это очень удобно при отладке различных самодельных сетевых протоколов.

В плане функциональности версия на Go, как и [эрланговская][Улучшенный TCP/IP proxy на Erlang'e], ведет три лога: двунаправленный шестнадцатеричный дамп и бинарные логи в обоих направлениях, "от" и "к" удаленному хосту. [Питоновская версия][Мультипотоковый отладчик TCP/IP соединений] бинарные логи не ведет.

Конечно, все многопоточно. И так как в Go параллельное программирование настолько просто (и безопасно), количество параллельных активностей для каждого соединения даже больше, чем в версии на Эрланге.

На Эрланге для каждого соединения работали следующие четыре потока:

* двунаправленный дамп-логгер
* два потока для двоичных логов принимаемых и посылаемых данных
* главный поток, мультиплексирующий чтение из локального и удаленного сокетов

В версии на Go немного иначе:

* двунаправленный дамп-логгер
* два потока для двоичных логов принимаемых и посылаемых данных
* два **независимых** потока для чтения и чтения из локального и удаленного сокета

Итого, 5.

В обоих случаях потоки чтения логируют данные, посылая сообщения потокам-логгерам. Конечно, нет никаких глупостей типа мьютексов или условных переменных. Проблемы согласования элегантно решаются через каналы Go.

Ниже привожу исходник. Он отличается от того, что в репозитории, наличием обильных комментариев. Для людей, не очень знакомых с Go, могут быть интересны некоторые моменты.

{% codeblock lang:go %}
package main

import (
  "flag"
  "fmt"
  "net"
  "os"
  "strings"
  "time"
  "encoding/hex"
  "runtime"
)

var (
  host        *string = flag.String("host", "", "target host or address")
  port        *string = flag.String("port", "0", "target port")
  listen_port *string = flag.String("listen_port", "0", "listen port")
)

func die(format string, v ...interface{}) {
  os.Stderr.WriteString(fmt.Sprintf(format+"\n", v...))
  os.Exit(1)
}

// Данная функция реализует поток для двунаправленного дампа. 
func connection_logger(data chan []byte, conn_n int, local_info, remote_info string) {
  log_name := fmt.Sprintf("log-%s-%04d-%s-%s.log", format_time(time.Now()),
                          conn_n, local_info, remote_info)
  logger_loop(data, log_name)
}

// Данная функция реализует двоичный лог.
func binary_logger(data chan []byte, conn_n int, peer string) {
  log_name := fmt.Sprintf("log-binary-%s-%04d-%s.log", format_time(time.Now()),
                           conn_n, peer)
  logger_loop(data, log_name)
}

// Данная функция реализует поток логирования. Создает лог-файл и начинает
// принимает сообщения. Каждое сообщение - это кусок данных для помещения
// в лог. Если пришли пустые данные - выходим.
//
func logger_loop(data chan []byte, log_name string) {
  f, err := os.Create(log_name)
  if err != nil {
    die("Unable to create file %s, %v\n", log_name, err)
  }
  defer f.Close()  // Гарантируем закрытие файла в случае падения.
  for {
    b := <-data
    if len(b) == 0 {
      break
    }
    f.Write(b)
    f.Sync()       // На всякий случай flush'имся.
  }
}

func format_time(t time.Time) string {
  return t.Format("2006.01.02-15.04.05")
}

func printable_addr(a net.Addr) string {
  return strings.Replace(a.String(), ":", "-", -1)
}

// Структура, в которой передаются параметры соединения. Объединено, чтобы
// не таскать много параметров.
type Channel struct {
  from, to net.Conn
  logger, binary_logger chan []byte
  ack chan bool
}

// Функция, "качающая" данные из одного сокета и передающая их в другой.
// Попутно ведется логирование.
func pass_through(c *Channel) {
  from_peer := printable_addr(c.from.LocalAddr())
  to_peer := printable_addr(c.to.LocalAddr())

  b := make([]byte, 10240)
  offset := 0
  packet_n := 0
  for {
    n, err := c.from.Read(b)
    if err != nil {
      c.logger <- []byte(fmt.Sprintf("Disconnected from %s\n", from_peer))
      break
    }
    if n > 0 {
      // Если что-то пришло, то логируем и пересылаем на выход.
      c.logger <- []byte(fmt.Sprintf("Received (#%d, %08X) %d bytes from %s\n", 
                                     packet_n, offset, n, from_peer))
      // Это все, что нужно для преобразования в hex-дамп. Удобно, не так ли?
      c.logger <- []byte(hex.Dump(b[:n]))
      c.binary_logger <- b[:n]
      c.to.Write(b[:n])
      c.logger <- []byte(fmt.Sprintf("Sent (#%d) to %s\n", packet_n, to_peer))
      offset += n
      packet_n += 1
    }
  }
  c.from.Close()
  c.to.Close()
  c.ack <- true   // Посылаем сообщение в главный поток, что мы закончили.
}

// Данная функция обслуживает соединение. Запускает необходимые потоки и ждет
// их завершения.
func process_connection(local net.Conn, conn_n int, target string) {
  // Соединяемся к удаленном сокету, куда будем пересылать данные.
  remote, err := net.Dial("tcp", target)
  if err != nil {
    fmt.Printf("Unable to connect to %s, %v\n", target, err)
  }
  
  local_info := printable_addr(remote.LocalAddr())
  remote_info := printable_addr(remote.RemoteAddr())

  // Засекаем начальное время.
  started := time.Now()
  
  // Создаем каналы для обмена с логгерами.
  logger := make(chan []byte)
  from_logger := make(chan []byte)
  to_logger := make(chan []byte)

  // Канал для получения подтверждений от качающих потоков.
  ack := make(chan bool)

  // Запускаем логгеры.
  go connection_logger(logger, conn_n, local_info, remote_info)
  go binary_logger(from_logger, conn_n, local_info)
  go binary_logger(to_logger, conn_n, remote_info)

  logger <- []byte(fmt.Sprintf("Connected to %s at %s\n", target,
                               format_time(started)))

  // Запускаем качающие потоки.
  go pass_through(&Channel{remote, local, logger, to_logger, ack})
  go pass_through(&Channel{local, remote, logger, from_logger, ack})

  // Ждем подтверждения об их завершении.
  <-ack
  <-ack

  // Вычисляем длительность соединения.
  finished := time.Now()
  duration := finished.Sub(started)
  logger <- []byte(fmt.Sprintf("Finished at %s, duration %s\n",
                               format_time(started), duration.String()))

  // Посылаем логгерам команды закругляться. Мы тут не ждем от них
  // подтверждения, так как они и так завершатся рано или поздно, а они нам
  // более не нужны.
  logger <- []byte{}
  from_logger <- []byte{}
  to_logger <- []byte{}
}

func main() {
  // Просим Go использовать все имеющиеся в системе процессоры.
  runtime.GOMAXPROCS(runtime.NumCPU())
  // Разбираем командную строку (несложно, не правда ли?)
  flag.Parse()
  if flag.NFlag() != 3 {
    fmt.Printf("usage: gotcpspy -host target_host -port target_port -listen_post=local_port\n")
    flag.PrintDefaults()
    os.Exit(1)
  }
  target := net.JoinHostPort(*host, *port)
  fmt.Printf("Start listening on port %s and forwarding data to %s\n",
             *listen_port, target)

  ln, err := net.Listen("tcp", ":"+*listen_port)
  if err != nil {
    fmt.Printf("Unable to start listener, %v\n", err)
    os.Exit(1)
  }
  conn_n := 1
  for {
    // Ждем новых соединений.
    if conn, err := ln.Accept(); err == nil {
      // Запускаем поток обработки соединения.
      go process_connection(conn, conn_n, target)
      conn_n += 1
    } else {
      fmt.Printf("Accept failed, %v\n", err)
    }
  }
}
{% endcodeblock %}

Повторюсь, каждое соединения обслуживается **пятью** потоками. И сделал я это не ради прикола. Просто мне показалось, что логически есть явно независимые подзадачи, которые было бы логично запустить параллельно. Если б я писал все на C++/boost, я б скорее всего замутил все одном потоке для каждого соединения (а может быть и вся программа была бы чисто однопотоковой через какие-нибудь изощренные библиотеки мультиплексирования), и не исключено, что на C++ в итоге еще и работало бы быстрее, несмотря на один поток. Но я хочу сказать не об этом. Go подталкивает на многопоточное программирование (а не отталкивает, как C++, даже на стероидах нового стандарта). Так или иначе, будут задачи, где удобная многопоточность станет ключевым фактором.

Запустить можно так (требуется как минимум Go релиз 1):

    go run gotcpspy.go -host pop.yandex.ru -port 110 -local_port 8080
    
Выведется:

    Start listening on port 8080 and forwarding data to pop.yandex.ru:110
    
Затем, если в другом окне ввести:

    telnet localhost 8080
    
и ввести, например, `USER test` `<ENTER>` и `PASS none` `<ENTER>`, то будут созданы три лога (дата в имени будет, конечно другая).
    
Общий лог `log-2012.04.20-19.55.17-0001-192.168.1.41-49544-213.180.204.37-110.log`:

    Connected to pop.yandex.ru:110 at 2012.04.20-19.55.17
    Received (#0, 00000000) 38 bytes from 192.168.1.41-49544
    00000000  2b 4f 4b 20 50 4f 50 20  59 61 21 20 76 31 2e 30  |+OK POP Ya! v1.0|
    00000010  2e 30 6e 61 40 32 36 20  48 74 6a 4a 69 74 63 50  |.0na@26 HtjJitcP|
    00000020  52 75 51 31 0d 0a                                 |RuQ1..|
    Sent (#0) to [--1]-8080
    Received (#0, 00000000) 11 bytes from [--1]-8080
    00000000  55 53 45 52 20 74 65 73  74 0d 0a                 |USER test..|
    Sent (#0) to 192.168.1.41-49544
    Received (#1, 00000026) 23 bytes from 192.168.1.41-49544
    00000000  2b 4f 4b 20 70 61 73 73  77 6f 72 64 2c 20 70 6c  |+OK password, pl|
    00000010  65 61 73 65 2e 0d 0a                              |ease...|
    Sent (#1) to [--1]-8080
    Received (#1, 0000000B) 11 bytes from [--1]-8080
    00000000  50 41 53 53 20 6e 6f 6e  65 0d 0a                 |PASS none..|
    Sent (#1) to 192.168.1.41-49544
    Received (#2, 0000003D) 72 bytes from 192.168.1.41-49544
    00000000  2d 45 52 52 20 5b 41 55  54 48 5d 20 6c 6f 67 69  |-ERR [AUTH] logi|
    00000010  6e 20 66 61 69 6c 75 72  65 20 6f 72 20 50 4f 50  |n failure or POP|
    00000020  33 20 64 69 73 61 62 6c  65 64 2c 20 74 72 79 20  |3 disabled, try |
    00000030  6c 61 74 65 72 2e 20 73  63 3d 48 74 6a 4a 69 74  |later. sc=HtjJit|
    00000040  63 50 52 75 51 31 0d 0a                           |cPRuQ1..|
    Sent (#2) to [--1]-8080
    Disconnected from 192.168.1.41-49544
    Disconnected from [--1]-8080
    Finished at 2012.04.20-19.55.17, duration 5.253979s
        
Двоичный лог исходящих данных `log-binary-2012.04.20-19.55.17-0001-192.168.1.41-49544.log`:

    USER test
    PASS none
    
Двоичный лог входящих данных `log-binary-2012.04.20-19.55.17-0001-213.180.204.37-110.log`:

    +OK POP Ya! v1.0.0na@26 HtjJitcPRuQ1
    +OK password, please.
    -ERR [AUTH] login failure or POP3 disabled, try later. sc=HtjJitcPRuQ1
    
Теперь измерим производительность. Прокачаем файл напрямую, а потом через эту программу.

Качаем напрямую (файл размером около 72MB):

    time wget http://www.erlang.org/download/otp_src_R15B01.tar.gz
    ...
    Saving to: `otp_src_R15B01.tar.gz'
    ...
    real	1m2.819s
    
Теперь закачаем через программу, предварительно запустив ее:

    go run gotcpspy.go -host=www.erlang.org -port=80 -listen_port=8080
    
Качаем:

    time wget http://localhost:8080/download/otp_src_R15B01.tar.gz
    ...
    Saving to: `otp_src_R15B01.tar.gz.1'
    ...
    real	0m56.209s
    
На всякий случай, можно сравнить результаты:

    diff otp_src_R15B01.tar.gz otp_src_R15B01.tar.gz.1
    
У меня файлы одинаковые, значит все работает верно.

Теперь время. Я повторял эксперимент несколько раз (на Mac Air), и, что удивительно, закачка через программу всегда была не то, чтобы медленнее, а даже немного быстрее. Например, напрямую -- 1m2.819s, через программу -- 0m56.209s. Единственное объяснение, что `wget` возможно работает в один поток, а программа принимает данные из локального и удаленного сокета в два потока, что может давать небольшое ускорение. Но, разница все равно минимальна, и возможно на другой машине или сети ее будет не видно, но главное, что работает как минимум **не медленнее**, чем напрямую, несмотря на создание в процессе передачи весьма массивных логов.

Итак, пока среди трех вариантов такой программы, на Питоне, Эрланге и Go, последняя мне нравится больше всего.

Как мне показалось, неплохой эксперимент с параллельностью в Go.

### Посты по теме

* [Задача для освоения новых языков][]
* [TCP/IP proxy на Erlang'e][]
* [Улучшенный TCP/IP proxy на Erlang'e][]
* [Мультипотоковый отладчик TCP/IP соединений][] (на Питоне)

### Ссылки на репозитории

* [Go][go-tcpspy]
* [Эрланг][erl-tcpspy]
* [Питон][py-tcpspy]

### P.S.

Кстати, если кто-то из джавистов замутил бы схожую программу (если можно, не требующую для сборки Eclipse/IDEA/ant/maven/spring/log4j/ivy и прочее), было бы очень интересно сравнить. И не в плане эффективности и скорости, а в плане красоты, изящности.

[go-tcpspy]: https://github.com/begoon/go-tcpspy
[erl-tcpspy]: https://github.com/begoon/erl-tcpspy
[py-tcpspy]: https://github.com/begoon/py-tcpspy

[Задача для освоения новых языков]: /blog/russian/2011/11/19/problem-to-try-new-languages/
[TCP/IP proxy на Erlang'e]: /blog/russian/2011/11/22/tcpip-proxy-in-erlang/
[Улучшенный TCP/IP proxy на Erlang'e]: /blog/russian/2011/11/26/improved-tcpip-proxy-in-erlang/
[Мультипотоковый отладчик TCP/IP соединений]: /blog/russian/2009/09/04/multi-threaded-tcpip-debugger/
