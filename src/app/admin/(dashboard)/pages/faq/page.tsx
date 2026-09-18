import { getFaqPageSettings } from "@/app/actions/faq-page-settings";

import { FaqEditor } from "./FaqEditor";

export const metadata = {
  title: "FAQs Settings | Admin Dashboard",
};

export default async function FaqSettingsPage() {
  const settings = await getFaqPageSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <FaqEditor initialSettings={settings} />
    </div>
  );
}
