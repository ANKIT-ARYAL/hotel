/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AdminClientLayout({ children, session }: { children: React.ReactNode; session?: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div data-admin-shell className="min-h-screen h-dvh flex w-full min-w-0 overflow-x-hidden">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} session={session} />
      <div
        className={`flex-1 min-h-0 flex flex-col min-w-0 transition-all duration-300 ${isCollapsed ? "md:ml-20" : "md:ml-64"}`}
      >
        <Topbar session={session} />
        <main className="flex-1 min-h-0 min-w-0 p-6 overflow-x-hidden overflow-y-auto overscroll-y-contain">{children}</main>
      </div>
    </div>
  );
}
