import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

test("markdown lists use the same foreground token as paragraphs", () => {
  const source = readFileSync(join(here, "mdx-content.tsx"), "utf8");
  assert.match(
    source,
    /prose-li:text-foreground\/90/,
    "list items must not inherit inverted prose body color in light mode",
  );
});
