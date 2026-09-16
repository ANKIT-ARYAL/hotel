import { notFound } from "next/navigation";
import { RoomDetails } from "../_components/RoomDetails";
import prisma from "@/lib/db";
import { getHomepageSettings } from '@/app/actions/homepage-settings';
import { getRoomsPageSettings } from '@/app/actions/rooms-page-settings';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const room = await prisma.roomCategory.findUnique({
    where: { slug: resolvedParams.slug },
  });

  if (!room) {
    return {
      title: 'Room Not Found - Hotel Luxury',
    };
  }

  return {
    title: `${room.name} - Hotel Luxury`,
    description: room.description || `Discover the luxurious ${room.name}.`,
  };
}

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const settings = await getHomepageSettings();
  const roomsSettings = await getRoomsPageSettings();
  const resolvedParams = await params;
  
  const room = await prisma.roomCategory.findUnique({
    where: { slug: resolvedParams.slug },
    include: {
      images: true,
      amenities: true,
      rooms: true
    }
  });

  if (!room) {
    notFound();
  }

  return (
    <main className="min-h-screen text-foreground">
      <RoomDetails room={room} settings={roomsSettings} />
    </main>
  );
}
