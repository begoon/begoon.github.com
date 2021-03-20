@language: russian
@date: 2012-11-22 22:00
@tags: pmc, propeller, parallax, project

Мини-компьютер на базе микроконтроллера Parallax Propeller
==========================================================

Микроконтроллер фирмы Parallax под названием [Propeller][], в сравнении с 
"классикой" жанра типа PIC или AVR занимает несколько странную нишу. Про
первые два можно сказать, что это архитектуры общего назначения. Создатели
же Пропеллера подошли к вопросу "с фланга".

[Propeller]: http://www.parallax.com/propeller/

Основные отличительные особенности Пропеллера:

* 8 независимых ядер, работающих параллельно. Какое-либо разделение времени, 
  необходимое для общих ресурсов типа памяти или портов ввода-вывода не
  контролируется программистом и "вшито" в кристалл. Это дает предсказуемость
  во времени выполнения кода. Каждое ядро (cog) имеет 4КБ собственной 
  изолированной оперативной памяти. Также каждое ядро имеет встроенный
  аппаратный модуль для генерации (внимание!) ТВ или VGA видео-сигнала.
* Нет понятия прерываний. Вместо это предлагается запускать конкурирующие
  задачи разных ядрах (cog'ах).
* Программировать можно либо на ассемблере, либо на особом высокоуровневом
  языке Spin, который сильно упрощает многоядерное и параллельное
  программирование. Интерпретатор Spin зашит в кристалл.
* Почти нет понятия программации или прошивки кристалла. Верхняя половина
  адресного (ROM) пространства размером в 32КБ прошита интерпретатором Spin
  и разными системными таблицами. В этом случае при каждом включении
  требуется загрузка программы извне (например, из среды разработки) в нижнюю
  область 32КБ (RAM). Но обычно в реальном использовании подключается внешняя
  I2C микросхема памяти EEPROM, содержимое которой автоматически копируется
  в RAM при включении кристалла.
* Процессор заявлен как 32-х битный, так как оперирует со данными этого
  размера, но адресное пространство 16-и битное (64КБ).

Язык Spin разработан для удобного многопроцессорного программирования, и
выглядит как нечто среднее между процедурным и объектно-ориентированным
языком.

Вот пример кода на Spin, запускающего функцию крутиться на нескольких
ядрах. Код реально простой и понятный.

    CON

      _clkmode = xtal1 + pll16x         'Establish speed
      _xinfreq = 5_000_000              '80Mhz

    OBJ

      led: "E555_LEDEngine.spin"        'Include LED methods object

    VAR

      byte Counter                      'Establish Counter Variable
      long stack[90]                    'Establish working space

    PUB Main

      cognew(Twinkle(16,clkfreq/50), @stack[0])    'start Twinkle cog 1
      cognew(Twinkle(19,clkfreq/150), @stack[30])  'start Twinkle cog 2
      cognew(Twinkle(22,clkfreq/100), @stack[60])  'start Twinkle cog 3

    PUB Twinkle(PIN,RATE)                  'Method declaration 

      repeat                               'Initiate a master loop

        repeat Counter from 0 to 100       'Repeat loop Counter
          led.LEDBrightness(Counter, PIN)  'Adjust LED brightness 
          waitcnt(RATE + cnt)              'Wait a moment

        repeat Counter from 100 to 0       'Repeat loop Counter
          led.LEDBrightness(Counter,PIN)   'Adjust LED brightness 
          waitcnt(RATE + cnt)              'Wait a moment

Функция `cognew` запускает задачу на трех ядрах, параметризируя каждую
своей частотой и стеком.

Упрощенно Пропеллер устроен следующим образом:

<a href="propeller-block-large.jpg">![](propeller-block.jpg)</a>

Название "Пропеллер" произошло от его модели передачи приоритета на доступ к
разделяемым ресурсам. Модуль Hub, контролирующий разделение времени,
делает это по кругу, типа крутящегося пропеллера.

Я не хочу в этой статье углубляется в сам Пропеллер, ибо это большая тема.
Для интересующихся в конце есть ссылки на книги, в которых можно получить
исчерпывающую информацию об этом микроконтроллере.

Но хочу рассказать об одном интересном проекте, который называется 
"[Pocket Mini Computer][]". Это мини-компьютер на базе Пропеллера (P8X32A), 
использующий evaluation board "P8X32A QuickStart" как основу.

[Pocket Mini Computer]: http://propellerpowered.wikispaces.com/Pocket+Mini+Computer

![](P8X32A-quick-start.jpg)

Выглядит это добро следующим образом (фотография с официального сайта):

![](pocket-mini-computer.jpg)

Фактически, автор [продает][PMC] evaluation board плюс плату расширения,
на которой есть VGA, microSD, PS/2, звук и Wii Gameport. Опционально
можно поставить микросхему оперативки SRAM на 32КБ.

Фишка проекта в том, что автор разработал интерпретатор Бейсика,
который превращает все это в микро-компьютер а-ля 80-е. Бейсик написан
на Spin'e ([исходники открыты][Propeller BASIC]). Диалект весьма
ограничен, например, нет массивов, строковых и вещественных переменных,
имена переменных только однобуквенные и т.д. Но тем не менее, дается
доступ ко всей периферии, включая SD-карту, и также позволяет запускать
чисто двоичные файлы, которые могут быть написаны хоть на том же Spin'e,
хоть на С (Parallax имеет версию GCC для Пропеллера), хоть на ассемблере.

[PMC]: http://propellerpowered.com/shop/?page_id=234
[Propeller BASIC]: https://www.dropbox.com/sh/qwhixzvtlrvp1u1/y-JshwklWj/PropellerBASIC

Далее несколько фотографий конструктора, чтобы было понятно, что дается в
наборе. Как я уже говорил, основа PMC - это готовая плата "P8X32A
QuickStart", поэтому спаять надо только плату расширения.

![](IMG_1192.JPG)

![](IMG_1193.JPG)

![](IMG_1194.JPG)

Почти все запаяно.

![](IMG_1195.JPG)

Бутерброд в сборе.

![](IMG_1196.JPG)

![](IMG_1197.JPG)

![](IMG_1198.JPG)

![](IMG_1199.JPG)

Вот небольшая демка, чтобы оценить графические возможности.

<iframe width="640" height="360" src="https://www.youtube.com/embed/capsFv1njUE" frameborder="0" allowfullscreen></iframe>

Общие впечатления
-----------------

### Пропеллер

Не получается назвать его процессором общего назначения. По моему
субъективному мнению, для эффективного использования Пропеллера надо очень
хорошо понимать свою прикладную задачу. Например, у Пропеллера нет ШИМ,
ЦАП/АПЦ, встроенной флеш-памяти, триггеров, понятия прерываний, и создатели
предлагают либо реализовывать необходимое программно, используя силу
нескольких ядер, либо использовать специализированные внешние микросхемы.
В книгах, приведенных в конце, описано множество примеров работы с
дополнительными микросхемами.

Интересно другое. Создатели Пропеллера не забоялись отойти от традиционного
подхода и попытались вложить в кристалл конкретные прикладные возможности,
почти готовые задачи. Может для каких-то проектов это придется очень кстати.
Как я понял, Пропеллер очень удобен для создания разного
рода игровых автоматов и приставок, например, из-за встроенной возможности
генерировать качественный телевизионный и VGA сигнал.

**Вывод**: интересная архитектура, определенно заслуживающая внимания.

### Конструктор PMC

Опять-таки, двоякое ощущение. Вроде работает, но ресурсов Бейсику явно
не хватает, особенно памяти. Например, тот же [Maximite][] на базе PIC32 его
на голову превосходит. На нем можно запустить хоть [RetroBSD][], хоть
[Радио-86РК][]. Да и встроенный MMBasic несравнимо мощнее.

Хотя, за 39 долларов США - это отличная игрушка для тех, кто хочет пощупать
Пропеллер, имея уже собранное устройство.

[Maximite]: /blog/russian/2012/01/19/maximite-kit/
[RetroBSD]: /blog/russian/2012/05/11/retrobsd-on-maximite/
[Радио-86РК]: /blog/russian/2012/08/23/radio86-on-maximite/

На закуску
----------

Книги по Пропеллеру, которые я прочитал, что касаемо архитектуры, и проглядел
(что касаемо проектов). Все рекомендую.

- - -

Небольшая и очень понятная книга для начинающих. Описаны (с картинками)
интересные проекты. Один из соавторов является конструктором PMC.

<a href="http://www.amazon.co.uk/gp/product/B004X6U6II/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B004X6U6II&amp;linkCode=as2&amp;tag=prodiy-21">Getting Started With the Propeller</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B004X6U6II" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/B004X6U6II/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B004X6U6II&amp;linkCode=as2&amp;tag=prodiy-21"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;ASIN=B004X6U6II&amp;Format=_SL160_&amp;ID=AsinImage&amp;MarketPlace=GB&amp;ServiceVersion=20070822&amp;WS=1&amp;tag=prodiy-21" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B004X6U6II" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

- - - 

Крайне грамотная книга в плане архитектуры и понимания сути Пропеллера.
В ней рассматривается только программирование на Spin, но с полным
объяснением подходов и особенностей микроконтроллера. Прочитав первую главу,
вы получите почти полное понимание архитектуры. Далее описаны несколько
проектов (это можно пропустить).

<a href="http://www.amazon.co.uk/gp/product/B003TQM9Y2/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B003TQM9Y2&amp;linkCode=as2&amp;tag=prodiy-21">Programming the Propeller with Spin : A Beginner's Guide to Parallel Processing (Tab Electronics)</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B003TQM9Y2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/B003TQM9Y2/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B003TQM9Y2&amp;linkCode=as2&amp;tag=prodiy-21"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;ASIN=B003TQM9Y2&amp;Format=_SL160_&amp;ID=AsinImage&amp;MarketPlace=GB&amp;ServiceVersion=20070822&amp;WS=1&amp;tag=prodiy-21" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B003TQM9Y2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

- - -

Сборник реальных проектов с использованием Пропеллера от его создателей.

<a href="http://www.amazon.co.uk/gp/product/B003BZVIZC/ref=as_li_qf_sp_asin_tl?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B003BZVIZC&amp;linkCode=as2&amp;tag=prodiy-21">Programming and Customizing the Multicore Propeller Microcontroller : The Official Guide</a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B003BZVIZC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

<a href="http://www.amazon.co.uk/gp/product/B003BZVIZC/ref=as_li_qf_sp_asin_il?ie=UTF8&amp;camp=1634&amp;creative=6738&amp;creativeASIN=B003BZVIZC&amp;linkCode=as2&amp;tag=prodiy-21"><img border="0" src="http://ws.assoc-amazon.co.uk/widgets/q?_encoding=UTF8&amp;ASIN=B003BZVIZC&amp;Format=_SL160_&amp;ID=AsinImage&amp;MarketPlace=GB&amp;ServiceVersion=20070822&amp;WS=1&amp;tag=prodiy-21" ></a><img src="http://www.assoc-amazon.co.uk/e/ir?t=prodiy-21&amp;l=as2&amp;o=2&amp;a=B003BZVIZC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />

На момент написания этой статьи, первая книга доступна только в формате Киндл
на Амазоне по цене в два доллара, а вот вторую и третью можно найти, если
поискать.
