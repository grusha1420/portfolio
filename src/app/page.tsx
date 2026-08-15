import { AboutPreview, ContactSection, FeaturedWork, Hero } from "~/components/sections";
import { getStaticPageMetadata } from "~/lib/seo";

export const metadata = getStaticPageMetadata(
  "resurexi — 3D Designer",
  "/",
);

/**
 * Homepage segment order and backgrounds (concept):
 * Hero — GIF / transparent overlay (default)
 * Featured Work — accent A + waves
 * About — default bg (shared page background)
 * Contact — accent B + waves (variant="home")
 */
export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <FeaturedWork />
      <AboutPreview />
      <ContactSection variant="home" />
    </main>
  );
}
