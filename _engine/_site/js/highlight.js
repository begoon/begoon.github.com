// Only highlight blocks with an explicit, supported language. Leave output,
// unlabelled snippets, and unsupported languages readable as plain code.
document.querySelectorAll('pre code').forEach(function (block) {
    var language = Array.from(block.classList).find(function (name) {
        return name.indexOf('language-') === 0;
    });
    if (language && hljs.getLanguage(language.slice('language-'.length))) {
        hljs.highlightElement(block);
    }
});
