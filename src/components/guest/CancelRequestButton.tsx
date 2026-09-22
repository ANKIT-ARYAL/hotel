"use client";

import { useState } from "react";
import { toast } from "sonner";
import { requestCancellation } from "@/app/actions/guest-reservations";

export function CancelRequestButton({ type, id }: { type: "booking" | "spa" | "dining" | "experience"; id: string }) {
  const [saving, setSaving] = useState(false);
  async function cancel() {
    if (!confirm("Send a cancellation request to the hotel team?")) return;
    setSaving(true);
    try { await requestCancellation({ type, id }); toast.success("Cancellation request sent to the hotel team"); } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to request cancellation"); } finally { setSaving(false); }
  }
  return <button type="button" onClick={cancel} disabled={saving} className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50">{saving ? "Sending…" : "Request cancellation"}</button>;
}
