function main() {
  this.launcher = document.createElement("a");
  this.launcher.target = "_blank";
  this.launcher.style.visibility = "hidden";
  document.getElementsByTagName("head")[0].appendChild(this.launcher);

  main_this = this;

  var images = document.getElementsByTagName('img'); 
  for(var i = 0; i < images.length; i++) {
    var img = images[i];
    if (img.getAttribute("class") == "_screen") {
      img.onmouseover = function() {
        this.setAttribute("original_height", this.height);
        this.style.height = this.height * 2;
      };
      img.onmouseout = function() {
        this.style.height = this.getAttribute("original_height");
      };
    }
  }
  
  var buttons = document.getElementsByTagName('button'); 
  for(var i = 0; i < buttons.length; i++) {
    var button = buttons[i];
    if (button.getAttribute("class") == "run") {
      button.onclick = function() {
        main_this.launcher.href = "../index.html?file=" + this.name;
        launcher.click();
      };
    }
    if (button.getAttribute("class") == "load") {
      button.onclick = function() {
        main_this.launcher.href = "../index.html?loadonly=1&file=" + this.name;
        launcher.click();
      };
    }
  }

  var as = document.getElementsByTagName('a'); 
  for(var i = 0; i < as.length; i++) {
    var a = as[i];
    if (a.getAttribute("class") == "filter") {
      a.href = "#";
      a.onclick = function() {
        search.value = this.innerHTML;
        search.onkeyup();
      };
    }
  }
  
  var search = document.getElementById("search");
  search.onclick = function() {
    if (search.getAttribute("first_click") == "yes") {
      search.setAttribute("first_click", null);
      search.setAttribute("value", "");
    }
  }
  search.setAttribute("value", "поиск");
  search.setAttribute("first_click", "yes");
  
  search.onkeyup = function() {
    var needle = search.value.toUpperCase();
    var always = needle.length < 3;
    var trs = document.getElementsByTagName('tr'); 
    for(var i = 0; i < trs.length; i++) {
      var tr = trs[i];
      if (tr.getAttribute("class") == "cart") {
        var name = tr.getAttribute("name");
        var title = document.getElementById(name + "_title").innerHTML;
        var descr = document.getElementById(name + "_descr").innerHTML;
        var text = (name + " " + title + " " + descr).toUpperCase();
        tr.style.display = always || text.indexOf(needle) != -1 ?
          "table-row" : "none";
      }
    }
  }
}
