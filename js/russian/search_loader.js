(function(language) {
    function async_load(){
        var s = document.createElement('script');
        s.type = 'text/javascript';
        s.async = true;
<<<<<<< HEAD
        s.src = '/js/' + language + '/search.js?2012-09-06T17:33:30+01:00';
=======
        s.src = '/js/' + language + '/search.js?2012-09-06T23:57:23+01:00';
>>>>>>> Post about Matrix project.
        var x = document.getElementsByTagName('script')[0];
        x.parentNode.insertBefore(s, x);
    }
    if (window.attachEvent)
        window.attachEvent('onload', async_load);
    else
        window.addEventListener('load', async_load, false);
})
("russian");
