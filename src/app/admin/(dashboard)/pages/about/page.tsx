import { getAboutPageSettings } from "@/app/actions/about-page-settings";

import { AboutEditor } from "./AboutEditor";

export const metadata = {
  title: "About Us Settings | Admin Dashboard",
};

export default async function AboutSettingsPage() {
  const settings = await getAboutPageSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <AboutEditor initialSettings={settings} />
    </div>
  );
}
