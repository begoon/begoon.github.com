// Simple static blog generator.

package main

import (
	"bytes"
	"crypto/sha256"
	"encoding/xml"
	"flag"
	"fmt"
	"html"
	"io"
	"io/ioutil"
	"net/url"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"
	"text/template"
	"time"
	"unicode"
	"unicode/utf8"

	"github.com/russross/blackfriday"
)

const (
	SiteDir     = "_site"
	ContentDir  = "_content"
	PostsDir    = "_posts"
	LayoutsDir  = "_layouts"
	IncludesDir = "_includes"
	BlogPrefix  = "blog"
	PublicDir   = ".."
	SiteHostID  = "http://demin.ws"
	FeedHost    = "https://demin.ws"
	FeedLimit   = 50

	// This format must use "magic" values (like 2006 for year, 01 for month etc.)
	// http://golang.org/src/pkg/time/format.go?s=15402:15448#L58
	DateFormat     = "2006-01-02"
	DateTimeFormat = DateFormat + " 15:04"
	LogFile        = "trace.log"
)

type Page map[string]string

type Posts []*Page

type ReversedIndex map[string](map[string]bool)

var (
	posts           = make(Posts, 0)
	number_of_posts = make(map[string]int)

	// This map is used to check whether a post with a given date already exists.
	post_dates = make(map[string]string)

	index_js = make(map[string]string)

	no_binaries *bool = flag.Bool("no-binaries", false, "don't publish binaries")
	logging     *bool = flag.Bool("logging", false, "log to 'trace.log'")

	HeaderRE          = regexp.MustCompile("(?s)^(---\n(.+)\n---\n)")
	HeaderREv2        = regexp.MustCompile("^(?s)(@.+?)\n\n")
	AttrsRE           = regexp.MustCompile("(?Um)^([^\\:]+?)\\: (.+)$")
	AttrsREv2         = regexp.MustCompile("(?Um)^@([^\\:]+?)\\: (.+)$")
	TitleREv2         = regexp.MustCompile("^(.+)\n?=+\n\n")
	CategoriesRE      = regexp.MustCompile("(?m)^- (.+)$")
	ImgRE             = regexp.MustCompile("{% img (\\S+?) %}")
	CodeblockRE       = regexp.MustCompile("(?smU)(^{% codeblock lang\\:([^ ]+) %}(.*){% endcodeblock %})")
	QuotedCodeRE1     = regexp.MustCompile("(?smU)^``` ([^ \n]+?)")
	QuotedCodeRE2     = regexp.MustCompile("(?smU)^```")
	YoutubeRE         = regexp.MustCompile("(?sU){% youtube (\\S+?) %}")
	YoutubeExtRE      = regexp.MustCompile("(?sU){% youtube (\\S+?) (\\d+) (\\d+) %}")
	IncludeRE         = regexp.MustCompile("(?sU){% include (\\S+?) %}")
	FeedTagRE         = regexp.MustCompile(`(?is)<(?:a|img|iframe|audio|video|source|link)\b(?:[^"'<>]|"[^"]*"|'[^']*')*>`)
	FeedAttrRE        = regexp.MustCompile(`(?is)(\s+)([a-z_:][a-z0-9_.:-]*)(\s*=\s*)(?:"([^"]*)"|'([^']*)'|([^\s>]+))`)
	PostNameRE        = regexp.MustCompile("^.*((\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d))-([^ \\./]+?)\\.markdown$")
	PostNameREv2      = regexp.MustCompile("^.*((\\d\\d\\d\\d)-(\\d\\d)-(\\d\\d))-([^ /]+?)/(index)\\.markdown$")
	BlogspotRE        = regexp.MustCompile("^http:\\/\\/(easy|meta)-coding\\.blogspot\\.com\\/\\d\\d\\d\\d\\/\\d\\d\\/.+\\.html$")
	BlogspotEnglishRE = regexp.MustCompile("-english(\\.html)$")
	UnprocessedTagsRE = regexp.MustCompile("(?Ums)^({%.*?}|```)")
	ExtLinkRE         = regexp.MustCompile("((http|https|ftp)\\:\\/\\/|mailto\\:)")
	CheckHrefRE       = regexp.MustCompile("(?s)<(?:a|link) .*?href=[\"']([^#][^\"']*?)[\"'].*?>")
	CheckImgRE        = regexp.MustCompile("(?s)<img .*?src=[\"']([^\"']+?)[\"'].*?>")
	DisqusShortNameRE = regexp.MustCompile("http\\:\\/\\/((easy|meta)-coding).blogspot.com\\/\\d\\d\\d\\d\\/\\d\\d\\/.+?\\.html")
	CodeblockRemoveRE = regexp.MustCompile("(?s){% codeblock [^%]*?%}.+?{% endcodeblock %}")
	QuoteCodeRemoveRE = regexp.MustCompile("(?s)``` [^%]*?.+?```")
	MarkdownTargetsRE = regexp.MustCompile("(?m)^\\[([^\\]]+?)\\]\\: (.*?)$")
	MarkdownLinks1RE  = regexp.MustCompile("\\[([^\\]]+?)\\]\\[\\]")
	MarkdownLinks2RE  = regexp.MustCompile("\\[([^\\]]+?)\\]\\[([^\\]]+?)\\]")

	BlogspotPostDate, _ = time.Parse(DateFormat, "2012-04-01")

	files_cache = make(map[string]*string)

	slash = string(os.PathSeparator)
)

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

// This function loads up a fileand removes '\r' from its content.
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

	// Process the "---"-type of the header.
	content := *load_file(name)
	if m := HeaderRE.FindStringSubmatch(content); m != nil {
		header := m[2]
		if m := AttrsRE.FindAllStringSubmatch(header, -1); m != nil {
			for _, pair := range m {
				p[pair[1]] = cut_surrounding_quotes(pair[2])
			}
		} else {
			die("Bad headers in [%#v]", header)
		}
		if m := CategoriesRE.FindAllStringSubmatch(header, -1); m != nil {
			categories := make([]string, 0)
			for _, g := range m {
				categories = append(categories, g[1])
			}
			p["categories"] = strings.Join(categories, ", ")
		}
		content = HeaderRE.ReplaceAllLiteralString(content, "")
	}
	if len(content) > 0 && content[0] == '@' {
		if m := HeaderREv2.FindStringSubmatch(content); m != nil {
			header := m[0]
			if m := AttrsREv2.FindAllStringSubmatch(header, -1); m != nil {
				for _, pair := range m {
					name, value := pair[1], pair[2]
					p[name] = cut_surrounding_quotes(value)
					if name == "tags" || name == "categories" {
						tags := strings.Split(value, ",")
						for i, v := range tags {
							tags[i] = strings.TrimSpace(v)
						}
						p["categories"] = strings.Join(tags, ", ")
					}
				}
				if _, ok := p["layout"]; !ok {
					p["layout"] = "post"
				}
			} else {
				die("Bad @ headers in [%#v]", header)
			}
		} else {
			die("Bad @ header in [%s]", name)
		}
		content = HeaderREv2.ReplaceAllLiteralString(content, "")
		if m := TitleREv2.FindStringSubmatch(content); m != nil {
			content = TitleREv2.ReplaceAllLiteralString(content, "")
			p["title"] = m[1]
		} else {
			die("Title not found in [%#v]", content)
		}
	}
	p["unprocessed"] = content
	if len(p["layout"]) == 0 {
		p["layout"] = "none" // Make sure that "layout" always exists.
	}
	if len(p["language"]) == 0 {
		p["language"] = "russian" // Make sure that "language" always exists.
	}
	p["content"] = content
	return p
}

func process_tags(post string) string {
	// {% img URL %}
	post = ImgRE.ReplaceAllString(post, "<img src=\"$1\" />")

	post = QuotedCodeRE1.ReplaceAllString(post, "{% codeblock lang:$1 %}")
	post = QuotedCodeRE2.ReplaceAllString(post, "{% endcodeblock %}")

	codeblock := func(s string) string {
		m := CodeblockRE.FindAllStringSubmatch(s, -1)
		if m == nil {
			die("Bad codeblock [%s]", s)
		}
		language := m[0][2]
		source := m[0][3]
		return render_code(source, language)
	}

	// {% codeblock lang:xxx %} ... {% endcodeblock %}
	post = CodeblockRE.ReplaceAllStringFunc(post, codeblock)

	// {% youtube id %}
	post = YoutubeRE.ReplaceAllString(post,
		"<iframe width=\"560\" height=\"420\" "+
			"src=\"https://www.youtube.com/embed/$1?color=white&theme=light\"></iframe>")

	// {% youtube id width height %}
	post = YoutubeExtRE.ReplaceAllString(post,
		"<iframe width=\"$2\" height=\"$3\" "+
			"src=\"https://www.youtube.com/embed/$1?color=white&theme=light\"></iframe>")

	include := func(s string) string {
		m := IncludeRE.FindAllStringSubmatch(s, -1)
		if m == nil {
			die("Bad include [%s]", s)
		}
		return *load_file(filepath.Join(IncludesDir, m[0][1]))
	}

	// {% include filename %}
	post = IncludeRE.ReplaceAllStringFunc(post, include)

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

func set_feed_dates(p Page) error {
	// Legacy dates have no timezone. Preserve the generator's UTC convention.
	published, err := time.Parse(DateTimeFormat, p["date"])
	if err != nil {
		return fmt.Errorf("invalid publication date: %w", err)
	}
	updated := published
	if value := p["updated"]; value != "" {
		updated, err = time.Parse(time.RFC3339, value)
		if err != nil {
			updated, err = time.Parse(DateTimeFormat, value)
		}
		if err != nil {
			return fmt.Errorf("invalid updated date: %w", err)
		}
		if updated.Before(published) {
			return fmt.Errorf("updated date precedes publication date")
		}
	}
	p["feed_published"] = published.UTC().Format(time.RFC3339)
	p["feed_updated"] = updated.UTC().Format(time.RFC3339)
	return nil
}

func feed_posts(language string) Posts {
	entries := make(Posts, 0)
	for _, p := range posts {
		if (*p)["language"] == language {
			entries = append(entries, p)
		}
	}
	// Significant revisions bring older posts back into the subscription feed.
	// Sort a copy so the site's chronological archive and search IDs stay intact.
	sort.Slice(entries, func(i, j int) bool {
		a, b := *entries[i], *entries[j]
		if a["feed_updated"] != b["feed_updated"] {
			return a["feed_updated"] > b["feed_updated"]
		}
		if a["feed_published"] != b["feed_published"] {
			return a["feed_published"] > b["feed_published"]
		}
		return a["url"] < b["url"]
	})
	if len(entries) > FeedLimit {
		entries = entries[:FeedLimit]
	}
	return entries
}

func escape_xml(s string) (string, error) {
	var b bytes.Buffer
	err := xml.EscapeText(&b, []byte(s))
	return b.String(), err
}

func feed_content(content, postURL string) string {
	base, err := url.Parse(FeedHost + postURL)
	if err != nil {
		die("Invalid feed entry URL [%s]: %v", postURL, err)
	}
	// Rewrite URL attributes only, never code samples or visible filenames.
	return FeedTagRE.ReplaceAllStringFunc(content, func(tag string) string {
		return FeedAttrRE.ReplaceAllStringFunc(tag, func(attribute string) string {
			m := FeedAttrRE.FindStringSubmatch(attribute)
			switch strings.ToLower(m[2]) {
			case "href", "src", "poster":
			default:
				return attribute
			}
			value := m[4] + m[5] + m[6]
			target, err := url.Parse(html.UnescapeString(value))
			if err != nil {
				return attribute
			}
			target = base.ResolveReference(target)
			if target.Host == base.Host && target.Scheme == "http" {
				target.Scheme = "https"
			}
			return m[1] + m[2] + m[3] + `"` + html.EscapeString(target.String()) + `"`
		})
	})
}

var codeLanguageRE = regexp.MustCompile(`<pre><code class="language-([a-zA-Z0-9_+-]+)">`)

func set_highlight_assets(p Page, content string) {
	for _, key := range []string{"highlight", "highlight_erlang", "highlight_dos", "highlight_x86asm"} {
		delete(p, key)
	}
	for _, match := range codeLanguageRE.FindAllStringSubmatch(content, -1) {
		language := match[1]
		if language == "plaintext" {
			continue
		}
		p["highlight"] = "yes"
		switch language {
		case "erlang", "dos", "x86asm":
			p["highlight_"+language] = "yes"
		}
	}
}

func render_page(p Page) string {
	trace("> Render page [%s]\n", p["filename"])

	include := func(filename string) string {
		trace("/ Include [%s]", filename)
		inc := load_layout(filepath.Join(IncludesDir, filename), p)
		return render_page(inc)
	}

	last_update := func(language string) string {
		entries := feed_posts(language)
		if len(entries) > 0 {
			return (*entries[0])["feed_updated"]
		}
		die("Unable to find the recent post for language [%s]", language)
		return "<no value>"
	}

	search_version := func(language string) string {
		// Hash the complete rendered script, including the index and search logic.
		// Render from source so the version does not depend on publication order.
		page := load_page(filepath.Join(SiteDir, "js", language, "search.js"))
		return fmt.Sprintf("%x", sha256.Sum256([]byte(render_page(page))))
	}

	funcs := template.FuncMap{
		"asset_version": func(filename string) string {
			content := load_file(filepath.Join(SiteDir, filename))
			return fmt.Sprintf("%x", sha256.Sum256([]byte(*content)))
		},
		"include":        include,
		"last_update":    last_update,
		"feed_posts":     feed_posts,
		"feed_content":   feed_content,
		"xml":            escape_xml,
		"search_version": search_version,
	}

	type Data struct {
		Page          Page
		Posts         Posts
		SiteHostID    string
		FeedHost      string
		ReversedIndex map[string]string
		NumberOfPosts map[string]int
	}

	tpl := template.Must(template.New(p["filename"]).Funcs(funcs).Parse(p["content"]))

	var b bytes.Buffer
	if err := tpl.Execute(&b, Data{p, posts, SiteHostID, FeedHost, index_js, number_of_posts}); err != nil {
		die("Unable to execute template, error [%v]", err)
	}

	p["content"] = b.String()

	if layout_name := p["layout"]; layout_name != "none" {
		if layout_name == "default" {
			set_highlight_assets(p, p["content"])
		}
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

func precheck_post(s string) {
	s = CodeblockRemoveRE.ReplaceAllLiteralString(s, "")
	s = QuoteCodeRemoveRE.ReplaceAllLiteralString(s, "")

	host_prefix := SiteHostID + "/"

	targets := map[string]string{}
	if m := MarkdownTargetsRE.FindAllStringSubmatch(s, -1); m != nil {
		for _, g := range m {
			url := g[2]
			targets[g[1]] = url
			// Check that URL hasn't the site domain as a prefix. The exception is:
			// "$domain/_engine".
			if strings.HasPrefix(url, host_prefix) && len(url) > len(host_prefix) &&
				url[len(host_prefix)] != '_' {
				die("Unnecessary absolute link [%s]", url)
			}
		}
	}

	used_targets := map[string]bool{}

	if m := MarkdownLinks1RE.FindAllStringSubmatch(s, -1); m != nil {
		for _, g := range m {
			link := g[1]
			if _, ok := targets[link]; !ok {
				die("Dead link [%s]", link)
			}
			used_targets[link] = true
		}
	}

	if m := MarkdownLinks2RE.FindAllStringSubmatch(s, -1); m != nil {
		for _, g := range m {
			link := g[2]
			if _, ok := targets[link]; !ok {
				die("Dead link [%s]", link)
			}
			used_targets[link] = true
		}
	}

	for link, target := range targets {
		if _, ok := used_targets[link]; !ok {
			die("Unused link [%s]: %s", link, target)
		}
	}
}

func pause() string {
	var s string
	fmt.Scanf("%s", &s)
	return s
}

func process_post(filename string) {
	trace("$ Processing post [%s]", filename)
	m := PostNameRE.FindStringSubmatch(filename)
	if m == nil {
		m = PostNameREv2.FindStringSubmatch(filename)
		if m == nil {
			return
		}
	}

	p := load_page(filename)

	if p["draft"] == "yes" {
		return
	}

	p["date_only"] = m[1]
	p["year"] = m[2]
	p["month"] = m[3]
	p["day"] = m[4]
	p["slug"] = m[5]

	if len(m) >= 7 {
		p["v2"] = "yes"
	}

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

	if err := set_feed_dates(p); err != nil {
		die("Invalid dates in [%s]: %v", filename, err)
	}

	// All posts before this date must have a blogspot id attribute.
	if date.Before(BlogspotPostDate) && p["blogspot"] == "" {
		die("All posts before '%s' must have a blogspot id", BlogspotPostDate.String())
	}

	p["disqus_developer"] = "0"

	p["disqus_shortname"] = "demin-ws"
	p["disqus_identifier"] = p["url"]
	p["disqus_url"] = SiteHostID + p["url"]

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

	// Keep the existing thread identifier and forum; only upgrade the page URL.
	p["disqus_url"] = strings.Replace(p["disqus_url"], "http://", "https://", 1)

	if p["disqus"] != "" && p["blogspot"] != "" {
		die("Disqus and Blogspot ids are given at the same time")
	}

	if !strings.HasPrefix(p["date"], p["date_only"]) {
		die("Slug date [%s] isn't a prefix of [%s]", p["date_only"], p["date"])
	}

	precheck_post(p["content"])

	p["content"] = markup(p["content"])
	p["rss"] = p["content"]
	if p["language"] == "english" {
		p["rss"] += "<hr/><a href=\"/english/about/\">Disclaimer</a>"
	}

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

	if p["v2"] == "yes" {
		callback := func(path string, info os.FileInfo, err error) error {
			name := filepath.Base(path)
			if info == nil || info.IsDir() || name == ".DS_Store" || name == "index.markdown" {
				return err
			}
			target_file := filepath.Join(dir, name)
			trace("+ Copy post file %s -> %s\n", path, target_file)
			copy_file(path, target_file)
			return err
		}
		if err := filepath.Walk(filepath.Dir(filename), callback); err != nil {
			die("Walking through post file failed, error %#v", err)
		}
	}

	t := strings.Join([]string{dir, "index.html"}, "/")
	if ioutil.WriteFile(t, []byte(p["content"]), 0666) != nil {
		die("Unable to write file [%s]", t)
	}
	trace("= Written file [%s]", t)

	p["index"] = strconv.Itoa(len(posts))
	posts = append(posts, &p)

	post_id := p["language"] + "-" + p["date"]
	if existing, ok := post_dates[post_id]; ok {
		die("Post with [%s] id (URL [%s]) already exists, URL [%s]", post_id, p["url"], existing)
	}
	post_dates[post_id] = p["url"]
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

	// Sort posts by descending creation date.
	sort.Sort(posts)

	// Count a number of posts in each language.
	post_indecies := make(map[string]int)
	for _, p := range posts {
		language := (*p)["language"]
		post_indecies[language] += 1
		number_of_posts[language] += 1
	}

	for _, p := range posts {
		language := (*p)["language"]
		// Index posts independently in each language.
		(*p)["index"] = strconv.Itoa(post_indecies[language])
		post_indecies[language] -= 1
	}
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
	// Vendored JavaScript can contain Go template delimiters as literal text.
	if strings.HasPrefix(name, filepath.Join(SiteDir, "common", "highlight")+slash) {
		process_binary(name)
		return
	}
	ext := filepath.Ext(name)
	if ext == ".html" || ext == ".xml" || ext == ".markdown" || ext == ".js" {
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
			// Query strings and fragments are not part of the local filename.
			if i := strings.IndexAny(l, "?#"); i >= 0 {
				l = l[:i]
			}
			if strings.HasPrefix(l, "/") {
				file_exist(PublicDir + l)
			} else if strings.HasPrefix(l, SiteHostID) {
				file_exist(PublicDir + l[len(SiteHostID):])
			} else {
				if !ExtLinkRE.MatchString(l) {
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

	check_links_re(f, filename, CheckHrefRE)
	check_links_re(f, filename, CheckImgRE)
	check_unexpanded_placeholders(f)
}

func check_links() {
	trace("~ Checking links")
	callback := func(path string, info os.FileInfo, err error) error {
		if info == nil || info.IsDir() || filepath.Base(path) == ".DS_Store" {
			return err
		}
		if strings.Contains(path, slash+"_engine"+slash) {
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

func build_language_index(language string) string {
	filter := func(c rune) bool {
		return !unicode.IsLetter(c)
	}
	index := make(ReversedIndex)
	for _, p := range posts {
		if (*p)["language"] != language {
			continue
		}
		data := strings.Join([]string{(*p)["title"], (*p)["unprocessed"], (*p)["categories"]}, " ")
		words := strings.FieldsFunc(data, filter)
		for _, w := range words {
			if utf8.RuneCountInString(w) < 3 {
				continue
			}
			w = strings.ToLower(w)
			if _, exist := index[w]; !exist {
				index[w] = make(map[string]bool)
			}
			index[w][(*p)["index"]] = true
		}
	}
	keys := make([]string, 0)
	for word, _ := range index {
		keys = append(keys, word)
	}
	sort.Strings(keys)

	lines := make([]string, 0)
	for _, word := range keys {
		l := make([]string, 0)
		for id, _ := range index[word] {
			l = append(l, id)
		}
		sort.Strings(l)
		lines = append(lines, fmt.Sprintf("ri[\"%s\"]=[%s]", word, strings.Join(l, ",")))
	}
	fmt.Printf("Words in %s index: %d\n", language, len(lines))
	return strings.Join(lines, "\n")
}

func build_index() {
	index_js["russian"] = build_language_index("russian")
	index_js["english"] = build_language_index("english")
}

var (
	language_table = map[string]string{
		"c++":         "cpp",
		"c#":          "csharp",
		"objective-c": "objectivec",
		"nasm":        "x86asm",
		"bat":         "dos",
		"io":          "plaintext",
	}
)

func render_code(source, language string) string {
	if shortcut, exist := language_table[language]; exist {
		language = shortcut
	}
	return "<pre><code class=\"language-" + html.EscapeString(language) + "\">" +
		html.EscapeString(strings.TrimPrefix(source, "\n")) + "</code></pre>\n"
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
	build_index()
	process_site()
	check_links()
	println(time.Since(started).String())
	fmt.Printf("Processed %d posts.\n", len(posts))
}
