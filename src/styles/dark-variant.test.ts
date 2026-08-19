import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const stylesDir = dirname(fileURLToPath(import.meta.url));

test("dark variant follows the .dark class used by next-themes", () => {
  const css = readFileSync(join(stylesDir, "globals.css"), "utf8");
  assert.match(
    css,
    /@custom-variant\s+dark\s*\(&:where\(\.dark,\s*\.dark\s+\*\)\)/,
    "dark: utilities must follow html.dark, not prefers-color-scheme",
  );
});
