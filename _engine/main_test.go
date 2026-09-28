package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

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
