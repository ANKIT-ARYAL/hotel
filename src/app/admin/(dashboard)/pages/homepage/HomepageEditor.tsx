/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, ChevronRight, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateHomepageSettings } from "@/app/actions/homepage-settings";
import type { HomepageSettings } from "@/components/homepage/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

import { FooterSettingsEditor } from "./FooterSettingsEditor";

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Main video and welcome text" },
  { id: "searchHero", title: "Search Page Hero Section", desc: "Video background for the search results page" },
  { id: "culinary", title: "Culinary Section", desc: "Introduction to dining" },
  { id: "spaWellness", title: "Spa & Wellness Section", desc: "Introduction to spa" },
  { id: "ourStory", title: "Our Story Section", desc: "Hotel history and legacy" },
  { id: "bookingCta", title: "Booking CTA Section", desc: "Final call to action" },
  { id: "featuredRooms", title: "Featured Accommodations", desc: "Showcase your best rooms and suites" },
  { id: "testimonials", title: "Testimonials Section", desc: "What our guests say" },
  { id: "footer", title: "Footer Section", desc: "Manage footer content and links" },
];

export function HomepageEditor({ initialSettings }: { initialSettings: HomepageSettings }) {
  const [settings, setSettings] = useState<HomepageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    await updateHomepageSettings(settings);
    setIsSaving(false);
    toast.success("Changes saved!");
    router.refresh();
  };

  const toggleVisibility = (section: keyof HomepageSettings) => {
    if (settings[section] && "isVisible" in (settings[section] as any)) {
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          isVisible: !(prev[section] as any).isVisible,
        },
      }));
    }
  };

  const updateSectionField = (section: keyof HomepageSettings, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof HomepageSettings,
    field: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        updateSectionField(section, field, data.url);
      } else {
        toast.error("Upload failed: " + data.error);
      }
    } catch (err) {
      toast.error("Upload failed");
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
              Homepage
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
                  <span className="text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                    {(settings as any)[sec.id]?.isVisible ? "Visible" : "Hidden"}
                  </span>
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
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-md border">
          <div>
            <h4 className="font-medium">Section Visibility</h4>
            <p className="text-sm text-muted-foreground">Toggle this section on or off</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sectionData?.isVisible}
              onChange={() => toggleVisibility(activeSectionId as keyof HomepageSettings)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900" />
          </label>
        </div>

        {activeSectionId === "hero" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateSectionField("hero", "title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <RichTextEditor
                value={sectionData.subtitle}
                onChange={(val) => updateSectionField("hero", "subtitle", val)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Video (MP4)</label>
              <div className="flex flex-col space-y-3">
                {sectionData.videoUrl && (
                  <div className="relative h-32 w-48 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <video src={sectionData.videoUrl} className="w-full h-full object-cover" muted playsInline />
                  </div>
                )}
                <Input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => handleFileUpload(e, "hero", "videoUrl")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input
                value={sectionData.buttonLabel}
                onChange={(e) => updateSectionField("hero", "buttonLabel", e.target.value)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "searchHero" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Video (MP4)</label>
              <div className="flex flex-col space-y-3">
                {sectionData.videoUrl && (
                  <div className="relative h-32 w-48 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <video src={sectionData.videoUrl} className="w-full h-full object-cover" muted playsInline />
                  </div>
                )}
                <Input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => handleFileUpload(e, "searchHero", "videoUrl")}
                />
              </div>
            </div>
          </div>
        )}

        {["culinary", "spaWellness", "ourStory", "bookingCta"].includes(activeSectionId) && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField(activeSectionId as keyof HomepageSettings, "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateSectionField(activeSectionId as keyof HomepageSettings, "description", val)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Upload</label>
              <div className="flex flex-col space-y-3">
                {sectionData.image && (
                  <div className="relative h-32 w-48 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={sectionData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, activeSectionId as keyof HomepageSettings, "image")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input
                value={sectionData.buttonLabel}
                onChange={(e) =>
                  updateSectionField(activeSectionId as keyof HomepageSettings, "buttonLabel", e.target.value)
                }
              />
            </div>
          </div>
        )}

        {activeSectionId === "featuredRooms" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("featuredRooms", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateSectionField("featuredRooms", "description", val)}
              />
            </div>
            <p className="text-xs text-muted-foreground italic">
              Note: The individual rooms displayed here are managed from the Rooms Management tab.
            </p>
          </div>
        )}

        {activeSectionId === "testimonials" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("testimonials", "title", e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground italic">
              Note: Reviews are managed from the Reviews Management tab.
            </p>
          </div>
        )}

        {activeSectionId === "footer" && (
          <FooterSettingsEditor
            data={sectionData}
            updateField={(field, value) => updateSectionField("footer", field, value)}
          />
        )}
      </div>
    </div>
  );
}
