const TABLE_SEPARATOR = /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/;
const TABLE_ROW = /^\s*\|?.+\|.+\|?\s*$/;
const ATX_HEADING = /^\s{0,3}#{1,6}\s+\S/m;
const THEMATIC_BREAK = /^\s{0,3}(?:-{3,}|\*{3,}|_{3,})\s*$/m;
const FENCED_CODE = /^ {0,3}```/m;

function containsMarkdownTable(text: string): boolean {
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length - 1; index += 1) {
    const row = lines[index] ?? "";
    const separator = lines[index + 1] ?? "";

    if (TABLE_ROW.test(row) && TABLE_SEPARATOR.test(separator)) {
      return true;
    }
  }

  return false;
}

export function clipboardTextLooksLikeMarkdown(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  return (
    containsMarkdownTable(trimmed) ||
    ATX_HEADING.test(trimmed) ||
    THEMATIC_BREAK.test(trimmed) ||
    FENCED_CODE.test(trimmed)
  );
}

/**
 * Cursor and other editors put GFM source in text/plain.
 * Lexical's default paste treats that as paragraphs, so tables stay as pipes.
 */
export function shouldImportClipboardAsMarkdown(plainText: string): boolean {
  return clipboardTextLooksLikeMarkdown(plainText);
}
