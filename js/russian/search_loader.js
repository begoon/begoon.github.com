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

("russian", "5c7bfdc7efcf5e56c290c21b8eec6d40a5864d1d5de9bce99ada2f04420dcb3c");
