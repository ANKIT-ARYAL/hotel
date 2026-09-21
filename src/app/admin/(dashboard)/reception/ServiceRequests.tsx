"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateServiceReservation } from "@/app/actions/guest-reservations";

type RequestItem = { id: string; name: string; scheduledAt: string; guests: number; status: string };

export function ServiceRequests({ spa, dining }: { spa: RequestItem[]; dining: RequestItem[] }) {
  const [items, setItems] = useState({ spa, dining });
  async function update(type: "spa" | "dining", id: string, status: "CONFIRMED" | "CANCELLED" | "COMPLETED") {
    try {
      await updateServiceReservation({ type, id, status });
      setItems((current) => ({ ...current, [type]: current[type].map((item) => item.id === id ? { ...item, status } : item) }));
      toast.success("Service request updated");
    } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to update request"); }
  }
  const render = (type: "spa" | "dining", list: RequestItem[]) => <div className="grid gap-3">{list.map((item) => <div key={item.id} className="rounded-lg border p-4"><div className="flex justify-between gap-3"><span className="font-medium">{item.name}</span><span className="text-sm text-muted-foreground">{item.status}</span></div><p className="mt-1 text-sm text-muted-foreground">{new Date(item.scheduledAt).toLocaleString()} · {item.guests} guest(s)</p><div className="mt-3 flex flex-wrap gap-2">{item.status === "PENDING" && <button className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={() => update(type, item.id, "CONFIRMED")}>Confirm</button>}{item.status === "CONFIRMED" && <button className="rounded-md border px-3 py-2 text-sm" onClick={() => update(type, item.id, "COMPLETED")}>Complete</button>}{!["CANCELLED", "COMPLETED"].includes(item.status) && <button className="rounded-md border px-3 py-2 text-sm text-destructive" onClick={() => update(type, item.id, "CANCELLED")}>Cancel</button>}</div></div>)}</div>;
  return <div className="grid gap-6 lg:grid-cols-2"><section><h2 className="mb-3 text-xl font-semibold">Spa requests</h2>{render("spa", items.spa)}</section><section><h2 className="mb-3 text-xl font-semibold">Dining requests</h2>{render("dining", items.dining)}</section></div>;
}
