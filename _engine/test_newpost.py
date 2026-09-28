import io
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

import newpost


class NewPostTests(unittest.TestCase):
    def test_calendar_dates(self):
        for date in ["2026-09-28 10:00", "2028-02-29 23:59"]:
            self.assertTrue(newpost.correct_date(date), date)
        for date in [
            "2026-02-29 10:00",
            "2019-02-31 10:00",
            "2026-09-28 24:00",
            "2026-9-28 10:00",
            "prefix 2026-09-28 10:00",
        ]:
            self.assertFalse(newpost.correct_date(date), date)

    def run_wizard(self, root, answers):
        with patch("builtins.input", side_effect=answers), patch(
            "sys.stdout", new_callable=io.StringIO
        ):
            newpost.main(root)

    def test_single_post_and_invalid_input(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.run_wizard(
                root,
                [
                    "2026-02-31 10:00",
                    "2026-09-28 10:00",
                    'An "English" title',
                    "../escape",
                    "hello-world",
                    "e",
                    "python",
                    "",
                    "y",
                    "n",
                    "n",
                ],
            )
            files = list(root.rglob("*.markdown"))
            self.assertEqual(
                files, [root / "english/2026-09-28-hello-world.markdown"]
            )
            content = files[0].read_text()
            self.assertIn("title: 'An \"English\" title'", content)
            self.assertIn("language: english\n", content)
            self.assertIn("- english\n- python\n", content)

    def test_bilingual_posts_and_category_removal(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.run_wizard(
                root,
                [
                    "2026-09-28 10:00",
                    "Привет",
                    "hello",
                    "r",
                    "go",
                    "unused",
                    "-unused",
                    "",
                    "y",
                    "y",
                    "y",
                    "n",
                    "n",
                ],
            )
            for language in ["russian", "english"]:
                content = (
                    root / language / "2026-09-28-hello.markdown"
                ).read_text()
                self.assertIn('title: "Привет"', content)
                self.assertIn(f"language: {language}\n", content)
                self.assertIn(f"- {language}\n", content)
                self.assertIn("- go\n", content)
                self.assertNotIn("unused", content)
                other = "english" if language == "russian" else "russian"
                self.assertNotIn(f"- {other}\n", content)

    def test_declining_overwrite_preserves_existing_post(self):
        with tempfile.TemporaryDirectory() as directory:
            filename = Path(directory) / "post.markdown"
            filename.write_text("Existing post")
            with patch("builtins.input", return_value=""):
                self.assertFalse(newpost.write_post(filename, "Replacement"))
            self.assertEqual(filename.read_text(), "Existing post")
            with patch("builtins.input", return_value="y"), patch(
                "sys.stdout", new_callable=io.StringIO
            ):
                self.assertTrue(newpost.write_post(filename, "Replacement"))
            self.assertEqual(filename.read_text(), "Replacement")

    def test_editor_arguments_do_not_use_a_shell(self):
        filename = Path("post with spaces; echo hello.markdown")
        with patch.dict(os.environ, {"EDITOR": "code --wait"}, clear=True):
            with patch("newpost.subprocess.run") as run:
                newpost.edit_file(filename)
                run.assert_called_once_with(
                    ["code", "--wait", str(filename)], check=True
                )


if __name__ == "__main__":
    unittest.main()
