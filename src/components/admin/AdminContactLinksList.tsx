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
import { TRPCClientError } from "@trpc/client";
import { GripVertical, Link as LinkIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { ImageUploader } from "~/components/admin/ImageUploader";
import { Button, Input, Label, Modal } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type ContactLink = RouterOutputs["contact"]["getLinks"][number];

const LINK_PRESETS = [
  { label: "Telegram", url: "https://t.me/" },
  { label: "WhatsApp", url: "https://wa.me/" },
] as const;

function getTrpcErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function getIconUrl(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

interface LinkIconPreviewProps {
  iconUrl: string | null;
  label: string;
  size?: "sm" | "md";
}

function LinkIconPreview({ iconUrl, label: _label, size = "sm" }: LinkIconPreviewProps) {
  const dimension = size === "sm" ? 20 : 32;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-md border border-border bg-background",
        size === "sm" ? "size-9" : "size-12",
      )}
    >
      {iconUrl ? (
        <Image
          src={iconUrl}
          alt=""
          width={dimension}
          height={dimension}
          className="object-contain"
          style={{ width: dimension, height: dimension }}
          aria-hidden
        />
      ) : (
        <LinkIcon
          className={cn("text-muted", size === "sm" ? "size-4" : "size-5")}
          aria-hidden
        />
      )}
    </div>
  );
}

interface LinkFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  link: ContactLink | null;
  nextOrder: number;
  onClose: () => void;
}

function LinkFormModal({
  open,
  mode,
  link,
  nextOrder,
  onClose,
}: LinkFormModalProps) {
  const utils = api.useUtils();
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [iconUrl, setIconUrl] = useState("");
  const [labelError, setLabelError] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [iconUrlError, setIconUrlError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isUploadingIcon, setIsUploadingIcon] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && link) {
      setLabel(link.label);
      setUrl(link.url);
      setIconUrl(link.iconUrl ?? "");
    } else {
      setLabel("");
      setUrl("");
      setIconUrl("");
    }

    setLabelError(null);
    setUrlError(null);
    setIconUrlError(null);
    setFormError(null);
  }, [open, mode, link]);

  const createMutation = api.contact.createLink.useMutation({
    onSuccess: async () => {
      await utils.contact.getLinks.invalidate();
      onClose();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const updateMutation = api.contact.updateLink.useMutation({
    onSuccess: async () => {
      await utils.contact.getLinks.invalidate();
      onClose();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const applyPreset = (preset: (typeof LINK_PRESETS)[number]) => {
    setLabel(preset.label);
    setUrl(preset.url);
    setLabelError(null);
    setUrlError(null);
    setFormError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    setLabelError(null);
    setUrlError(null);
    setIconUrlError(null);

    const trimmedLabel = label.trim();
    const trimmedUrl = url.trim();
    const resolvedIconUrl = getIconUrl(iconUrl);

    let hasError = false;

    if (!trimmedLabel) {
      setLabelError("Label is required");
      hasError = true;
    }

    if (!trimmedUrl) {
      setUrlError("URL is required");
      hasError = true;
    } else if (!isValidHttpUrl(trimmedUrl)) {
      setUrlError("Enter a valid URL including https://");
      hasError = true;
    }

    if (resolvedIconUrl && !isValidHttpUrl(resolvedIconUrl)) {
      setIconUrlError("Enter a valid icon URL including https://");
      hasError = true;
    }

    if (hasError || isUploadingIcon) {
      return;
    }

    if (mode === "edit" && link) {
      updateMutation.mutate({
        id: link.id,
        label: trimmedLabel,
        url: trimmedUrl,
        iconUrl: resolvedIconUrl,
      });
      return;
    }

    createMutation.mutate({
      label: trimmedLabel,
      url: trimmedUrl,
      iconUrl: resolvedIconUrl ?? undefined,
      order: nextOrder,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Add Link" : "Edit Link"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {mode === "create" ? (
          <div className="flex flex-wrap gap-2">
            {LINK_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => applyPreset(preset)}
              >
                {preset.label} template
              </Button>
            ))}
          </div>
        ) : null}

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-link-label" required>
            Label
          </Label>
          <Input
            id="contact-link-label"
            value={label}
            onChange={(event) => {
              setLabel(event.target.value);
              setLabelError(null);
              setFormError(null);
            }}
            placeholder="Telegram, WhatsApp, Behance…"
            aria-invalid={Boolean(labelError)}
            autoFocus
          />
          {labelError ? (
            <p className="text-sm text-red-600 dark:text-red-400">{labelError}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="contact-link-url" required>
            URL
          </Label>
          <Input
            id="contact-link-url"
            type="url"
            value={url}
            onChange={(event) => {
              setUrl(event.target.value);
              setUrlError(null);
              setFormError(null);
            }}
            placeholder="https://t.me/username"
            aria-invalid={Boolean(urlError)}
          />
          {urlError ? (
            <p className="text-sm text-red-600 dark:text-red-400">{urlError}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-border bg-background/50 p-4">
          <div className="flex items-start gap-3">
            <LinkIconPreview
              iconUrl={getIconUrl(iconUrl)}
              label={label || "Link"}
              size="md"
            />
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium text-foreground">Icon</p>
              <p className="text-xs text-muted">
                Optional. Upload an image or paste an external icon URL. If empty,
                the public site uses a default link icon.
              </p>
            </div>
          </div>

          <ImageUploader
            label="Upload icon"
            value={iconUrl}
            onChange={(value) => {
              const nextValue = typeof value === "string" ? value : value.url;
              setIconUrl(nextValue);
              setIconUrlError(null);
              setFormError(null);
            }}
            onUploadingChange={setIsUploadingIcon}
          />

          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-link-icon-url">Or icon URL</Label>
            <Input
              id="contact-link-icon-url"
              type="url"
              value={iconUrl}
              onChange={(event) => {
                setIconUrl(event.target.value);
                setIconUrlError(null);
                setFormError(null);
              }}
              placeholder="https://example.com/icon.svg"
              aria-invalid={Boolean(iconUrlError)}
            />
            {iconUrlError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {iconUrlError}
              </p>
            ) : null}
            {iconUrl.trim() ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="self-start"
                onClick={() => {
                  setIconUrl("");
                  setIconUrlError(null);
                }}
              >
                Remove icon
              </Button>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
        ) : null}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSaving || isUploadingIcon}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving || isUploadingIcon}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface DeleteConfirmModalProps {
  open: boolean;
  link: ContactLink | null;
  onClose: () => void;
}

function DeleteConfirmModal({ open, link, onClose }: DeleteConfirmModalProps) {
  const utils = api.useUtils();
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setFormError(null);
    }
  }, [open]);

  const deleteMutation = api.contact.deleteLink.useMutation({
    onSuccess: async () => {
      await utils.contact.getLinks.invalidate();
      onClose();
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
    },
  });

  const handleDelete = () => {
    if (!link) return;
    deleteMutation.mutate({ id: link.id });
  };

  return (
    <Modal open={open} onClose={onClose} title="Delete Link">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Delete{" "}
          <span className="font-medium text-foreground">
            {link?.label ?? "this link"}
          </span>
          ? This action cannot be undone.
        </p>

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
            disabled={deleteMutation.isPending || !link}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

interface SortableLinkRowProps {
  link: ContactLink;
  onEdit: (link: ContactLink) => void;
  onDelete: (link: ContactLink) => void;
}

function SortableLinkRow({ link, onEdit, onDelete }: SortableLinkRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "grid gap-3 border-b border-border px-4 py-4 last:border-b-0 md:grid-cols-[auto_auto_minmax(0,1fr)_minmax(0,1.5fr)_auto] md:items-center md:gap-4 md:px-6",
        isDragging && "relative z-10 bg-card shadow-lg",
      )}
    >
      <button
        type="button"
        className="flex size-9 cursor-grab items-center justify-center rounded-md text-muted hover:bg-muted/10 active:cursor-grabbing"
        aria-label={`Reorder ${link.label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <LinkIconPreview iconUrl={link.iconUrl} label={link.label} />

      <div className="min-w-0">
        <span className="text-xs font-medium uppercase tracking-wide text-muted md:hidden">
          Label
        </span>
        <p className="truncate text-sm font-medium text-foreground">{link.label}</p>
      </div>

      <div className="min-w-0">
        <span className="text-xs font-medium uppercase tracking-wide text-muted md:hidden">
          URL
        </span>
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block truncate text-sm text-muted underline-offset-2 hover:underline"
        >
          {link.url}
        </a>
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Edit ${link.label}`}
          onClick={() => onEdit(link)}
        >
          <Pencil className="size-4" />
          <span className="sr-only md:not-sr-only">Edit</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-red-600 hover:text-red-700 dark:text-red-400"
          aria-label={`Delete ${link.label}`}
          onClick={() => onDelete(link)}
        >
          <Trash2 className="size-4" />
          <span className="sr-only md:not-sr-only">Delete</span>
        </Button>
      </div>
    </div>
  );
}

export function AdminContactLinksList() {
  const utils = api.useUtils();
  const [formModal, setFormModal] = useState<{
    open: boolean;
    mode: "create" | "edit";
    link: ContactLink | null;
  }>({ open: false, mode: "create", link: null });
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    link: ContactLink | null;
  }>({ open: false, link: null });
  const [orderedLinks, setOrderedLinks] = useState<ContactLink[]>([]);

  const {
    data: links = [],
    isLoading,
    isError,
  } = api.contact.getLinks.useQuery();

  useEffect(() => {
    setOrderedLinks(links);
  }, [links]);

  const nextOrder = useMemo(() => {
    if (links.length === 0) {
      return 0;
    }

    return Math.max(...links.map((link) => link.order)) + 1;
  }, [links]);

  const reorderMutation = api.contact.reorderLinks.useMutation({
    onSuccess: async () => {
      await utils.contact.getLinks.invalidate();
    },
    onError: async () => {
      setOrderedLinks(links);
      await utils.contact.getLinks.invalidate();
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

    const oldIndex = orderedLinks.findIndex((link) => link.id === active.id);
    const newIndex = orderedLinks.findIndex((link) => link.id === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    const reordered = arrayMove(orderedLinks, oldIndex, newIndex);
    setOrderedLinks(reordered);

    reorderMutation.mutate({
      items: reordered.map((link, index) => ({
        id: link.id,
        order: index,
      })),
    });
  };

  const openCreate = () => {
    setFormModal({ open: true, mode: "create", link: null });
  };

  const openEdit = (link: ContactLink) => {
    setFormModal({ open: true, mode: "edit", link });
  };

  const openDelete = (link: ContactLink) => {
    setDeleteModal({ open: true, link });
  };

  if (isLoading) {
    return (
      <p className="py-16 text-center text-sm text-muted">Loading contact links…</p>
    );
  }

  if (isError) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        Unable to load contact links. Please try again later.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            Manage social and messaging links shown in Contact and Hero. Drag rows to
            reorder. Order is reflected on the public site immediately.
          </p>
          <Button onClick={openCreate} className="shrink-0">
            Add Link
          </Button>
        </div>

        {orderedLinks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
            <p className="text-sm text-muted">No contact links yet</p>
            <p className="mt-2 text-xs text-muted">
              Add WhatsApp, Telegram, or social profiles. An empty list hides the
              social grid on the public Contact section.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="hidden border-b border-border px-6 py-3 md:grid md:grid-cols-[auto_auto_minmax(0,1fr)_minmax(0,1.5fr)_auto] md:gap-4">
              <span className="w-9" aria-hidden />
              <span className="w-9 text-xs font-medium uppercase tracking-wide text-muted">
                Icon
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                Label
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-muted">
                URL
              </span>
              <span className="text-right text-xs font-medium uppercase tracking-wide text-muted">
                Actions
              </span>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={orderedLinks.map((link) => link.id)}
                strategy={verticalListSortingStrategy}
              >
                {orderedLinks.map((link) => (
                  <SortableLinkRow
                    key={link.id}
                    link={link}
                    onEdit={openEdit}
                    onDelete={openDelete}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        )}
      </div>

      <LinkFormModal
        open={formModal.open}
        mode={formModal.mode}
        link={formModal.link}
        nextOrder={nextOrder}
        onClose={() => setFormModal((current) => ({ ...current, open: false }))}
      />

      <DeleteConfirmModal
        open={deleteModal.open}
        link={deleteModal.link}
        onClose={() => setDeleteModal({ open: false, link: null })}
      />
    </>
  );
}
