import { DesimentorRenderer } from "@/components/desimentor/DesimentorRenderer";
import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { getHomepage } from "@/lib/wordpress/api";
import { normalizeDisplayMode } from "@/lib/content/display-mode";
import { buildMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const page = await getHomepage();
  if (!page?.seo) {
    return { title: "Creative Web Solutions" };
  }
  return buildMetadata(page.seo, "/");
}

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const page = await getHomepage();
  const sections = page?.sections || [];

  const mode = normalizeDisplayMode(page?.displayMode);
  const hasDesimentor = Boolean(page?.desimentor?.sections?.length);
  const showElementor = mode === "elementor" && hasDesimentor;
  const showSections = mode === "classic" || !showElementor;

  return (
    <SiteLayout currentPath="/">
      <div className="home-page">
        {showElementor ? <DesimentorRenderer document={page!.desimentor!} /> : null}
        {showSections && sections.length > 0 ? (
          <SectionRenderer sections={sections} />
        ) : !showSections && !showElementor ? (
          <section className="corp-section">
            <div className="corp-container text-center py-5">
              <p className="text-muted mb-0">
                Homepage content is managed in WordPress. Set a static front page and add Homepage
                Sections in the admin.
              </p>
            </div>
          </section>
        ) : null}
      </div>
    </SiteLayout>
  );
}
