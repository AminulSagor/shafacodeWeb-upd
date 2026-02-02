"use client";

import React from "react";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await fetch("/api/client/logout", { method: "POST" });
      window.location.href = "/client/login";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="cursor-pointer flex items-center gap-2 text-sm font-semibold opacity-95 hover:opacity-100"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
