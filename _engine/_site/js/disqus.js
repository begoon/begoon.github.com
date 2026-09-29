(function () {
    var thread = document.getElementById('disqus_thread');
    if (!thread) return;

    var loaded = false;
    function loadComments() {
        if (loaded) return;
        loaded = true;
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://' + disqus_shortname + '.disqus.com/' + disqus_script;
        document.head.appendChild(script);
    }

    if (!('IntersectionObserver' in window)) {
        loadComments();
        return;
    }

    var observer = new IntersectionObserver(function (entries) {
        if (entries.some(function (entry) { return entry.isIntersecting; })) {
            observer.disconnect();
            loadComments();
        }
    }, { rootMargin: '300px' });
    observer.observe(thread);
}());
