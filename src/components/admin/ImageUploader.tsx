"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, RotateCcw, Upload, X } from "lucide-react";
import type { ClientUploadedFileData } from "uploadthing/types";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/cn";
import { useUploadThing } from "~/utils/uploadthing";

export type ImageUploadValue = {
  url: string;
  isAnimated?: boolean;
};

type SingleValue = string | ImageUploadValue;
type UploadEndpoint = "imageUploader" | "heroImageUploader" | "wireframeImageUploader";
type UploadedFile = ClientUploadedFileData<{ url: string; name: string }>;

interface ImageUploaderBaseProps {
  label?: string;
  detectAnimated?: boolean;
  variant?: "default" | "hero" | "wireframe";
  onUploadingChange?: (uploading: boolean) => void;
}

export interface SingleImageUploaderProps extends ImageUploaderBaseProps {
  multiple?: false;
  value: SingleValue;
  onChange: (value: SingleValue) => void;
}

export interface MultipleImageUploaderProps extends ImageUploaderBaseProps {
  multiple: true;
  value: SingleValue[];
  onChange: (value: SingleValue[]) => void;
}

export type ImageUploaderProps =
  | SingleImageUploaderProps
  | MultipleImageUploaderProps;

function getItemUrl(item: SingleValue): string {
  return typeof item === "string" ? item : item.url;
}

function getItemAnimated(item: SingleValue): boolean {
  return typeof item === "string" ? false : Boolean(item.isAnimated);
}

function normalizeItems(
  value: SingleValue | SingleValue[],
  multiple: boolean,
): SingleValue[] {
  if (multiple) {
    return Array.isArray(value) ? value : value ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.length > 0 ? [value[0]!] : [];
  }

  return value ? [value] : [];
}

function toOutputValue(items: SingleValue[], multiple: true): SingleValue[];
function toOutputValue(items: SingleValue[], multiple: false): SingleValue;
function toOutputValue(
  items: SingleValue[],
  multiple: boolean,
): SingleValue | SingleValue[] {
  if (multiple) {
    return items;
  }

  return items[0] ?? "";
}

function mapUploadedFiles(
  files: UploadedFile[],
  mimeByName: Map<string, string>,
  detectAnimated: boolean,
): ImageUploadValue[] {
  return files.map((file) => {
    const mime = mimeByName.get(file.name);
    const isGif =
      detectAnimated &&
      (mime === "image/gif" || file.name.toLowerCase().endsWith(".gif"));

    return {
      url: file.ufsUrl,
      ...(isGif ? { isAnimated: true } : {}),
    };
  });
}

function useImageUploadHandlers(
  endpoint: UploadEndpoint,
  options: {
    items: SingleValue[];
    multiple: boolean;
    detectAnimated: boolean;
    onChange: (value: SingleValue | SingleValue[]) => void;
    mimeByNameRef: React.RefObject<Map<string, string>>;
    lastFilesRef: React.RefObject<File[]>;
    setError: (error: string | null) => void;
  },
) {
  const {
    items,
    multiple,
    detectAnimated,
    onChange,
    mimeByNameRef,
    lastFilesRef,
    setError,
  } = options;

  return useUploadThing(endpoint, {
    onClientUploadComplete: (res: UploadedFile[]) => {
      const uploaded = mapUploadedFiles(
        res,
        mimeByNameRef.current,
        detectAnimated,
      );

      if (multiple) {
        onChange([...items, ...uploaded]);
      } else {
        onChange(uploaded[0] ?? "");
      }

      setError(null);
      lastFilesRef.current = [];
      mimeByNameRef.current.clear();
    },
    onUploadError: (err) => {
      setError(err.message ?? "Upload failed. Please try again.");
    },
  });
}

export function ImageUploader(props: ImageUploaderProps) {
  const {
    value,
    onChange,
    multiple = false,
    label,
    detectAnimated = true,
    variant = "default",
    onUploadingChange,
  } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFilesRef = useRef<File[]>([]);
  const mimeByNameRef = useRef<Map<string, string>>(new Map());

  const [error, setError] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const items = normalizeItems(value, multiple);

  const handlerOptions = {
    items,
    multiple,
    detectAnimated,
    onChange: onChange as (value: SingleValue | SingleValue[]) => void,
    mimeByNameRef,
    lastFilesRef,
    setError,
  };

  const defaultUpload = useImageUploadHandlers(
    "imageUploader",
    handlerOptions,
  );
  const heroUpload = useImageUploadHandlers("heroImageUploader", handlerOptions);
  const wireframeUpload = useImageUploadHandlers(
    "wireframeImageUploader",
    handlerOptions,
  );

  const { startUpload, isUploading } =
    variant === "hero"
      ? heroUpload
      : variant === "wireframe"
        ? wireframeUpload
        : defaultUpload;

  useEffect(() => {
    onUploadingChange?.(isUploading);
  }, [isUploading, onUploadingChange]);

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (files.length === 0) return;

      const accepted = multiple ? files : files.slice(0, 1);
      lastFilesRef.current = accepted;
      mimeByNameRef.current = new Map(
        accepted.map((file) => [file.name, file.type]),
      );
      setError(null);

      await startUpload(accepted);
    },
    [multiple, startUpload],
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    void uploadFiles(files);
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    void uploadFiles(Array.from(event.dataTransfer.files));
  };

  const handleRemove = (index: number) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index);

    if (multiple) {
      (onChange as (value: SingleValue[]) => void)(
        toOutputValue(next, true),
      );
    } else {
      (onChange as (value: SingleValue) => void)(
        toOutputValue(next, false),
      );
    }
  };

  const handleRetry = () => {
    void uploadFiles(lastFilesRef.current);
  };

  const accept =
    variant === "hero" || variant === "wireframe"
      ? "image/*"
      : "image/png,image/jpeg,image/webp,image/gif,image/avif";

  return (
    <div className="flex flex-col gap-3">
      {label ? <Label>{label}</Label> : null}

      {error ? (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200"
        >
          <span className="flex-1">{error}</span>
          <div className="flex shrink-0 items-center gap-2">
            {lastFilesRef.current.length > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRetry}
                disabled={isUploading}
                className="h-8 px-2 text-red-800 hover:bg-red-100 dark:text-red-200 dark:hover:bg-red-900/40"
              >
                <RotateCcw className="size-4" />
                Retry
              </Button>
            ) : null}
            <button
              type="button"
              aria-label="Dismiss error"
              onClick={() => setError(null)}
              className="rounded p-1 hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ) : null}

      <div
        className={cn(
          "grid gap-3",
          multiple ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4" : "grid-cols-1",
        )}
      >
        {items.map((item, index) => (
          <div
            key={`${getItemUrl(item)}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-card"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={getItemUrl(item)}
              alt=""
              className="size-full object-cover"
            />
            {getItemAnimated(item) ? (
              <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                GIF
              </span>
            ) : null}
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => handleRemove(index)}
              className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}

        {(!multiple && items.length === 0) || multiple ? (
          <div
            onDragEnter={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={(event) => {
              event.preventDefault();
              setIsDragActive(false);
            }}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-input-border bg-background p-4 text-center transition-colors",
              isDragActive
                ? "border-accent bg-accent/5"
                : "hover:border-accent/60 hover:bg-foreground/5",
              isUploading ? "pointer-events-none opacity-70" : undefined,
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept={accept}
              multiple={multiple}
              className="hidden"
              onChange={handleInputChange}
            />

            {isUploading ? (
              <>
                <Loader2 className="size-8 animate-spin text-muted" />
                <span className="text-sm text-muted">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="size-8 text-muted" />
                <span className="text-sm text-muted">
                  {multiple ? "Drop images or click" : "Drop image or click"}
                </span>
                <span className="text-xs text-muted">
                  {variant === "hero"
                    ? "Up to 32MB (GIF supported)"
                    : variant === "wireframe"
                      ? "Up to 8MB"
                      : "Up to 4MB"}
                </span>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
