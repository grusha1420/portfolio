import { AdminWorkForm } from "~/components/admin/AdminWorkForm";
import { AdminWorkSubNav } from "~/components/admin/AdminWorkSubNav";

interface AdminWorkEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminWorkEditPage({
  params,
}: AdminWorkEditPageProps) {
  const { id } = await params;

  return (
    <div className="flex flex-col gap-6">
      <AdminWorkSubNav />
      <AdminWorkForm workId={id} />
    </div>
  );
}
