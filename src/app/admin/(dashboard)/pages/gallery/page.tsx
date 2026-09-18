import { getGalleryPageSettings } from "@/app/actions/gallery-page-settings";

import { GalleryEditor } from "./GalleryEditor";

export const metadata = {
  title: "Gallery Settings | Admin Dashboard",
};

export default async function GallerySettingsPage() {
  const settings = await getGalleryPageSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <div>
        <h1
          className="font-semibold text-2xl tracking-tight text-zinc-900"
          style={{ fontSize: "var(--admin-heading-size)" }}
        >
          Gallery Page
        </h1>
        <p className="text-zinc-500 mt-2 tracking-tight">
          Manage the static layout, sections, and content for the Gallery page.
        </p>
      </div>

      <GalleryEditor initialSettings={settings} />
    </div>
  );
}
