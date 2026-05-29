import Link from "next/link";
import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, COMMUNITY_TABS } from "@/components/admin/community/AdminSectionTabs";
import { CommunityModerationSummary } from "@/components/admin/community/CommunityModerationSummary";
import { cmsAdminFetch } from "@/lib/admin/server";

type ModerationCounts = {
  blogComments: number;
  memberBlogs: number;
  forumTopics: number;
  forumReplies: number;
};

export default async function AdminCommunityHubPage() {
  let counts: ModerationCounts = { blogComments: 0, memberBlogs: 0, forumTopics: 0, forumReplies: 0 };
  let err = "";

  try {
    counts = await cmsAdminFetch<ModerationCounts>("/community/moderation-counts");
  } catch (e) {
    err = String(e);
  }

  return (
    <AdminShell title="Community">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={COMMUNITY_TABS} />
        {err ? <div className="cms-notice err">{err}</div> : null}
        <div className="cms-card">
          <h2 className="wp-heading-inline" style={{ marginTop: 0 }}>
            Community moderation
          </h2>
          <p className="cms-field-hint">
            Review member blog comments, submitted articles, and forum activity before they appear on the public site.
          </p>
          <CommunityModerationSummary counts={counts} />
          <ul className="community-hub-links">
            <li>
              <Link href="/admin/community/comments">Blog comments</Link>
              {counts.blogComments > 0 ? <span className="community-hub-links__badge">{counts.blogComments} pending</span> : null}
            </li>
            <li>
              <Link href="/admin/community/posts">Member blog posts</Link>
              {counts.memberBlogs > 0 ? <span className="community-hub-links__badge">{counts.memberBlogs} pending</span> : null}
            </li>
            <li>
              <Link href="/admin/forums">Forums</Link>
            </li>
            <li>
              <Link href="/admin/forums/topics">Forum topics</Link>
              {counts.forumTopics > 0 ? <span className="community-hub-links__badge">{counts.forumTopics} pending</span> : null}
            </li>
            <li>
              <Link href="/admin/forums/replies">Forum replies</Link>
              {counts.forumReplies > 0 ? <span className="community-hub-links__badge">{counts.forumReplies} pending</span> : null}
            </li>
            <li>
              <Link href="/admin/members">Site members</Link>
            </li>
          </ul>
        </div>
      </AdminRequireAdmin>
    </AdminShell>
  );
}
