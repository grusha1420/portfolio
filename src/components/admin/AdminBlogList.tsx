"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  AdminTable,
  AdminTableBody,
  AdminTableCell,
  AdminTableCol,
  AdminTableColGroup,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableRow,
} from "~/components/admin/admin-table";
import { Button, Modal } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type BlogPost = RouterOutputs["blog"]["listForAdmin"][number];

function formatUpdatedAt(date: Date): string {
  return new Intl.DateTimeFormat("en-UK", {
    year: "numeric",
    month: "numeric",
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
          <AdminTable minWidth="640px">
            <AdminTableColGroup>
              <AdminTableCol />
              <AdminTableCol className="w-20" />
              <AdminTableCol className="w-20" />
              <AdminTableCol className="w-44" />
              <AdminTableCol className="w-40" />
            </AdminTableColGroup>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>Title</AdminTableHeaderCell>
                <AdminTableHeaderCell align="center">Main</AdminTableHeaderCell>
                <AdminTableHeaderCell align="center">Hidden</AdminTableHeaderCell>
                <AdminTableHeaderCell>Updated</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {posts.map((post) => (
                <AdminTableRow key={post.id}>
                  <AdminTableCell>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {post.title}
                      </p>
                      {post.subtitle ? (
                        <p className="truncate text-xs text-muted">{post.subtitle}</p>
                      ) : null}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <StatusCheck active={post.isMain} />
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <StatusCheck active={post.hidden} />
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className="text-sm text-muted">
                      {formatUpdatedAt(post.updatedAt)}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit ${post.title}`}
                        onClick={() => router.push(`/admin/blog/${post.id}`)}
                        className="px-2"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 px-2"
                        aria-label={`Delete ${post.title}`}
                        onClick={() => setDeleteModal({ open: true, post })}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </AdminTableCell>
                </AdminTableRow>
              ))}
            </AdminTableBody>
          </AdminTable>
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
