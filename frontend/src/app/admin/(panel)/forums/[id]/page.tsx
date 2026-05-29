import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, FORUMS_TABS } from "@/components/admin/community/AdminSectionTabs";
import { ForumForm } from "@/components/admin/forums/ForumForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminForumEditPage({ params }: Props) {
  const { id } = await params;
  return (
    <AdminShell title="Edit forum">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        <ForumForm forumId={Number(id)} />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
