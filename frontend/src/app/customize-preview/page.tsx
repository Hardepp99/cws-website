import { SectionRenderer } from "@/components/sections/SectionRenderer";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { CustomizePreviewListener } from "@/components/customize/CustomizePreviewListener";
import { getHomepage } from "@/lib/wordpress/api";

export const dynamic = "force-dynamic";

export default async function CustomizePreviewPage() {
  const page = await getHomepage();
  const sections = page?.sections ?? [];

  return (
    <>
      <SiteLayout currentPath="/">
        {sections.length > 0 ? (
          <SectionRenderer sections={sections} />
        ) : (
          <section className="corp-section">
            <div className="corp-container py-5 text-center">
              <p className="text-muted mb-0">Homepage preview — add sections in the admin to see more content here.</p>
            </div>
          </section>
        )}
      </SiteLayout>
      <CustomizePreviewListener />
    </>
  );
}
