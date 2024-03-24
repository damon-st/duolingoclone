import { getIsAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarAdmin } from "./_components/sidebar";

type Props = {
  children: ReactNode;
};

export default function AdminLayout({ children }: Props) {
  if (!getIsAdmin()) {
    return redirect("/shop");
  }
  return (
    <div className="size-full flex">
      <SidebarAdmin />
      {children}
    </div>
  );
}
