import assert from "node:assert/strict";
import { test } from "node:test";

import { shouldImportClipboardAsMarkdown } from "./markdown-paste.ts";

const cursorTablePaste = `I use it for quick sketches.

---

## How I Use It in Practice

| Task | Purpose |
|------|---------|
| Quick sketch from a description | A client describes an idea |
| Concept variations | Several visual directions before starting 3D |

The final character is still made in Blender.`;

test("imports a GFM table pasted from Cursor", () => {
  assert.equal(shouldImportClipboardAsMarkdown(cursorTablePaste), true);
});

test("imports a table without leading pipes", () => {
  const text = `Task | Purpose
--- | ---
Sketch | Show the idea`;

  assert.equal(shouldImportClipboardAsMarkdown(text), true);
});

test("imports ATX headings and thematic breaks from markdown", () => {
  assert.equal(
    shouldImportClipboardAsMarkdown("## How I Use It in Practice"),
    true,
  );
  assert.equal(shouldImportClipboardAsMarkdown("---"), true);
});

test("leaves ordinary prose and rich-text paste alone", () => {
  assert.equal(
    shouldImportClipboardAsMarkdown("Just a sentence with a | pipe."),
    false,
  );
  assert.equal(shouldImportClipboardAsMarkdown("Choose option A or B"), false);
  assert.equal(shouldImportClipboardAsMarkdown(""), false);
});
