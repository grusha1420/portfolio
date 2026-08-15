import { PageHero } from "~/components/layout/PageHero";
import { ContactSection } from "~/components/sections";
import { WorkGallery } from "~/components/work";
import { getStaticPageMetadata } from "~/lib/seo";

export const metadata = getStaticPageMetadata(
  "Work — astershape",
  "/work",
  "Portfolio gallery of 3D renders, animation, and case studies by astershape.",
);

export default function WorkPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background pt-16 text-foreground">
      <div className="container-content py-16 md:py-24">
        <PageHero
          overline="— WORK"
          title="Renders, films & case studies"
          description="A selection of 3D visualization, motion design, and product storytelling — from still renders and animated films to interactive electronics and full case studies."
        />
        <WorkGallery />
      </div>
      <ContactSection variant="page" />
    </main>
  );
}
