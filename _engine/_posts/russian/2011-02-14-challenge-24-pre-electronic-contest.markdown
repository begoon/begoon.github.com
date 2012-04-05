---
layout: post
title: "Challenge 24 Pre Electronic Сontest"
language: russian
date: 2011-02-14 01:00
comments: true
blogspot: http://easy-coding.blogspot.com/2011/02/challenge-24-pre-electronic-ontest.html
categories:
- olympiad programming
- russian
---
В эту субботу наша команда в составе [Leonid][], [Lomir][] и меня "разогревались" на тестовом раунде [Challenge 24 Contest][]. [Задачи][] уже доступны. В этом раунде не было никакого рейтинга, а просто можно было ознакомиться с правилами и системой. Хотя лично для меня задачи были вполне себе серьезные. Например, [P][], конечно, совсем простая, но остальные для меня вполне реальны.

[Leonid]: http://www.topcoder.com/tc?module=MemberProfile&cr=19825431
[Lomir]: http://www.topcoder.com/tc?module=MemberProfile&cr=22654571
[Challenge 24 Contest]: http://ch24.org/
[Задачи]: http://ch24.org/preec/html/

Мне нравится этот контест тем, что он не заточен исключительно на алгоритмические задачи. Например, в [Q][] надо было сделать хорошую эвристику, в [R][] - типа взломать код, ну а [S][] - это алгоритм.

[P]: http://ch24.org/preec/html/P.html
[Q]: http://ch24.org/preec/html/Q.html
[R]: http://ch24.org/preec/html/R.html
[S]: http://ch24.org/preec/html/S.html

Я по-пенсионерски попросился решать [R][]. В итоге написал какой-то невообразимый велосипед на С++, которым таки получилось сделать играемый wav, прослушать сообщения и сдать задачу, и только потом, немного успокоившись, на питоне получилась короткая программа, делающая чистые 16-битные wav'ы.

{% codeblock lang:python %}
import wave, struct

def make_soundfile(sample, freq, fname):
    frate = 7000

    data_size = len(sample)

    sine_list = []
    for x in sample:
        sine_list.append(float(x) / 2 * 32768)

    wav_file = wave.open(fname + ".wav", "w")

    nchannels = 1
    sampwidth = 2
    framerate = int(frate)
    nframes = data_size
    comptype = "NONE"
    compname = "not compressed"

    wav_file.setparams((nchannels, sampwidth, framerate, nframes, comptype, compname))
    for s in sine_list:
        wav_file.writeframes(struct.pack('h', int(s)))
    wav_file.close()

 for n in range(1, 11):
    fname = "test-%02d.tst" % n
    print fname
    sample = open(fname).readlines()
    sample = sample[1:]
    freq = len(sample)
    make_soundfile(sample, freq, fname)

{% endcodeblock %}

Конечно, авторское решение было еще проще.

    awk 'NR > 1 {printf "%c",int(128*($1+1))}' *.in >/dev/dsp

Погдядим, что будет в реальном раунде в эту субботу.
