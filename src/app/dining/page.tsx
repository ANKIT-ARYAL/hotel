import React from "react";

import { getDiningPageSettings } from "@/app/actions/dining-page-settings";
import { DiningFeatureSection } from "@/components/dining/DiningFeatureSection";
import { DiningGridSection } from "@/components/dining/DiningGridSection";
import { DiningHero } from "@/components/dining/DiningHero";
import { DiningIntro } from "@/components/dining/DiningIntro";
import { DiningMenuSection } from "@/components/dining/DiningMenuSection";
import { DiningSliderSection } from "@/components/dining/DiningSliderSection";
import { RestaurantsList } from "@/components/dining/RestaurantsList";

export const metadata = {
  title: "Dining | Our Venues",
  description: "Experience our distinctive dining venues and culinary experiences.",
};

export default async function DiningPage() {
  const settings = await getDiningPageSettings();

  return (
    <main className="min-h-screen text-foreground">
      <DiningHero settings={settings.hero} />
      <DiningIntro settings={settings.intro} />
      <RestaurantsList settings={settings.restaurantsList} />

      {settings.menus?.isVisible && <DiningMenuSection section={settings.menus} />}

      {settings.bar?.isVisible && <DiningSliderSection section={settings.bar} />}
      {settings.events?.isVisible && <DiningFeatureSection section={settings.events} reverse={false} />}
      {settings.liveMusic?.isVisible && <DiningGridSection section={settings.liveMusic} />}
      {settings.privateDining?.isVisible && <DiningFeatureSection section={settings.privateDining} reverse={true} />}
    </main>
  );
}
