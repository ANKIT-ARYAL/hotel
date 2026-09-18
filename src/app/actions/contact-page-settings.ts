"use server";

import { revalidatePath } from "next/cache";

import { type ContactPageSettings, defaultContactPageSettings } from "@/components/contact/types";
import prisma from "@/lib/db";

export async function getContactPageSettings(): Promise<ContactPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "contact_settings" },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultContactPageSettings,
        ...parsed,
      } as ContactPageSettings;
    }

    // Seed defaults if missing
    await prisma.setting.upsert({
      where: { key: "contact_settings" },
      update: {},
      create: {
        key: "contact_settings",
        value: JSON.stringify(defaultContactPageSettings),
      },
    });

    return defaultContactPageSettings;
  } catch (error) {
    console.error("Error fetching contact page settings:", error);
    return defaultContactPageSettings;
  }
}

export async function updateContactPageSettings(settings: ContactPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: "contact_settings" },
      update: {
        value: JSON.stringify(settings),
      },
      create: {
        key: "contact_settings",
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/contact");
    revalidatePath("/admin/pages/contact");
    return { success: true };
  } catch (error) {
    console.error("Error updating contact page settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
