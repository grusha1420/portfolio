import { api } from "~/trpc/server";

import { HeroInteractive } from "./HeroInteractive";
import {
  HERO_PLACEHOLDERS,
  isMessagingLink,
  type HeroContentData,
  type HeroContactLink,
} from "./hero-constants";

function nonEmpty(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }
  return trimmed;
}

function resolveHeroContent(
  hero: Awaited<ReturnType<typeof api.content.getHero>>,
): HeroContentData {
  if (!hero) {
    return {
      overline: HERO_PLACEHOLDERS.overline,
      title: HERO_PLACEHOLDERS.title,
      subtitle: HERO_PLACEHOLDERS.subtitle,
      gifUrl: HERO_PLACEHOLDERS.gifUrl,
      wireframeUrl: HERO_PLACEHOLDERS.wireframeUrl,
      wireframeColorUrl: HERO_PLACEHOLDERS.wireframeColorUrl,
    };
  }

  return {
    overline: HERO_PLACEHOLDERS.overline,
    title: nonEmpty(hero.heroTitle) ?? HERO_PLACEHOLDERS.title,
    subtitle: nonEmpty(hero.heroSubtitle) ?? HERO_PLACEHOLDERS.subtitle,
    gifUrl: nonEmpty(hero.heroGifUrl),
    wireframeUrl: nonEmpty(hero.heroWireframeUrl),
    wireframeColorUrl: nonEmpty(hero.heroWireframeColorUrl),
  };
}

function resolveContactLinks(
  links: Awaited<ReturnType<typeof api.contact.getLinks>>,
): HeroContactLink[] {
  return links
    .filter(isMessagingLink)
    .map((link) => ({
      id: link.id,
      label: link.label,
      url: link.url,
      iconUrl: link.iconUrl,
    }));
}

export async function Hero() {
  const [hero, links] = await Promise.all([
    api.content.getHero(),
    api.contact.getLinks(),
  ]);

  const content = resolveHeroContent(hero);
  const contactLinks = resolveContactLinks(links);

  return <HeroInteractive content={content} contactLinks={contactLinks} />;
}
