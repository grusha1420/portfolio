export const HERO_PLACEHOLDERS = {
  overline: "3D Designer",
  title: "astershape",
  subtitle:
    "Crafting immersive 3D visuals, product renders, and spatial experiences for brands worldwide.",
  gifUrl: "/placeholders/hero-bg.gif",
  wireframeUrl: "/placeholders/wireframe-bw.svg",
  wireframeColorUrl: "/placeholders/wireframe-color.svg",
} as const;

export type HeroContentData = {
  overline: string;
  title: string;
  subtitle: string;
  gifUrl: string | null;
  wireframeUrl: string | null;
  wireframeColorUrl: string | null;
};

export type HeroContactLink = {
  id: string;
  label: string;
  url: string;
  iconUrl: string | null;
};

export function isMessagingLink(link: { label: string; url: string }): boolean {
  const haystack = `${link.label} ${link.url}`.toLowerCase();
  return (
    haystack.includes("wa.me") ||
    haystack.includes("whatsapp") ||
    haystack.includes("t.me") ||
    haystack.includes("telegram")
  );
}
