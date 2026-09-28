function show_post(i, visible) {
    var o = document.getElementById("post_" + i)
    if (o != null) o.style.display = visible ? "block" : "none"
}

function filter(s) {
    var words = s.split(/\s+/)
    var search_words = []
    for (var i = 0; i < words.length; ++i) {
        var word = words[i]
        if (word.length < 3) continue
        search_words[search_words.length] = word
    }
    var visible = {}
    for (var i = 0; i < search_words.length; ++i) {
        var word = search_words[i].toLowerCase()
        for (var s in ri) {
            if (s.indexOf(word) < 0) continue
            var refs = ri[s]
            for (var j = 0; j < refs.length; ++j) {
                if (i == 0 || visible[refs[j]] == i)
                    visible[refs[j]] = i + 1
            }
        }
    }
    for (var i = 1; i <= nb_posts; ++i) {
        show_post(i, search_words.length ? (visible[i] == search_words.length) : true)
    }
}

function init_search(caption) {
  var search_obj = search_object()
  search_obj.placeholder = caption
  filter(search_obj.value)
  search_obj.style.visibility = "visible"
}

function search_object() {
  return document.getElementById("search")
}
