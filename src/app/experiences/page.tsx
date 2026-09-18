import React from "react";

import { getExperiencesPageSettings } from "@/app/actions/experiences-page-settings";
import { ExperiencesFeatured } from "@/components/experiences/ExperiencesFeatured";
import { ExperiencesHero } from "@/components/experiences/ExperiencesHero";
import { ExperiencesIntro } from "@/components/experiences/ExperiencesIntro";
import { ExperiencesLocalGuide } from "@/components/experiences/ExperiencesLocalGuide";

export const metadata = {
  title: "Experiences | Hotel Luxury",
  description: "Unforgettable moments tailored exclusively for our guests.",
};

export default async function ExperiencesPage() {
  const settings = await getExperiencesPageSettings();

  return (
    <main className="min-h-screen text-foreground">
      <ExperiencesHero settings={settings.hero} />
      <ExperiencesIntro settings={settings.intro} />
      <ExperiencesFeatured settings={settings.featured} />
      <ExperiencesLocalGuide settings={settings.localGuide} />
    </main>
  );
}
