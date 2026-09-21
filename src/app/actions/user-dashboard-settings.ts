"use server";

import { revalidatePath } from "next/cache";
import { defaultUserDashboardSettings, type UserDashboardSettings } from "@/components/user-dashboard/types";
import prisma from "@/lib/db";

const KEY = "USER_DASHBOARD_SETTINGS";

export async function getUserDashboardSettings(): Promise<UserDashboardSettings> {
  const setting = await prisma.setting.findUnique({ where: { key: KEY } });
  if (!setting) return defaultUserDashboardSettings;
  try {
    const parsed = JSON.parse(setting.value);
    return { ...defaultUserDashboardSettings, ...parsed, hero: { ...defaultUserDashboardSettings.hero, ...parsed.hero }, bookings: { ...defaultUserDashboardSettings.bookings, ...parsed.bookings }, services: { ...defaultUserDashboardSettings.services, ...parsed.services }, activity: { ...defaultUserDashboardSettings.activity, ...parsed.activity } };
  } catch { return defaultUserDashboardSettings; }
}

export async function updateUserDashboardSettings(settings: UserDashboardSettings) {
  await prisma.setting.upsert({ where: { key: KEY }, update: { value: JSON.stringify(settings) }, create: { key: KEY, value: JSON.stringify(settings) } });
  revalidatePath("/account");
  revalidatePath("/admin/pages/user-dashboard");
  return { success: true };
}
