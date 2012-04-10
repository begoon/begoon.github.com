---
layout: post
language: english
date: 2012-04-10 23:13
title: "Asynchronous JavaScript loading"
---
If you look closely, the search field on the main page appears with a little delay. It becomes visible only when the search index script is fully loaded. But the script is being loaded asynchronously, in background. I googled the following example: 

{% codeblock lang:javascript %}
<script language="javascript">
(function() {
    function async_load(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'URL of a script to load';
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

They say, this is a modern HTML5 compatible method, the idiom.
