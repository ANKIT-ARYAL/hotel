import { RoomsList } from "./_components/RoomsList";
import prisma from "@/lib/db";
import { getRoomsPageSettings } from '@/app/actions/rooms-page-settings';

export const metadata = {
  title: 'Rooms & Suites - Hotel Luxury',
  description: 'Discover our luxury rooms and suites.',
};

export default async function RoomsAndSuitesPage() {
  const roomsSettings = await getRoomsPageSettings();
  const categories = await prisma.roomCategory.findMany({
    include: {
      images: true,
      amenities: true
    },
    orderBy: { basePrice: 'asc' }
  });

  return (
    <main className="min-h-screen text-foreground">
      <RoomsList categories={categories} settings={roomsSettings} />      
    </main>
  );
}
