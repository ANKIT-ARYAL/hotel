import { getFooterSettings } from "@/app/actions/footer-settings";
import { FooterEditor } from "./FooterEditor";

export const metadata = { title: "Footer Settings | Admin Dashboard" };

export default async function FooterSettingsPage() {
  const settings = await getFooterSettings();
  return (
    <div className="p-6 w-full space-y-6">
      <div>
        <h1
          className="font-semibold text-2xl tracking-tight text-zinc-900"
          style={{ fontSize: "var(--admin-heading-size)" }}
        >
          Footer Settings
        </h1>
        <p className="text-zinc-500 mt-2 tracking-tight">
          Manage footer content and the links displayed on your site.
        </p>
      </div>
      <FooterEditor initialSettings={settings} />
    </div>
  );
}
