import React from "react";

import { getGalleryPageSettings } from "@/app/actions/gallery-page-settings";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryMasonry } from "@/components/gallery/GalleryMasonry";

export const metadata = {
  title: "Gallery | Hotel Luxury",
  description: "Explore the architectural elegance and exquisite interiors of our resort.",
};

export default async function GalleryPage() {
  const settings = await getGalleryPageSettings();

  return (
    <main className="min-h-screen text-foreground bg-white">
      <GalleryHero settings={settings.hero} />
      <GalleryMasonry settings={settings} />
    </main>
  );
}
