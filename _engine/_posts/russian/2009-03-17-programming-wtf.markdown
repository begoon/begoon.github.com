---
layout: post
title: "Programming WTF"
language: russian
date: 2009-03-17 00:00
comments: true
blogspot: http://easy-coding.blogspot.com/2009/03/programming-wtf.html
categories:
- russian
---
Когда вы в приступе ярости при тщетных попытках заставить чужой код работать вдруг захотели громогласным криком сообщить окружающим, что вы работате среди некомпетентных дураков, и только вы один такой тут красивый д'Артаньян, можно так и сделать — и пар выпустите, и коллеги вас поймут и поддержат.

Потом можно для снятия умственного напряжения и для еще большого подняния самооценки полистать сообщество "[Programming WTF][]".

[Programming WTF]: http://community.livejournal.com/code_wtf/

Начав с известной нетленки для проверки условия `i < 10`:

{% codeblock lang:c# %}
uint i;
...
if (i.ToString().Length == 1)
{
  ...
}
{% endcodeblock %}

можно постепенно усиливать ощущения...

{% codeblock lang:cpp %}
std::string str1;
std::string str2;
...
if (!strcmp(str1.c_str(), str2.c_str()))
{
   ...
}
{% endcodeblock %}

вставляя в код противопехотные мины...

{% img /images/blog/wtf-get_random_number.png %}

различного радиуса поражения...

{% codeblock lang:cpp %}
#define bool BOOL
{% endcodeblock %}

и убойной силы.

{% codeblock lang:php %}
<?
define( "FALSE", -1 );
define( "TRUE", 0 );
?>
{% endcodeblock %}

А вот это для настоящих гурманов и знатоков своего дела:

{% codeblock lang:cpp %}
#define sizeof(x) rand()
{% endcodeblock %}

После того, как вы, обойдя вашу систему ревизий кода, чтобы никто не заметил засады, добавили это в какой-нибудь тихий, но повсеместно используемый файл ваших коллег смело идите покурить. Не думаю, что удасться выкурить в тишине хотя бы одну сигарету.

Теперь ваши коллеги тоже снимут стресс и напряжение.
