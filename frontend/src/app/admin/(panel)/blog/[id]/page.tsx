"use client";

import { useParams } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export default function AdminBlogEditPage() {
  const params = useParams();
  const id = parseInt(String(params.id), 10);

  return (
    <AdminShell title="Edit post">
      <BlogPostForm postId={id} />
    </AdminShell>
  );
}
