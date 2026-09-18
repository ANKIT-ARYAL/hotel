/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, ChevronRight, Eye, EyeOff, Image as ImageIcon, Loader2, Save, Video } from "lucide-react";
import { toast } from "sonner";

import { updateDiningPageSettings } from "@/app/actions/dining-page-settings";
import type { DiningPageSettings } from "@/components/dining/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

import { GalleryManager } from "./GalleryManager";
import { MenuManager } from "./MenuManager";
import { VenueManager } from "./VenueManager";

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Main banner at the top of the page" },
  { id: "intro", title: "Intro Section", desc: "Short introductory description" },
  { id: "restaurantsList", title: "Restaurants List", desc: "Heading for the list of venues" },
  { id: "venues", title: "Manage Venues", desc: "Add, edit, or remove dining venues" },
  { id: "menus", title: "Chefs Specials", desc: "Manage the special menus" },
  { id: "bar", title: "Bar & Lounge", desc: "Slider section for the bar" },
  { id: "events", title: "Events", desc: "Slider section for events" },
  { id: "liveMusic", title: "Live Music", desc: "Slider section for live music" },
  { id: "privateDining", title: "Private Dining", desc: "Slider section for private dining" },
];

export function DiningEditor({ initialSettings }: { initialSettings: DiningPageSettings }) {
  const [settings, setSettings] = useState<DiningPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    await updateDiningPageSettings(settings);
    setIsSaving(false);
    toast.success("Changes saved!");
    router.refresh();
  };

  const toggleVisibility = (section: keyof DiningPageSettings) => {
    if (settings[section]) {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          isVisible: !(prev[section] as any).isVisible,
        },
      }));
    }
  };

  const updateSectionField = (section: keyof DiningPageSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string, type: "videoUrl" | "image") => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        updateSectionField("hero", type, data.url);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Error uploading file");
    }
  };

  if (!activeSectionId) {
    return (
      <div className="space-y-6 pb-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-gray-900"
              style={{ fontSize: "var(--admin-heading-size)" }}
            >
              Dining Page
            </h1>
            <p className="text-base text-gray-500 mt-1">Select a section to customize</p>
          </div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="mt-4 sm:mt-0 bg-gray-900 text-white min-w-[120px]"
          >
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SECTIONS.map((sec) => (
            <Card
              key={sec.id}
              className="cursor-pointer hover:border-zinc-800 transition-colors shadow-sm"
              onClick={() => setActiveSectionId(sec.id)}
            >
              <CardContent className="p-6 flex flex-col h-full justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-lg">{sec.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{sec.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-blue-600 flex items-center">
                    Edit Section <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                  {sec.id !== "venues" && (
                    <span className="text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                      {(settings as any)[sec.id]?.isVisible ? "Visible" : "Hidden"}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const activeSection = SECTIONS.find((s) => s.id === activeSectionId);
  const sectionData = (settings as any)[activeSectionId];

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setActiveSectionId(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold capitalize tracking-tight">{activeSection?.title}</h2>
            <p className="text-sm text-muted-foreground">Editing section</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="bg-gray-900 text-white min-w-[120px]">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="max-w-3xl space-y-6 bg-white p-6 border rounded-lg shadow-sm">
        {activeSectionId !== "venues" && (
          <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-md border">
            <div>
              <h4 className="font-medium">Section Visibility</h4>
              <p className="text-sm text-muted-foreground">Toggle this section on or off</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={sectionData.isVisible}
                onChange={() => toggleVisibility(activeSectionId as keyof DiningPageSettings)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900" />
            </label>
          </div>
        )}

        {activeSectionId === "hero" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={settings.hero.title}
                onChange={(e) => updateSectionField("hero", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle (Optional)</label>
              <Input
                value={settings.hero.subtitle || ""}
                onChange={(e) => updateSectionField("hero", "subtitle", e.target.value)}
              />
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <h4 className="text-sm font-medium mb-3">Background Media</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center">
                    <ImageIcon className="w-3 h-3 mr-1" /> Hero Image
                  </label>
                  {settings.hero.image && (
                    <div className="mb-2 relative w-full h-32 rounded bg-zinc-100 overflow-hidden">
                      <img src={settings.hero.image} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleUpload(e, "hero", "image")}
                      className="text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center">
                    <Video className="w-3 h-3 mr-1" /> Hero Video
                  </label>
                  {settings.hero.videoUrl && (
                    <div className="mb-2 w-full h-32 rounded bg-zinc-100 overflow-hidden relative">
                      <video src={settings.hero.videoUrl} className="w-full h-full object-cover" muted />
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(e) => handleUpload(e, "hero", "videoUrl")}
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                If both are provided, video takes precedence. Aspect ratio should be 16:9 for best results.
              </p>
            </div>
          </div>
        )}

        {activeSectionId === "intro" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={settings.intro.title}
                onChange={(e) => updateSectionField("intro", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={settings.intro.description}
                onChange={(val) => updateSectionField("intro", "description", val)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "restaurantsList" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={settings.restaurantsList.title}
                onChange={(e) => updateSectionField("restaurantsList", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={settings.restaurantsList.description}
                onChange={(val) => updateSectionField("restaurantsList", "description", val)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "venues" && (
          <div className="space-y-4 -m-6 border-0 p-0 shadow-none">
            <VenueManager
              venues={settings.restaurantsList.venues}
              onVenuesChange={(venues) =>
                setSettings((prev) => ({
                  ...prev,
                  restaurantsList: { ...prev.restaurantsList, venues },
                }))
              }
            />
          </div>
        )}

        {activeSectionId === "menus" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={settings.menus.title}
                onChange={(e) => updateSectionField("menus", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={settings.menus.description}
                onChange={(val) => updateSectionField("menus", "description", val)}
              />
            </div>
            <div className="pt-4 border-t">
              <MenuManager
                categories={settings.menus.categories || []}
                onCategoriesChange={(categories) => updateSectionField("menus", "categories", categories)}
              />
            </div>
          </div>
        )}

        {["bar", "events", "liveMusic", "privateDining"].includes(activeSectionId) && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={(settings as any)[activeSectionId].title || ""}
                onChange={(e) =>
                  updateSectionField(activeSectionId as keyof DiningPageSettings, "title", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={(settings as any)[activeSectionId].description || ""}
                onChange={(val) => updateSectionField(activeSectionId as keyof DiningPageSettings, "description", val)}
              />
            </div>
            <div className="pt-4 border-t">
              <h3 className="font-medium text-lg mb-4">Slider Gallery</h3>
              <GalleryManager
                images={(settings as any)[activeSectionId].images || []}
                onChange={(images) => updateSectionField(activeSectionId as keyof DiningPageSettings, "images", images)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
