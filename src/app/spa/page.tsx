import React from "react";
import type { Metadata } from "next";

import { getSpaPageSettings } from "@/app/actions/spa-page-settings";
import { auth } from "@/lib/auth";
import { SpaFacilitiesSection } from "@/components/spa/SpaFacilitiesSection";
import { SpaHero } from "@/components/spa/SpaHero";
import { SpaIntro } from "@/components/spa/SpaIntro";
import { SpaTreatmentsList } from "@/components/spa/SpaTreatmentsList";




export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getSpaPageSettings();
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
      title: seoTitle || "Spa & Wellness | Hotel Luxury",
      description: metaDescription || "Immerse yourself in an oasis of serenity at our award-winning spa.",
      keywords: keywords || undefined,
    };
  } catch (error) {
    return {
      title: "Spa & Wellness | Hotel Luxury",
      description: "Immerse yourself in an oasis of serenity at our award-winning spa.",
    };
  }
}

export default async function SpaPage() {
  const settings = await getSpaPageSettings();
  const session = await auth();

  return (
    <main className="min-h-screen text-foreground">
      <SpaHero settings={settings.hero} />
      <SpaIntro settings={settings.intro} />
      <SpaTreatmentsList settings={settings.treatments} isLoggedIn={Boolean(session?.user)} />
      <SpaFacilitiesSection settings={settings.facilities} />
    </main>
  );
}
