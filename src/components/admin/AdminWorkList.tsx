"use client";

import { Check, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

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
          <AdminTable minWidth="640px">
            <AdminTableColGroup>
              <AdminTableCol className="w-16" />
              <AdminTableCol />
              <AdminTableCol className="w-20" />
              <AdminTableCol className="w-20" />
              <AdminTableCol className="w-32" />
              <AdminTableCol className="w-40" />
            </AdminTableColGroup>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>Cover</AdminTableHeaderCell>
                <AdminTableHeaderCell>Title</AdminTableHeaderCell>
                <AdminTableHeaderCell align="center">Featured</AdminTableHeaderCell>
                <AdminTableHeaderCell align="center">Hidden</AdminTableHeaderCell>
                <AdminTableHeaderCell>Categories</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {filteredWorks.map((work) => (
                <AdminTableRow key={work.id}>
                  <AdminTableCell className="w-16">
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
                  </AdminTableCell>
                  <AdminTableCell>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {work.title}
                      </p>
                      {work.subtitle ? (
                        <p className="truncate text-xs text-muted">
                          {work.subtitle}
                        </p>
                      ) : null}
                    </div>
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <StatusCheck active={work.featured} />
                  </AdminTableCell>
                  <AdminTableCell align="center">
                    <StatusCheck active={work.hidden} />
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className="truncate text-sm text-muted">
                      {formatCategories(work.categories)}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit ${work.title}`}
                        onClick={() => router.push(`/admin/work/${work.id}`)}
                        className="px-2"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 dark:text-red-400 px-2"
                        aria-label={`Delete ${work.title}`}
                        onClick={() => setDeleteModal({ open: true, work })}
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
        work={deleteModal.work}
        onClose={() => setDeleteModal({ open: false, work: null })}
      />
    </>
  );
}
