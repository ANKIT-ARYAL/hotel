import React from "react";
import type { Metadata } from "next";

import { getDiningPageSettings } from "@/app/actions/dining-page-settings";
import { auth } from "@/lib/auth";
import { DiningFeatureSection } from "@/components/dining/DiningFeatureSection";
import { DiningGridSection } from "@/components/dining/DiningGridSection";
import { DiningHero } from "@/components/dining/DiningHero";
import { DiningIntro } from "@/components/dining/DiningIntro";
import { DiningMenuSection } from "@/components/dining/DiningMenuSection";
import { DiningSliderSection } from "@/components/dining/DiningSliderSection";
import { RestaurantsList } from "@/components/dining/RestaurantsList";




export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getDiningPageSettings();
    let seoTitle = "";
    let metaDescription = "";
    let keywords = "";
    
    // Search for SEO fields in any section of the settings
    for (const key of Object.keys(settings)) {
      const section = (settings as any)[key];
      if (section && typeof section === 'object') {
        if (section.seoTitle && !seoTitle) seoTitle = section.seoTitle;
        if (section.metaDescription && !metaDescription) metaDescription = section.metaDescription;
        if (section.keywords && !keywords) keywords = section.keywords;
      }
    }
    
    return {
      title: seoTitle || "Dining | Our Venues",
      description: metaDescription || "Experience our distinctive dining venues and culinary experiences.",
      keywords: keywords || undefined,
    };
  } catch (error) {
    return {
      title: "Dining | Our Venues",
      description: "Experience our distinctive dining venues and culinary experiences.",
    };
  }
}

export default async function DiningPage() {
  const settings = await getDiningPageSettings();
  const session = await auth();

  return (
    <main className="min-h-screen text-foreground">
      <DiningHero settings={settings.hero} />
      <DiningIntro settings={settings.intro} />
      <RestaurantsList settings={settings.restaurantsList} isLoggedIn={Boolean(session?.user)} />

      {settings.menus?.isVisible && <DiningMenuSection section={settings.menus} />}

      {settings.bar?.isVisible && <DiningSliderSection section={settings.bar} />}
      {settings.events?.isVisible && <DiningFeatureSection section={settings.events} reverse={false} />}
      {settings.liveMusic?.isVisible && <DiningGridSection section={settings.liveMusic} />}
      {settings.privateDining?.isVisible && <DiningFeatureSection section={settings.privateDining} reverse={true} />}
    </main>
  );
}
