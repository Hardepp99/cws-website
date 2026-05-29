import { notFound } from "next/navigation";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { TopicThread } from "@/components/community/TopicThread";
import { cmsFetch } from "@/lib/member/cms";

interface Props {
  params: Promise<{ forumSlug: string; topicSlug: string }>;
}

export default async function TopicPage({ params }: Props) {
  const { forumSlug, topicSlug } = await params;
  const data = await cmsFetch<{
    forum: { title: string; slug: string };
    topic: {
      id: number;
      title: string;
      body: string;
      authorName: string;
      createdAt: string;
      replies: Array<{ id: number; body: string; displayName: string; createdAt: string }>;
    };
  }>(`/community/forums/${forumSlug}/${topicSlug}`);

  if (!data?.topic) notFound();

  return (
    <SiteLayout currentPath={`/community/${forumSlug}/${topicSlug}`}>
      <section className="content-page-section community-page">
        <div className="corp-container">
          <TopicThread forumSlug={forumSlug} forumTitle={data.forum.title} topic={data.topic} />
        </div>
      </section>
    </SiteLayout>
  );
}
