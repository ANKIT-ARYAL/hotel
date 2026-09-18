import { getExperiencesPageSettings } from "@/app/actions/experiences-page-settings";

import { ExperiencesEditor } from "./ExperiencesEditor";

export const metadata = {
  title: "Experiences Settings | Admin Dashboard",
};

export default async function ExperiencesSettingsPage() {
  const settings = await getExperiencesPageSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <ExperiencesEditor initialSettings={settings} />
    </div>
  );
}
