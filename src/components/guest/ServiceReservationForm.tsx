"use client";

import { useState, type ReactNode } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { createDiningReservation, createExperienceReservation, createSpaReservation } from "@/app/actions/guest-reservations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ServiceReservationForm({ type, options, trigger, open = false, initialOption, isLoggedIn = false }: { type: "spa" | "dining" | "experience"; options: string[]; trigger?: ReactNode; open?: boolean; initialOption?: string; isLoggedIn?: boolean }) {
  const [isOpen, setIsOpen] = useState(open);
  const [option, setOption] = useState(initialOption || options[0] || "General request");
  const [scheduledAt, setScheduledAt] = useState("");
  const [guests, setGuests] = useState("1");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  async function openGoogleLogin() {
    const result = await signIn("google", { redirect: false, callbackUrl: `${window.location.origin}/login/popup-complete` });
    if (result?.url) window.open(result.url, "hotel-google-login", "popup,width=520,height=680");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { scheduledAt: new Date(scheduledAt).toISOString(), guests: Number(guests), notes };
      if (type === "spa") await createSpaReservation({ ...payload, service: option });
      else if (type === "dining") await createDiningReservation({ ...payload, restaurant: option });
      else await createExperienceReservation({ ...payload, experience: option });
      toast.success("Reservation request submitted");
      setNotes("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please sign in before requesting a reservation");
    } finally {
      setSaving(false);
    }
  }

  return <>
    {trigger && <span onClick={() => setIsOpen(true)}>{trigger}</span>}
    {isOpen && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl md:p-10">
        <div className="mb-6 flex items-start justify-between gap-4"><div><h2 className="text-3xl font-semibold">Reserve {type === "spa" ? "a spa service" : type === "dining" ? "a dining table" : "an experience"}</h2><p className="mt-2 text-muted-foreground">Choose your preferred option and request a reservation.</p></div><button type="button" onClick={() => setIsOpen(false)} className="text-2xl text-muted-foreground" aria-label="Close">×</button></div>
        <form onSubmit={submit} className="grid gap-5">
          <label className="grid gap-2 font-medium">{type === "spa" ? "Treatment" : type === "dining" ? "Venue" : "Experience"}<select value={option} onChange={(e) => setOption(e.target.value)} className="h-12 rounded-md border bg-background px-3">{options.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="grid gap-2 font-medium">Date and time<Input required type="datetime-local" value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} /></label>
          <label className="grid gap-2 font-medium">Guests<Input required min={1} max={20} type="number" value={guests} onChange={(e) => setGuests(e.target.value)} /></label>
          <label className="grid gap-2 font-medium">Notes <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" maxLength={500} /></label>
          <div className="flex flex-col gap-3 sm:flex-row"><Button type="submit" disabled={saving} className="h-12 flex-1">{saving ? "Submitting…" : "Submit request"}</Button>{!isLoggedIn && <Button type="button" variant="outline" className="h-12" onClick={openGoogleLogin}>Continue with Google</Button>}</div>
        </form>
      </div>
    </div>}
  </>;
}
