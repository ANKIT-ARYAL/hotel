import React from "react";

import { getContactPageSettings } from "@/app/actions/contact-page-settings";

import { ContactEditor } from "./ContactEditor";

export const metadata = {
  title: "Contact Page CMS | Admin Dashboard",
};

export default async function AdminContactPage() {
  const settings = await getContactPageSettings();

  return (
    <div className="w-full py-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-bold tracking-tight text-gray-900"
          style={{ fontSize: "var(--admin-heading-size)" }}
        >
          Contact Page
        </h1>
        <p className="text-gray-500 mt-2 text-base">Manage the content for the Contact page.</p>
      </div>

      <ContactEditor initialSettings={settings} />
    </div>
  );
}
