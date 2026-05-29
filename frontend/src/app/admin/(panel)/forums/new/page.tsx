import { AdminRequireAdmin } from "@/components/admin/AdminRequireAdmin";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminSectionTabs, FORUMS_TABS } from "@/components/admin/community/AdminSectionTabs";
import { ForumForm } from "@/components/admin/forums/ForumForm";

export default function AdminForumNewPage() {
  return (
    <AdminShell title="Add forum">
      <AdminRequireAdmin>
        <AdminSectionTabs tabs={FORUMS_TABS} />
        <ForumForm isNew />
      </AdminRequireAdmin>
    </AdminShell>
  );
}
