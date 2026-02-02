import { LayoutDashboard } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function Topbar() {
  return (
    <header className="w-full rounded-2xl bg-primary text-white">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3 font-semibold">
          <LayoutDashboard size={18} />
          <span className="text-lg">Dashboard</span>
        </div>

        <div className="flex items-center gap-6 py-2">
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
