/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

import { ArrowLeft, ChevronRight, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateAboutPageSettings } from "@/app/actions/about-page-settings";
import type { AboutPageSettings } from "@/components/about/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleUpload } from "@/lib/upload";

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Main title and background" },
  { id: "ourStory", title: "Our Story Section", desc: "Hotel history and mission" },
  { id: "coreValues", title: "Core Values Section", desc: "Guiding principles and icons" },
  { id: "team", title: "Team Section", desc: "Meet the visionaries" },
  { id: "contactBlock", title: "Contact Block", desc: "Call to action and contact info" },
];

export function AboutEditor({ initialSettings }: { initialSettings: AboutPageSettings }) {
  const [settings, setSettings] = useState<AboutPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateAboutPageSettings(settings);
    setIsSaving(false);
    if (result.success) {
      toast.success("Changes saved!");
    } else {
      toast.error("Failed to save settings");
    }
  };

  const toggleVisibility = (section: keyof AboutPageSettings) => {
    if (settings[section]) {
      const currentVal = (settings[section] as any).isVisible;
      const newVal = currentVal === false ? true : false;
      setSettings((prev) => ({
        ...prev,
        [section]: {
          ...(prev[section] as any),
          isVisible: newVal,
        },
      }));
    }
  };

  const updateSectionField = (section: keyof AboutPageSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const handleImageUpload = (file: File | undefined, section: keyof AboutPageSettings, field: string) => {
    if (!file) return;
    handleUpload(file, (url) => {
      updateSectionField(section, field, url);
    });
  };

  // Helper to handle arrays (values, team members)
  const updateArrayItem = (
    section: keyof AboutPageSettings,
    arrayField: string,
    index: number,
    field: string,
    value: any,
  ) => {
    const sectionData = settings[section] as any;
    const array = [...sectionData[arrayField]];
    array[index] = { ...array[index], [field]: value };
    updateSectionField(section, arrayField, array);
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
              About Us Page
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
                    {(settings as any)[sec.id]?.isVisible !== false ? "Visible" : "Hidden"}
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

      <div className="max-w-4xl space-y-6 bg-white p-6 border rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 bg-zinc-50 rounded-md border">
          <div>
            <h4 className="font-medium">Section Visibility</h4>
            <p className="text-sm text-muted-foreground">Toggle this section on or off</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={sectionData?.isVisible !== false}
              onChange={() => toggleVisibility(activeSectionId as keyof AboutPageSettings)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-zinc-900" />
          </label>
        </div>

        {activeSectionId === "hero" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image</label>
              <div className="flex items-center gap-4 mt-1">
                {sectionData.image && (
                  <img src={sectionData.image} alt="Hero" className="h-16 w-16 object-cover rounded-md" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files?.[0], "hero", "image")}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateSectionField("hero", "title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                value={sectionData.subtitle}
                onChange={(e) => updateSectionField("hero", "subtitle", e.target.value)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "ourStory" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("ourStory", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Content (HTML allowed)</label>
              <Textarea
                rows={6}
                value={sectionData.content}
                onChange={(e) => updateSectionField("ourStory", "content", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Story Image 1</label>
                <div className="flex flex-col gap-2 mt-1">
                  {sectionData.image1 && (
                    <img src={sectionData.image1} alt="Story 1" className="h-32 w-full object-cover rounded-md" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0], "ourStory", "image1")}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Story Image 2</label>
                <div className="flex flex-col gap-2 mt-1">
                  {sectionData.image2 && (
                    <img src={sectionData.image2} alt="Story 2" className="h-32 w-full object-cover rounded-md" />
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0], "ourStory", "image2")}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSectionId === "coreValues" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("coreValues", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                value={sectionData.subtitle}
                onChange={(e) => updateSectionField("coreValues", "subtitle", e.target.value)}
              />
            </div>
            <div className="mt-6 space-y-6">
              <h4 className="font-medium border-b pb-2">Values</h4>
              {sectionData.values.map((v: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-md space-y-4 bg-zinc-50">
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={v.title}
                        onChange={(e) => updateArrayItem("coreValues", "values", idx, "title", e.target.value)}
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label className="text-sm font-medium">Icon (Lucide Name)</label>
                      <Input
                        value={v.icon}
                        onChange={(e) => updateArrayItem("coreValues", "values", idx, "icon", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      rows={2}
                      value={v.description}
                      onChange={(e) => updateArrayItem("coreValues", "values", idx, "description", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSectionId === "team" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateSectionField("team", "title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Input
                value={sectionData.subtitle}
                onChange={(e) => updateSectionField("team", "subtitle", e.target.value)}
              />
            </div>
            <div className="mt-6 space-y-6">
              <h4 className="font-medium border-b pb-2">Team Members</h4>
              {sectionData.members.map((m: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-md space-y-4 bg-zinc-50">
                  <div className="flex gap-6 items-start">
                    <div className="w-1/3 space-y-2">
                      <label className="text-sm font-medium">Photo</label>
                      {m.image && (
                        <img src={m.image} alt="Team" className="w-full aspect-[3/4] object-cover rounded-md mb-2" />
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUpload(file, (url) => updateArrayItem("team", "members", idx, "image", url));
                        }}
                      />
                    </div>
                    <div className="w-2/3 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input
                          value={m.name}
                          onChange={(e) => updateArrayItem("team", "members", idx, "name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Role</label>
                        <Input
                          value={m.role}
                          onChange={(e) => updateArrayItem("team", "members", idx, "role", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSectionId === "contactBlock" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("contactBlock", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input
                value={sectionData.description}
                onChange={(e) => updateSectionField("contactBlock", "description", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={sectionData.phone}
                  onChange={(e) => updateSectionField("contactBlock", "phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={sectionData.email}
                  onChange={(e) => updateSectionField("contactBlock", "email", e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Button Label</label>
              <Input
                value={sectionData.buttonLabel}
                onChange={(e) => updateSectionField("contactBlock", "buttonLabel", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
