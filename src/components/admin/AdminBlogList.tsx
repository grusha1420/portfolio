"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

interface SortablePostRowProps {
  post: BlogPost;
  onEdit: (post: BlogPost) => void;
  onDelete: (post: BlogPost) => void;
}

function SortablePostRow({ post, onEdit, onDelete }: SortablePostRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: post.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <AdminTableRow
      ref={setNodeRef}
      style={style}
      className={cn(isDragging && "relative z-10 bg-card shadow-lg")}
    >
      <AdminTableCell className="w-12 px-3">
        <button
          type="button"
          className="flex size-9 shrink-0 cursor-grab items-center justify-center rounded-md text-muted hover:bg-muted/10 active:cursor-grabbing"
          aria-label={`Reorder ${post.title}`}
          {...attributes}
          {...listeners}
        >
          <GripVertical className="size-4" />
        </button>
      </AdminTableCell>
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
            onClick={() => onEdit(post)}
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
            onClick={() => onDelete(post)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </AdminTableCell>
    </AdminTableRow>
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
  const utils = api.useUtils();
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    post: BlogPost | null;
  }>({ open: false, post: null });
  const [orderedPosts, setOrderedPosts] = useState<BlogPost[]>([]);

  const {
    data: posts,
    isLoading,
    isError,
  } = api.blog.listForAdmin.useQuery();

  useEffect(() => {
    if (posts === undefined) return;
    setOrderedPosts(posts);
  }, [posts]);

  const reorderMutation = api.blog.reorder.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.blog.listForAdmin.invalidate(),
        utils.blog.listPublic.invalidate(),
      ]);
    },
    onError: async () => {
      if (posts) {
        setOrderedPosts(posts);
      }
      await utils.blog.listForAdmin.invalidate();
    },
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = orderedPosts.findIndex((post) => post.id === active.id);
    const newIndex = orderedPosts.findIndex((post) => post.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reordered = arrayMove(orderedPosts, oldIndex, newIndex);
    setOrderedPosts(reordered);

    reorderMutation.mutate({
      items: reordered.map((post, index) => ({
        id: post.id,
        order: index,
      })),
    });
  };

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Drag rows to reorder. Order is reflected on the public site
            immediately. New posts appear at the bottom.
          </p>
          <Button
            onClick={() => router.push("/admin/blog/new")}
            className="shrink-0"
          >
            New Post
          </Button>
        </div>

        {orderedPosts.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">No posts yet</p>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <AdminTable minWidth="720px">
              <AdminTableColGroup>
                <AdminTableCol className="w-12" />
                <AdminTableCol />
                <AdminTableCol className="w-20" />
                <AdminTableCol className="w-20" />
                <AdminTableCol className="w-44" />
                <AdminTableCol className="w-40" />
              </AdminTableColGroup>
              <AdminTableHead>
                <AdminTableRow>
                  <AdminTableHeaderCell className="px-3">
                    <span className="sr-only">Reorder</span>
                  </AdminTableHeaderCell>
                  <AdminTableHeaderCell>Title</AdminTableHeaderCell>
                  <AdminTableHeaderCell align="center">Main</AdminTableHeaderCell>
                  <AdminTableHeaderCell align="center">Hidden</AdminTableHeaderCell>
                  <AdminTableHeaderCell>Updated</AdminTableHeaderCell>
                  <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
                </AdminTableRow>
              </AdminTableHead>
              <AdminTableBody>
                <SortableContext
                  items={orderedPosts.map((post) => post.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {orderedPosts.map((post) => (
                    <SortablePostRow
                      key={post.id}
                      post={post}
                      onEdit={(item) => router.push(`/admin/blog/${item.id}`)}
                      onDelete={(item) =>
                        setDeleteModal({ open: true, post: item })
                      }
                    />
                  ))}
                </SortableContext>
              </AdminTableBody>
            </AdminTable>
          </DndContext>
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
