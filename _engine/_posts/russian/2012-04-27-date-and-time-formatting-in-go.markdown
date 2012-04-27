---
layout: post
title: "Шаблоны даты и времени в Go"
language: russian
date: 2012-04-27 01:44
comments: true
categories: 
- go
- russian
---
Часто, когда надо задать формат или шаблон для даты или времени, придумывается что-то вроде `YYYY`, `MM`, `mm:ss` и т.д. Но вот в процессе написания движка для блога, я наткнулся реализацию в Go. В Go в качестве шаблона используются не особые символы, а фиксированные значения непосредственно даты или времени. Например:

{% codeblock lang:go %}
func format_time(t time.Time) string {
  return t.Format("2006.01.02-15.04.05")  // Аналогично: YYYY.MM.DD-hh.mm.ss
}
{% endcodeblock %}

Вот полный набор "волшебных" значений (из [time/format.go][]):

[time/format.go]: http://golang.org/src/pkg/time/format.go

{% codeblock lang:go %}
stdLongMonth      = "January"
stdMonth          = "Jan"
stdNumMonth       = "1"
stdZeroMonth      = "01"
stdLongWeekDay    = "Monday"
stdWeekDay        = "Mon"
stdDay            = "2"
stdUnderDay       = "_2"
stdZeroDay        = "02"
stdHour           = "15"
stdHour12         = "3"
stdZeroHour12     = "03"
stdMinute         = "4"
stdZeroMinute     = "04"
stdSecond         = "5"
stdZeroSecond     = "05"
stdLongYear       = "2006"
stdYear           = "06"
stdPM             = "PM"
stdpm             = "pm"
stdTZ             = "MST"
stdISO8601TZ      = "Z0700"  // prints Z for UTC
stdISO8601ColonTZ = "Z07:00" // prints Z for UTC
stdNumTZ          = "-0700"  // always numeric
stdNumShortTZ     = "-07"    // always numeric
stdNumColonTZ     = "-07:00" // always numeric
{% endcodeblock %}

И некоторые примеры готовых шаблонов:

{% codeblock lang:go %}
ANSIC       = "Mon Jan _2 15:04:05 2006"
UnixDate    = "Mon Jan _2 15:04:05 MST 2006"
RubyDate    = "Mon Jan 02 15:04:05 -0700 2006"
RFC822      = "02 Jan 06 15:04 MST"
RFC822Z     = "02 Jan 06 15:04 -0700" // RFC822 with numeric zone
RFC850      = "Monday, 02-Jan-06 15:04:05 MST"
RFC1123     = "Mon, 02 Jan 2006 15:04:05 MST"
RFC1123Z    = "Mon, 02 Jan 2006 15:04:05 -0700" // RFC1123 with numeric zone
RFC3339     = "2006-01-02T15:04:05Z07:00"
RFC3339Nano = "2006-01-02T15:04:05.999999999Z07:00"
Kitchen     = "3:04PM"
// Handy time stamps.
Stamp      = "Jan _2 15:04:05"
StampMilli = "Jan _2 15:04:05.000"
StampMicro = "Jan _2 15:04:05.000000"
StampNano  = "Jan _2 15:04:05.000000000"
{% endcodeblock %}

Я такого приема раньше не встречал, и как-то кажется сейчас, что это более наглядно.
