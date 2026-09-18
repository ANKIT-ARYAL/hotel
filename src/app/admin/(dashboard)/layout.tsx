/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * Website: https://flyuptechnology.com
 * @author FlyUp Technology Pvt. Ltd.
 */

import type { ReactNode } from "react";

import { AdminClientLayout } from "./_components/AdminClientLayout";
import { Topbar } from "./_components/topbar";

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return <AdminClientLayout topbar={<Topbar />}>{children}</AdminClientLayout>;
}
