import { AdminWorkForm } from "~/components/admin/AdminWorkForm";
import { AdminWorkSubNav } from "~/components/admin/AdminWorkSubNav";

export default function AdminWorkNewPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminWorkSubNav />
      <AdminWorkForm />
    </div>
  );
}
