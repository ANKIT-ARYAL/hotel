"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, MoveDown, MoveUp, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { updateFooterSettings } from "@/app/actions/footer-settings";
import type { HomepageSettings } from "@/components/homepage/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FooterSettings = HomepageSettings["footer"];
type LinkGroup = "exploreLinks" | "quickLinks";

export function FooterEditor({ initialSettings }: { initialSettings: FooterSettings }) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const idPrefix = useId();

  const update = (field: keyof FooterSettings, value: unknown) =>
    setSettings((current) => ({ ...current, [field]: value }));

  const saveSettings = async () => {
    setIsSaving(true);
    const result = await updateFooterSettings(settings);
    if (result.success) toast.success("Footer settings saved successfully");
    else toast.error("Failed to save footer settings");
    setIsSaving(false);
  };

  const addLink = (group: LinkGroup) =>
    update(group, [...settings[group], { id: `${idPrefix}-${group}-${settings[group].length}`, label: "New Link", href: "/", isVisible: true }]);

  const updateLink = (group: LinkGroup, id: string, field: string, value: string | boolean) =>
    update(group, settings[group].map((link) => (link.id === id ? { ...link, [field]: value } : link)));

  const removeLink = (group: LinkGroup, id: string) => update(group, settings[group].filter((link) => link.id !== id));

  const moveLink = (group: LinkGroup, index: number, direction: "up" | "down") => {
    const links = [...settings[group]];
    const next = direction === "up" ? index - 1 : index + 1;
    if (next < 0 || next >= links.length) return;
    [links[index], links[next]] = [links[next], links[index]];
    update(group, links);
  };

  const renderLinkGroup = (group: LinkGroup, title: string) => (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><CardTitle>{title}</CardTitle><CardDescription>These links render as list items in the footer.</CardDescription></div>
        <Button onClick={() => addLink(group)} variant="outline" size="sm" className="w-full sm:w-auto"><Plus className="mr-2 size-4" /> Add Link</Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {settings[group].map((link, index) => (
          <div key={link.id} className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-3 sm:flex-row sm:items-end">
            <div className="flex shrink-0 gap-1 sm:flex-col">
              <button type="button" onClick={() => moveLink(group, index, "up")} disabled={index === 0} aria-label={`Move ${link.label} up`} className="rounded p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30"><MoveUp className="size-4" /></button>
              <button type="button" onClick={() => moveLink(group, index, "down")} disabled={index === settings[group].length - 1} aria-label={`Move ${link.label} down`} className="rounded p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30"><MoveDown className="size-4" /></button>
            </div>
            <div className="grid min-w-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2">
              <div className="min-w-0"><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">Label</label><Input value={link.label} onChange={(e) => updateLink(group, link.id, "label", e.target.value)} /></div>
              <div className="min-w-0"><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">URL (href)</label><Input value={link.href} onChange={(e) => updateLink(group, link.id, "href", e.target.value)} /></div>
            </div>
            <div className="flex shrink-0 gap-2 self-end">
              <Button type="button" variant="outline" size="icon" aria-label={link.isVisible ? `Hide ${link.label}` : `Show ${link.label}`} onClick={() => updateLink(group, link.id, "isVisible", !link.isVisible)}>{link.isVisible ? <Eye className="size-4" /> : <EyeOff className="size-4 text-zinc-400" />}</Button>
              <Button type="button" variant="outline" size="icon" aria-label={`Delete ${link.label}`} className="text-red-500 hover:text-red-600" onClick={() => removeLink(group, link.id)}><Trash2 className="size-4" /></Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-medium">Save Changes</h2><p className="text-sm text-zinc-500">Save changes to publish them on the website.</p></div>
        <Button onClick={saveSettings} disabled={isSaving} className="w-full sm:w-auto"><Save className="mr-2 size-4" /> {isSaving ? "Saving..." : "Save All Changes"}</Button>
      </div>
      <Card>
        <CardHeader><CardTitle>Footer Information</CardTitle><CardDescription>Manage the contact and branding details shown in the footer.</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {(["brandDescription", "address", "phone", "email", "copyright"] as const).map((field) => <div key={field} className={field === "brandDescription" ? "sm:col-span-2 xl:col-span-3" : ""}><label className="mb-1 block text-xs font-medium uppercase tracking-wider text-zinc-500">{field.replace(/([A-Z])/g, " $1")}</label><Input value={settings[field]} onChange={(e) => update(field, e.target.value)} /></div>)}
        </CardContent>
      </Card>
      {renderLinkGroup("exploreLinks", "Explore Links")}
      {renderLinkGroup("quickLinks", "Quick Links")}
    </div>
  );
}
