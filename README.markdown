This repository contains materials of the personal blog "[Программирование - это просто][] / [Programming DIY][]". 

[Программирование - это просто]: https://demin.ws/
[Programming DIY]: https://demin.ws/english/

# How to use the blog engine

[A blog post about Goblog](https://demin.ws/blog/english/2012/04/23/static-blog-engine-goblog/).

# Build

Install Go (the version in `go.mod` or newer) and [just](https://github.com/casey/just).
On macOS: `brew install go just`.

Run `just build` from the repository root. This runs the generator from `_engine`
and regenerates the published pages and assets in the repository root. Go downloads
the pinned Markdown dependency on the first build.

Run the code-block regression tests with `go test ./_engine/main.go ./_engine/main_test.go`.

# Syntax highlighting

The generator emits escaped code blocks with explicit language classes. The browser
highlights them using locally hosted Highlight.js 11.12.0; no `highlight` executable
or JavaScript build tool is needed. Without JavaScript, code remains readable.
Feed readers receive plain code blocks.

Vendored files in `_engine/_site/common/highlight/` come from
[Highlight.js CDN release 11.12.0](https://github.com/highlightjs/cdn-release/tree/11.12.0):
`build/highlight.min.js`, the `erlang`, `dos`, and `x86asm` grammars from
`build/languages/`, and `LICENSE`. The theme in `_engine/_site/css/highlight.css`
is `build/styles/github.min.css` from the same release. Update these files together
and rebuild the site when upgrading.

Legacy language names are normalized by the generator. Io has no bundled grammar
and uses plain text. Unlabelled blocks and unsupported languages are left unchanged
rather than auto-detected.
