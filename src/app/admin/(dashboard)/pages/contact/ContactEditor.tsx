/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { useRouter } from "next/navigation";

import { ArrowLeft, ChevronRight, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { updateContactPageSettings } from "@/app/actions/contact-page-settings";
import type { ContactPageSettings } from "@/components/contact/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const SECTIONS = [
  { id: "header", title: "Header Section", desc: "Main title and subtitle" },
  { id: "contactInfo", title: "Contact Introduction", desc: "Text above the contact details" },
  { id: "location", title: "Location Info", desc: "Address details" },
  { id: "phone", title: "Phone Info", desc: "Contact number and availability" },
  { id: "email", title: "Email Info", desc: "Email address" },
];

export function ContactEditor({ initialSettings }: { initialSettings: ContactPageSettings }) {
  const [settings, setSettings] = useState<ContactPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const router = useRouter();

  const handleSave = async () => {
    setIsSaving(true);
    await updateContactPageSettings(settings);
    setIsSaving(false);
    toast.success("Changes saved!");
    router.refresh();
  };

  const updateSectionField = (section: keyof ContactPageSettings, field: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const updateRootField = (field: keyof ContactPageSettings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    section: keyof ContactPageSettings,
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
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">Sections</h2>
            <p className="text-sm text-gray-500 mt-1">Select a section to edit its content.</p>
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
        {activeSectionId === "header" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("header", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtitle</label>
              <Textarea
                rows={3}
                value={sectionData.subtitle}
                onChange={(e) => updateSectionField("header", "subtitle", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Image</label>
              <div className="flex flex-col space-y-3">
                {sectionData.image && (
                  <div className="relative h-32 w-48 rounded-md overflow-hidden bg-black/10 border border-zinc-200">
                    <img src={sectionData.image} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                )}
                <Input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "header", "image")} />
              </div>
            </div>
          </div>
        )}

        {activeSectionId === "contactInfo" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("contactInfo", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                value={sectionData.description}
                onChange={(e) => updateSectionField("contactInfo", "description", e.target.value)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "location" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input
                value={sectionData.title}
                onChange={(e) => updateSectionField("location", "title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                rows={3}
                value={sectionData.address}
                onChange={(e) => updateSectionField("location", "address", e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                This address will automatically update the interactive Google Map.
              </p>
            </div>
          </div>
        )}

        {activeSectionId === "phone" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateSectionField("phone", "title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={sectionData.number}
                onChange={(e) => updateSectionField("phone", "number", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability Text</label>
              <Input
                value={sectionData.availability}
                onChange={(e) => updateSectionField("phone", "availability", e.target.value)}
              />
            </div>
          </div>
        )}

        {activeSectionId === "email" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input value={sectionData.title} onChange={(e) => updateSectionField("email", "title", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input
                type="email"
                value={sectionData.address}
                onChange={(e) => updateSectionField("email", "address", e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
