import React from "react";

import { getHomepageSettings } from "@/app/actions/homepage-settings";
import { AmenitiesSection } from "@/components/homepage/AmenitiesSection";
import { BookingCtaSection } from "@/components/homepage/BookingCtaSection";
import { CulinarySection } from "@/components/homepage/CulinarySection";
import { ExperiencesSection } from "@/components/homepage/ExperiencesSection";
import { FeaturedRooms } from "@/components/homepage/FeaturedRooms";
import { HeroSection } from "@/components/homepage/HeroSection";
import { Loader } from "@/components/homepage/Loader";
import { OurStorySection } from "@/components/homepage/OurStorySection";
import { SpaWellnessSection } from "@/components/homepage/SpaWellnessSection";
import { TestimonialsSection } from "@/components/homepage/TestimonialsSection";
import prisma from "@/lib/db";

export default async function Home() {
  const settings = await getHomepageSettings();
  const categories = await prisma.roomCategory.findMany({
    include: { images: true, amenities: true },
  });

  return (
    <div className="min-h-screen">
      {settings.loader.isVisible && <Loader settings={settings.loader} />}
      <main className="flex flex-col w-full">
        {settings.hero.isVisible && <HeroSection settings={settings.hero} />}
        {settings.featuredRooms.isVisible && (
          <FeaturedRooms settings={settings.featuredRooms} categories={categories} />
        )}
        {settings.culinary.isVisible && <CulinarySection settings={settings.culinary} />}
        {settings.experiences?.isVisible && <ExperiencesSection settings={settings.experiences} />}
        {settings.spaWellness.isVisible && <SpaWellnessSection settings={settings.spaWellness} />}
        {settings.amenities.isVisible && <AmenitiesSection settings={settings.amenities} />}
        {settings.testimonials.isVisible && <TestimonialsSection settings={settings.testimonials} />}
        {settings.ourStory?.isVisible && <OurStorySection settings={settings.ourStory} />}
        {settings.bookingCta?.isVisible && <BookingCtaSection settings={settings.bookingCta} />}
      </main>
    </div>
  );
}
