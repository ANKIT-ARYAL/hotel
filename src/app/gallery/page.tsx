import React from "react";
import type { Metadata } from "next";

import { getGalleryPageSettings } from "@/app/actions/gallery-page-settings";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryMasonry } from "@/components/gallery/GalleryMasonry";




export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getGalleryPageSettings();
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
      title: seoTitle || "Gallery | Hotel Luxury",
      description: metaDescription || "Explore the architectural elegance and exquisite interiors of our resort.",
      keywords: keywords || undefined,
    };
  } catch (error) {
    return {
      title: "Gallery | Hotel Luxury",
      description: "Explore the architectural elegance and exquisite interiors of our resort.",
    };
  }
}

export default async function GalleryPage() {
  const settings = await getGalleryPageSettings();

  return (
    <main className="min-h-screen text-foreground bg-white">
      <GalleryHero settings={settings.hero} />
      <GalleryMasonry settings={settings} />
    </main>
  );
}
