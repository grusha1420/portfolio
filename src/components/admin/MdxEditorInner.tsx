"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  InsertTable,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  quotePlugin,
  tablePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { useEffect, useRef, type ClipboardEvent } from "react";

import { cn } from "~/lib/cn";
import { shouldImportClipboardAsMarkdown } from "~/lib/markdown-paste";
import { uploadFiles } from "~/utils/uploadthing";

export interface MdxEditorInnerProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

async function handleImageUpload(file: File): Promise<string> {
  const result = await uploadFiles("imageUploader", { files: [file] });
  const uploaded = result[0];

  if (!uploaded) {
    throw new Error("Image upload failed");
  }

  return uploaded.ufsUrl;
}

export function MdxEditorInner({
  value,
  onChange,
  className,
}: MdxEditorInnerProps) {
  const editorRef = useRef<MDXEditorMethods>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    editorRef.current?.setMarkdown(value);
  }, [value]);

  function handlePasteCapture(event: ClipboardEvent<HTMLDivElement>) {
    const plainText = event.clipboardData.getData("text/plain");
    if (!shouldImportClipboardAsMarkdown(plainText)) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    editorRef.current?.focus(() => {
      editorRef.current?.insertMarkdown(plainText);
    });
  }

  return (
    <div
      className={cn(
        "border-input-border bg-background overflow-hidden rounded-lg border",
        className,
      )}
      onPasteCapture={handlePasteCapture}
    >
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={(markdown) => {
          isInternalChange.current = true;
          onChange(markdown);
        }}
        contentEditableClassName={cn(
          "prose prose-sm max-w-none dark:prose-invert min-h-[320px] px-4 py-3",
          "prose-headings:text-foreground prose-p:text-foreground/90 prose-li:text-foreground/90",
          "prose-a:text-accent prose-strong:text-foreground",
          "prose-table:text-foreground prose-th:border-border prose-td:border-border",
        )}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          tablePlugin(),
          markdownShortcutPlugin(),
          imagePlugin({ imageUploadHandler: handleImageUpload }),
          toolbarPlugin({
            toolbarClassName: "border-b border-input-border bg-card px-2",
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <CreateLink />
                <InsertImage />
                <InsertTable />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
