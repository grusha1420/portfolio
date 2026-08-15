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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

import {
  ImageUploader,
  type ImageUploadValue,
} from "~/components/admin/ImageUploader";
import { cn } from "~/lib/cn";

export type GalleryItem = ImageUploadValue & {
  alt?: string;
};

interface SortableGalleryUploaderProps {
  value: GalleryItem[];
  onChange: (value: GalleryItem[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

function toGalleryItem(item: string | ImageUploadValue): GalleryItem {
  if (typeof item === "string") {
    return { url: item };
  }

  return {
    url: item.url,
    isAnimated: item.isAnimated,
  };
}

interface SortableGalleryItemProps {
  item: GalleryItem;
  onRemove: () => void;
}

function SortableGalleryItem({ item, onRemove }: SortableGalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-lg border border-border bg-card",
        isDragging && "z-10 opacity-80 shadow-lg",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.url} alt="" className="size-full object-cover" />
      {item.isAnimated ? (
        <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
          GIF
        </span>
      ) : null}
      <button
        type="button"
        aria-label="Drag to reorder"
        className="absolute bottom-2 left-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>
      <button
        type="button"
        aria-label="Remove image"
        onClick={onRemove}
        className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

export function SortableGalleryUploader({
  value,
  onChange,
  onUploadingChange,
}: SortableGalleryUploaderProps) {
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

    const oldIndex = value.findIndex((item) => item.url === active.id);
    const newIndex = value.findIndex((item) => item.url === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onChange(arrayMove(value, oldIndex, newIndex));
  };

  const handleUploadChange = (uploaded: string | ImageUploadValue | (string | ImageUploadValue)[]) => {
    const items = Array.isArray(uploaded) ? uploaded : [uploaded];
    const newItems = items.map(toGalleryItem);
    onChange([...value, ...newItems]);
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {value.length > 0 ? (
        <div className="max-h-96 overflow-y-auto rounded-lg border border-border p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={value.map((item) => item.url)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {value.map((item, index) => (
                  <SortableGalleryItem
                    key={item.url}
                    item={item}
                    onRemove={() => handleRemove(index)}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      ) : null}

      <ImageUploader
        multiple
        label="Add gallery images"
        value={[]}
        onChange={handleUploadChange}
        onUploadingChange={onUploadingChange}
      />
    </div>
  );
}
