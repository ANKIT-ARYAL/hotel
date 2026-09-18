"use server";

import { revalidatePath } from "next/cache";

import type { FaqPageSettings } from "@/components/faq/types";
import prisma from "@/lib/db";

const defaultFaqPageSettings: FaqPageSettings = {
  hero: {
    isVisible: true,
    title: "Frequently Asked Questions",
    subtitle: "Find answers to common questions about our services and amenities.",
  },
  faqs: {
    isVisible: true,
    items: [
      {
        question: "What are the check-in and check-out times?",
        answer:
          "Standard check-in is at 3:00 PM and check-out is at 12:00 PM. Early check-in or late check-out can be requested and is subject to availability.",
      },
      {
        question: "Is breakfast included in the room rate?",
        answer:
          "Breakfast inclusion depends on the specific room rate or package you select during booking. Please check the rate details for specific information.",
      },
    ],
  },
};

export async function getFaqPageSettings(): Promise<FaqPageSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "faq_settings" },
    });

    if (setting) {
      const parsed = JSON.parse(setting.value);
      return {
        ...defaultFaqPageSettings,
        ...parsed,
        hero: { ...defaultFaqPageSettings.hero, ...parsed.hero },
        faqs: { ...defaultFaqPageSettings.faqs, ...parsed.faqs },
      } as FaqPageSettings;
    }

    return defaultFaqPageSettings;
  } catch (error) {
    console.error("Failed to get FAQ page settings:", error);
    return defaultFaqPageSettings;
  }
}

export async function updateFaqPageSettings(settings: FaqPageSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: "faq_settings" },
      update: { value: JSON.stringify(settings) },
      create: {
        key: "faq_settings",
        value: JSON.stringify(settings),
      },
    });

    revalidatePath("/faq");
    revalidatePath("/admin/pages/faq");
    return { success: true };
  } catch (error) {
    console.error("Failed to update FAQ page settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
