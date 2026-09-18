"use server";

import { revalidatePath } from "next/cache";

import { defaultGalleryPageSettings, type GalleryPageSettings } from "@/components/gallery/types";
import prisma from "@/lib/db";

const GALLERY_PAGE_SETTINGS_KEY = "GALLERY_PAGE_SETTINGS";

export async function getGalleryPageSettings(): Promise<GalleryPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: GALLERY_PAGE_SETTINGS_KEY },
    });

    if (!setting) {
      return defaultGalleryPageSettings;
    }

    const parsed = JSON.parse(setting.value);
    return {
      ...defaultGalleryPageSettings,
      ...parsed,
      hero: { ...defaultGalleryPageSettings.hero, ...(parsed.hero || {}) },
      categories: parsed.categories || defaultGalleryPageSettings.categories,
      images: parsed.images || defaultGalleryPageSettings.images,
    };
  } catch (error) {
    console.error("Error fetching gallery page settings:", error);
    return defaultGalleryPageSettings;
  }
}

export async function updateGalleryPageSettings(settings: GalleryPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: GALLERY_PAGE_SETTINGS_KEY },
      update: { value: JSON.stringify(settings) },
      create: {
        key: GALLERY_PAGE_SETTINGS_KEY,
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/gallery");
    revalidatePath("/admin/pages/gallery");
    return { success: true };
  } catch (error) {
    console.error("Error updating gallery page settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
