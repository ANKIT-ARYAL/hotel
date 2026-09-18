"use server";

import { revalidatePath } from "next/cache";

import { defaultNavbarSettings, type NavbarSettings } from "@/components/homepage/NavbarManagerTypes";
import prisma from "@/lib/db";

const NAVBAR_SETTINGS_KEY = "NAVBAR_SETTINGS";

export async function getNavbarSettings(): Promise<NavbarSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: NAVBAR_SETTINGS_KEY },
    });

    if (!setting) {
      return defaultNavbarSettings;
    }

    const parsed = JSON.parse(setting.value);
    return {
      ...defaultNavbarSettings,
      ...parsed,
    };
  } catch (error) {
    console.error("Error fetching navbar settings:", error);
    return defaultNavbarSettings;
  }
}

export async function updateNavbarSettings(settings: NavbarSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: NAVBAR_SETTINGS_KEY },
      update: { value: JSON.stringify(settings) },
      create: {
        key: NAVBAR_SETTINGS_KEY,
        value: JSON.stringify(settings),
      },
    });

    // Revalidate everything that uses the navbar
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error updating navbar settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
