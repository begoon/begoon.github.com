This repository contains materials of the personal blog "[Программирование - это просто][] / [Programming DIY][]". 

[Программирование - это просто]: https://demin.ws/
[Programming DIY]: https://demin.ws/english/

# How to use the blog engine

[A blog post about Goblog](https://demin.ws/blog/english/2012/04/23/static-blog-engine-goblog/).

# Build

Install Go (the version in `go.mod` or newer), [just](https://github.com/casey/just),
and [uv](https://docs.astral.sh/uv/) for Python helpers.
On macOS: `brew install go just uv`.

Run `just build` from the repository root. This runs the generator from `_engine`
and regenerates the published pages and assets in the repository root. Go downloads
the pinned Markdown dependency on the first build.

Run the code-block regression tests with `go test ./_engine/main.go ./_engine/main_test.go`.
Run the search regression tests with `bun test ./_engine/search.test.ts` (requires Bun).
Run the new-post helper tests with `uv run --no-project python -B -m unittest discover -s _engine -p 'test_*.py'`.

The root `Justfile` replaces `_engine/Makefile`:

| Command | Purpose |
| --- | --- |
| `just build` | Regenerate the blog; optional generator flags follow the recipe name. |
| `just format` | Format the Go engine and its tests. |
| `just all` | Format, then build. |
| `just serve` | Serve locally on port 9000; pass another port to override it. |
| `just newpost` | Create a Markdown post interactively, optionally in both languages. |
| `just updated-public` | List tracked files with unstaged changes outside `_engine`. |
| `just revert-updated-public` | Discard unstaged changes outside `_engine`, including root configuration and documentation. |

`just run` and `just server` are aliases for `build` and `serve`.
The private `filter-updated` recipe runs a supplied command for each file listed
by `updated-public`, preserving filenames containing spaces.

The new-post helper uses Python's standard library through `uv run --no-project python`;
Ruby is no longer required. It validates calendar dates and filename slugs, previews
the post, and asks before overwriting an existing file. New posts go under
`_engine/_posts`, regardless of the working directory. Optional editing uses
`VISUAL`, then `EDITOR`, then `vi`.

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

# Subscription feeds

The RSS links serve Atom feeds at `/atom.xml` (Russian) and `/english/atom.xml`
(English). Each contains the 50 most recently published or significantly updated
posts, with full content. The website continues to list the complete archive.

Publication times come from each post's `date`, including the time of day.
Dates without an explicit timezone retain the generator's historical UTC
interpretation. Feed links use HTTPS; existing entry IDs deliberately keep their
original HTTP form so feed readers recognize previously delivered posts.

When significantly revising a post, add or change its optional `updated` metadata:

```text
updated: 2026-09-28T11:30:00+01:00
```

For posts using `@` metadata, use `@updated: 2026-09-28T11:30:00+01:00`.
The legacy `YYYY-MM-DD HH:MM` format is also accepted as UTC. The revision date
must not precede publication. Without `updated`, the publication time is used.
A revision brings the post back into the feed and advances the feed's `updated`
time. Unchanged builds do not change feed timestamps or content.
