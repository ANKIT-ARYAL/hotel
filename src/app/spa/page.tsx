import React from "react";

import { getSpaPageSettings } from "@/app/actions/spa-page-settings";
import { SpaFacilitiesSection } from "@/components/spa/SpaFacilitiesSection";
import { SpaHero } from "@/components/spa/SpaHero";
import { SpaIntro } from "@/components/spa/SpaIntro";
import { SpaTreatmentsList } from "@/components/spa/SpaTreatmentsList";

export const metadata = {
  title: "Spa & Wellness | Hotel Luxury",
  description: "Immerse yourself in an oasis of serenity at our award-winning spa.",
};

export default async function SpaPage() {
  const settings = await getSpaPageSettings();

  return (
    <main className="min-h-screen text-foreground">
      <SpaHero settings={settings.hero} />
      <SpaIntro settings={settings.intro} />
      <SpaTreatmentsList settings={settings.treatments} />
      <SpaFacilitiesSection settings={settings.facilities} />
    </main>
  );
}
