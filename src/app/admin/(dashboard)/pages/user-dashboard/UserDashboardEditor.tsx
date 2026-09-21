"use client";

import { useState } from "react";
import { ArrowLeft, ChevronRight, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { updateUserDashboardSettings } from "@/app/actions/user-dashboard-settings";
import type { UserDashboardSettings } from "@/components/user-dashboard/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleUpload } from "@/lib/upload";

const sections = [{ id: "hero", title: "Hero Section", description: "Welcome message and dashboard hero image" }, { id: "bookings", title: "Bookings Section", description: "Guest room booking content" }, { id: "services", title: "Services Section", description: "Spa and dining service links" }, { id: "activity", title: "Activity Section", description: "Spa and dining reservation history" }] as const;

export function UserDashboardEditor({ initialSettings }: { initialSettings: UserDashboardSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [active, setActive] = useState<keyof UserDashboardSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const update = (section: keyof UserDashboardSettings, field: string, value: string | boolean) => setSettings((current) => ({ ...current, [section]: { ...current[section], [field]: value } }));
  const save = async () => { setSaving(true); await updateUserDashboardSettings(settings); setSaving(false); toast.success("User dashboard settings saved"); };
  if (!active) return <div className="space-y-6 pb-12"><div className="flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-end"><div><h1 className="text-3xl font-bold" style={{ fontSize: "var(--admin-heading-size)" }}>User Dashboard</h1><p className="mt-1 text-gray-500">Customize the guest-facing account dashboard.</p></div><Button onClick={save} disabled={saving}>{saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}Save All Changes</Button></div><div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{sections.map((section) => <Card key={section.id} className="cursor-pointer hover:border-zinc-800" onClick={() => setActive(section.id)}><CardContent className="flex h-full flex-col justify-between gap-4 p-6"><div><h3 className="text-lg font-semibold">{section.title}</h3><p className="mt-1 text-sm text-muted-foreground">{section.description}</p></div><span className="flex items-center text-sm font-medium text-blue-600">Edit Section <ChevronRight className="ml-1 h-4 w-4" /></span></CardContent></Card>)}</div></div>;
  const data: any = settings[active];
  return <div className="space-y-6 pb-12"><div className="flex items-center justify-between border-b pb-4"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" onClick={() => setActive(null)}><ArrowLeft className="h-5 w-5" /></Button><div><h2 className="text-xl font-semibold">{sections.find((item) => item.id === active)?.title}</h2><p className="text-sm text-muted-foreground">Editing section</p></div></div><Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</Button></div><div className="max-w-4xl space-y-5 rounded-lg border bg-white p-6 shadow-sm"><label className="flex items-center justify-between rounded-md border bg-zinc-50 p-4"><span><span className="block font-medium">Section visibility</span><span className="text-sm text-muted-foreground">Show this section on the guest dashboard</span></span><input type="checkbox" checked={data.isVisible} onChange={(event) => update(active, "isVisible", event.target.checked)} /></label>{active === "hero" && <><label className="grid gap-2 text-sm font-medium">Hero image<input className="block w-full rounded-md border p-2 text-sm" type="file" accept="image/*" onChange={(event) => { const file = event.target.files?.[0]; if (file) handleUpload(file, (url) => update("hero", "image", url)); }} /></label>{data.image && <img src={data.image} alt="Current dashboard hero" className="h-40 w-full rounded-md object-cover" />}<label className="grid gap-2 text-sm font-medium">Title<Input value={data.title} onChange={(event) => update("hero", "title", event.target.value)} /></label><label className="grid gap-2 text-sm font-medium">Subtitle<Textarea value={data.subtitle} onChange={(event) => update("hero", "subtitle", event.target.value)} /></label></>}{active !== "hero" && <><label className="grid gap-2 text-sm font-medium">Title<Input value={data.title} onChange={(event) => update(active, "title", event.target.value)} /></label><label className="grid gap-2 text-sm font-medium">Description<Textarea value={data.description} onChange={(event) => update(active, "description", event.target.value)} /></label></>}</div></div>;
}
