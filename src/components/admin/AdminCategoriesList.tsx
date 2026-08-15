"use client";

import { TRPCClientError } from "@trpc/client";
import { Pencil, Trash2 } from "lucide-react";
import slugifyLib from "slugify";
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
import { Button, Input, Label, Modal } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type Category = RouterOutputs["categories"]["listForAdmin"][number];

function generateSlug(name: string): string {
  return slugifyLib(name, { lower: true, strict: true, locale: "ru" });
}

function getTrpcErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

interface CategoryFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  category: Category | null;
  onClose: () => void;
  onSaved: () => void;
}

function CategoryFormModal({
  open,
  mode,
  category,
  onClose,
  onSaved,
}: CategoryFormModalProps) {
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && category) {
      setName(category.name);
      setSlug(category.slug);
      setSlugManuallyEdited(true);
    } else {
      setName("");
      setSlug("");
      setSlugManuallyEdited(false);
    }

    setNameError(null);
    setFormError(null);
  }, [open, mode, category]);

  const createMutation = api.categories.create.useMutation({
    onSuccess: async () => {
      await utils.categories.listForAdmin.invalidate();
      onSaved();
      onClose();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const updateMutation = api.categories.update.useMutation({
    onSuccess: async () => {
      await utils.categories.listForAdmin.invalidate();
      onSaved();
      onClose();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleNameChange = (value: string) => {
    setName(value);
    setNameError(null);
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Name is required");
      return;
    }

    const trimmedSlug = slug.trim();
    const payload = {
      name: trimmedName,
      slug: trimmedSlug || undefined,
    };

    if (mode === "edit" && category) {
      updateMutation.mutate({ id: category.id, ...payload });
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Category" : "Edit Category"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category-name" required>
            Name
          </Label>
          <Input
            id="category-name"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="Category name"
            aria-invalid={Boolean(nameError)}
            autoFocus
          />
          {nameError ? (
            <p className="text-sm text-red-600 dark:text-red-400">{nameError}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category-slug">Slug</Label>
          <Input
            id="category-slug"
            value={slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            placeholder="category-slug"
          />
          <p className="text-xs text-muted">
            Auto-generated from name. Edit to customize.
          </p>
        </div>

        {formError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface DeleteConfirmModalProps {
  open: boolean;
  category: Category | null;
  onClose: () => void;
  onDeleted: () => void;
}

function DeleteConfirmModal({
  open,
  category,
  onClose,
  onDeleted,
}: DeleteConfirmModalProps) {
  const utils = api.useUtils();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormError(null);
    }
  }, [open]);

  const deleteMutation = api.categories.delete.useMutation({
    onSuccess: async () => {
      await utils.categories.listForAdmin.invalidate();
      onDeleted();
      onClose();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const handleDelete = () => {
    if (!category) return;
    deleteMutation.mutate({ id: category.id });
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Category">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Delete{" "}
          <span className="font-medium text-foreground">
            {category?.name ?? "this category"}
          </span>
          ? This action cannot be undone.
        </p>

        {category && category.workCount > 0 ? (
          <p className="text-sm text-red-600 dark:text-red-400">
            This category is assigned to {category.workCount}{" "}
            {category.workCount === 1 ? "work" : "works"} and cannot be deleted.
          </p>
        ) : null}

        {formError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
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
            disabled={
              deleteMutation.isPending || !category || category.workCount > 0
            }
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function AdminCategoriesList() {
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    category: Category | null;
  }>({ open: false, mode: "create", category: null });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    category: Category | null;
  }>({ open: false, category: null });

  const {
    data: categories = [],
    isLoading,
    isError,
  } = api.categories.listForAdmin.useQuery();

  const openCreate = () => {
    setFormModal({ open: true, mode: "create", category: null });
  };

  const openEdit = (category: Category) => {
    setFormModal({ open: true, mode: "edit", category });
  };

  const openDelete = (category: Category) => {
    setDeleteModal({ open: true, category });
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading categories…</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Unable to load categories. Please try again later.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button onClick={openCreate}>Add Category</Button>
        </div>

        {categories.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted">No categories yet</p>
        ) : (
          <AdminTable minWidth="640px">
            <AdminTableColGroup>
              <AdminTableCol />
              <AdminTableCol />
              <AdminTableCol className="w-20" />
              <AdminTableCol className="w-40" />
            </AdminTableColGroup>
            <AdminTableHead>
              <AdminTableRow>
                <AdminTableHeaderCell>Name</AdminTableHeaderCell>
                <AdminTableHeaderCell>Slug</AdminTableHeaderCell>
                <AdminTableHeaderCell>Works</AdminTableHeaderCell>
                <AdminTableHeaderCell align="right">Actions</AdminTableHeaderCell>
              </AdminTableRow>
            </AdminTableHead>
            <AdminTableBody>
              {categories.map((category) => (
                <AdminTableRow key={category.id}>
                  <AdminTableCell>
                    <span className="truncate text-sm font-medium text-foreground">
                      {category.name}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className="truncate font-mono text-sm text-muted">
                      {category.slug}
                    </span>
                  </AdminTableCell>
                  <AdminTableCell>
                    <span className="text-sm text-muted">{category.workCount}</span>
                  </AdminTableCell>
                  <AdminTableCell align="right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Edit ${category.name}`}
                        onClick={() => openEdit(category)}
                        className="px-2"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={cn(
                          category.workCount > 0
                            ? "text-muted"
                            : "text-red-600 hover:text-red-700 dark:text-red-400",
                          "px-2"
                        )}
                        aria-label={`Delete ${category.name}`}
                        onClick={() => openDelete(category)}
                        disabled={category.workCount > 0}
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

      <CategoryFormModal
        open={formModal.open}
        mode={formModal.mode}
        category={formModal.category}
        onClose={() =>
          setFormModal((current) => ({ ...current, open: false }))
        }
        onSaved={() => undefined}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        category={deleteModal.category}
        onClose={() => setDeleteModal({ open: false, category: null })}
        onDeleted={() => undefined}
      />
    </>
  );
}
