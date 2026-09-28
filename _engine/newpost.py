"""Create a Markdown post for the blog, optionally in both languages."""

from datetime import datetime
import os
from pathlib import Path
import re
import shlex
import subprocess

POSTS_DIR = Path(__file__).resolve().parent / "_posts"
DATE_FORMAT = "%Y-%m-%d %H:%M"


def ask(prompt, choices):
    labels = ", ".join([choices[0].upper(), *choices[1:]])
    while True:
        answer = input(f"{prompt} [{labels}]? ").strip().lower() or choices[0]
        if answer in choices:
            return answer


def confirm(prompt, default=True):
    return ask(prompt, ["y", "n"] if default else ["n", "y"]) == "y"


def enter(prompt, default=""):
    while True:
        answer = input(f"{prompt} [{default}]: ").strip() or default
        if answer:
            return answer


def correct_date(value):
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2} \d{2}:\d{2}", value):
        return False
    try:
        datetime.strptime(value, DATE_FORMAT)
        return True
    except ValueError:
        return False


def enter_categories(language):
    categories = {language}
    while True:
        category = input(
            f"Categories ({', '.join(sorted(categories))}): "
        ).strip()
        if not category:
            return categories
        if category.startswith("-"):
            categories.discard(category[1:])
        else:
            categories.add(category)


def render_post(title, language, date, categories):
    # The generator strips surrounding quotes without interpreting escapes.
    quote = "'" if '"' in title else '"'
    lines = [
        "---",
        "layout: post",
        f"title: {quote}{title}{quote}",
        f"language: {language}",
        f"date: {date}",
        "comments: true",
        "categories:",
        *[f"- {category}" for category in sorted(categories)],
        "---",
        "",
    ]
    return "\n".join(lines) + "\n"


def write_post(filename, content):
    if filename.exists() and not confirm(
        f"Overwrite {filename}", default=False
    ):
        return False
    filename.parent.mkdir(parents=True, exist_ok=True)
    filename.write_text(content, encoding="utf-8")
    print(f"Written to '{filename}'")
    return True


def edit_file(filename):
    editor = os.environ.get("VISUAL") or os.environ.get("EDITOR") or "vi"
    subprocess.run([*shlex.split(editor), str(filename)], check=True)


def main(posts_dir=POSTS_DIR):
    while True:
        while True:
            date = enter(
                "New date (YYYY-MM-DD HH:MM)",
                datetime.now().strftime(DATE_FORMAT),
            )
            if correct_date(date):
                break
            print("Invalid calendar date or time")
        title = enter("Title")
        while True:
            slug = enter("Slug (lowercase words separated by hyphens)")
            if re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug):
                break
            print(
                "Use lowercase letters, digits, and single hyphens between words"
            )
        language = (
            "russian" if ask("Language", ["r", "e"]) == "r" else "english"
        )
        categories = enter_categories(language)
        filename = posts_dir / language / f"{date[:10]}-{slug}.markdown"
        content = render_post(title, language, date, categories)
        print(f"Creating file: {filename}\n{content}")
        if confirm("Happy"):
            break

    created = []
    if write_post(filename, content):
        created.append(filename)

    second_language = "english" if language == "russian" else "russian"
    if confirm(f"Create also post in {second_language}", default=False):
        second_filename = posts_dir / second_language / filename.name
        second_categories = (categories - {language}) | {second_language}
        second_content = render_post(
            title, second_language, date, second_categories
        )
        print(f"Creating file: {second_filename}\n{second_content}")
        if confirm("Happy") and write_post(second_filename, second_content):
            created.append(second_filename)

    for filename in created:
        if confirm(f"Edit {filename}", default=False):
            edit_file(filename)


if __name__ == "__main__":
    try:
        main()
    except (EOFError, KeyboardInterrupt):
        print("\nCancelled")
        raise SystemExit(1)
