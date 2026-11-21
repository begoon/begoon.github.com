(function(language, version) {
    function async_load(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
        s.src = '/js/' + language + '/search.js?' + version;
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_load);
    else
        window.addEventListener('load', async_load, false);
})

("russian", "10232ec5f67f3232922a6303ae86d8fcc4e5e3d9e08fcb65774c960c801481be");
