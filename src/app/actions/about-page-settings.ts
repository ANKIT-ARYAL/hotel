"use server";

import { revalidatePath } from "next/cache";

import { type AboutPageSettings, defaultAboutPageSettings } from "@/components/about/types";
import prisma from "@/lib/db";

export async function getAboutPageSettings(): Promise<AboutPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "about_settings" },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultAboutPageSettings,
        ...parsed,
        hero: { ...defaultAboutPageSettings.hero, ...parsed.hero },
        ourStory: { ...defaultAboutPageSettings.ourStory, ...parsed.ourStory },
        coreValues: { ...defaultAboutPageSettings.coreValues, ...parsed.coreValues },
        team: { ...defaultAboutPageSettings.team, ...parsed.team },
        contactBlock: { ...defaultAboutPageSettings.contactBlock, ...parsed.contactBlock },
      } as AboutPageSettings;
    }

    // Seed defaults if missing
    await prisma.setting.upsert({
      where: { key: "about_settings" },
      update: {},
      create: {
        key: "about_settings",
        value: JSON.stringify(defaultAboutPageSettings),
      },
    });

    return defaultAboutPageSettings;
  } catch (error) {
    console.error("Error fetching about page settings:", error);
    return defaultAboutPageSettings;
  }
}

export async function updateAboutPageSettings(settings: AboutPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: "about_settings" },
      update: {
        value: JSON.stringify(settings),
      },
      create: {
        key: "about_settings",
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/about");
    revalidatePath("/admin/pages/about");
    return { success: true };
  } catch (error) {
    console.error("Error updating about page settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
