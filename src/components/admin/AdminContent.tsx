"use client";

import { TRPCClientError } from "@trpc/client";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ImageUploader } from "~/components/admin/ImageUploader";
import { Button, Input, Label, Textarea } from "~/components/ui";
import { cn } from "~/lib/cn";
import { api, type RouterOutputs } from "~/trpc/react";

type ContentTab = "hero" | "about" | "contact";
type HeroRecord = RouterOutputs["content"]["getHero"];
type AboutRecord = RouterOutputs["content"]["getAboutPreview"];
type ContactRecord = RouterOutputs["content"]["getContactInfo"];

const TABS: { id: ContentTab; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "about", label: "About Preview" },
  { id: "contact", label: "Contact Info" },
];

function getTrpcErrorMessage(error: unknown): string {
  if (error instanceof TRPCClientError) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

function pickChangedFields<T extends object>(
  current: T,
  baseline: T,
): Partial<{ [K in keyof T]: string | null }> {
  const patch: Partial<{ [K in keyof T]: string | null }> = {};

  for (const key of Object.keys(current) as (keyof T)[]) {
    const cur = current[key];
    const base = baseline[key];

    if (cur !== base) {
      patch[key] = (cur === "" ? null : cur) as string | null;
    }
  }

  return patch;
}

function PreviewLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
    >
      {label}
      <ExternalLink className="size-3.5" aria-hidden />
    </Link>
  );
}

function FormStatus({
  isSaving,
  saved,
  error,
}: {
  isSaving: boolean;
  saved: boolean;
  error: string | null;
}) {
  return (
    <div className="flex min-h-6 flex-col gap-1">
      {error ? (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
      {isSaving ? (
        <p className="text-sm text-muted">Saving…</p>
      ) : saved ? (
        <p className="text-sm text-green-700 dark:text-green-400">
          Saved successfully.
        </p>
      ) : null}
    </div>
  );
}

interface HeroFormState {
  heroTitle: string;
  heroSubtitle: string;
  heroGifUrl: string;
  heroWireframeUrl: string;
  heroWireframeColorUrl: string;
}

function emptyHeroForm(): HeroFormState {
  return {
    heroTitle: "",
    heroSubtitle: "",
    heroGifUrl: "",
    heroWireframeUrl: "",
    heroWireframeColorUrl: "",
  };
}

function heroFromRecord(hero: HeroRecord | null | undefined): HeroFormState {
  return {
    heroTitle: hero?.heroTitle ?? "",
    heroSubtitle: hero?.heroSubtitle ?? "",
    heroGifUrl: hero?.heroGifUrl ?? "",
    heroWireframeUrl: hero?.heroWireframeUrl ?? "",
    heroWireframeColorUrl: hero?.heroWireframeColorUrl ?? "",
  };
}

function HeroContentForm() {
  const utils = api.useUtils();
  const { data: hero, isLoading } = api.content.getHero.useQuery();
  const [form, setForm] = useState<HeroFormState>(emptyHeroForm);
  const [baseline, setBaseline] = useState<HeroFormState>(emptyHeroForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [gifUploading, setGifUploading] = useState(false);
  const [wireframeUploading, setWireframeUploading] = useState(false);
  const [wireframeColorUploading, setWireframeColorUploading] = useState(false);

  useEffect(() => {
    if (hero === undefined) return;

    const next = heroFromRecord(hero);
    setForm(next);
    setBaseline(next);
    setSaved(false);
  }, [hero]);

  const updateMutation = api.content.updateHero.useMutation({
    onSuccess: async (updated) => {
      await utils.content.getHero.invalidate();
      const next = heroFromRecord(updated);
      setForm(next);
      setBaseline(next);
      setFormError(null);
      setSaved(true);
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
      setSaved(false);
    },
  });

  const isUploading =
    gifUploading || wireframeUploading || wireframeColorUploading;
  const isSaving = updateMutation.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSaved(false);

    const patch = pickChangedFields(form, baseline);

    if (Object.keys(patch).length === 0) {
      return;
    }

    updateMutation.mutate(patch);
  };

  if (isLoading) {
    return <p className="text-sm text-muted">Loading hero content…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Homepage hero section — title, subtitle, and layered media.
        </p>
        <PreviewLink href="/#hero" label="View on site →" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="heroTitle">Title</Label>
        <Input
          id="heroTitle"
          value={form.heroTitle}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, heroTitle: event.target.value }))
          }
          placeholder="Anastasia Maidannikova"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="heroSubtitle">Subtitle</Label>
        <Textarea
          id="heroSubtitle"
          value={form.heroSubtitle}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, heroSubtitle: event.target.value }))
          }
          rows={3}
          placeholder="3D model designer for games and interactive experiences"
        />
      </div>

      <ImageUploader
        label="Background GIF"
        variant="hero"
        value={form.heroGifUrl}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            heroGifUrl: typeof value === "string" ? value : value.url,
          }))
        }
        onUploadingChange={setGifUploading}
      />

      <div className="rounded-lg border border-border bg-card/50 p-4 text-sm text-muted">
        <p className="font-medium text-foreground">Wireframe dual-layer effect</p>
        <p className="mt-2">
          Upload two images with identical dimensions: a black-and-white wireframe
          and a full-color version. They stack on top of each other; on desktop
          the color layer fades in based on cursor position, on mobile based on
          scroll progress.
        </p>
      </div>

      <ImageUploader
        label="Wireframe (B&W)"
        variant="wireframe"
        value={form.heroWireframeUrl}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            heroWireframeUrl: typeof value === "string" ? value : value.url,
          }))
        }
        onUploadingChange={setWireframeUploading}
      />

      <ImageUploader
        label="Wireframe (color)"
        variant="wireframe"
        value={form.heroWireframeColorUrl}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            heroWireframeColorUrl:
              typeof value === "string" ? value : value.url,
          }))
        }
        onUploadingChange={setWireframeColorUploading}
      />

      <FormStatus isSaving={isSaving} saved={saved} error={formError} />

      <div>
        <Button type="submit" disabled={isSaving || isUploading}>
          {isUploading ? "Upload in progress…" : isSaving ? "Saving…" : "Save Hero"}
        </Button>
      </div>
    </form>
  );
}

interface AboutFormState {
  aboutPreviewTitle: string;
  aboutPreviewText: string;
  aboutPreviewImageUrl: string;
}

function emptyAboutForm(): AboutFormState {
  return {
    aboutPreviewTitle: "",
    aboutPreviewText: "",
    aboutPreviewImageUrl: "",
  };
}

function aboutFromRecord(about: AboutRecord | null | undefined): AboutFormState {
  return {
    aboutPreviewTitle: about?.aboutPreviewTitle ?? "",
    aboutPreviewText: about?.aboutPreviewText ?? "",
    aboutPreviewImageUrl: about?.aboutPreviewImageUrl ?? "",
  };
}

function AboutContentForm() {
  const utils = api.useUtils();
  const { data: about, isLoading } = api.content.getAboutPreview.useQuery();
  const [form, setForm] = useState<AboutFormState>(emptyAboutForm);
  const [baseline, setBaseline] = useState<AboutFormState>(emptyAboutForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    if (about === undefined) return;

    const next = aboutFromRecord(about);
    setForm(next);
    setBaseline(next);
    setSaved(false);
  }, [about]);

  const updateMutation = api.content.updateAboutPreview.useMutation({
    onSuccess: async (updated) => {
      await utils.content.getAboutPreview.invalidate();
      const next = aboutFromRecord(updated);
      setForm(next);
      setBaseline(next);
      setFormError(null);
      setSaved(true);
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
      setSaved(false);
    },
  });

  const isSaving = updateMutation.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSaved(false);

    const patch = pickChangedFields(form, baseline);

    if (Object.keys(patch).length === 0) {
      return;
    }

    updateMutation.mutate(patch);
  };

  if (isLoading) {
    return <p className="text-sm text-muted">Loading about preview…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Short about section on the homepage before the full /about page.
        </p>
        <PreviewLink href="/#about" label="View on site →" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="aboutPreviewTitle">Title</Label>
        <Input
          id="aboutPreviewTitle"
          value={form.aboutPreviewTitle}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              aboutPreviewTitle: event.target.value,
            }))
          }
          placeholder="About me"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="aboutPreviewText">Text</Label>
        <Textarea
          id="aboutPreviewText"
          value={form.aboutPreviewText}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              aboutPreviewText: event.target.value,
            }))
          }
          rows={6}
          placeholder="A short introduction to your work and background…"
        />
      </div>

      <ImageUploader
        label="Preview image"
        value={form.aboutPreviewImageUrl}
        onChange={(value) =>
          setForm((prev) => ({
            ...prev,
            aboutPreviewImageUrl: typeof value === "string" ? value : value.url,
          }))
        }
        onUploadingChange={setImageUploading}
      />

      <FormStatus isSaving={isSaving} saved={saved} error={formError} />

      <div>
        <Button type="submit" disabled={isSaving || imageUploading}>
          {imageUploading
            ? "Upload in progress…"
            : isSaving
              ? "Saving…"
              : "Save About Preview"}
        </Button>
      </div>
    </form>
  );
}

interface ContactFormState {
  contactEmail: string;
  responseTimeText: string;
  basedInText: string;
}

function emptyContactForm(): ContactFormState {
  return {
    contactEmail: "",
    responseTimeText: "",
    basedInText: "",
  };
}

function contactFromRecord(info: ContactRecord | undefined): ContactFormState {
  return {
    contactEmail: info?.contactEmail ?? "",
    responseTimeText: info?.responseTimeText ?? "",
    basedInText: info?.basedInText ?? "",
  };
}

function ContactContentForm() {
  const utils = api.useUtils();
  const { data: info, isLoading } = api.content.getContactInfo.useQuery();
  const [form, setForm] = useState<ContactFormState>(emptyContactForm);
  const [baseline, setBaseline] = useState<ContactFormState>(emptyContactForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  useEffect(() => {
    if (info === undefined) return;

    const next = contactFromRecord(info);
    setForm(next);
    setBaseline(next);
    setSaved(false);
  }, [info]);

  const updateMutation = api.content.updateContactInfo.useMutation({
    onSuccess: async (updated) => {
      await utils.content.getContactInfo.invalidate();
      const next = {
        contactEmail: updated?.contactEmail ?? "",
        responseTimeText: updated?.responseTimeText ?? "",
        basedInText: updated?.basedInText ?? "",
      };
      setForm(next);
      setBaseline(next);
      setFormError(null);
      setSaved(true);
    },
    onError: (error) => {
      setFormError(getTrpcErrorMessage(error));
      setSaved(false);
    },
  });

  const isSaving = updateMutation.isPending;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFormError(null);
    setSaved(false);
    setEmailError(null);

    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    const patch = pickChangedFields(form, baseline);

    if (Object.keys(patch).length === 0) {
      return;
    }

    updateMutation.mutate(patch);
  };

  if (isLoading) {
    return <p className="text-sm text-muted">Loading contact info…</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <p className="text-sm text-muted">
        Contact panel on the homepage and subpages — email, response time, and
        location.
      </p>

      <div className="flex flex-col gap-2">
        <Label htmlFor="contactEmail">Email</Label>
        <Input
          id="contactEmail"
          type="email"
          value={form.contactEmail}
          onChange={(event) => {
            setForm((prev) => ({ ...prev, contactEmail: event.target.value }));
            setEmailError(null);
          }}
          placeholder="info@example.com"
        />
        {emailError ? (
          <p className="text-sm text-red-600 dark:text-red-400">{emailError}</p>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="responseTimeText">Response time</Label>
        <Input
          id="responseTimeText"
          value={form.responseTimeText}
          onChange={(event) =>
            setForm((prev) => ({
              ...prev,
              responseTimeText: event.target.value,
            }))
          }
          placeholder="Usually within 24 hours"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="basedInText">Based in</Label>
        <Input
          id="basedInText"
          value={form.basedInText}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, basedInText: event.target.value }))
          }
          placeholder="Berlin, Germany"
        />
      </div>

      <FormStatus isSaving={isSaving} saved={saved} error={formError} />

      <div>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? "Saving…" : "Save Contact Info"}
        </Button>
      </div>
    </form>
  );
}

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<ContentTab>("hero");
  const seededRef = useRef(false);
  const utils = api.useUtils();

  const ensureDefaults = api.content.ensureDefaults.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.content.getHero.invalidate(),
        utils.content.getAboutPreview.invalidate(),
        utils.content.getContactInfo.invalidate(),
      ]);
    },
  });

  useEffect(() => {
    if (seededRef.current) return;
    seededRef.current = true;
    ensureDefaults.mutate();
  }, [ensureDefaults]);

  return (
    <div className="flex flex-col gap-6">
      <nav
        className="flex gap-1 border-b border-border"
        aria-label="Content section tabs"
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div className="max-w-2xl">
        {activeTab === "hero" ? <HeroContentForm /> : null}
        {activeTab === "about" ? <AboutContentForm /> : null}
        {activeTab === "contact" ? <ContactContentForm /> : null}
      </div>
    </div>
  );
}
