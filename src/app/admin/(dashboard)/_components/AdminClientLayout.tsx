"use client";

import { useState } from "react";

import { Sidebar } from "./sidebar";

export function AdminClientLayout({ children, topbar }: { children: React.ReactNode; topbar: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        {topbar}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
