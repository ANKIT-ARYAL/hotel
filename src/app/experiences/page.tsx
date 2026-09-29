import React from "react";
import type { Metadata } from "next";

import { getExperiencesPageSettings } from "@/app/actions/experiences-page-settings";
import { auth } from "@/lib/auth";
import { ExperiencesFeatured } from "@/components/experiences/ExperiencesFeatured";
import { ExperiencesHero } from "@/components/experiences/ExperiencesHero";
import { ExperiencesIntro } from "@/components/experiences/ExperiencesIntro";
import { ExperiencesLocalGuide } from "@/components/experiences/ExperiencesLocalGuide";




export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getExperiencesPageSettings();
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
      title: seoTitle || "Experiences | Hotel Luxury",
      description: metaDescription || "Unforgettable moments tailored exclusively for our guests.",
      keywords: keywords || undefined,
    };
  } catch (error) {
    return {
      title: "Experiences | Hotel Luxury",
      description: "Unforgettable moments tailored exclusively for our guests.",
    };
  }
}

export default async function ExperiencesPage() {
  const settings = await getExperiencesPageSettings();
  const session = await auth();

  return (
    <main className="min-h-screen text-foreground">
      <ExperiencesHero settings={settings.hero} />
      <ExperiencesIntro settings={settings.intro} />
      <ExperiencesFeatured settings={settings.featured} isLoggedIn={(() => { const role = session?.user?.role as unknown as string | { name?: string } | undefined; return (typeof role === "string" ? role : role?.name) === "USER"; })()} />
      <ExperiencesLocalGuide settings={settings.localGuide} />
    </main>
  );
}
