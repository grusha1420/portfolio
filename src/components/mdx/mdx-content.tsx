import {
  MDXRemote,
  type MDXRemoteProps,
} from "next-mdx-remote/rsc";
import {
  type AnchorHTMLAttributes,
  type BlockquoteHTMLAttributes,
  type ImgHTMLAttributes,
} from "react";

import { MediaImage } from "~/components/ui/media-image";
import { cn } from "~/lib/cn";

type MDXComponents = NonNullable<MDXRemoteProps["components"]>;

function MdxImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { src, alt, className, width, height } = props;
  if (!src || typeof src !== "string") return null;

  return (
    <MediaImage
      src={src}
      alt={typeof alt === "string" ? alt : ""}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      className={cn("rounded-lg", className)}
    />
  );
}

function MdxLink({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  const isExternal = typeof href === "string" && href.startsWith("http");

  return (
    <a
      href={href}
      className="text-accent underline-offset-4 hover:underline"
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      {...props}
    >
      {children}
    </a>
  );
}

function MdxBlockquote({
  children,
  ...props
}: BlockquoteHTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-4 border-accent pl-4 italic text-muted"
      {...props}
    >
      {children}
    </blockquote>
  );
}

const mdxComponents: MDXComponents = {
  img: MdxImage,
  a: MdxLink,
  blockquote: MdxBlockquote,
};

export interface MDXContentProps {
  source: string;
  className?: string;
}

export function MDXContent({ source, className }: MDXContentProps) {
  return (
    <div
      className={cn(
        "prose prose-lg max-w-none dark:prose-invert",
        "prose-headings:text-foreground prose-p:text-foreground/90",
        "prose-a:text-accent prose-strong:text-foreground",
        className,
      )}
    >
      <MDXRemote source={source} components={mdxComponents} />
    </div>
  );
}
