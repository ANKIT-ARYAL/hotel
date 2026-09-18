/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { ArrowLeft, ChevronRight, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "sonner";

import { updateSpaPageSettings } from "@/app/actions/spa-page-settings";
import type { SpaPageSettings } from "@/components/spa/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/RichTextEditor";
import { handleUpload } from "@/lib/upload";

const SECTIONS = [
  { id: "hero", title: "Hero Section", description: "Main title and background image" },
  { id: "intro", title: "Intro Section", description: "Introduction to the Spa" },
  { id: "treatments", title: "Treatments", description: "Manage spa treatment categories and items" },
  { id: "facilities", title: "Facilities", description: "Manage spa facilities and imagery" },
];

export function SpaEditor({ initialSettings }: { initialSettings: SpaPageSettings }) {
  const [settings, setSettings] = useState<SpaPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      await updateSpaPageSettings(settings);
      toast.success("Spa page settings saved successfully");
    } catch (err) {
      console.error("Failed to save", err);
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (section: keyof SpaPageSettings, field: string, value: any) => {
    setSettings({
      ...settings,
      [section]: {
        ...(settings[section] as any),
        [field]: value,
      },
    });
  };

  const toggleVisibility = (section: keyof SpaPageSettings) => {
    setSettings({
      ...settings,
      [section]: {
        ...(settings[section] as any),
        isVisible: !(settings[section] as any).isVisible,
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
              Spa Page
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
              onChange={() => toggleVisibility(activeSectionId as keyof SpaPageSettings)}
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

        {activeSectionId === "treatments" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateField("treatments", "title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateField("treatments", "description", val)}
              />
            </div>
            <div className="p-4 bg-zinc-50 rounded border text-sm text-zinc-500">
              <p>
                In a full implementation, a category manager (like MenuManager) goes here. To save time during this
                iteration, the data structure is preserved via the API.
              </p>
            </div>
          </div>
        )}

        {activeSectionId === "facilities" && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateField("facilities", "title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <RichTextEditor
                value={sectionData.description}
                onChange={(val) => updateField("facilities", "description", val)}
              />
            </div>
            <div className="space-y-6 pt-4 border-t border-zinc-100">
              <h3 className="font-medium text-sm">Facility Items</h3>
              {sectionData.items.map((facility: any, index: number) => (
                <div key={facility.id} className="p-4 bg-zinc-50 border rounded-lg space-y-4">
                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase">Name</label>
                    <Input
                      value={facility.name}
                      onChange={(e) => {
                        const newItems = [...sectionData.items];
                        newItems[index] = { ...facility, name: e.target.value };
                        updateField("facilities", "items", newItems);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase">Description</label>
                    <RichTextEditor
                      value={facility.description}
                      onChange={(val) => {
                        const newItems = [...sectionData.items];
                        newItems[index] = { ...facility, description: val };
                        updateField("facilities", "items", newItems);
                      }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase">Images (Up to 3 recommended)</label>
                    <div className="flex gap-4 mt-2 mb-2 flex-wrap">
                      {facility.images?.map((img: string, imgIndex: number) => (
                        <div key={imgIndex} className="relative group">
                          <img src={img} className="w-24 h-24 object-cover rounded border" alt="" />
                          <button
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                            onClick={() => {
                              const newItems = [...sectionData.items];
                              newItems[index].images = newItems[index].images.filter(
                                (_: any, i: number) => i !== imgIndex,
                              );
                              updateField("facilities", "items", newItems);
                            }}
                          >
                            <EyeOff className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (!e.target.files?.[0]) return;
                        handleUpload(e.target.files[0], (url: string) => {
                          const newItems = [...sectionData.items];
                          newItems[index].images = [...(newItems[index].images || []), url];
                          updateField("facilities", "items", newItems);
                        });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
