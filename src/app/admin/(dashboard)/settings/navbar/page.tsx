import { getNavbarSettings } from "@/app/actions/navbar-settings";

import { NavbarEditor } from "./NavbarEditor";

export const metadata = {
  title: "Navbar Settings | Admin Dashboard",
};

export default async function NavbarSettingsPage() {
  const settings = await getNavbarSettings();

  return (
    <div className="p-6 w-full space-y-6">
      <div>
        <h1
          className="font-semibold text-2xl tracking-tight text-zinc-900"
          style={{ fontSize: "var(--admin-heading-size)" }}
        >
          Navbar Settings
        </h1>
        <p className="text-zinc-500 mt-2 tracking-tight">
          Manage navigation links, dropdowns, and the global call-to-action button.
        </p>
      </div>

      <NavbarEditor initialSettings={settings} />
    </div>
  );
}
