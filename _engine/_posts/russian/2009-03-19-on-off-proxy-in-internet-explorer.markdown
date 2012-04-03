---
layout: post
title: "Включение/выключение proxy в Internet Explorer"
language: russian
date: 2009-03-19 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/proxy-internet-explorer.html
categories:
- script
- russian
---
Иногда таки приходится пользоваться Internet Explorer'ом (всякие сайты кривые, web-интерфейсы некоторых роутеров и т.д.).

Для включения/выключения proxy надо лазать в меню, что долго и неудобно. Лично мне удобнее просто скрипт запустить.

Кстати, гугловский Chrome по каким-то причинам использует настройки интернета от IE (системные для всего Windows), поэтому все сказанное актуально и для него.

Итак, привожу два скрипта для включения и отключения proxy в системных настройках интернета в Windows.

Файл `iepon.cmd`:

{% codeblock lang:bat %}
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 1 /f
{% endcodeblock %}

Файл `iepoff.cmd`:

{% codeblock lang:bat %}
reg add "HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f
{% endcodeblock %}

Я проверял это только в Windows XP.


