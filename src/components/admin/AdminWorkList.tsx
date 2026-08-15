"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { Button, Modal } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type Work = RouterOutputs["works"]["listForAdmin"][number];

type WorkFilter = "all" | "hidden" | "published";

function formatCategories(categories: Work["categories"]): string {
  if (categories.length === 0) {
    return "—";
  }

  return categories.map((category) => category.name).join(", ");
}

interface DeleteConfirmModalProps {
  open: boolean;
  work: Work | null;
  onClose: () => void;
}

function DeleteConfirmModal({ open, work, onClose }: DeleteConfirmModalProps) {
  const utils = api.useUtils();
  const [error, setError] = useState<string | null>(null);

  const deleteMutation = api.works.delete.useMutation({
    onSuccess: async () => {
      await utils.works.listForAdmin.invalidate();
      onClose();
    },
    onError: (mutationError) => {
      setError(mutationError.message);
    },
  });

  const handleDelete = () => {
    if (!work) return;
    setError(null);
    deleteMutation.mutate({ id: work.id });
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Work">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Delete{" "}
          <span className="font-medium text-foreground">
            {work?.title ?? "this work"}
          </span>
          ? This action cannot be undone.
        </p>

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

const FILTER_OPTIONS: { value: WorkFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "hidden", label: "Hidden" },
];

export function AdminWorkList() {
  const router = useRouter();
  const [filter, setFilter] = useState<WorkFilter>("all");
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    work: Work | null;
  }>({ open: false, work: null });

  const {
    data: works = [],
    isLoading,
    isError,
  } = api.works.listForAdmin.useQuery();

  const filteredWorks = useMemo(() => {
    if (filter === "hidden") {
      return works.filter((work) => work.hidden);
    }

    if (filter === "published") {
      return works.filter((work) => !work.hidden);
    }

    return works;
  }, [filter, works]);

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading works…</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Unable to load works. Please try again later.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/admin/work/categories"
            className="text-sm font-medium text-accent hover:underline"
          >
            Manage Categories →
          </Link>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="inline-flex rounded-full border border-border p-1"
              role="group"
              aria-label="Filter works"
            >
              {FILTER_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    filter === option.value
                      ? "bg-accent text-white"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <Button onClick={() => router.push("/admin/work/new")}>
              New Work
            </Button>
          </div>
        </div>

        {filteredWorks.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">
            {works.length === 0 ? "No works yet" : "No works match this filter"}
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden border-b border-border px-6 py-3 lg:grid lg:grid-cols-[auto_minmax(0,2fr)_auto_auto_minmax(0,1fr)_auto] lg:gap-4">
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Cover
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Title
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Featured
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Hidden
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Categories
              </span>
              <span className="text-right text-xs font-medium uppercase tracking-wide text-muted">
                Actions
              </span>
            </div>

            {filteredWorks.map((work) => (
              <div
                key={work.id}
                className="grid gap-3 border-b border-border px-4 py-4 last:border-b-0 lg:grid-cols-[auto_minmax(0,2fr)_auto_auto_minmax(0,1fr)_auto] lg:items-center lg:gap-4 lg:px-6"
              >
                <div className="size-12 overflow-hidden rounded-lg border border-border bg-background">
                  {work.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={work.coverImageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-xs text-muted">
                      —
                    </div>
                  )}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {work.title}
                  </p>
                  {work.subtitle ? (
                    <p className="truncate text-xs text-muted">{work.subtitle}</p>
                  ) : null}
                </div>

                <div className="flex items-center gap-2 lg:justify-center">
                  <span className="text-xs text-muted lg:hidden">Featured</span>
                  <StatusCheck active={work.featured} />
                </div>

                <div className="flex items-center gap-2 lg:justify-center">
                  <span className="text-xs text-muted lg:hidden">Hidden</span>
                  <StatusCheck active={work.hidden} />
                </div>

                <span className="truncate text-sm text-muted">
                  <span className="lg:hidden">Categories: </span>
                  {formatCategories(work.categories)}
                </span>

                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    aria-label={`Edit ${work.title}`}
                    onClick={() => router.push(`/admin/work/${work.id}`)}
                  >
                    <Pencil className="size-4" />
                    <span className="sr-only lg:not-sr-only">Edit</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 dark:text-red-400"
                    aria-label={`Delete ${work.title}`}
                    onClick={() => setDeleteModal({ open: true, work })}
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
        work={deleteModal.work}
        onClose={() => setDeleteModal({ open: false, work: null })}
      />
    </>
  );
}
