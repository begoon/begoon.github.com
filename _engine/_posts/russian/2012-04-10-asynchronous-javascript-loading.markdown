---
layout: post
language: russian
date: 2012-04-10 23:13
title: "Асинхронная загрузка скриптов JavaScript"
---
Если приглядеться, то поле поиска на главной странице блога появляется с небольшой задержкой. Оно становится видимым только после полной загрузки скрипта с индексом. Но скрипт загружается асинхронно, в фоне. Для пришлось нагуглить вот такой код:

{% codeblock lang:javascript %}
<script language="javascript">
(function() {
    function async_load(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'URL скрипта для загрузки';
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_load);
    else
        window.addEventListener('load', async_load, false);
})();
</script>
{% endcodeblock %}

Говорят, что это модный HTML5 совместимый способ. Идиома, так сказать.
