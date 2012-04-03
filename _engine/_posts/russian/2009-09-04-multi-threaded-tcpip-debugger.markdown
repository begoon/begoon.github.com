---
layout: post
title: "Мультипотоковый отладчик TCP/IP соединений"
language: russian
date: 2009-09-04 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/09/tcpip.html
categories:
- russian
---
Трассировка данных, передаваемых по TCP/IP, является весьма частой задачей при разработке сетевых приложений, особенно низкого уровня. 

Программ для данной задачи существует превеликое множество. Но лично я очень давно использую для этих целей свой собственный велосипед. Причин тут несколько. Основная - мне нужна одна программа, одинаково работающая на многих платформах, включая даже Windows. Вторая по значимости причина - возможность налету что-то подкручивать, допиливать, вставлять миникуски кода для анализа конкретного протокола и т.д. Получается, что скриптовой язык тут является хорошим подспорьем.

Несколько лет назад первые версии моей утилиты были на PHP, но текущая версия переписана на Питоне.

Исходник небольшой, а, как мне кажется, разглядывание исходников должно радовать большинство программистов, особенно, если есть что покритиковать, поэтому приведу его прямо здесь (см. ниже).

Ни разу не претендую на оптимальность или крутизну использования Питона, поэтому принимаю любую критику.

Основные особенности и возможности:

* программа "слушает" на указанном порту и перенаправляет траффик на указанные адрес и порт
* умеет сохранять лог в файл
* программа является многопотоковой, то есть может принимать сразу несколько входящих содинений
* механизм записи лога работает также в отдельном потоке, ускоряет работу

Пример использования.

Запускаем сервер:

    python pyspy.py -a 10.44.5.138 -p 5467 -l 9999 -L trace.log
    
Запускаем клиента:

    telnet localhost 9999
    
и вводим `GET / HTTP/1.0<ENTER><ENTER>`.
    
В файле лога и в консоли получаем вот такое:

    0000: Listen at port 9999, remote host ('10.44.5.138', 5467)
    0000: Connection accepted from ('127.0.0.1', 15223), thread 1 launched
    0001: Thread started
    0001: Connecting to ('10.44.5.138', 5467)...
    0001: Remote host: ('127.0.0.1', 15223)
    0001: Recevied from ('127.0.0.1', 15223) (1)
    0001: ----: 00-01-02-03-04-05-06-07-08-09-0A-0B-0C-0D-0E-0F
    0001:       ------------------------------------------------
    0001: 0000: 47                                              | G               
    0001: Sent to ('10.44.5.138', 5467) (1)
    0001: Recevied from ('127.0.0.1', 15223) (13)
    0001: ----: 00-01-02-03-04-05-06-07-08-09-0A-0B-0C-0D-0E-0F
    0001:       ------------------------------------------------
    0001: 0000: 45 54 20 2F 20 48 54 54 50 2F 31 2E 30          | ET / HTTP/1.0   
    0001: Sent to ('10.44.5.138', 5467) (13)
    0001: Recevied from ('127.0.0.1', 15223) (2)
    0001: ----: 00-01-02-03-04-05-06-07-08-09-0A-0B-0C-0D-0E-0F
    0001:       ------------------------------------------------
    0001: 0000: 0D 0A                                           | ..              
    0001: Sent to ('10.44.5.138', 5467) (2)
    0001: Recevied from ('127.0.0.1', 15223) (2)
    0001: ----: 00-01-02-03-04-05-06-07-08-09-0A-0B-0C-0D-0E-0F
    0001:       ------------------------------------------------
    0001: 0000: 0D 0A                                           | ..              
    0001: Sent to ('10.44.5.138', 5467) (2)
    0001: Recevied from ('10.44.5.138', 5467) (379)
    0001: ----: 00-01-02-03-04-05-06-07-08-09-0A-0B-0C-0D-0E-0F
    0001:       ------------------------------------------------
    0001: 0000: 48 54 54 50 2F 31 2E 31 20 33 30 32 20 46 6F 75 | HTTP/1.1 302 Fou
    0001: 0010: 6E 64 0D 0A 44 61 74 65 3A 20 46 72 69 2C 20 30 | nd..Date: Fri, 0
    0001: 0020: 34 20 53 65 70 20 32 30 30 39 20 30 38 3A 35 33 | 4 Sep 2009 08:53
    0001: 0030: 3A 30 33 20 47 4D 54 0D 0A 53 65 72 76 65 72 3A | :03 GMT..Server:
    0001: 0040: 20 41 70 61 63 68 65 0D 0A 50 72 61 67 6D 61 3A |  Apache..Pragma:
    0001: 0050: 20 6E 6F 2D 63 61 63 68 65 0D 0A 45 78 70 69 72 |  no-cache..Expir
    0001: 0060: 65 73 3A 20 46 72 69 2C 20 30 31 20 4A 61 6E 20 | es: Fri, 01 Jan 
    0001: 0070: 31 39 39 39 20 30 30 3A 30 30 3A 30 30 20 47 4D | 1999 00:00:00 GM
    0001: 0080: 54 0D 0A 43 61 63 68 65 2D 63 6F 6E 74 72 6F 6C | T..Cache-control
    0001: 0090: 3A 20 6E 6F 2D 63 61 63 68 65 2C 20 6E 6F 2D 63 | : no-cache, no-c
    0001: 00A0: 61 63 68 65 3D 22 53 65 74 2D 43 6F 6F 6B 69 65 | ache="Set-Cookie
    0001: 00B0: 22 2C 20 70 72 69 76 61 74 65 0D 0A 4C 6F 63 61 | ", private..Loca
    ...
    [обрезано]
    ...
    0001: 0100: 76 3D 31 0D 0A 43 6F 6E 6E 65 63 74 69 6F 6E 3A | v=1..Connection:
    0001: 0110: 20 63 6C 6F 73 65 0D 0A 43 6F 6E 74 65 6E 74 2D |  close..Content-
    0001: 0120: 54 79 70 65 3A 20 74 65 78 74 2F 68 74 6D 6C 0D | Type: text/html.
    0001: 0130: 0A 0D 0A 52 65 64 69 72 65 63 74 20 70 61 67 65 | ...Redirect page
    0001: 0140: 3C 62 72 3E 3C 62 72 3E 0A 54 68 65 72 65 20 69 | <br><br>.There i
    0001: 0150: 73 20 6E 6F 74 68 69 6E 67 20 74 6F 20 73 65 65 | s nothing to see
    0001: 0160: 20 68 65 72 65 2C 20 70 6C 65 61 73 65 20 6D 6F |  here, please mo
    0001: 0170: 76 65 20 61 6C 6F 6E 67 2E 2E 2E                | ve along...     
    0001: Sent to ('127.0.0.1', 15223) (379)
    0001: Connection reset by ('10.44.5.138', 5467)
    0001: Connection closed

Теперь, собственно, исходник:

{% codeblock lang:python %}
#!/usr/bin/python

import socket, string, threading, os, select, sys, time, getopt
from sys import argv

def usage():
   name = os.path.basename(argv[0])
   print "usage:", name, "-l listen_port -a host -p port [-L file] [-c] [-h?]"
   print " -a host         - address/host to connect"
   print " -p port         - remote port to connect"
   print " -l listen_port  - local port to listen"
   print " -L file         - log file"
   print " -c              - supress console output"
   print " -h or -?        - this help"
   print " -v              - version"
   sys.exit(1)

PORT = False
REMOTE_HOST = REMOTE_PORT = False

CONSOLE = True
LOGFILE = False

try:
   opts, args = getopt.getopt(argv[1:], "l:a:p:L:ch?v")

   for opt in opts:
      opt, val = opt
      if opt == "-l":
         PORT = int(val)
      elif opt == "-a":
         REMOTE_HOST = val
      elif opt == "-p":
         REMOTE_PORT = int(val)
      elif opt == "-L":
         LOGFILE = val
      elif opt == "-c":
         CONSOLE = False
      elif opt == "-?" or opt == "-h":
         usage()
      elif opt == "-v":
         print "Python TCP/IP Spy  Version 1.01  Copyright (c) 2009 by Alexander Demin"
         sys.exit(1)
      else:
         usage()

   if not PORT:
      raise StandardError, "listen port is not given"

   if not REMOTE_HOST:
      raise StandardError, "remote host is not given"

   if not REMOTE_PORT:
      raise StandardError, "remote port is not given"

except Exception, e:
   print "error:", e, "\n"
   usage()

# Remote host
REMOTE = (REMOTE_HOST, REMOTE_PORT)

# Create logging contitional variable
log_cond = threading.Condition()

queue = []

def logger():
   global queue
   while 1:
      log_cond.acquire()

      while len(queue) == 0:
         log_cond.wait()

      if LOGFILE:
         try:
            logfile = open(LOGFILE, "a+")
            logfile.writelines(map(lambda x: x+"\n", queue))
            logfile.close()
         except: pass
     
      if CONSOLE:
         for line in queue:
            print line
      
      queue = []
      log_cond.release()

# Thread safe logger
def log(thread, msg):
   if CONSOLE or LOGFILE:
      log_cond.acquire()
      queue.append("%04d: %s" % (thread, msg))
      log_cond.notify()
      log_cond.release()

def printable(ch):
   return (int(ch < 32) and '.') or (int(ch >= 32) and chr(ch))

# Pre-build a printable characters map
printable_map = [ printable(x) for x in range(256) ]

# Thread safe dumper
def log_dump(thread, msg):

   if CONSOLE or LOGFILE:
      log_cond.acquire()

      width = 16

      header = reduce(lambda x, y: x + ("%02X-" % y), range(width), "")[0:-1]
      queue.append("%04d: ----: %s" % (thread, header))
      queue.append("%04d:       %s" % (thread, '-' * width * 3))

      i = 0
      while 1:
         line = msg[i:i+width]
         if len(line) == 0: break
         dump = reduce(lambda x, y: x + ("%02X " % ord(y)), line, "")
         char = reduce(lambda x, y: x + printable_map[ord(y)], line, "")
         queue.append("%04X: %04X: %-*s| %-*s" % (thread, i, width*3, dump, width, char))
         i = i + width

      log_cond.notify()
      log_cond.release()

# Spy thread
def spy_thread(local, addr, thread_id):
   log(thread_id, "Thread started")

   try:
      log(thread_id, "Connecting to %s..." % str(REMOTE))
      remote = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
      remote.connect(REMOTE)
   except Exception, e:
      log(thread_id, "Unable connect to %s -> %s" % (REMOTE, e))
      local.close()
      return

   LOCAL = str(addr)

   log(thread_id, "Remote host: " + LOCAL)

   try:
      running = 1;
      while running == 1: 

         rd, wr, er = select.select([local, remote], [], [local, remote], 3600)

         for sock in er:
            if sock == local:
               log(thread_id, "Connection error from " + LOCAL)
               running = 0
            if sock == remote:
               log(thread_id, "Connection error from " + REMOTE)
               running = 0

         for sock in rd:
            if sock == local:
               val = local.recv(1024)
               if val: 
                  log(thread_id, "Recevied from %s (%d)" % (LOCAL, len(val)))
                  log_dump(thread_id, val)
                  remote.send(val)
                  log(thread_id, "Sent to %s (%d)" % (REMOTE, len(val)))
               else:
                  log(thread_id, "Connection reset by %s" % LOCAL)
                  running = 0;

            if sock == remote:
               val = remote.recv(1024)
               if val: 
                  log(thread_id, "Recevied from %s (%d)" % (REMOTE, len(val)))
                  log_dump(thread_id, val)
                  local.send(val)
                  log(thread_id, "Sent to %s (%d)" % (LOCAL, len(val)))
               else:
                  log(thread_id, "Connection reset by %s" % str(REMOTE))
                  running = 0;

   except Exception, e:
      log(thread_id, ("Connection terminated: " + str(e)))

   remote.close()
   local.close()

   log(thread_id, "Connection closed")

try:
   # Server socket
   srv = socket.socket(socket.AF_INET, socket.SOCK_STREAM) 
   srv.bind(("", PORT)) 
except Exception, e:
   print "error", e
   sys.exit(1)

counter = 1

threading.Thread(target=logger, args=[]).start()

log(0, "Listen at port %d, remote host %s" % (PORT, REMOTE))
 
while 1: 
   srv.listen(1)              
   local, addr = srv.accept()
   log(0, "Connection accepted from %s, thread %d launched" % (addr, counter))
   threading.Thread(target=spy_thread, args=[local, addr, counter]).start()
   counter = counter + 1
{% endcodeblock %}

Лично я постоянно использую этот скрипт на Windows, Linux и Solaris.

Следующий шаг - это переписать все на чистом С в виде одного единственного файла, который можно было бы в течение минуты забросить на любой UNIX или Windows, скомпилить и получить готовую программу. Питон - это конечно здорово, но, например, для AIX или HP-UX Питон является небольшой загвоздкой, которую в пять секунд не решить.

А что стоит у вас на вооружении по этому вопросу?
