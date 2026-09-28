"use client";

import { useState, useRef, type ReactNode } from "react";
import { signIn } from "next-auth/react";
import { CheckCircle2 } from "lucide-react";
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
  const [isSuccess, setIsSuccess] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  async function openGoogleLogin() {
    const result = await signIn("google", { redirect: false, callbackUrl: `${window.location.origin}/login/popup-complete` });
    if (result?.url) window.open(result.url, "hotel-google-login", "popup,width=520,height=680");
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!scheduledAt) {
      toast.error("Please select a date and time");
      return;
    }
    if (new Date(scheduledAt).getTime() < Date.now() - 60 * 1000) {
      toast.error("Please select a future date and time");
      return;
    }

    setSaving(true);
    try {
      const payload = { scheduledAt: new Date(scheduledAt).toISOString(), guests: Number(guests), notes };
      if (type === "spa") await createSpaReservation({ ...payload, service: option });
      else if (type === "dining") await createDiningReservation({ ...payload, restaurant: option });
      else await createExperienceReservation({ ...payload, experience: option });
      
      setIsSuccess(true);
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      if (isMobile) {
        modalContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      }
      setNotes("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please sign in before requesting a reservation");
    } finally {
      setSaving(false);
    }
  }

  const handleClose = () => {
    setIsOpen(false);
    setIsSuccess(false);
  };

  return <>
    {trigger && <span onClick={() => { setIsOpen(true); setIsSuccess(false); }}>{trigger}</span>}
    {isOpen && <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div ref={modalContainerRef} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl md:p-10">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Reserve {type === "spa" ? "a spa service" : type === "dining" ? "a dining table" : "an experience"}</h2>
            <p className="mt-2 text-muted-foreground">Choose your preferred option and request a reservation.</p>
          </div>
          <button type="button" onClick={handleClose} className="text-2xl text-muted-foreground hover:text-foreground" aria-label="Close">×</button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-zinc-900">Reservation Request Confirmed!</h3>
            <p className="text-muted-foreground max-w-md">
              Your {type} request for <span className="font-semibold text-foreground">{option}</span> has been successfully sent. Our concierge team will review and confirm your details.
            </p>
            <Button onClick={handleClose} className="mt-4 px-8">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-5">
            <label className="grid gap-2 font-medium">
              {type === "spa" ? "Treatment" : type === "dining" ? "Venue" : "Experience"}
              <select value={option} onChange={(e) => setOption(e.target.value)} className="h-12 rounded-md border bg-background px-3">
                {options.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-2 font-medium">
              Date and time
              <Input required type="datetime-local" min={getMinDateTime()} value={scheduledAt} onChange={(e) => setScheduledAt(e.target.value)} />
            </label>
            <label className="grid gap-2 font-medium">
              Guests
              <Input required min={1} max={20} type="number" value={guests} onChange={(e) => setGuests(e.target.value)} />
            </label>
            <label className="grid gap-2 font-medium">
              Notes
              <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional" maxLength={500} />
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={saving} className="h-12 flex-1">
                {saving ? "Submitting…" : "Submit request"}
              </Button>
              {!isLoggedIn && (
                <Button type="button" variant="outline" className="h-12" onClick={openGoogleLogin}>
                  Continue with Google
                </Button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>}
  </>;
}
