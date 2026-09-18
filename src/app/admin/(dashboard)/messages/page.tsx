import React from "react";

import { getMessages } from "@/app/actions/messages";

import { MessagesTable } from "./MessagesTable";

export const metadata = {
  title: "Messages | Admin Dashboard",
};

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <div className="w-full py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Contact Messages
          </h1>
          <p className="text-gray-500 mt-2 text-base">View and manage messages sent from the contact form.</p>
        </div>
      </div>

      <MessagesTable initialMessages={messages} />
    </div>
  );
}
