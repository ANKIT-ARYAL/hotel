import React from "react";

import type { Metadata } from "next";

import { getAboutPageSettings } from "@/app/actions/about-page-settings";
import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { AboutHero } from "@/components/about/AboutHero";
import { CoreValues } from "@/components/about/CoreValues";
import { OurStory } from "@/components/about/OurStory";
import { TeamSection } from "@/components/about/TeamSection";
import { BookingCtaSection } from "@/components/homepage/BookingCtaSection";

export const metadata: Metadata = {
  title: "About Us | Hotel Luxury",
  description: "Learn about the heritage, mission, and team behind Hotel Luxury.",
};

export default async function AboutPage() {
  const settings = await getAboutPageSettings();
  const hpSettings = await getHomepageSettings();

  return (
    <div className="min-h-screen bg-white">
      <main className="flex flex-col w-full">
        {settings.hero.isVisible && <AboutHero settings={settings.hero} />}
        {settings.ourStory.isVisible && <OurStory settings={settings.ourStory} />}
        {settings.coreValues.isVisible && <CoreValues settings={settings.coreValues} />}
        {settings.team.isVisible && <TeamSection settings={settings.team} />}

        {/* Reuse the Booking CTA from homepage settings for consistency */}
        {hpSettings.bookingCta?.isVisible && settings.contactBlock.isVisible && (
          <BookingCtaSection
            settings={{
              ...hpSettings.bookingCta,
              title: settings.contactBlock.title,
              description: settings.contactBlock.description,
              buttonLabel: settings.contactBlock.buttonLabel,
            }}
          />
        )}
      </main>
    </div>
  );
}
