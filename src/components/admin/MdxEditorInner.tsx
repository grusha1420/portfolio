"use client";

import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  CreateLink,
  headingsPlugin,
  imagePlugin,
  InsertImage,
  linkDialogPlugin,
  linkPlugin,
  listsPlugin,
  ListsToggle,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  UndoRedo,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

import { cn } from "~/lib/cn";
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
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-input-border bg-background",
        className,
      )}
    >
      <MDXEditor
        markdown={value}
        onChange={(markdown) => onChange(markdown)}
        contentEditableClassName={cn(
          "prose prose-sm max-w-none dark:prose-invert min-h-[320px] px-4 py-3",
          "prose-headings:text-foreground prose-p:text-foreground/90",
          "prose-a:text-accent prose-strong:text-foreground",
        )}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
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
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
