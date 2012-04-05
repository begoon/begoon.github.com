package main

import (
  "bytes"
  "flag"
  "fmt"
  "github.com/russross/blackfriday"
  "io"
  "io/ioutil"
  "os"
  "path/filepath"
  "regexp"
  "sort"
  "strings"
  "text/template"
  "time"
)

const (
  SiteDir     = "_site"
  ContentDir  = "_content"
  PostsDir    = "_posts"
  LayoutsDir  = "_layouts"
  IncludesDir = "_includes"
  BlogPrefix  = "blog"
  PublicDir   = ".."
  SiteHost    = "http://demin.ws"

  // This format must use "magic" values (like 2006 for year, 01 for month etc.)
  // http://golang.org/src/pkg/time/format.go?s=15402:15448#L58
  DateFormat = "2006-01-02"

  LogFile = "trace.log"
)

var (
  posts       Posts
  no_binaries *bool = flag.Bool("no-binaries", false, "don't publish binaries")
  logging     *bool = flag.Bool("logging", false, "log to 'trace.log'")

  HeaderRE,
  AttrsRE,
  ImgRE,
  CodeblockRE,
  YoutubeRE,
  YoutubeExtRE,
  ImgReplaceRE,
  HrefReplaceRE,
  PostNameRE,
  BlogspotRE,
  BlogspotEnglishRE,
  UnprocessedTagsRE,
  ExtLinkRE,
  CheckHrefRE,
  CheckImgRE,
  DisqusShortNameRE regexp.Regexp

  CutDate time.Time

  files_cache map[string]*string
)

func init() {
  posts = Posts{}

  // Pre-compile regexps.
  HeaderRE = *regexp.MustCompile("(?s)^(---\n(.+)\n---\n)")
  AttrsRE = *regexp.MustCompile("(?Um)^([^\\:]+?)\\: (.+)$")
  ImgRE = *regexp.MustCompile("{% img (\\S+?) %}")
  CodeblockRE = *regexp.MustCompile("(?sU){% codeblock lang\\:([^ ]+) %}(.*){% endcodeblock %}")
  YoutubeRE = *regexp.MustCompile("(?sU){% youtube (\\S+?) %}")
  YoutubeExtRE = *regexp.MustCompile("(?sU){% youtube (\\S+?) (\\d+) (\\d+) %}")
  ImgReplaceRE = *regexp.MustCompile("(?s)(<img .*?src=[\"'])(/[^\"']+?)([\"'].*?\\/>)")
  HrefReplaceRE = *regexp.MustCompile("(?s)(<a .*?href=[\"'])(/[^\"']+?)([\"'].*?>)")
  PostNameRE = *regexp.MustCompile("^.*((\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d))-([^ \\.]+)\\.markdown$")
  BlogspotRE = *regexp.MustCompile("^http:\\/\\/(easy|meta)-coding\\.blogspot\\.com\\/\\d\\d\\d\\d\\/\\d\\d\\/.+\\.html$")
  BlogspotEnglishRE = *regexp.MustCompile("-english(\\.html)$")
  UnprocessedTagsRE = *regexp.MustCompile("(?Us){%.*?}")
  ExtLinkRE = *regexp.MustCompile("((http|https|ftp)\\:\\/\\/|mailto\\:)")
  CheckHrefRE = *regexp.MustCompile("(?s)<(?:a|link) .*?href=[\"']([^#][^\"']*?)[\"'].*?>")
  CheckImgRE = *regexp.MustCompile("(?s)<img .*?src=[\"']([^\"']+?)[\"'].*?>")
  DisqusShortNameRE = *regexp.MustCompile("http\\:\\/\\/((easy|meta)-coding).blogspot.com\\/\\d\\d\\d\\d\\/\\d\\d\\/.+?\\.html")

  var err error
  CutDate, err = time.Parse(DateFormat, "2012-04-01")
  if err != nil {
    die("Unable to parse the cut date, error [%v]", err)
  }

  files_cache = map[string]*string{}
}

type Page map[string]string

type Posts []*Page

func (p Posts) Len() int           { return len(p) }
func (p Posts) Swap(i, j int)      { p[i], p[j] = p[j], p[i] }
func (p Posts) Less(i, j int) bool { return (*p[i])["date"] > (*p[j])["date"] }

func die(format string, v ...interface{}) {
  os.Stderr.WriteString(fmt.Sprintf(format+"\n", v...))
  os.Exit(1)
}

func trace(format string, v ...interface{}) {
  if !*logging {
    return
  }
  log, err := os.OpenFile(LogFile, os.O_RDWR|os.O_APPEND, os.ModeAppend)
  if err != nil {
    die("Unable to open log [%s], %v", LogFile, err)
  }
  s := fmt.Sprintf(format, v...)
  log.WriteString(s)
  if !strings.HasSuffix(s, "\n") {
    log.WriteString("\n")
  }
  log.Close()
}

// This function loads up a file  and removes '\r' from its content.
func load_file(filename string) *string {
  if t, ok := files_cache[filename]; ok {
    return t
  }
  bytes, err := ioutil.ReadFile(filename)
  if err != nil {
    die("Unable to read file [%s]", filename)
  }
  s := strings.Replace(string(bytes), "\r", "", -1)
  files_cache[filename] = &s
  return &s
}

func copy_file(src, dst string) {
  sf, err := os.Open(src)
  if err != nil {
    die("Unable to read [%s]", src)
  }
  df, err := os.Create(dst)
  if err != nil {
    die("Unable to write [%s]", dst)
  }
  io.Copy(df, sf)
  sf.Close()
  df.Close()
}

// This function converts a file name based on '_site' directory
// to deploy directory by cutting out '_site' prefix and replacing it
// with the deploy dirctory. Then it creates all parent directories
// of the target file name.
func prepare_target_file(name string) string {
  d := filepath.Join(PublicDir, filepath.Dir(name)[len(SiteDir):])
  if os.MkdirAll(d, os.ModePerm) != nil {
    die("Unable to create [%v]\n", d)
  }
  return filepath.Join(d, filepath.Base(name))
}

func publish_parsable_file(name string, content string) {
  t := prepare_target_file(name)
  f, err := os.Create(t)
  if err != nil {
    die("Unable to create file [%s]", t)
  }
  f.WriteString(content)
  defer f.Close()
}

func file_exist(name string) {
  if _, err := os.Stat(name); err == nil {
    return
  }
  die("File or directory [%s] doesn't exist", name)
}

func cut_surrounding_quotes(s string) string {
  if strings.HasPrefix(s, "\"") && strings.HasSuffix(s, "\"") ||
    strings.HasPrefix(s, "'") && strings.HasSuffix(s, "'") {
    return s[1 : len(s)-1]
  }
  return s
}

func load_page(name string) Page {
  p := Page{}
  p["filename"] = name
  p["content"] = *load_file(name)
  if m := HeaderRE.FindStringSubmatch(p["content"]); m != nil {
    header := m[2]
    if m := AttrsRE.FindAllStringSubmatch(header, -1); m != nil {
      for _, pair := range m {
        p[pair[1]] = cut_surrounding_quotes(pair[2])
      }
    } else {
      die("Bad headers in [%#v]", header)
    }
  }
  p["content"] = HeaderRE.ReplaceAllLiteralString(p["content"], "")
  if len(p["layout"]) == 0 {
    p["layout"] = "none" // Make sure that "layout" always exists.
  }
  if len(p["language"]) == 0 {
    p["language"] = "russian" // Make sure that "language" always exists.
  }
  return p
}

func process_tags(post string) string {
  // {% img URL %}
  post = ImgRE.ReplaceAllString(post, "<img src=\"$1\" />")

  // {% codeblock lang:xxx %} ... {% endcodeblock %}
  post = CodeblockRE.ReplaceAllString(post, "``` $1$2```")

  // {% youtube id %}
  post = YoutubeRE.ReplaceAllString(post,
    "<iframe width=\"560\" height=\"420\" "+
      "src=\"http://www.youtube.com/embed/$1?color=white&theme=light\"></iframe>")

  // {% youtube id width height %}
  post = YoutubeExtRE.ReplaceAllString(post,
    "<iframe width=\"$2\" height=\"$3\" "+
      "src=\"http://www.youtube.com/embed/$1?color=white&theme=light\"></iframe>")

  return post
}

func load_layout(filename string, current Page) Page {
  p := load_page(filename)
  for k, v := range current {
    if k != "content" && k != "layout" {
      p[k] = v
    }
  }
  return p
}

func render_page(p Page) string {
  trace("> Render page [%s]\n", p["filename"])

  include := func(filename string) string {
    trace("/ Include [%s]", filename)
    inc := load_layout(filepath.Join(IncludesDir, filename), p)
    return render_page(inc)
  }

  now := func() string {
    return time.Now().Format(time.RFC3339)
  }

  replace_relative_urls := func(s string) string {
    s = ImgReplaceRE.ReplaceAllString(s, "${1}"+SiteHost+"$2$3")
    s = HrefReplaceRE.ReplaceAllString(s, "${1}"+SiteHost+"$2$3")
    return s
  }

  funcs := template.FuncMap{
    "include": include,
    "now":     now,
    "replace_relative_urls": replace_relative_urls,
  }

  type Data struct {
    Page  Page
    Posts Posts
    Host  string
  }

  tpl := template.Must(template.New(p["filename"]).Funcs(funcs).Parse(p["content"]))

  var b bytes.Buffer
  if err := tpl.Execute(&b, Data{p, posts, SiteHost}); err != nil {
    die("Unable to execute template, error [%v]", err)
  }

  p["content"] = b.String()

  if layout_name := p["layout"]; layout_name != "none" {
    trace("& Layout [%s]\n", layout_name)
    layout := load_layout(filepath.Join(LayoutsDir, p["language"], layout_name)+".html", p)
    layout["child"] = p["content"]
    p["content"] = render_page(layout)
  }

  return p["content"]
}

func markup(s string) string {
  s = process_tags(s)
  if UnprocessedTagsRE.MatchString(s) {
    die("Unprocessed tag in [%s]", s)
  }
  return string(blackfriday.MarkdownCommon([]byte(s)))
}

func process_post(filename string) {
  trace("$ Processing post [%s]", filename)
  m := PostNameRE.FindStringSubmatch(filename)
  if m == nil {
    die("Unable to split post name [%s]", filename)
  }

  p := load_page(filename)

  p["date_only"] = m[1]
  p["year"] = m[2]
  p["month"] = m[3]
  p["day"] = m[4]
  p["slug"] = m[5]

  p["url"] = "/" + strings.Join([]string{
    BlogPrefix, p["language"], p["year"], p["month"], p["day"], p["slug"],
  }, "/") + "/"

  if p["layout"] == "none" {
    die("'layout' attribute can't be 'none'")
  }

  date, err := time.Parse(DateFormat, p["date_only"])
  if err != nil {
    die("Unable to parse the post date, error [%v]", err)
  }

  // All posts before this date must have a blogspot id attribute.
  if date.Before(CutDate) && p["blogspot"] == "" {
    die("All posts before '%s' must have a blogspot id", CutDate.String())
  }

  p["disqus_developer"] = "0"

  p["disqus_shortname"] = "demin-ws"
  p["disqus_identifier"] = p["url"]
  p["disqus_url"] = SiteHost + p["url"]

  if p["blogspot"] != "" {
    if !BlogspotRE.MatchString(p["blogspot"]) {
      die("Bad Blogspot URL [%s]", p["blogspot"])
    }

    p["blogspot_url"] = BlogspotEnglishRE.ReplaceAllString(p["blogspot"], "$1")

    m := DisqusShortNameRE.FindStringSubmatch(p["blogspot"])
    if m == nil {
      die("Cannot determite DISQUS ShortName from [%s]", p["blogspot"])
    }
    if m[1] != "easy-coding" && m[1] != "meta-coding" {
      die("Bad DISQUS ShortName [%s]", m[1])
    }
    p["disqus_shortname"] = m[1]
    p["disqus_identifier"] = p["blogspot"]
    p["disqus_url"] = p["blogspot_url"]
  }

  if p["disqus"] != "" && p["blogspot"] != "" {
    die("Disqus and Blogspot ids are given at the same time")
  }

  if !strings.HasPrefix(p["date"], p["date_only"]) {
    die("Slug date [%s] isn't a prefix of [%s]", p["date_only"], p["date"])
  }

  p["content"] = markup(p["content"])
  p["rss"] = p["content"]

  p["post"] = "yes"
  p[p["language"]] = "yes"
  p["content"] = render_page(p)

  dir := filepath.Join(
    PublicDir, BlogPrefix, p["language"],
    p["year"], p["month"], p["day"], p["slug"],
  )
  if os.MkdirAll(dir, os.ModePerm) != nil {
    die("Unable to create directory [%s]", dir)
  }
  t := strings.Join([]string{dir, "index.html"}, "/")
  if ioutil.WriteFile(t, []byte(p["content"]), os.ModePerm) != nil {
    die("Unable to write file [%s]", t)
  }
  trace("= Written file [%s]", t)

  posts = append(posts, &p)
}

func process_posts() {
  trace("~ Processing posts")
  callback := func(path string, info os.FileInfo, err error) error {
    if info == nil || info.IsDir() || filepath.Base(path) == ".DS_Store" {
      return err
    }
    process_post(path)
    return err
  }
  if err := filepath.Walk(PostsDir, callback); err != nil {
    die("Walking through posts failed, error %#v", err)
  }
  sort.Sort(posts)
}

func process_parsable_file(filename string) {
  trace(". Parsing [%s]\n", filename)
  p := load_page(filename)
  if filepath.Ext(filename) == ".markdown" {
    p["content"] = markup(p["content"])
    filename = strings.Replace(filename, ".markdown", ".html", -1)
  }
  publish_parsable_file(filename, render_page(p))
}

func process_binary(name string) {
  target_name := prepare_target_file(name)
  if !*no_binaries {
    trace("+ Copy %s -> %s\n", name, target_name)
    copy_file(name, target_name)
  }
}

func process_file(name string) {
  ext := filepath.Ext(name)
  if ext == ".html" || ext == ".xml" || ext == ".markdown" {
    process_parsable_file(name)
  } else {
    process_binary(name)
  }
}

func process_site() {
  trace("~ Processing site")
  callback := func(path string, info os.FileInfo, err error) error {
    if info == nil || info.IsDir() || filepath.Base(path) == ".DS_Store" {
      return err
    }
    process_file(path)
    return err
  }
  if err := filepath.Walk(SiteDir, callback); err != nil {
    die("Walking through site failed, error %#v", err)
  }
}

func check_links_re(s *string, filename string, re *regexp.Regexp) {
  if m := re.FindAllStringSubmatch(*s, -1); m != nil {
    for _, link := range m {
      l := link[1]
      trace("|| [%s]", l)
      if strings.HasPrefix(l, "/") {
        file_exist(PublicDir + l)
      } else if strings.HasPrefix(l, SiteHost) {
        file_exist(PublicDir + l[len(SiteHost):])
      } else {
        if !ExtLinkRE.MatchString(l) {
          l = regexp.MustCompile("#.+$").ReplaceAllString(l, "")
          file_exist(filepath.Join(filepath.Dir(filename), l))
        }
      }
    }
  }
}

func check_unexpanded_placeholders(s *string) {
  if strings.Contains(*s, "<no value>") {
    die("'<no value>' string is found")
  }
}

func check_links_in_file(filename string) {
  trace("-> Check links in [%s]", filename)
  f := load_file(filename)

  check_links_re(f, filename, &CheckHrefRE)
  check_links_re(f, filename, &CheckImgRE)
  check_unexpanded_placeholders(f)
}

func check_links() {
  trace("~ Checking links")
  callback := func(path string, info os.FileInfo, err error) error {
    if info == nil || info.IsDir() || filepath.Base(path) == ".DS_Store" {
      return err
    }
    if strings.Contains(path, "/_engine/") {
      return err
    }
    ext := filepath.Ext(path)
    if ext == ".html" || ext == ".xml" {
      check_links_in_file(path)
    }
    return err
  }
  if err := filepath.Walk(PublicDir, callback); err != nil {
    die("Unable to walk in [%s], %#v", PublicDir, err)
  }
}

func main() {
  flag.Parse()
  fmt.Printf("Go static blog generator  Copyright (C) 2012 by Alexander Demin\n")

  if *logging {
    log, err := os.Create(LogFile)
    if err != nil {
      die("Unable to create [%s]", LogFile)
    }
    defer log.Close()
  }

  started := time.Now()
  process_posts()
  process_site()
  check_links()
  println(time.Since(started).String())
}
