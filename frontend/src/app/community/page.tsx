import { SiteLayout } from "@/components/layout/SiteLayout";
import { ForumHub } from "@/components/community/ForumHub";
import { PageHeader } from "@/components/ui/PageHeader";
import { cmsFetch } from "@/lib/member/cms";

export default async function CommunityPage() {
  const data = await cmsFetch<{ items: Parameters<typeof ForumHub>[0]["initialForums"] }>("/community/forums");

  return (
    <SiteLayout currentPath="/community">
      <PageHeader breadcrumb={[{ label: "Home", href: "/" }, { label: "Community forum" }]} />
      <section className="content-page-section community-page">
        <div className="corp-container">
          <h1 className="community-page__title">Community</h1>
          <ForumHub initialForums={data?.items ?? []} />
        </div>
      </section>
    </SiteLayout>
  );
}
