"use server";

import { revalidatePath } from "next/cache";

import { defaultExperiencesPageSettings, type ExperiencesPageSettings } from "@/components/experiences/types";
import prisma from "@/lib/db";

const EXPERIENCES_PAGE_SETTINGS_KEY = "EXPERIENCES_PAGE_SETTINGS";

export async function getExperiencesPageSettings(): Promise<ExperiencesPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: EXPERIENCES_PAGE_SETTINGS_KEY },
    });

    if (!setting) {
      return defaultExperiencesPageSettings;
    }

    const parsed = JSON.parse(setting.value);
    return {
      ...defaultExperiencesPageSettings,
      ...parsed,
      hero: { ...defaultExperiencesPageSettings.hero, ...(parsed.hero || {}) },
      intro: { ...defaultExperiencesPageSettings.intro, ...(parsed.intro || {}) },
      featured: { ...defaultExperiencesPageSettings.featured, ...(parsed.featured || {}) },
      localGuide: { ...defaultExperiencesPageSettings.localGuide, ...(parsed.localGuide || {}) },
    };
  } catch (error) {
    console.error("Error fetching experiences page settings:", error);
    return defaultExperiencesPageSettings;
  }
}

export async function updateExperiencesPageSettings(settings: ExperiencesPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: EXPERIENCES_PAGE_SETTINGS_KEY },
      update: { value: JSON.stringify(settings) },
      create: {
        key: EXPERIENCES_PAGE_SETTINGS_KEY,
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/experiences");
    revalidatePath("/admin/pages/experiences");
    return { success: true };
  } catch (error) {
    console.error("Error updating experiences page settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
