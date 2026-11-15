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

("russian", "738013b1a2df721d52f0b217ffbd15f8f412a70e963f75e6a46eb5ef3ff5150b");
