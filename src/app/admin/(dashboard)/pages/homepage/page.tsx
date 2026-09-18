import React from "react";

import { getHomepageSettings } from "@/app/actions/homepage-settings";

import { HomepageEditor } from "./HomepageEditor";

export default async function HomepageAdminPage() {
  const settings = await getHomepageSettings();

  return (
    <div className="p-8">
      <HomepageEditor initialSettings={settings} />
    </div>
  );
}
