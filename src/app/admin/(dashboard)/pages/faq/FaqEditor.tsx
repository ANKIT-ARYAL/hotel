/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";

import { ArrowLeft, ChevronRight, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { updateFaqPageSettings } from "@/app/actions/faq-page-settings";
import type { FaqPageSettings } from "@/components/faq/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { handleUpload } from "@/lib/upload";

const SECTIONS = [
  { id: "hero", title: "Hero Section", desc: "Main title and subtitle" },
  { id: "faqs", title: "Questions & Answers", desc: "Manage all FAQ entries" },
];

export function FaqEditor({ initialSettings }: { initialSettings: FaqPageSettings }) {
  const [settings, setSettings] = useState<FaqPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    const result = await updateFaqPageSettings(settings);
    setIsSaving(false);
    if (result.success) {
      toast.success("Changes saved!");
    } else {
      toast.error("Failed to save settings");
    }
  };

  const toggleVisibility = (section: keyof FaqPageSettings) => {
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

  const updateSectionField = (section: keyof FaqPageSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value,
      },
    }));
  };

  const addFaqItem = () => {
    const currentItems = settings.faqs.items || [];
    updateSectionField("faqs", "items", [...currentItems, { question: "", answer: "" }]);
  };

  const removeFaqItem = (index: number) => {
    const currentItems = [...settings.faqs.items];
    currentItems.splice(index, 1);
    updateSectionField("faqs", "items", currentItems);
  };

  const updateFaqItem = (index: number, field: string, value: string) => {
    const currentItems = [...settings.faqs.items];
    currentItems[index] = { ...currentItems[index], [field]: value };
    updateSectionField("faqs", "items", currentItems);
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
              FAQs Page
            </h1>
            <p className="text-base text-gray-500 mt-1">Manage the layout and dynamic questions for the FAQs page.</p>
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
              onChange={() => toggleVisibility(activeSectionId as keyof FaqPageSettings)}
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, (url) => updateSectionField("hero", "image", url));
                  }}
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

        {activeSectionId === "faqs" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">FAQ Entries</h4>
              <Button onClick={addFaqItem} variant="outline" size="sm" className="gap-2">
                <Plus className="w-4 h-4" /> Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {sectionData.items?.map((item: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-md space-y-4 bg-zinc-50 relative group">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 text-zinc-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeFaqItem(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="space-y-2 pr-10">
                    <label className="text-sm font-medium">Question</label>
                    <Input
                      value={item.question}
                      onChange={(e) => updateFaqItem(idx, "question", e.target.value)}
                      placeholder="e.g. What time is check-in?"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Answer</label>
                    <Textarea
                      rows={3}
                      value={item.answer}
                      onChange={(e) => updateFaqItem(idx, "answer", e.target.value)}
                      placeholder="Provide a detailed answer..."
                    />
                  </div>
                </div>
              ))}

              {(!sectionData.items || sectionData.items.length === 0) && (
                <div className="text-center py-10 border rounded-md border-dashed text-zinc-500">
                  No FAQ entries yet. Click Add Question to create one.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
