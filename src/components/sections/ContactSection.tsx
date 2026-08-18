import { BookCallButton } from "~/components/BookCallButton";
import { ColoredSegment } from "~/components/layout";
import { cn } from "~/lib/cn";
import { api } from "~/trpc/server";

import { ContactForm } from "./ContactForm";
import {
  CONTACT_INFO_PLACEHOLDERS,
  type ContactInfoContent,
} from "./contact-info-constants";
import { SocialLinks } from "./SocialLinks";

export type ContactSectionProps = {
  variant?: "home" | "page";
};

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function resolveContactInfo(
  info: Awaited<ReturnType<typeof api.content.getContactInfo>>,
): ContactInfoContent {
  return {
    contactEmail:
      nonEmpty(info.contactEmail) ?? CONTACT_INFO_PLACEHOLDERS.contactEmail,
    responseTimeText:
      nonEmpty(info.responseTimeText) ?? CONTACT_INFO_PLACEHOLDERS.responseTimeText,
    basedInText:
      nonEmpty(info.basedInText) ?? CONTACT_INFO_PLACEHOLDERS.basedInText,
  };
}

function ContactInfoPanel({ info }: { info: ContactInfoContent }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 rounded-xl border border-border bg-card p-6 text-foreground shadow-sm",
        "md:p-8",
      )}
    >
      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Email
        </p>
        <a
          href={`mailto:${info.contactEmail}`}
          className="text-base font-medium underline-offset-4 transition-opacity hover:underline hover:opacity-90"
        >
          {info.contactEmail}
        </a>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Response time
        </p>
        <p className="text-base leading-relaxed">{info.responseTimeText}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
          Based in
        </p>
        <p className="text-base leading-relaxed">{info.basedInText}</p>
      </div>

      <BookCallButton className="w-full sm:w-fit" />

      <SocialLinks />
    </div>
  );
}

export async function ContactSection({ variant = "home" }: ContactSectionProps) {
  const contactInfo = await api.content.getContactInfo();
  const info = resolveContactInfo(contactInfo);

  const content = (
    <div className="container-content py-16 md:py-24">
      <header className="mb-10 flex flex-col gap-3 md:mb-12">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          03 — Contact
        </p>
        <h2 className="text-3xl text-foreground font-bold md:text-4xl lg:text-5xl"> 
          Let&apos;s work together
        </h2>
      </header>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 lg:items-start">
        <ContactForm />
        <ContactInfoPanel info={info} />
      </div>
    </div>
  );

  if (variant === "home") {
    return (
      <ColoredSegment id="contact" variant="b" waves="top" waveOverlap="top">
        {content}
      </ColoredSegment>
    );
  }

  return (
    <section id="contact" className="bg-background text-foreground">
      {content}
    </section>
  );
}
