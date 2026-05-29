import { SiteLayout } from "@/components/layout/SiteLayout";
import { MemberBlogEditor } from "@/components/member/MemberBlogEditor";
import { PageHeader } from "@/components/ui/PageHeader";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditMemberBlogPage({ params }: Props) {
  const { id } = await params;
  return (
    <SiteLayout currentPath={`/account/blog/${id}`}>
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Edit post" },
        ]}
      />
      <section className="content-page-section member-area">
        <div className="corp-container">
          <h2 className="member-area__page-title">Edit blog submission</h2>
          <MemberBlogEditor postId={Number(id)} />
        </div>
      </section>
    </SiteLayout>
  );
}
