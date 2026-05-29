import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { ForumTopics } from "@/components/community/ForumTopics";
import { PageHeader } from "@/components/ui/PageHeader";
import { cmsFetch } from "@/lib/member/cms";

interface Props {
  params: Promise<{ forumSlug: string }>;
}

export default async function ForumPage({ params }: Props) {
  const { forumSlug } = await params;
  const data = await cmsFetch<{
    forum: { title: string; slug: string };
    items: Array<{
      id: number;
      slug: string;
      title: string;
      replyCount: number;
      isPinned: boolean;
      authorName: string;
      lastActivity: string;
    }>;
  }>(`/community/forums/${forumSlug}`);

  if (!data?.forum) notFound();

  return (
    <SiteLayout currentPath={`/community/${forumSlug}`}>
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Community", href: "/community" },
          { label: data.forum.title },
        ]}
      />
      <section className="content-page-section community-page">
        <div className="corp-container">
          <ForumTopics forumSlug={forumSlug} forumTitle={data.forum.title} initialTopics={data.items} />
        </div>
      </section>
    </SiteLayout>
  );
}
