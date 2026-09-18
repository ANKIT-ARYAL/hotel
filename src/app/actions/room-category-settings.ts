"use server";

import { revalidatePath } from "next/cache";

import { defaultRoomsPageSettings, type RoomsPageSettings } from "@/components/rooms/types";
import prisma from "@/lib/db";

// We'll reuse RoomsPageSettings for category specific settings,
// as it contains 'detailsHero', 'amenitiesSection', and 'bookingCta'.
export async function getRoomCategorySettings(categoryId: string): Promise<RoomsPageSettings> {
  try {
    const settingKey = `room_category_settings_${categoryId}`;
    const setting = await prisma.setting.findUnique({
      where: { key: settingKey },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultRoomsPageSettings,
        ...parsed,
        detailsHero: { ...defaultRoomsPageSettings.detailsHero, ...parsed.detailsHero },
        amenitiesSection: { ...defaultRoomsPageSettings.amenitiesSection, ...parsed.amenitiesSection },
        bookingCta: { ...defaultRoomsPageSettings.bookingCta, ...parsed.bookingCta },
      } as RoomsPageSettings;
    }

    return defaultRoomsPageSettings;
  } catch (error) {
    console.error("Error fetching room category settings:", error);
    return defaultRoomsPageSettings;
  }
}

export async function updateRoomCategorySettings(categoryId: string, settings: RoomsPageSettings) {
  try {
    const settingKey = `room_category_settings_${categoryId}`;
    await prisma.setting.upsert({
      where: { key: settingKey },
      update: {
        value: JSON.stringify(settings),
      },
      create: {
        key: settingKey,
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/rooms-and-suites/[slug]", "page");
    revalidatePath("/admin/pages/rooms");
    return { success: true };
  } catch (error) {
    console.error("Error updating room category settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
