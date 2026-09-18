/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState } from "react";

import { Eye, EyeOff, Grid, Heading, Save } from "lucide-react";
import { toast } from "sonner";

import { updateGalleryPageSettings } from "@/app/actions/gallery-page-settings";
import type { GalleryPageSettings } from "@/components/gallery/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { handleUpload } from "@/lib/upload";

export function GalleryEditor({ initialSettings }: { initialSettings: GalleryPageSettings }) {
  const [settings, setSettings] = useState<GalleryPageSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = async () => {
    setIsSaving(true);
    const result = await updateGalleryPageSettings(settings);
    if (result.success) {
      toast.success("Gallery settings saved successfully");
    } else {
      toast.error("Failed to save settings");
    }
    setIsSaving(false);
  };

  const updateHeroField = (field: string, value: any) => {
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        [field]: value,
      },
    });
  };

  const toggleHeroVisibility = () => {
    setSettings({
      ...settings,
      hero: {
        ...settings.hero,
        isVisible: !settings.hero.isVisible,
      },
    });
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    handleUpload(e.target.files[0], (url: any) => {
      updateHeroField("image", url);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setSettings({
          ...settings,
          images: [
            ...settings.images,
            { id: Date.now().toString(), url: data.url, title: file.name, categoryId: "All" },
          ],
        });
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    }
  };

  const handleDeleteImage = (id: string) => {
    setSettings({
      ...settings,
      images: settings.images.filter((img) => img.id !== id),
    });
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <Button onClick={saveSettings} disabled={isSaving} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <div>
            <CardTitle>Hero Section</CardTitle>
            <CardDescription>Main title for the Gallery page</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={toggleHeroVisibility}>
            {settings.hero.isVisible ? (
              <>
                <Eye className="w-4 h-4 mr-2" /> Visible
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4 mr-2" /> Hidden
              </>
            )}
          </Button>
        </CardHeader>
        {settings.hero.isVisible && (
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Hero Image</label>
              <div className="flex items-center gap-4 mt-1">
                {settings.hero.image && (
                  <img src={settings.hero.image} alt="Hero" className="h-16 w-16 object-cover rounded-md" />
                )}
                <Input type="file" accept="image/*" onChange={handleHeroImageUpload} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={settings.hero.title} onChange={(e) => updateHeroField("title", e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                value={settings.hero.description}
                onChange={(e) => updateHeroField("description", e.target.value)}
              />
            </div>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images & Categories</CardTitle>
          <CardDescription>Manage the images that appear in the masonry grid</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Input type="file" onChange={handleFileUpload} accept="image/*" className="max-w-xs" />
            <span className="text-sm text-gray-500 ml-2">Upload a new image</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {settings.images.map((img) => (
              <div key={img.id} className="relative aspect-square border rounded bg-zinc-100 overflow-hidden group">
                <img src={img.url} className="w-full h-full object-cover" alt={img.title} />
                <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 text-xs text-white truncate flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>{img.title}</span>
                  <button onClick={() => handleDeleteImage(img.id)} className="text-red-400 hover:text-red-300">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
