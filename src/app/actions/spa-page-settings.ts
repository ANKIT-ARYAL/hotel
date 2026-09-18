"use server";

import { revalidatePath } from "next/cache";

import { defaultSpaPageSettings, type SpaPageSettings } from "@/components/spa/types";
import prisma from "@/lib/db";

const SPA_PAGE_SETTINGS_KEY = "SPA_PAGE_SETTINGS";

export async function getSpaPageSettings(): Promise<SpaPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: SPA_PAGE_SETTINGS_KEY },
    });

    if (!setting) {
      return defaultSpaPageSettings;
    }

    const parsed = JSON.parse(setting.value);
    // Deep merge to ensure all keys exist
    return {
      ...defaultSpaPageSettings,
      ...parsed,
      hero: { ...defaultSpaPageSettings.hero, ...(parsed.hero || {}) },
      intro: { ...defaultSpaPageSettings.intro, ...(parsed.intro || {}) },
      treatments: { ...defaultSpaPageSettings.treatments, ...(parsed.treatments || {}) },
      facilities: { ...defaultSpaPageSettings.facilities, ...(parsed.facilities || {}) },
    };
  } catch (error) {
    console.error("Error fetching spa page settings:", error);
    return defaultSpaPageSettings;
  }
}

export async function updateSpaPageSettings(settings: SpaPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: SPA_PAGE_SETTINGS_KEY },
      update: { value: JSON.stringify(settings) },
      create: {
        key: SPA_PAGE_SETTINGS_KEY,
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/spa");
    revalidatePath("/admin/pages/spa");
    return { success: true };
  } catch (error) {
    console.error("Error updating spa page settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
