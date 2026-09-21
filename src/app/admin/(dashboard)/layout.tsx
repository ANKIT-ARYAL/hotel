/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * Website: https://flyuptechnology.com
 * @author FlyUp Technology Pvt. Ltd.
 */

import type { ReactNode } from "react";
import { auth } from "@/lib/auth";

import { AdminClientLayout } from "./_components/AdminClientLayout";

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  return <AdminClientLayout session={session}>{children}</AdminClientLayout>;
}
