import { MediaImage } from "~/components/ui";
import { cn } from "~/lib/cn";

export interface WorkGalleryImage {
  id: string;
  url: string;
  alt: string | null;
  order: number;
  isAnimated: boolean;
}

export interface WorkImageGalleryProps {
  images: WorkGalleryImage[];
  className?: string;
}

export function WorkImageGallery({ images, className }: WorkImageGalleryProps) {
  const sortedImages = [...images].sort((a, b) => a.order - b.order);

  if (sortedImages.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {sortedImages.map((image) => (
        <div
          key={image.id}
          className="relative aspect-[4/3] overflow-hidden rounded-xl bg-black/20"
        >
          <MediaImage
            src={image.url}
            alt={image.alt ?? ""}
            isAnimated={image.isAnimated}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              "object-cover",
              image.isAnimated && "absolute inset-0 h-full w-full object-cover",
            )}
          />
        </div>
      ))}
    </div>
  );
}
