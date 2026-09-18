import { PrismaClient } from "@prisma/client";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { getPaymentSettings } from "@/app/actions/payment-settings";

import { SettingsClientView } from "./settings-client";

const prisma = new PrismaClient();

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany({
    orderBy: { key: "asc" },
  });

  const homepageSettings = await getHomepageSettings();
  const paymentSettings = await getPaymentSettings();

  return (
    <SettingsClientView
      initialSettings={settings}
      initialHomepageSettings={homepageSettings}
      initialPaymentSettings={paymentSettings}
    />
  );
}
