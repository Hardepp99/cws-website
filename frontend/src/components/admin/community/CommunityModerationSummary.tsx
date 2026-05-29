import Link from "next/link";

type Counts = {
  blogComments?: number;
  memberBlogs?: number;
  forumTopics?: number;
  forumReplies?: number;
};

export function CommunityModerationSummary({ counts }: { counts: Counts }) {
  const cards = [
    {
      label: "Pending comments",
      value: counts.blogComments ?? 0,
      href: "/admin/community/comments?status=pending",
    },
    {
      label: "Member posts to review",
      value: counts.memberBlogs ?? 0,
      href: "/admin/community/posts?status=pending_review",
    },
    {
      label: "Pending forum topics",
      value: counts.forumTopics ?? 0,
      href: "/admin/forums/topics?status=pending",
    },
    {
      label: "Pending forum replies",
      value: counts.forumReplies ?? 0,
      href: "/admin/forums/replies?status=pending",
    },
  ];

  return (
    <div className="community-mod-summary">
      {cards.map((card) => (
        <Link key={card.href} href={card.href} className="community-mod-summary__card">
          <strong>{card.value}</strong>
          <span>{card.label}</span>
        </Link>
      ))}
    </div>
  );
}
