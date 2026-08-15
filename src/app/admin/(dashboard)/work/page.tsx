import { AdminWorkList } from "~/components/admin/AdminWorkList";
import { AdminWorkSubNav } from "~/components/admin/AdminWorkSubNav";

export default function AdminWorkPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminWorkSubNav />
      <AdminWorkList />
    </div>
  );
}
