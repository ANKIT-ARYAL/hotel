"use server";

import { revalidatePath } from "next/cache";
import { defaultHomepageSettings, type HomepageSettings } from "@/components/homepage/types";
import prisma from "@/lib/db";

const HOMEPAGE_SETTINGS_KEY = "homepage_settings";

export async function getFooterSettings(): Promise<HomepageSettings["footer"]> {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: HOMEPAGE_SETTINGS_KEY } });
    const parsed = setting ? JSON.parse(setting.value) : {};
    return { ...defaultHomepageSettings.footer, ...(parsed.footer || {}) };
  } catch (error) {
    console.error("Error fetching footer settings:", error);
    return defaultHomepageSettings.footer;
  }
}

export async function updateFooterSettings(footer: HomepageSettings["footer"]) {
  try {
    const setting = await prisma.setting.findUnique({ where: { key: HOMEPAGE_SETTINGS_KEY } });
    const current = setting ? JSON.parse(setting.value) : defaultHomepageSettings;
    await prisma.setting.upsert({
      where: { key: HOMEPAGE_SETTINGS_KEY },
      update: { value: JSON.stringify({ ...current, footer }) },
      create: { key: HOMEPAGE_SETTINGS_KEY, value: JSON.stringify({ ...defaultHomepageSettings, footer }) },
    });
    revalidatePath("/");
    revalidatePath("/admin/settings/footer");
    revalidatePath("/admin/pages/homepage");
    return { success: true };
  } catch (error) {
    console.error("Error updating footer settings:", error);
    return { success: false, error: "Failed to update footer settings" };
  }
}
