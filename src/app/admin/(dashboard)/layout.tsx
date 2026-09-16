import { ReactNode } from 'react';
import { Sidebar } from './_components/sidebar';
import { Topbar } from './_components/topbar';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen md:ml-64">
        <Topbar />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
