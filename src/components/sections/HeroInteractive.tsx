"use client";

import { MessageCircle, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

import { BookCallButton } from "~/components/BookCallButton";
import { cn } from "~/lib/cn";

import {
  type HeroContactLink,
  type HeroContentData,
} from "./hero-constants";
import { HeroWireframe } from "./HeroWireframe";

interface HeroInteractiveProps {
  content: HeroContentData;
  contactLinks: HeroContactLink[];
}

function ContactIcon({ link }: { link: HeroContactLink }) {
  const label = link.label.toLowerCase();
  const isWhatsApp = label.includes("whatsapp") || link.url.includes("wa.me");
  const isTelegram = label.includes("telegram") || link.url.includes("t.me");

  if (link.iconUrl) {
    return (
      <Image
        src={link.iconUrl}
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 object-contain"
        aria-hidden
      />
    );
  }

  if (isWhatsApp) {
    return <MessageCircle className="h-5 w-5" aria-hidden />;
  }

  if (isTelegram) {
    return <Send className="h-5 w-5" aria-hidden />;
  }

  return <MessageCircle className="h-5 w-5" aria-hidden />;
}

export function HeroInteractive({ content, contactLinks }: HeroInteractiveProps) {
  const heroRef = useRef<HTMLElement>(null);
  const showWireframe = Boolean(content.wireframeUrl && content.wireframeColorUrl);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen flex-col justify-end"
    >
      {content.gifUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.gifUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-br from-segment-accent-a via-[#4a3578] to-[#2d1f4e]"
        />
      )}

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20"
      />

      <div className="container-content relative z-10 flex w-full flex-col pb-10 pt-28 md:pt-32">
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            {content.overline}
          </p>

          <div className="flex flex-col gap-4">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
              {content.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-white/85 md:text-lg">
              {content.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {contactLinks.map((link) => (
              <Link
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 w-11 items-center justify-center rounded-full",
                  "border border-white/25 bg-white/10 text-white backdrop-blur-sm",
                  "transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                )}
                aria-label={link.label}
              >
                <ContactIcon link={link} />
              </Link>
            ))}

            <BookCallButton size="lg" className="min-w-[10rem]" />
          </div>
        </div>
      </div>

      {showWireframe && content.wireframeUrl && content.wireframeColorUrl ? (
        <HeroWireframe
          wireframeUrl={content.wireframeUrl}
          wireframeColorUrl={content.wireframeColorUrl}
          heroRef={heroRef}
          className="pointer-events-none relative z-10 w-full select-none"
        />
      ) : null}
    </section>
  );
}
