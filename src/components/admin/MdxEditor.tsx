"use client";

import dynamic from "next/dynamic";

import { cn } from "~/lib/cn";

import type { MdxEditorInnerProps } from "./MdxEditorInner";

const MdxEditorInner = dynamic(
  () => import("./MdxEditorInner").then((module) => module.MdxEditorInner),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[360px] items-center justify-center rounded-lg border border-input-border bg-background px-4 py-8 text-sm text-muted">
        Loading editor…
      </div>
    ),
  },
);

export type MdxEditorProps = MdxEditorInnerProps;

export function MdxEditor({ className, ...props }: MdxEditorProps) {
  return <MdxEditorInner className={cn(className)} {...props} />;
}
