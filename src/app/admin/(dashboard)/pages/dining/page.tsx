import { getDiningPageSettings } from "@/app/actions/dining-page-settings";

import { DiningEditor } from "./DiningEditor";

export const metadata = {
  title: "Dining Settings | Admin Dashboard",
};

export default async function DiningSettingsPage() {
  const settings = await getDiningPageSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <DiningEditor initialSettings={settings} />
    </div>
  );
}
