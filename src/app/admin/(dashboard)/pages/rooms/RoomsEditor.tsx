"use client";
import type React from "react";
import { useState } from "react";

import { ArrowLeft, CheckCircle2, ChevronRight, Image as ImageIcon, Loader2, Save, Video } from "lucide-react";
import { toast } from "sonner";

import { updateRoomCategorySettings } from "@/app/actions/room-category-settings";
import { updateRoomsPageSettings } from "@/app/actions/rooms-page-settings";
import type { RoomsPageSettings } from "@/components/rooms/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
  slug: string | null;
}

interface RoomsEditorProps {
  initialSettings: RoomsPageSettings;
  categories: Category[];
  initialCategorySettings: { categoryId: string; settings: RoomsPageSettings }[];
}

export function RoomsEditor({ initialSettings, categories, initialCategorySettings }: RoomsEditorProps) {
  const [globalSettings, setGlobalSettings] = useState<RoomsPageSettings>(initialSettings);
  const [categorySettingsMap, setCategorySettingsMap] = useState<Record<string, RoomsPageSettings>>(
    initialCategorySettings.reduce((acc, { categoryId, settings }) => ({ ...acc, [categoryId]: settings }), {}),
  );

  const [saving, setSaving] = useState(false);

  // Navigation State
  const [activePageId, setActivePageId] = useState<string | null>(null); // 'main' or category ID
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

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
        updateField(field, type, data.url);
        toast.success(`${type === "image" ? "Image" : "Video"} uploaded successfully`);
      }
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const updateField = (sectionKey: string, fieldKey: string, value: any) => {
    if (activePageId === "main") {
      setGlobalSettings((prev) => ({
        ...prev,
        [sectionKey]: {
          ...(prev as any)[sectionKey],
          [fieldKey]: value,
        },
      }));
    } else if (activePageId) {
      setCategorySettingsMap((prev) => ({
        ...prev,
        [activePageId]: {
          ...prev[activePageId],
          [sectionKey]: {
            ...(prev[activePageId] as any)[sectionKey],
            [fieldKey]: value,
          },
        },
      }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (activePageId === "main") {
        await updateRoomsPageSettings(globalSettings);
      } else if (activePageId) {
        await updateRoomCategorySettings(activePageId, categorySettingsMap[activePageId]);
      }
      toast.success("Settings saved successfully");
    } catch (e) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // Level 1: Page Selection
  // -------------------------------------------------------------
  if (!activePageId) {
    return (
      <div className="space-y-6 pb-12 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-gray-900"
              style={{ fontSize: "var(--admin-heading-size)" }}
            >
              Rooms & Suites
            </h1>
            <p className="text-base text-gray-500 mt-1">Select a Page to Edit</p>
          </div>
          <Button onClick={handleSave} disabled={saving} className="mt-4 sm:mt-0 bg-gray-900 text-white min-w-[120px]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Saving..." : "Save All Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            className="cursor-pointer hover:border-zinc-800 transition-colors bg-zinc-50 border-zinc-300 shadow-sm"
            onClick={() => setActivePageId("main")}
          >
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Main Listing Page</h3>
                <p className="text-sm text-muted-foreground">/rooms-and-suites</p>
              </div>
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </CardContent>
          </Card>

          {categories.map((cat) => (
            <Card
              key={cat.id}
              className="cursor-pointer hover:border-zinc-800 transition-colors shadow-sm"
              onClick={() => setActivePageId(cat.id)}
            >
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">/{cat.slug || cat.id}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-zinc-400" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isMainPage = activePageId === "main";
  const activeCategory = categories.find((c) => c.id === activePageId);
  const pageTitle = isMainPage ? "Main Listing Page" : activeCategory?.name;

  const currentSettings = isMainPage ? globalSettings : categorySettingsMap[activePageId];

  // -------------------------------------------------------------
  // Level 2: Section Selection
  // -------------------------------------------------------------
  if (!activeSectionId) {
    const mainSections = [
      { id: "hero", title: "Listing Hero Section", desc: "Main video/image hero for the listing page" },
      { id: "listSection", title: "Rooms List Intro", desc: "Heading above the list of rooms" },
    ];

    const categorySections = [
      { id: "detailsHero", title: "Details Hero Section", desc: "Hero background for this specific category" },
      { id: "amenitiesSection", title: "Amenities Section", desc: "Heading for amenities" },
      { id: "bookingCta", title: "Booking CTA", desc: "Call to action block at the bottom" },
    ];

    const sections = isMainPage ? mainSections : categorySections;

    return (
      <div className="space-y-6 pb-12 w-full">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setActivePageId(null)}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h2 className="text-xl font-semibold capitalize tracking-tight">Editing: {pageTitle}</h2>
              <p className="text-sm text-muted-foreground">Select a section to customize</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-gray-900 text-white min-w-[120px]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((sec) => (
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
                <div className="flex items-center text-sm font-medium text-blue-600">
                  Edit Section <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Level 3: Form Editor
  // -------------------------------------------------------------
  const sectionData = (currentSettings as any)[activeSectionId] || {};

  return (
    <div className="space-y-6 pb-12 w-full">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setActiveSectionId(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-xl font-semibold capitalize tracking-tight">
              {activeSectionId.replace(/([A-Z])/g, " $1").trim()}
            </h2>
            <p className="text-sm text-muted-foreground">Editing section for {pageTitle}</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-gray-900 text-white min-w-[120px]">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {saving ? "Saving..." : "Save Changes"}
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
              checked={sectionData.isVisible}
              onChange={(e) => updateField(activeSectionId, "isVisible", e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900" />
          </label>
        </div>

        {sectionData.title !== undefined && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input value={sectionData.title} onChange={(e) => updateField(activeSectionId, "title", e.target.value)} />
          </div>
        )}

        {sectionData.subtitle !== undefined && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Subtitle</label>
            <Input
              value={sectionData.subtitle}
              onChange={(e) => updateField(activeSectionId, "subtitle", e.target.value)}
            />
          </div>
        )}

        {sectionData.description !== undefined && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={sectionData.description}
              onChange={(e) => updateField(activeSectionId, "description", e.target.value)}
              className="w-full p-3 border rounded-md min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900"
            />
          </div>
        )}

        {sectionData.buttonLabel !== undefined && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Button Label</label>
            <Input
              value={sectionData.buttonLabel}
              onChange={(e) => updateField(activeSectionId, "buttonLabel", e.target.value)}
            />
          </div>
        )}

        {/* Media Uploads */}
        {(sectionData.videoUrl !== undefined || sectionData.image !== undefined) && (
          <div className="space-y-4 pt-6 border-t border-zinc-100">
            <h4 className="font-medium text-base">Background Media</h4>
            <p className="text-sm text-muted-foreground">
              Upload an image or video background. If both are provided, the video takes priority.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {sectionData.image !== undefined && (
                <div className="p-4 border rounded-md bg-zinc-50 space-y-4">
                  <div className="flex items-center gap-2 mb-2 font-medium">
                    <ImageIcon className="w-4 h-4 text-zinc-500" /> Image
                  </div>
                  {sectionData.image ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                      <img src={sectionData.image} className="w-full h-full object-cover" alt="Preview" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-200 rounded-md border-dashed border-2 flex items-center justify-center text-zinc-400">
                      No Image
                    </div>
                  )}
                  <div>
                    <Input type="file" accept="image/*" onChange={(e) => handleUpload(e, activeSectionId, "image")} />
                  </div>
                </div>
              )}

              {sectionData.videoUrl !== undefined && (
                <div className="p-4 border rounded-md bg-zinc-50 space-y-4">
                  <div className="flex items-center gap-2 mb-2 font-medium">
                    <Video className="w-4 h-4 text-zinc-500" /> Video
                  </div>
                  {sectionData.videoUrl ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                      <video src={sectionData.videoUrl} className="w-full h-full object-cover" muted playsInline />
                      <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-zinc-200 rounded-md border-dashed border-2 flex items-center justify-center text-zinc-400">
                      No Video
                    </div>
                  )}
                  <div>
                    <Input
                      type="file"
                      accept="video/mp4,video/webm"
                      onChange={(e) => handleUpload(e, activeSectionId, "videoUrl")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
