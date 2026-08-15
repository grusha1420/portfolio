"use client";

import { TRPCClientError } from "@trpc/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import slugifyLib from "slugify";
import { useEffect, useState } from "react";

import { ImageUploader } from "~/components/admin/ImageUploader";
import { MdxEditor } from "~/components/admin/MdxEditor";
import { Button, Input, Label, Modal, Textarea } from "~/components/ui";
import { cn } from "~/lib/cn";
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

interface AdminBlogFormProps {
  postId?: string;
}

export function AdminBlogForm({ postId }: AdminBlogFormProps) {
  const router = useRouter();
  const utils = api.useUtils();
  const isEdit = Boolean(postId);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [isMain, setIsMain] = useState(false);
  const [hidden, setHidden] = useState(true);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [ogImageUrl, setOgImageUrl] = useState("");
  const [titleError, setTitleError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showHiddenWarning, setShowHiddenWarning] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = api.blog.getById.useQuery(
    { id: postId! },
    { enabled: isEdit },
  );

  useEffect(() => {
    if (!post) return;

    setTitle(post.title);
    setSubtitle(post.subtitle ?? "");
    setSlug(post.slug);
    setSlugManuallyEdited(true);
    setCoverImageUrl(post.coverImageUrl ?? "");
    setContent(post.content);
    setIsMain(post.isMain);
    setHidden(post.hidden);
    setMetaTitle(post.metaTitle ?? "");
    setMetaDescription(post.metaDescription ?? "");
    setOgImageUrl(post.ogImageUrl ?? "");
  }, [post]);

  const createMutation = api.blog.create.useMutation({
    onSuccess: async (created) => {
      await utils.blog.listForAdmin.invalidate();
      if (created) {
        router.push(`/admin/blog/${created.id}`);
      } else {
        router.push("/admin/blog");
      }
      router.refresh();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const updateMutation = api.blog.update.useMutation({
    onSuccess: async () => {
      await utils.blog.listForAdmin.invalidate();
      if (postId) {
        await utils.blog.getById.invalidate({ id: postId });
      }
      router.refresh();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const deleteMutation = api.blog.delete.useMutation({
    onSuccess: async () => {
      await utils.blog.listForAdmin.invalidate();
      router.push("/admin/blog");
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

  const handleHiddenChange = (checked: boolean) => {
    setHidden(checked);
    if (checked && isMain) {
      setShowHiddenWarning(true);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

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

    const payload = {
      title: trimmedTitle,
      slug: trimmedSlug,
      subtitle: subtitle.trim() || undefined,
      coverImageUrl: coverImageUrl.trim() || undefined,
      content,
      isMain,
      hidden,
      metaTitle: metaTitle.trim() || undefined,
      metaDescription: metaDescription.trim() || undefined,
      ogImageUrl: ogImageUrl.trim() || undefined,
    };

    if (isEdit && postId) {
      updateMutation.mutate({ id: postId, ...payload });
      return;
    }

    createMutation.mutate(payload);
  };

  if (isEdit && isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading post…</p>
    );
  }

  if (isEdit && isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <p className="text-sm text-muted">Unable to load this post.</p>
        <Link
          href="/admin/blog"
          className="inline-flex h-9 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/blog"
            className="inline-flex h-9 items-center justify-center rounded-full border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            ← Back to Blog
          </Link>

          {isEdit ? (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete Post
            </Button>
          ) : null}
        </div>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Basic</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="blog-title" required>
                Title
              </Label>
              <Input
                id="blog-title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="Post title"
                aria-invalid={Boolean(titleError)}
              />
              {titleError ? (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {titleError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="blog-slug" required>
                Slug
              </Label>
              <Input
                id="blog-slug"
                value={slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="post-slug"
              />
              <p className="text-xs text-muted">
                Auto-generated from title. Edit to customize.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="blog-subtitle">Subtitle</Label>
            <Input
              id="blog-subtitle"
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Optional subtitle"
            />
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Cover</h2>
          <ImageUploader
            label="Cover image"
            value={coverImageUrl}
            onChange={(value) =>
              setCoverImageUrl(typeof value === "string" ? value : value.url)
            }
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Content</h2>
          <MdxEditor
            key={postId ?? "new"}
            value={content}
            onChange={setContent}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">Publishing</h2>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={isMain}
              onChange={(event) => setIsMain(event.target.checked)}
              className="mt-1 size-4 rounded border-input-border text-accent focus:ring-accent/20"
            />
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">
                Main About page post
              </span>
              <span className="text-xs text-muted">
                Only one post can be main. Checking this will unmark any other
                main post.
              </span>
            </span>
          </label>

          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={hidden}
              onChange={(event) => handleHiddenChange(event.target.checked)}
              className="mt-1 size-4 rounded border-input-border text-accent focus:ring-accent/20"
            />
            <span className="flex flex-col gap-1">
              <span className="text-sm font-medium text-foreground">Hidden</span>
              <span className="text-xs text-muted">
                Hidden posts are only accessible via direct link. Defaults to
                hidden on create.
              </span>
            </span>
          </label>

          {showHiddenWarning && hidden && isMain ? (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
              This post is marked as main but hidden. The About page will not
              show it publicly until hidden is unchecked.
            </p>
          ) : null}
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-base font-semibold text-foreground">SEO</h2>

          <div className="flex flex-col gap-2">
            <Label htmlFor="blog-meta-title">Meta title</Label>
            <Input
              id="blog-meta-title"
              value={metaTitle}
              onChange={(event) => setMetaTitle(event.target.value)}
              placeholder="Optional SEO title"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="blog-meta-description">Meta description</Label>
            <Textarea
              id="blog-meta-description"
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
          />
        </section>

        {formError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
        ) : null}

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Link
            href="/admin/blog"
            aria-disabled={isSaving}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-full border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5",
              isSaving && "pointer-events-none opacity-50",
            )}
          >
            Cancel
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : isEdit ? "Save Changes" : "Create Post"}
          </Button>
        </div>
      </form>

      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Post"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-muted">
            Delete{" "}
            <span className="font-medium text-foreground">
              {title || "this post"}
            </span>
            ? This action cannot be undone.
          </p>

          {isMain ? (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              This is the main About page post. The About page will show an
              empty state until another post is marked as main.
            </p>
          ) : null}

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
              onClick={() => postId && deleteMutation.mutate({ id: postId })}
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
