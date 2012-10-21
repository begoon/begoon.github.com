function InnerWindowResizer(innerWidth, innerHeight) {
  var windowInnerWidth, windowInnerHeight;
  if (self.innerWidth) {
    windowInnerWidth = self.innerWidth;
    windowInnerHeight = self.innerHeight;
  }
  else if (document.documentElement && document.documentElement.clientWidth) {
    windowInnerWidth = document.documentElement.clientWidth;
    windowInnerHeight = document.documentElement.clientHeight;
  }
  else if (document.body) {
    windowInnerWidth = document.body.clientWidth;
    windowInnerHeight = document.body.clientHeight;
  }
  else {
    return;
  }
  var adjustWidth = innerWidth - windowInnerWidth;
  var adjustHeight = innerHeight - windowInnerHeight;
  window.resizeBy(adjustWidth, adjustHeight);
}
