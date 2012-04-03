---
layout: post
title: "QueryPerformanceCounter на мультиядерных и виртуальных системах"
language: russian
date: 2009-03-05 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/queryperformancecounter.html
categories:
- windows
- russian
---
Как я [обещал][Unit-тест для Coredump], рассказываю про мои приключения с классом [PreciseTimer][Миллисекундный таймер для Windows и UNIX].

Мой класс `PreciseTimer` предназначен для работы с миллисекундными интервалами времени. Реализация под Windows основана на использовании функций [QueryPerformanceFrequency][] и [QueryPerformanceCounter][].

[QueryPerformanceFrequency]: http://msdn.microsoft.com/en-us/library/ms644905.aspx
[QueryPerformanceCounter]: http://msdn.microsoft.com/en-us/library/ms644904.aspx

Этот класс активно используется в некоторых наших проектах. Также, в силу некоторых обстоятельств, мы активно используем виртуальные машины для тестовых сборок. И, например, сборка под Windows 64-бита производится под [VirtualBox][]. И вот очередной релиз-кандидат ушел в тестирование. Немедленно мне посыпались жалобы, что сборка не работает под 64-битным Windows под виртуальной машиной.

[VirtualBox]: http://www.virtualbox.org/

Я запретил тестерам временно отключать тест и начал проверять все сам. На реальных машинах все работает. Начал гонять на виртуальных. На [VMWare][] тоже глючит. Тест `PreciseTimer.MeasurementAccuracy` выдает ошибку типа:

[VMWare]: http://www.vmware.com/

    c:\sandbox\test\PreTimer_unittest.cpp(22): error: Value of: delta <= allowed_delta_ms
      Actual: false
    Expected: true
    Delta (100) > than 10
    [  FAILED  ] PreciseTimer.MeasurementAccuracy (110 ms)

Получается, что задержка в 100 миллисекунд была измерена практически как нулевая.

Я заподозрил функцию `QueryPerformanceCounter()`. Написал еще один кондовый тест:

{% codeblock lang:cpp %}
TEST(PreciseTimer, MillisecCounter) {
  monitor::PreciseTimer timer;
  monitor::PreciseTimer::Counter a = timer.millisec();
  timer.sleepMs(10000);
  monitor::PreciseTimer::Counter b = timer.millisec();
  EXPECT_EQ(10000, b - a);
}
{% endcodeblock %}

Этот тест делает видную глазом задержку в 10 секунд (чтобы исключить проблему в самой задержке) и затем проверят показания таймера.

Итак, на реальной машине тест выдает следующее:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from PreciseTimer
    [ RUN      ] PreciseTimer.MillisecCounter
    c:\sandbox\test\PreTimer_unittest.cpp(17): error: Value of: b - a

      Actual: 9995
    Expected: 10000
    [  FAILED  ] PreciseTimer.MillisecCounter
    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran.
    [  PASSED  ] 0 tests.
    [  FAILED  ] 1 test, listed below:
    [  FAILED  ] PreciseTimer.MillisecCounter

     1 FAILED TEST

Тест, конечно, сбоит, но тут четко видно, что требуемая задержка в 10000 миллисекунд (10 секунд) измерена как 9995 миллисекунд. Понятно, тут невозможно измерить точь в точь, но суть работает верно.

А вот, что я получил на виртуальное машине:

    [==========] Running 1 test from 1 test case.
    [----------] Global test environment set-up.
    [----------] 1 test from PreciseTimer
    [ RUN      ] PreciseTimer.MillisecCounter
    c:\sandbox\test\PreTimer_unittest.cpp(17): error: Value of: b - a
      Actual: 90
    Expected: 10000
    [  FAILED  ] PreciseTimer.MillisecCounter
    [----------] Global test environment tear-down
    [==========] 1 test from 1 test case ran.
    [  PASSED  ] 0 tests.
    [  FAILED  ] 1 test, listed below:
    [  FAILED  ] PreciseTimer.MillisecCounter

     1 FAILED TEST

Задержка в 10000 миллисекунд была измерена всего как 90. Вот и причина сбоя — функция `QueryPerformanceCounter()`. Полчаса работы.

Затем я поискал в интернете на тему проблем у функции `QueryPerformanceCounter()` на виртуальных машинах и нашел объяснение в MSDN. Корень проблемы, как оказалось, был не конкретно в виртуальных машинах, а в "старом" биосе и в использовании мультиядерных систем. На наших реальных мультиядерных машинах все работало, так как, видимо их биос был "нормальным".

В итоге проблема решилась добавлением параметра `/usepmtimer` в файл `c:\boot.ini`, как рекомендуется в найденной статье. После этого все тесты заработали как положено.

Я включил подробное описание проблемы в Release Notes, чтобы клиенты не наступили на эти грабли, и инцидент был исчерпан. Еще полчаса работы. Итого час на все.

А теперь вдумайтесь в произошедшее. Проблема была локализована и исправлена не то, чтобы до релиза. Она была локализована даже до тестового запуска. Лично я вот ну ни как не ожидал, что в Windows функция `QueryPerformanceCounter()` почему-то как-то особенно работает на мультиядерных системах со "старым" биосом (видимо биосы VMWare и VirtualBox как раз подходят под эту категорию). А вот как бы искал эту проблему потом? уже на реальной работающей системе. Одно из применений этого класса у нас, это измерения временных данных по транзакциям. Да я потратил был потом полжизни для поиска этой "маленькой проблемки", случись она у реального клиента.

Пишите тесты! Это экономит не только деньги, но самое драгоценное — ваши нервы.

Другие посты по теме:

* [Миллисекундный таймер для Windows и UNIX][]

[Unit-тест для Coredump]: /blog/russian/2009/02/26/coredump-for-windows-unittest/
[Миллисекундный таймер для Windows и UNIX]: /blog/russian/2009/01/29/milliseconds-timer-for-windows-and-unix/
