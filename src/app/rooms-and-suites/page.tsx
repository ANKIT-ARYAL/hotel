/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRoomsPageSettings } from "@/app/actions/rooms-page-settings";
import type { Metadata } from "next";
import prisma from "@/lib/db";

import { RoomsList } from "./_components/RoomsList";


export const revalidate = 60;




export async function generateMetadata(): Promise<Metadata> {
  try {
    const settings = await getRoomsPageSettings();
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
      title: seoTitle || "Rooms & Suites - Hotel Luxury",
      description: metaDescription || "Discover our luxury rooms and suites.",
      keywords: keywords || undefined,
    };
  } catch (error) {
    return {
      title: "Rooms & Suites - Hotel Luxury",
      description: "Discover our luxury rooms and suites.",
    };
  }
}

export default async function RoomsAndSuitesPage() {
  const roomsSettings = await getRoomsPageSettings();
  const categories = await prisma.roomCategory.findMany({
    include: {
      images: true,
      amenities: true,
    },
    orderBy: { basePrice: "asc" },
  });

  return (
    <main className="min-h-screen text-foreground">
      <RoomsList categories={categories} settings={roomsSettings} />
    </main>
  );
}
