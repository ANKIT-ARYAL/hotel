import { getRoomCategorySettings } from "@/app/actions/room-category-settings";
import { getRoomsPageSettings } from "@/app/actions/rooms-page-settings";
import prisma from "@/lib/db";

import { RoomsEditor } from "./RoomsEditor";

export const metadata = {
  title: "Rooms & Suites Settings | Admin Dashboard",
};

export default async function RoomsSettingsPage() {
  const settings = await getRoomsPageSettings();

  const categories = await prisma.roomCategory.findMany({
    select: { id: true, name: true, slug: true },
  });

  const categorySettings = await Promise.all(
    categories.map(async (cat) => {
      const s = await getRoomCategorySettings(cat.id);
      return { categoryId: cat.id, settings: s };
    }),
  );

  return (
    <div className="p-6 w-full space-y-6">
      <RoomsEditor initialSettings={settings} categories={categories} initialCategorySettings={categorySettings} />
    </div>
  );
}
