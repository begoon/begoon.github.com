---
layout: post
title: "Ссылки на файлы и каталоги в Windows"
language: russian
date: 2011-05-09 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/05/windows.html
categories: 
- windows
- russian
---
К своему стыду я думал, что Windows все еще существует в прошлом веке без возможности делать ссылки на файлы в файловой системе. Я знал про ссылки на каталоги (junctions), которые можно делать, например, в FAR'е через Alt-F6.

Но сегодня, открыв "[Windows Internals][]" в случайном месте, наткнулся на параграф про данный вопрос.

Итак, просто привожу небольшой лог с консоли (Windows 7).

[Windows Internals]: http://www.amazon.co.uk/Windows-Internals-PRO-Developer-Mark-Russinovich/dp/0735625301/

    ver

    Microsoft Windows [Version 6.1.7601]
    
Создаем файл и каталог:

    cd C:\Temp\links
    C:\temp\links>mkdir folder
    C:\temp\links>echo >file

Создаем символьную ссылку на каталог:

    C:\temp\links>mklink /D link1 folder
    symbolic link created for link1 <<===>> folder
    
Создаем junction на каталог (на файл его создать нельзя):

    C:\temp\links>mklink /J link2 folder
    Junction created for link2 <<===>> folder

Создаем символьную ссылку на каталог немного иначе:

    C:\temp\links>mklink link3 folder
    symbolic link created for link3 <<===>> folder
    
Создаем символьную ссылку на файл:

    C:\temp\links>mklink link4 file
    symbolic link created for link4 <<===>> file
    
Результат:

    C:\temp\links>dir
     Volume in drive C has no label.
     Volume Serial Number is C021-6C9F

     Directory of C:\temp\links

    09/05/2011  18:26    <DIR>          .
    09/05/2011  18:26    <DIR>          ..
    09/05/2011  18:26                13 file
    09/05/2011  18:25    <SYMLINKD>     link1 [folder]
    09/05/2011  18:25    <JUNCTION>     link2 [C:\temp\links\folder]
    09/05/2011  18:25    <SYMLINK>      link3 [folder]
    09/05/2011  18:26    <SYMLINK>      link4 [file]
    09/05/2011  18:23    <DIR>          folder
                   3 File(s)             13 bytes
                   5 Dir(s)  208,278,925,312 bytes free
                   
Обратите внимание на интересные типы файлов: `<SYMLINKD>`, `<JUNCTION>`, `<SYMLINK>`. Как написано в книге, первые два по функциональности одно и то же, просто `<JUNCTION>` более старый механизм, доступный в более старых версиях Windows и который поддерживает ссылки только внутри одного тома.

Также, обратите внимание, что ссылка `link3` хоть и является ссылкой на каталог, не работает нормально как обычный каталог (в отличие от `link1` и `link2`, которые в целом ведут себя как нормальне каталоги). FAR, кстати, тоже, `link3` за каталог не считает.

В общем, такая простая задача как ссылки внутри файловой системы, решенная в UNIXах более двадцати лет назад, решена в Windows традиционным для этой операционной системы путем - решений много, и каждое имеет свой уровень совместимости.

И книга, "[Windows Internals][]", чертовски хороша, рекомендую.
