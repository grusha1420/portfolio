import { AdminBlogForm } from "~/components/admin/AdminBlogForm";

interface AdminBlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminBlogEditPage({
  params,
}: AdminBlogEditPageProps) {
  const { id } = await params;

  return <AdminBlogForm postId={id} />;
}
