@language: russian
@date: 2012-11-27 22:00
@tags: habr, habrahabr, css, stylebot

CSS для удобного просмотра Хабра
================================

[Первый опыт "причесывания" сайтов][Как подкорректировать DOM/CSS налету в браузере?], пестрящих баннерами, был очень удачным. Я постоянно лазаю на translate.ru, поэтому сделать его компактным было полезно.

[Как подкорректировать DOM/CSS налету в браузере?]: /blog/russian/2012/05/06/how-to-fix-dom-css-on-the-fly-in-browser/

Теперь небольшой fix для Хабра. Было:

![](habr-normal-view.png)

Стало (просмотр в полную ширину и без рекламы):

![](habr-without-banners.png)

Фикс можно приложить расширением Stylebot.

``` css
#topline {
    display: none;
}
#header .logo {
    background: none;
    height: 30px;
}
#header .main_menu .banner_special {
    display: none;
}
.sidebar_right {
    display: none;
}
.content_left {
    width: 99%;
}
.rotated_posts {
    display: none;
}
```
