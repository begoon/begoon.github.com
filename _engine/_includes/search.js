var nb_posts = {{.NumberOfPosts}}

function show_post(i, visible) {
    var o = document.getElementById("post_" + i)
    if (o != null) o.style.display = visible ? "block" : "none"
    filtered = !visible
}

function filter(s) {
    var filtered = false
    var words = s.split(" ")
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
            filtered = true
        }
    }
    for (var i = 0; i < nb_posts; ++i) {
        show_post(i, filtered ? (visible[i] == search_words.length) : true)
    }
}

var search_first = false

function init_search(caption) {
  var search_obj = search_object()
  if (search_obj.value == "" || search_obj.value == caption) {
    search_obj.value = caption
    search_first = true
    filter("")
  } else {
    filter(search_obj.value)  
  }
  search_obj.style.visibility = "visible"
}

function search_object() {
  return document.getElementById("search")
}

function remove_search_caption() {
  if (search_first) search_object().value = ''
}

