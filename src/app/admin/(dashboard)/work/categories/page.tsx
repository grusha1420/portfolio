import { AdminCategoriesList } from "~/components/admin/AdminCategoriesList";
import { AdminWorkSubNav } from "~/components/admin/AdminWorkSubNav";

export default function AdminWorkCategoriesPage() {
  return (
    <div className="flex flex-col gap-6">
      <AdminWorkSubNav />
      <AdminCategoriesList />
    </div>
  );
}
