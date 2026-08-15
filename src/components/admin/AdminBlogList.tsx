"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Modal } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type BlogPost = RouterOutputs["blog"]["listForAdmin"][number];

function formatUpdatedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

interface DeleteConfirmModalProps {
  open: boolean;
  post: BlogPost | null;
  onClose: () => void;
}

function DeleteConfirmModal({ open, post, onClose }: DeleteConfirmModalProps) {
  const utils = api.useUtils();
  const [error, setError] = useState<string | null>(null);

  const deleteMutation = api.blog.delete.useMutation({
    onSuccess: async () => {
      await utils.blog.listForAdmin.invalidate();
      onClose();
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const handleDelete = () => {
    if (!post) return;
    setError(null);
    deleteMutation.mutate({ id: post.id });
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Post">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Delete{" "}
          <span className="font-medium text-foreground">
            {post?.title ?? "this post"}
          </span>
          ? This action cannot be undone.
        </p>

        {post?.isMain ? (
          <p className="text-sm text-amber-700 dark:text-amber-300">
            This is the main About page post. The About page will show an empty
            state until another post is marked as main.
          </p>
        ) : null}

        {error ? (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={deleteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/30"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

function StatusCheck({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex size-5 items-center justify-center rounded-full border",
        active
          ? "border-accent bg-accent/10 text-accent"
          : "border-border text-transparent",
      )}
      aria-hidden={!active}
    >
      <Check className="size-3.5" />
      <span className="sr-only">{active ? "Yes" : "No"}</span>
    </span>
  );
}

export function AdminBlogList() {
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    post: BlogPost | null;
  }>({ open: false, post: null });

  const {
    data: posts = [],
    isLoading,
    isError,
  } = api.blog.listForAdmin.useQuery();

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading posts…</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Unable to load posts. Please try again later.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button onClick={() => router.push("/admin/blog/new")}>New Post</Button>
        </div>

        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">No posts yet</p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden border-b border-border px-6 py-3 lg:grid lg:grid-cols-[minmax(0,2fr)_auto_auto_minmax(0,1fr)_auto] lg:gap-4">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Title
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Main
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Hidden
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Updated
              </span>
              <span className="text-right text-xs font-medium uppercase tracking-wide text-muted">
                Actions
              </span>
            </div>

            {posts.map((post) => (
              <div
                key={post.id}
                className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 lg:grid-cols-[minmax(0,2fr)_auto_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 lg:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {post.title}
                  </p>
                  {post.subtitle ? (
                    <p className="truncate text-xs text-muted">{post.subtitle}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 lg:justify-center">
                  <span className="text-xs text-muted lg:hidden">Main</span>
                  <StatusCheck active={post.isMain} />
                </div>

                <div className="flex items-center gap-2 lg:justify-center">
                  <span className="text-xs text-muted lg:hidden">Hidden</span>
                  <StatusCheck active={post.hidden} />
                </div>

                <span className="text-sm text-muted">
                  <span className="lg:hidden">Updated: </span>
                  {formatUpdatedAt(post.updatedAt)}
                </span>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${post.title}`}
                    onClick={() => router.push(`/admin/blog/${post.id}`)}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only lg:not-sr-only">Edit</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                    aria-label={`Delete ${post.title}`}
                    onClick={() => setDeleteModal({ open: true, post })}
                  >
                    <Trash2 className="size-4" />
                    <span className="sr-only lg:not-sr-only">Delete</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        open={deleteModal.open}
        post={deleteModal.post}
        onClose={() => setDeleteModal({ open: false, post: null })}
      />
    </>
  );
}
