import Image from "next/image";

import { cn } from "~/lib/cn";

export interface MediaImageProps {
  src: string;
  alt?: string;
  isAnimated?: boolean;
  className?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
}

export function MediaImage({
  src,
  alt = "",
  isAnimated = false,
  className,
  width,
  height,
  fill,
  sizes,
  priority,
}: MediaImageProps) {
  if (isAnimated) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("h-auto max-w-full", className)}
        loading={priority ? "eager" : "lazy"}
      />
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width ?? 800}
      height={height ?? 600}
      sizes={sizes}
      priority={priority}
      className={cn("h-auto max-w-full", className)}
    />
  );
}
