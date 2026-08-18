import Link from "next/link";

import { MediaImage } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api } from "~/trpc/server";

import {
  ABOUT_PREVIEW_PLACEHOLDERS,
  type AboutPreviewContent,
} from "./about-preview-constants";

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function resolveAboutContent(
  about: Awaited<ReturnType<typeof api.content.getAboutPreview>>,
): AboutPreviewContent {
  if (!about) {
    return {
      title: ABOUT_PREVIEW_PLACEHOLDERS.title,
      text: ABOUT_PREVIEW_PLACEHOLDERS.text,
      imageUrl: null,
    };
  }

  return {
    title: nonEmpty(about.aboutPreviewTitle) ?? ABOUT_PREVIEW_PLACEHOLDERS.title,
    text: nonEmpty(about.aboutPreviewText) ?? ABOUT_PREVIEW_PLACEHOLDERS.text,
    imageUrl: nonEmpty(about.aboutPreviewImageUrl),
  };
}

export async function AboutPreview() {
  const about = await api.content.getAboutPreview();
  const content = resolveAboutContent(about);
  const hasImage = Boolean(content.imageUrl);

  return (
    <section id="about" className="bg-segment-default text-foreground">
      <div className="container-content py-16 md:py-24">
        <div
          className={cn(
            "grid gap-10 md:gap-16",
            hasImage && "md:grid-cols-2 md:items-center",
          )}
        >
          <div className="flex max-w-3xl flex-col gap-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              02 — About
            </p>

            <div className="flex flex-col gap-4">
              <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
                {content.title}
              </h2>
              <p className="text-base leading-relaxed md:text-lg">
                {content.text}
              </p>
            </div>

            <Link
              href="/about"
              className={cn(
                "inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-colors",
                "bg-accent text-accent-foreground hover:bg-accent/90",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              Learn more
            </Link>
          </div>

          {hasImage && content.imageUrl ? (
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-card">
              <MediaImage
                src={content.imageUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
