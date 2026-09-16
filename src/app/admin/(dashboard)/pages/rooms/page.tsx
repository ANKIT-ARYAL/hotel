import { getRoomsPageSettings } from '@/app/actions/rooms-page-settings';
import { RoomsEditor } from './RoomsEditor';

export const metadata = {
  title: 'Rooms & Suites Settings | Admin Dashboard',
};

export default async function RoomsSettingsPage() {
  const settings = await getRoomsPageSettings();

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rooms & Suites Page</h1>
        <p className="text-muted-foreground mt-2">
          Manage the static layout, headers, and call-to-actions for the Rooms & Suites listings and detail pages.
        </p>
      </div>

      <RoomsEditor initialSettings={settings} />
    </div>
  );
}
