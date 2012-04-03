---
layout: post
title: "RapidEE - Редактор переменных окружения для Windows"
language: russian
date: 2009-02-16 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/02/windows.html
categories:
- russian
---
Поднимите руки те, кому удобно пользоваться стандартным способом редактирования переменных окужения в Windows XP? Особенно когда, например, редактируешь длиннющую строку PATH в поле ввода длиной десять сантиметров. Я руку не поднимал, так как мне не нравится, радикально не нравится.

Есть замечательная программа [Rapid Environment Editor][] (RapidEE). Она позволяет очень удобно редактировать переменные окружения Windows в виде двух панелей: слева системные переменные, справа пользователькие. Переменная PATH автоматически представляется в виде списка путей. И даже то, что всю картину переменных видно как на ладони, и то, что программа понимает вставку из буфера обмена — все это меркнет перед гениальной функцией подсветки "мертвых" путей в переменной PATH. "Мертвым" путь может быть в основном по двум причинам: либо путь остался от программы, которая давно снесена, либо путь просто задан неверно, а вы битый час пытаетесь понять, почему что-то там не запускается. RapidEE моментально решает подобные проблемы.

[Rapid Environment Editor]: http://www.rapidee.com/ru/about

Я не сторонник графического интерфейса, и чего греха таить, люблю командную строку. В свое время я написал небольшой скрипт, который в Windows распечатывает пути из переменной PATH по отдельности:

Файл `splitpath.cmd`:

{% codeblock lang:bat %}
@echo off 
set line=%path%
setlocal 
:parse_line
for /F "delims=; tokens=1,*" %%a in ("%line%") do (
   echo %%a
   set line=%%b
)
if "%line%" NEQ "" goto parse_line
endlocal
{% endcodeblock %}

Примерный результат его работы выглядит так:

    C:\WINDOWS\system32
    C:\WINDOWS
    C:\WINDOWS\System32\Wbem
    c:\Python25
    C:\Program Files\CodeGear\RAD Studio\5.0\bin
    C:\Program Files\Java\jdk1.6.0_04
    C:\Program Files\Java\jdk1.6.0_04\jre\bin
    C:\Program Files\PC Connectivity Solution
    c:\oracle\9.2.0.1\bin
    C:\Program Files\Oracle\jre\1.3.1\bin
    C:\Program Files\Oracle\jre\1.1.8\bin
    C:\WINDOWS\Microsoft.NET\Framework\v1.1.4322
    C:\PROGRA~1\Borland\CBUILD~1\Bin

Но после перехода на RapidEE нужда в скрипте отпала совсем.

**Вывод**: RapidEE очень удобная программа для редактирования переменных окружения в Windows. Программа бесплатная. Может работать в portable режиме и не требовать установки.

Скриншот:

{% img /images/blog/rapidee.png %}

