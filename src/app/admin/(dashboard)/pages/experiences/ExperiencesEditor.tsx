/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { ArrowLeft, ChevronRight, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

import { updateExperiencesPageSettings } from "@/app/actions/experiences-page-settings";
import type { ExperiencesPageSettings } from "@/components/experiences/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { handleUpload } from "@/lib/upload";

const SECTIONS = [
  { id: "hero", title: "Hero Section", description: "Main banner for the Experiences page" },
  { id: "intro", title: "Intro Section", description: "Introduction to Experiences" },
  { id: "featured", title: "Featured Experiences", description: "Manage signature adventures" },
  { id: "localGuide", title: "Local Guide", description: "Manage local attractions" },
];

export function ExperiencesEditor({ initialSettings }: { initialSettings: ExperiencesPageSettings }) {
  const [settings, setSettings] = useState<ExperiencesPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const saveSettings = async () => {
    setIsSaving(true);
    const result = await updateExperiencesPageSettings(settings);
    if (result.success) {
      toast.success("Experiences settings saved successfully");
    } else {
      toast.error("Failed to save settings");
    }
    setIsSaving(false);
  };

  const updateField = (section: keyof ExperiencesPageSettings, field: string, value: any) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        [field]: value,
      },
    });
  };

  const toggleVisibility = (section: keyof ExperiencesPageSettings) => {
    setSettings({
      ...settings,
      [section]: {
        ...settings[section],
        isVisible: !settings[section].isVisible,
      },
    });
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    handleUpload(e.target.files[0], (url: any) => {
      updateField("hero", "image", url);
    });
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
              Experiences Page
            </h1>
            <p className="text-base text-gray-500 mt-1">Select a section to customize</p>
          </div>
          <Button onClick={saveSettings} disabled={isSaving} className="mt-4 sm:mt-0 bg-gray-900 text-white">
            <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save All Changes"}
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
                  <p className="text-sm text-muted-foreground mt-1">{sec.description}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-blue-600 flex items-center">
                    Edit Section <ChevronRight className="w-4 h-4 ml-1" />
                  </span>
                  <span className="text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-1 rounded">
                    {(settings as any)[sec.id].isVisible ? "Visible" : "Hidden"}
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
        <Button onClick={saveSettings} disabled={isSaving} className="bg-gray-900 text-white">
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Changes"}
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
              onChange={() => toggleVisibility(activeSectionId as keyof ExperiencesPageSettings)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900" />
          </label>
        </div>

        {activeSectionId === "hero" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateField("hero", "title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Subtitle</label>
              <Input value={sectionData.subtitle} onChange={(e) => updateField("hero", "subtitle", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Background Image</label>
              {sectionData.image && (
                <img src={sectionData.image} alt="Hero" className="w-full h-48 object-cover rounded mt-2 mb-2" />
              )}
              <Input type="file" accept="image/*" onChange={handleHeroImageUpload} />
            </div>
          </div>
        )}

        {activeSectionId === "intro" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateField("intro", "title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateField("intro", "description", val)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "featured" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateField("featured", "title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateField("featured", "description", val)}
              />
            </div>
            <div className="p-4 bg-zinc-50 rounded border text-sm text-zinc-500">
              <p>
                Featured items manager would go here. To save time during this iteration, the data structure is
                preserved via the API.
              </p>
            </div>
          </div>
        )}

        {activeSectionId === "localGuide" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateField("localGuide", "title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateField("localGuide", "description", val)}
              />
            </div>
            <div className="p-4 bg-zinc-50 rounded border text-sm text-zinc-500">
              <p>Local guide items list manager goes here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
