"use client";

import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { cn } from "~/lib/cn";
import { api } from "~/trpc/react";

export function SocialLinks() {
  const { data: links = [] } = api.contact.getLinks.useQuery();

  if (links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] opacity-80">
        Connect
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {links.map((link) => (
          <Link
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "inline-flex items-center gap-2 rounded-lg border border-current/15 px-3 py-2 text-sm font-medium transition-opacity hover:opacity-80",
            )}
          >
            {link.iconUrl ? (
              <Image
                src={link.iconUrl}
                alt=""
                width={18}
                height={18}
                className="h-[18px] w-[18px] object-contain"
                aria-hidden
              />
            ) : (
              <LinkIcon className="h-[18px] w-[18px] shrink-0" aria-hidden />
            )}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
