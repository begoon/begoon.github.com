package main

import (
	"strings"
	"testing"
)

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
