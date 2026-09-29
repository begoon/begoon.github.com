package main

import (
	"encoding/xml"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"
)

func TestFeedDates(t *testing.T) {
	for _, test := range []struct {
		updated string
		want    string
	}{
		{"", "2013-01-29T22:00:00Z"},
		{"2026-09-28 10:30", "2026-09-28T10:30:00Z"},
		{"2026-09-28T11:30:00+01:00", "2026-09-28T10:30:00Z"},
	} {
		p := Page{"date": "2013-01-29 22:00", "updated": test.updated}
		if err := set_feed_dates(p); err != nil {
			t.Fatal(err)
		}
		if p["feed_published"] != "2013-01-29T22:00:00Z" || p["feed_updated"] != test.want {
			t.Fatalf("unexpected dates: %v", p)
		}
	}
	for _, updated := range []string{"invalid", "2026-02-30 12:00", "2013-01-29 21:59"} {
		if err := set_feed_dates(Page{"date": "2013-01-29 22:00", "updated": updated}); err == nil {
			t.Errorf("accepted invalid revision date %q", updated)
		}
	}
}

func TestFeedContentURLs(t *testing.T) {
	input := `<p>photo.jpg</p><a href="/">home</a><img src="photo.jpg" title='literal href="/unchanged" > text'>` +
		`<a href='http://demin.ws/about/?a=1&amp;b=2'>local</a>` +
		`<a href="http://example.org/">external</a><iframe src="//example.org/embed"></iframe>` +
		`<a href="#section">anchor</a><img src=/images/picture.jpg>` +
		`<pre><code>&lt;img src="photo.jpg"&gt;</code></pre>`
	got := feed_content(input, "/blog/english/2013/01/29/example/")
	for _, want := range []string{
		`<p>photo.jpg</p>`, `href="https://demin.ws/"`,
		`src="https://demin.ws/blog/english/2013/01/29/example/photo.jpg"`,
		`title='literal href="/unchanged" > text'`,
		`href="https://demin.ws/about/?a=1&amp;b=2"`, `href="http://example.org/"`,
		`src="https://example.org/embed"`,
		`href="https://demin.ws/blog/english/2013/01/29/example/#section"`,
		`src="https://demin.ws/images/picture.jpg"`,
		`<pre><code>&lt;img src="photo.jpg"&gt;</code></pre>`,
	} {
		if !strings.Contains(got, want) {
			t.Errorf("missing %q in %s", want, got)
		}
	}
}

func TestAtomFeeds(t *testing.T) {
	previous := posts
	t.Cleanup(func() { posts = previous })
	posts = nil
	start := time.Date(2013, 1, 1, 10, 30, 0, 0, time.UTC)
	for _, language := range []string{"russian", "english"} {
		for i := 0; i < FeedLimit+1; i++ {
			p := Page{
				"language": language, "date": start.AddDate(0, 0, i).Format(DateTimeFormat),
				"url":   fmt.Sprintf("/blog/%s/example-%d/", language, i),
				"title": "vector<bool> & vector<int> ]]> Привет",
				"rss":   `<p>Code: &lt;tag&gt; and ]]&gt;</p><img src="photo.jpg">`,
			}
			if i == 0 {
				p["updated"] = "2026-09-28T11:30:00+01:00"
			}
			if err := set_feed_dates(p); err != nil {
				t.Fatal(err)
			}
			posts = append(posts, &p)
		}
	}
	for _, language := range []string{"russian", "english"} {
		prefix := ""
		if language == "english" {
			prefix = "english/"
		}
		filename := filepath.Join(SiteDir, prefix, "atom.xml")
		output := render_page(load_page(filename))
		if again := render_page(load_page(filename)); again != output {
			t.Fatal("feed changed without a content change")
		}
		var feed struct {
			XMLName xml.Name
			ID      string `xml:"id"`
			Updated string `xml:"updated"`
			Links   []struct {
				Href string `xml:"href,attr"`
				Rel  string `xml:"rel,attr"`
			} `xml:"link"`
			Entries []struct {
				ID        string `xml:"id"`
				Title     string `xml:"title"`
				Content   string `xml:"content"`
				Published string `xml:"published"`
				Updated   string `xml:"updated"`
			} `xml:"entry"`
		}
		if err := xml.Unmarshal([]byte(output), &feed); err != nil {
			t.Fatal(err)
		}
		if feed.XMLName.Space != "http://www.w3.org/2005/Atom" || len(feed.Entries) != FeedLimit {
			t.Fatalf("invalid Atom namespace or entry count: %s, %d", feed.XMLName.Space, len(feed.Entries))
		}
		if feed.ID != SiteHostID+"/"+prefix || len(feed.Links) != 2 ||
			feed.Links[0].Rel != "self" || feed.Links[0].Href != FeedHost+"/"+prefix+"atom.xml" ||
			feed.Links[1].Href != FeedHost+"/"+prefix {
			t.Fatalf("incorrect feed identity or links: %+v", feed)
		}
		entry := feed.Entries[0]
		if entry.ID != SiteHostID+"/blog/"+language+"/example-0/" ||
			entry.Published != "2013-01-01T10:30:00Z" || entry.Updated != "2026-09-28T10:30:00Z" ||
			feed.Updated != entry.Updated {
			t.Fatalf("revised post was not included with stable ID and correct dates: %+v", entry)
		}
		if entry.Title != "vector<bool> & vector<int> ]]> Привет" ||
			!strings.Contains(entry.Content, `Code: &lt;tag&gt; and ]]&gt;`) ||
			!strings.Contains(entry.Content, FeedHost+"/blog/"+language+"/example-0/photo.jpg") {
			t.Fatalf("title or HTML content was corrupted: %+v", entry)
		}
		for _, entry := range feed.Entries {
			if !strings.HasPrefix(entry.ID, SiteHostID+"/blog/"+language+"/") {
				t.Fatalf("mixed languages or changed ID: %s", entry.ID)
			}
		}
	}
	if (*posts[1])["url"] != "/blog/russian/example-1/" {
		t.Fatal("feed sorting changed the main post ordering")
	}
}

func TestSearchLoaderVersion(t *testing.T) {
	dir := t.TempDir()
	for _, name := range []string{
		"_site/js/english/search.js", "_site/js/english/search_loader.js",
		"_includes/search.js", "_includes/search_loader.js",
	} {
		data, err := os.ReadFile(name)
		if err != nil {
			t.Fatal(err)
		}
		target := filepath.Join(dir, name)
		if err := os.MkdirAll(filepath.Dir(target), 0755); err != nil {
			t.Fatal(err)
		}
		if err := os.WriteFile(target, data, 0644); err != nil {
			t.Fatal(err)
		}
	}
	t.Chdir(dir)
	oldIndex, oldCounts, oldCache := index_js, number_of_posts, files_cache
	t.Cleanup(func() {
		index_js, number_of_posts, files_cache = oldIndex, oldCounts, oldCache
	})
	index_js = map[string]string{"english": `ri["hello"]=[1]`}
	number_of_posts = map[string]int{"english": 1}
	render := func() string {
		// Each invocation models a fresh build, with no cached source files.
		files_cache = make(map[string]*string)
		return render_page(load_page("_site/js/english/search_loader.js"))
	}
	initial := render()
	if got := render(); got != initial {
		t.Fatal("unchanged search script changed the loader")
	}
	index_js["russian"] = `ri["other"]=[1]`
	if got := render(); got != initial {
		t.Fatal("another language's index changed the English loader")
	}
	index_js["english"] = `ri["hello"]=[1,2]`
	changedIndex := render()
	if changedIndex == initial {
		t.Fatal("index change did not update the loader")
	}
	number_of_posts["english"] = 2
	changedCount := render()
	if changedCount == changedIndex {
		t.Fatal("post count change did not update the loader")
	}
	if err := os.WriteFile("_includes/search.js", []byte("// Updated search implementation\n"), 0644); err != nil {
		t.Fatal(err)
	}
	if render() == changedCount {
		t.Fatal("search implementation change did not update the loader")
	}
}

func TestCodeBlocks(t *testing.T) {
	for _, opening := range []string{"{% codeblock lang:cpp %}", "``` cpp"} {
		closing := "{% endcodeblock %}"
		if strings.HasPrefix(opening, "```") {
			closing = "```"
		}
		input := opening + "\nif (a < b && c > d) {\n  puts(\"</code><script>alert(1)</script>\");\n}\n" + closing
		got := markup(input)
		if !strings.Contains(got, `<pre><code class="language-cpp">`) {
			t.Fatalf("missing code wrapper: %s", got)
		}
		if strings.Contains(got, "<script>") || !strings.Contains(got, "a &lt; b &amp;&amp; c &gt; d") {
			t.Fatalf("code was not escaped: %s", got)
		}
		if strings.Contains(got, "<span") || strings.Contains(got, "{%") {
			t.Fatalf("unexpected highlighting or unexpanded tag: %s", got)
		}
	}
}

func TestCodeLanguageAliases(t *testing.T) {
	for input, want := range map[string]string{
		"c++": "cpp", "c#": "csharp", "objective-c": "objectivec",
		"nasm": "x86asm", "bat": "dos", "io": "plaintext",
		"go": "go", "makefile": "makefile", "erlang": "erlang",
	} {
		got := render_code("\nexample\n", input)
		if !strings.Contains(got, `class="language-`+want+`">example`+"\n</code>") {
			t.Errorf("%s: unexpected code block %s", input, got)
		}
	}
}

func TestConditionalHighlightAssets(t *testing.T) {
	for _, test := range []struct {
		name, content string
		want          []string
	}{
		{"text", "<p>Hello</p>", nil},
		{"inline", "<p><code>printf()</code></p>", nil},
		{"unlabelled", "<pre><code>plain</code></pre>", nil},
		{"plaintext", render_code("plain", "io"), nil},
		{"cpp", render_code("int main() {}", "c++"), []string{"highlight.min.js", "/js/highlight.js", "highlight.css"}},
		{"extras", render_code("ok.", "erlang") + render_code("echo hi", "bat") + render_code("mov ax, bx", "nasm"), []string{"highlight.min.js", "/js/highlight.js", "highlight.css", "erlang.min.js", "dos.min.js", "x86asm.min.js"}},
	} {
		t.Run(test.name, func(t *testing.T) {
			p := Page{"highlight": "stale", "highlight_erlang": "stale"}
			set_highlight_assets(p, test.content)
			output := render_page(load_layout("_includes/highlight.html", p))
			for _, asset := range []string{"highlight.min.js", "/js/highlight.js", "highlight.css", "erlang.min.js", "dos.min.js", "x86asm.min.js"} {
				want := false
				for _, expected := range test.want {
					if expected == asset {
						want = true
					}
				}
				if strings.Contains(output, asset) != want {
					t.Errorf("asset %s: %s", asset, output)
				}
			}
		})
	}
}

func TestPageDescriptionAndMain(t *testing.T) {
	for _, language := range []string{"english", "russian"} {
		p := Page{"filename": "test", "layout": "default", "language": language, "title": "Example", "description": `A "quote" & <tag>`, "content": "<p>Text</p>"}
		output := render_page(p)
		if !strings.Contains(output, `<meta name="description" content="A &#34;quote&#34; &amp; &lt;tag&gt;" />`) {
			t.Fatalf("description not escaped: %s", output)
		}
		if !strings.Contains(output, `<main id="home">`) || !strings.Contains(output, "</main>") {
			t.Fatal("main landmark missing")
		}
		if strings.Contains(output, "highlight.min.js") {
			t.Fatal("highlighting loaded without code")
		}
	}
}
