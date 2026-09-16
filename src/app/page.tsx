import React from 'react';
import { HeroSection } from '@/components/homepage/HeroSection';
import { FeaturedRooms } from '@/components/homepage/FeaturedRooms';
import { AmenitiesSection } from '@/components/homepage/AmenitiesSection';
import { CulinarySection } from '@/components/homepage/CulinarySection';
import { ExperiencesSection } from '@/components/homepage/ExperiencesSection';
import { SpaWellnessSection } from '@/components/homepage/SpaWellnessSection';
import { TestimonialsSection } from '@/components/homepage/TestimonialsSection';
import { OurStorySection } from '@/components/homepage/OurStorySection';
import { BookingCtaSection } from '@/components/homepage/BookingCtaSection';
import { Loader } from '@/components/homepage/Loader';
import { Navbar } from '@/components/homepage/Navbar';
import { getHomepageSettings } from '@/app/actions/homepage-settings';

export default async function Home() {
  const settings = await getHomepageSettings();

  return (
    <div className="min-h-screen">
      {settings.loader.isVisible && <Loader settings={settings.loader} />}
      <Navbar />
      <main className="flex flex-col w-full">
        {settings.hero.isVisible && <HeroSection settings={settings.hero} />}
        {settings.featuredRooms.isVisible && <FeaturedRooms settings={settings.featuredRooms} />}
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
