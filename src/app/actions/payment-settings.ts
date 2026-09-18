"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/db";
import { defaultPaymentSettings, type PaymentSettings } from "@/lib/payment-settings-types";

export async function getPaymentSettings(): Promise<PaymentSettings> {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: "payment-settings" },
    });

    if (!setting) {
      return defaultPaymentSettings;
    }

    return JSON.parse(setting.value) as PaymentSettings;
  } catch (error) {
    console.error("Failed to get payment settings:", error);
    return defaultPaymentSettings;
  }
}

export async function updatePaymentSettings(settings: PaymentSettings) {
  try {
    await prisma.setting.upsert({
      where: { key: "payment-settings" },
      update: { value: JSON.stringify(settings) },
      create: {
        key: "payment-settings",
        value: JSON.stringify(settings),
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/(dashboard)/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to update payment settings:", error);
    return { success: false, error: "Failed to update settings" };
  }
}
