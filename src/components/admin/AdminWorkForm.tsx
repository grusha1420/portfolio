"use client";

import { TRPCClientError } from "@trpc/client";
import { Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import slugifyLib from "slugify";
import { useState } from "react";

import {
  ImageUploader,
  type ImageUploadValue,
} from "~/components/admin/ImageUploader";
import { MdxEditor } from "~/components/admin/MdxEditor";
import {
  SortableGalleryUploader,
  type GalleryItem,
} from "~/components/admin/SortableGalleryUploader";
import { Button, Input, Label, Modal, Textarea } from "~/components/ui";
import { cn } from "~/lib/cn";
import { shouldHydrateLoadedRecord } from "~/lib/hydrate-record";
import { api } from "~/trpc/react";

function generateSlug(title: string): string {
  return slugifyLib(title, { lower: true, strict: true, locale: "ru" });
}

function getTrpcErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function isValidYouTubeUrl(url: string): boolean {
  if (!url.trim()) return false;

  try {
    const parsed = new URL(url.trim());
    return /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)/.test(
      parsed.href,
    );
  } catch {
    return false;
  }
}

interface YoutubeEntry {
  id: string;
  url: string;
}

function createYoutubeEntry(url = ""): YoutubeEntry {
  return {
    id: crypto.randomUUID(),
    url,
  };
}

interface AdminWorkFormProps {
  workId?: string;
}

export function AdminWorkForm({ workId }: AdminWorkFormProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const isEdit = Boolean(workId);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverIsAnimated, setCoverIsAnimated] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryItem[]>([]);
  const [youtubeVideos, setYoutubeVideos] = useState<YoutubeEntry[]>([
    createYoutubeEntry(),
  ]);
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [featured, setFeatured] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [coverError, setCoverError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [ogUploading, setOgUploading] = useState(false);
  const [hydratedId, setHydratedId] = useState<string | null>(null);

  const isUploading = coverUploading || galleryUploading || ogUploading;

  const {
    data: work,
    isLoading,
    isError,
  } = api.works.getById.useQuery({ id: workId! }, { enabled: isEdit });

  const { data: categories = [] } = api.categories.listForAdmin.useQuery();

  if (work && shouldHydrateLoadedRecord(work.id, hydratedId)) {
    setHydratedId(work.id);
    setTitle(work.title);
    setSubtitle(work.subtitle ?? "");
    setSlug(work.slug);
    setSlugManuallyEdited(true);
    setCoverImageUrl(work.coverImageUrl);
    setCoverIsAnimated(work.coverIsAnimated);
    setGalleryImages(
      work.galleryImages.map((image) => ({
        url: image.url,
        alt: image.alt ?? undefined,
        isAnimated: image.isAnimated,
      })),
    );
    setYoutubeVideos(
      work.youtubeVideos.length > 0
        ? work.youtubeVideos.map((video) => createYoutubeEntry(video.url))
        : [createYoutubeEntry()],
    );
    setCategoryIds(work.categories.map((category) => category.id));
    setDescription(work.description);
    setFeatured(work.featured);
    setHidden(work.hidden);
    setMetaTitle(work.metaTitle ?? "");
    setMetaDescription(work.metaDescription ?? "");
    setOgImageUrl(work.ogImageUrl ?? "");
  }

  const createMutation = api.works.create.useMutation({
    onSuccess: async (created) => {
      await utils.works.listForAdmin.invalidate();
      router.push(`/admin/work/${created.id}`);
      router.refresh();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const updateMutation = api.works.update.useMutation({
    onSuccess: async () => {
      await utils.works.listForAdmin.invalidate();
      if (workId) {
        await utils.works.getById.invalidate({ id: workId });
      }
      router.refresh();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const deleteMutation = api.works.delete.useMutation({
    onSuccess: async () => {
      await utils.works.listForAdmin.invalidate();
      router.push("/admin/work");
      router.refresh();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleTitleChange = (value: string) => {
    setTitle(value);
    setTitleError(null);
    setFormError(null);

    if (!slugManuallyEdited) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(value);
    setFormError(null);
  };

  const handleCoverChange = (value: string | ImageUploadValue) => {
    if (typeof value === "string") {
      setCoverImageUrl(value);
      setCoverIsAnimated(false);
    } else {
      setCoverImageUrl(value.url);
      setCoverIsAnimated(Boolean(value.isAnimated));
    }
    setCoverError(null);
  };

  const handleCategoryToggle = (categoryId: string, checked: boolean) => {
    setCategoryIds((current) =>
      checked
        ? [...current, categoryId]
        : current.filter((id) => id !== categoryId),
    );
  };

  const handleYoutubeChange = (entryId: string, url: string) => {
    setYoutubeVideos((current) =>
      current.map((entry) =>
        entry.id === entryId ? { ...entry, url } : entry,
      ),
    );
    setFormError(null);
  };

  const handleAddYoutube = () => {
    setYoutubeVideos((current) => [...current, createYoutubeEntry()]);
  };

  const handleRemoveYoutube = (entryId: string) => {
    setYoutubeVideos((current) =>
      current.length > 1
        ? current.filter((entry) => entry.id !== entryId)
        : current,
    );
  };

  const buildPayload = () => {
    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    const trimmedCover = coverImageUrl.trim();

    const galleryPayload = galleryImages.map((image, index) => ({
      url: image.url,
      alt: image.alt,
      order: index,
      isAnimated: Boolean(image.isAnimated),
    }));

    const youtubePayload = youtubeVideos
      .map((entry, index) => ({
        url: entry.url.trim(),
        order: index,
      }))
      .filter((entry) => entry.url.length > 0);

    return {
      title: trimmedTitle,
      slug: trimmedSlug,
      subtitle: subtitle.trim() || undefined,
      description,
      coverImageUrl: trimmedCover,
      coverIsAnimated,
      featured,
      hidden,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      ogImageUrl: ogImageUrl.trim() || undefined,
      categoryIds,
      galleryImages: galleryPayload,
      youtubeVideos: youtubePayload,
    };
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    if (isUploading) {
      setFormError("Please wait for uploads to finish before saving.");
      return;
    }

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setTitleError("Title is required");
      return;
    }

    const trimmedSlug = slug.trim();
    if (!trimmedSlug) {
      setFormError("Slug is required");
      return;
    }

    const trimmedCover = coverImageUrl.trim();
    if (!trimmedCover) {
      setCoverError("Cover image is required");
      return;
    }

    const invalidYoutube = youtubeVideos.find(
      (entry) => entry.url.trim() && !isValidYouTubeUrl(entry.url),
    );

    if (invalidYoutube) {
      setFormError("One or more YouTube URLs are invalid.");
      return;
    }

    const payload = buildPayload();

    if (isEdit && workId) {
      updateMutation.mutate({ id: workId, ...payload });
      return;
    }

    createMutation.mutate(payload);
  };

  if (isEdit && isLoading) {
    return (
      <p className="text-muted py-16 text-center text-sm">Loading work…</p>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-muted text-sm">Unable to load this work.</p>
        <Link
          href="/admin/work"
          className="border-border text-foreground hover:bg-foreground/5 inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors"
        >
          Back to Works
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/work"
            className="border-border text-foreground hover:bg-foreground/5 inline-flex h-9 items-center justify-center rounded-full border px-4 text-sm font-medium transition-colors"
          >
            ← Back to Works
          </Link>

          {isEdit ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Work
            </Button>
          ) : null}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">Basic</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="work-title" required>
                Title
              </Label>
              <Input
                id="work-title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Work title"
                aria-invalid={Boolean(titleError)}
              />
              {titleError ? (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {titleError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="work-slug" required>
                Slug
              </Label>
              <Input
                id="work-slug"
                value={slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="work-slug"
              />
              <p className="text-muted text-xs">
                Auto-generated from title. Edit to customize.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="work-subtitle">Subtitle</Label>
            <Input
              id="work-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Optional subtitle"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">Media</h2>

          <ImageUploader
            label="Cover image"
            value={
              coverImageUrl
                ? { url: coverImageUrl, isAnimated: coverIsAnimated }
                : ""
            }
            onChange={handleCoverChange}
            onUploadingChange={setCoverUploading}
          />
          {coverError ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              {coverError}
            </p>
          ) : null}

          <SortableGalleryUploader
            value={galleryImages}
            onChange={setGalleryImages}
            onUploadingChange={setGalleryUploading}
          />
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-foreground text-base font-semibold">Videos</h2>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddYoutube}
            >
              <Plus className="size-4" />
              Add video
            </Button>
          </div>

          <div className="flex flex-col gap-3">
            {youtubeVideos.map((entry, index) => (
              <div key={entry.id} className="flex items-start gap-3">
                <span className="text-muted mt-2.5 w-6 shrink-0 text-sm">
                  {index + 1}.
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Input
                    value={entry.url}
                    onChange={(event) =>
                      handleYoutubeChange(entry.id, event.target.value)
                    }
                    placeholder="https://www.youtube.com/watch?v=..."
                    aria-invalid={
                      entry.url.trim().length > 0 &&
                      !isValidYouTubeUrl(entry.url)
                    }
                  />
                  {entry.url.trim() && !isValidYouTubeUrl(entry.url) ? (
                    <p className="text-xs text-red-600 dark:text-red-400">
                      Must be a valid YouTube URL
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label="Remove video"
                  onClick={() => handleRemoveYoutube(entry.id)}
                  disabled={youtubeVideos.length === 1}
                  className="text-muted mt-0.5 hover:text-red-600"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">
            Categories
          </h2>

          {categories.length === 0 ? (
            <p className="text-muted text-sm">
              No categories yet.{" "}
              <Link
                href="/admin/work/categories"
                className="text-accent hover:underline"
              >
                Create categories
              </Link>{" "}
              first.
            </p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="border-border flex items-center gap-3 rounded-lg border px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={categoryIds.includes(category.id)}
                    onChange={(event) =>
                      handleCategoryToggle(category.id, event.target.checked)
                    }
                    className="border-input-border text-accent focus:ring-accent/20 size-4 rounded"
                  />
                  <span className="text-foreground text-sm">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">
            Description
          </h2>
          <MdxEditor
            key={workId ?? "new"}
            value={description}
            onChange={setDescription}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">
            Publishing
          </h2>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={featured}
              onChange={(event) => setFeatured(event.target.checked)}
              className="border-input-border text-accent focus:ring-accent/20 mt-1 size-4 rounded"
            />
            <span className="flex flex-col gap-1">
              <span className="text-foreground text-sm font-medium">
                Featured
              </span>
              <span className="text-muted text-xs">
                Featured works appear on the homepage when also published.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(event) => setHidden(event.target.checked)}
              className="border-input-border text-accent focus:ring-accent/20 mt-1 size-4 rounded"
            />
            <span className="flex flex-col gap-1">
              <span className="text-foreground text-sm font-medium">
                Hidden
              </span>
              <span className="text-muted text-xs">
                Hidden works are only accessible via direct link. Defaults to
                hidden on create.
              </span>
            </span>
          </label>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-foreground text-base font-semibold">SEO</h2>

          <div className="flex flex-col gap-2">
            <Label htmlFor="work-meta-title">Meta title</Label>
            <Input
              id="work-meta-title"
              value={metaTitle}
              onChange={(event) => setMetaTitle(event.target.value)}
              placeholder="Optional SEO title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="work-meta-description">Meta description</Label>
            <Textarea
              id="work-meta-description"
              value={metaDescription}
              onChange={(event) => setMetaDescription(event.target.value)}
              placeholder="Optional SEO description"
              rows={3}
            />
          </div>

          <ImageUploader
            label="OG image"
            value={ogImageUrl}
            onChange={(value) =>
              setOgImageUrl(typeof value === "string" ? value : value.url)
            }
            onUploadingChange={setOgUploading}
          />
        </section>

        {formError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
        ) : null}

        <div className="border-border flex justify-end gap-3 border-t pt-4">
          <Link
            href="/admin/work"
            aria-disabled={isSaving || isUploading}
            className={cn(
              "border-border text-foreground hover:bg-foreground/5 inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium transition-colors",
              (isSaving || isUploading) && "pointer-events-none opacity-50",
            )}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSaving || isUploading}>
            {isUploading
              ? "Uploading..."
              : isSaving
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Work"}
          </Button>
        </div>
      </form>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Work"
      >
        <div className="flex flex-col gap-4">
          <p className="text-muted text-sm">
            Delete{" "}
            <span className="text-foreground font-medium">
              {title || "this work"}
            </span>
            ? This action cannot be undone.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleteMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => workId && deleteMutation.mutate({ id: workId })}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
