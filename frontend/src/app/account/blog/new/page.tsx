import { SiteLayout } from "@/components/layout/SiteLayout";
import { MemberBlogEditor } from "@/components/member/MemberBlogEditor";
import { PageHeader } from "@/components/ui/PageHeader";

export default function NewMemberBlogPage() {
  return (
    <SiteLayout currentPath="/account/blog/new">
      <PageHeader
        breadcrumb={[
          { label: "Home", href: "/" },
          { label: "Account", href: "/account" },
          { label: "Write post" },
        ]}
      />
      <section className="content-page-section member-area">
        <div className="corp-container">
          <h2 className="member-area__page-title">Submit a blog post</h2>
          <MemberBlogEditor />
        </div>
      </section>
    </SiteLayout>
  );
}
