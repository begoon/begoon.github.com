---
layout: post
title: "Как подкорректировать DOM/CSS налету в браузере?"
language: russian
date: 2012-05-06 13:46
comments: true
categories: 
- css
- html
- javascript
- russian
---
Мне нравится translate.ru. На мой субъективный взгляд, качество перевода в среднем лучше, чем у Google или Яндекс translate. Но сейчас не об этом. У translate.ru просто ужасная страница. Вот такой вот вырви глаз:

{% img /images/blog/translate-ru-normal.png %}

Но! Если в Хроме открыть Developer Tools, и, поелозив по странице, немного подкрутить CSS, в основном добавив `display: none` там-сям, то получается вот такая вот красота:

{% img /images/blog/translate-ru-clean.png %}

Вопрос: кто-нибудь может указать на какой-нибудь API в Хроме или готовое расширение, которым можно было автоматически править CSS? Я видел подобные расширения для Хрома, которыми можно менять и убирать элементы Gmail и Google Reader, но они были заточены именно под продукты Гугла. Универсального я никак не могу найти.

### Обновление

Решение найдено. Надо поставить [Stylebot][] и добавить в нем CSS-фильтр на адрес www.translate.ru. Текст CSS-добавки ниже. После этого страничка будет содержать только минимальный набор нужных элементов.

[Stylebot]: https://chrome.google.com/webstore/detail/oiaejidbmkiecgbjeifoejpgmdaleoha/

{% codeblock lang:css %}
#contentBlock header {
    display: none;
}

#ctl00_SiteContent_templatesBlock {
    display: none;
}

#passportMenu {
    display: none;
}

#bott_link {
    display: none;
}

topAdvert {
    display: none;
}

#topAdvert {
    display: none;
}

#subscribeForm {
    display: none;
}

#adv4Blocks {
    display: none;
}

#bottomAdvSection {
    display: none;
}

#blogRSS {
    display: none;
}

#rightSection {
    display: none;
}

#viewMode {
    display: none;
}

#viewModeBlock {
    display: none;
}

#tmOther {
    display: none;
}

#resultBlock {
    float: none;
    width: 100%;
}

#sourceBlock {
    float: none;
    width: 100%;
}

#mainSection {
    margin: 0px;
}

#contentBlock {
    border: none;
    border-radius: 0px;
    box-shadow: 0 0;
    margin: 0;
    max-width: 100%;
}

#dir_set {
    margin: 0;
}

#dmenu {
    float: none;
}

#btr_web {
    float: none;
}

.selDiv {
    padding: 0;
    float: none;
}

#ctl00_SiteContent_rLang {
    min-width: 0;
}

#ctl00_SiteContent_sLang {
    min-width: 0;
}

select {
    border: 1px solid;
}

.wrapp {
    padding: 0;
}

#bTranslate {
    margin-left: 1em;
    padding: 2px;
    font-weight: normal;
    background-color: #ccc;
    -webkit-border-radius: 2px;
    color: #003333;
}

body {
    background: none;
}
{% endcodeblock %}
