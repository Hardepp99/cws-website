"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default function AdminBlogNewPage() {
  return (
    <AdminShell title="Add post">
      <BlogPostForm isNew />
    </AdminShell>
  );
}
