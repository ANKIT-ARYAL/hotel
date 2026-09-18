import { getSpaPageSettings } from "@/app/actions/spa-page-settings";

import { SpaEditor } from "./SpaEditor";

export const metadata = {
  title: "Spa Settings | Admin Dashboard",
};

export default async function SpaSettingsPage() {
  const settings = await getSpaPageSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <SpaEditor initialSettings={settings} />
    </div>
  );
}
