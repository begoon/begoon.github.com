# Python formatting

Always format Python (`.py`) files with Black after creating or modifying them.
Run Black through `uvx` with a line length of 80:

```sh
uvx black --line-length 80 <files>
```

# Hidden posts

Old posts are hidden, never deleted, so their URLs keep working.

- To hide a post, add `unlisted: yes` to its header (`@unlisted: yes` for
  directory-style posts with `@` headers), then rebuild with `just build`. The
  engine still publishes the page but leaves it out of the index, the search
  and the Atom feed.
- Always hide a post in both languages when it has a translation.
- Hide in rounds agreed with the author, and record each round as its own
  section in `HIDDEN.md` (the reason and a table of posts per language).
