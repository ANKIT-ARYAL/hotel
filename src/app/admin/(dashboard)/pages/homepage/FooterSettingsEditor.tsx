import React from "react";

import { Plus, Trash2 } from "lucide-react";

import type { HomepageSettings } from "@/components/homepage/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FooterSettingsEditorProps {
  data: HomepageSettings["footer"];
  updateField: (field: string, value: any) => void;
}

export function FooterSettingsEditor({ data, updateField }: FooterSettingsEditorProps) {
  const updateLinkArray = (
    arrayName: "socialLinks" | "exploreLinks" | "quickLinks",
    index: number,
    field: string,
    value: string | boolean,
  ) => {
    const newArray = [...(data[arrayName] || [])];
    newArray[index] = { ...newArray[index], [field]: value };
    updateField(arrayName, newArray);
  };

  const addLink = (arrayName: "socialLinks" | "exploreLinks" | "quickLinks", newItem: any) => {
    const newArray = [...(data[arrayName] || []), { ...newItem, id: Date.now().toString(), isVisible: true }];
    updateField(arrayName, newArray);
  };

  const removeLink = (arrayName: "socialLinks" | "exploreLinks" | "quickLinks", index: number) => {
    const newArray = [...(data[arrayName] || [])];
    newArray.splice(index, 1);
    updateField(arrayName, newArray);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">General Info</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand Description</label>
          <Input value={data.brandDescription} onChange={(e) => updateField("brandDescription", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Address</label>
          <Input value={data.address} onChange={(e) => updateField("address", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone</label>
          <Input value={data.phone} onChange={(e) => updateField("phone", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input value={data.email} onChange={(e) => updateField("email", e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Copyright Text</label>
          <Input value={data.copyright} onChange={(e) => updateField("copyright", e.target.value)} />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold">Social Links</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addLink("socialLinks", { platform: "facebook", url: "#" })}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Social Link
          </Button>
        </div>
        {(data.socialLinks || []).map((link, idx) => (
          <div key={link.id || idx} className="flex gap-2 items-center">
            <Input
              placeholder="Platform (e.g. facebook)"
              value={link.platform}
              onChange={(e) => updateLinkArray("socialLinks", idx, "platform", e.target.value)}
              className="w-1/3"
            />
            <Input
              placeholder="URL"
              value={link.url}
              onChange={(e) => updateLinkArray("socialLinks", idx, "url", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink("socialLinks", idx)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold">Explore Links</h3>
          <Button variant="outline" size="sm" onClick={() => addLink("exploreLinks", { label: "New Link", href: "#" })}>
            <Plus className="w-4 h-4 mr-1" /> Add Explore Link
          </Button>
        </div>
        {(data.exploreLinks || []).map((link, idx) => (
          <div key={link.id || idx} className="flex gap-2 items-center">
            <Input
              placeholder="Label"
              value={link.label}
              onChange={(e) => updateLinkArray("exploreLinks", idx, "label", e.target.value)}
              className="w-1/3"
            />
            <Input
              placeholder="URL Path (/rooms)"
              value={link.href}
              onChange={(e) => updateLinkArray("exploreLinks", idx, "href", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink("exploreLinks", idx)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Button variant="outline" size="sm" onClick={() => addLink("quickLinks", { label: "New Link", href: "#" })}>
            <Plus className="w-4 h-4 mr-1" /> Add Quick Link
          </Button>
        </div>
        {(data.quickLinks || []).map((link, idx) => (
          <div key={link.id || idx} className="flex gap-2 items-center">
            <Input
              placeholder="Label"
              value={link.label}
              onChange={(e) => updateLinkArray("quickLinks", idx, "label", e.target.value)}
              className="w-1/3"
            />
            <Input
              placeholder="URL Path (/terms)"
              value={link.href}
              onChange={(e) => updateLinkArray("quickLinks", idx, "href", e.target.value)}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeLink("quickLinks", idx)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
