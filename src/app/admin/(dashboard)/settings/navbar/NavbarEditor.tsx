"use client";

import React, { useState } from "react";

import { ChevronDown, ChevronRight, Eye, EyeOff, MoveDown, MoveUp, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { updateNavbarSettings } from "@/app/actions/navbar-settings";
import type { NavbarSettings, NavLink } from "@/components/homepage/NavbarManagerTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export function NavbarEditor({ initialSettings }: { initialSettings: NavbarSettings }) {
  const [settings, setSettings] = useState<NavbarSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  const saveSettings = async () => {
    setIsSaving(true);
    const result = await updateNavbarSettings(settings);
    if (result.success) {
      toast.success("Navbar settings saved successfully");
    } else {
      toast.error("Failed to save settings");
    }
    setIsSaving(false);
  };

  const addParentLink = () => {
    const newLink: NavLink = {
      id: Date.now().toString(),
      label: "New Link",
      href: "/",
      isVisible: true,
      children: [],
    };
    setSettings({ ...settings, links: [...settings.links, newLink] });
  };

  const updateParentLink = (id: string, field: string, value: any) => {
    setSettings({
      ...settings,
      links: settings.links.map((link) => (link.id === id ? { ...link, [field]: value } : link)),
    });
  };

  const deleteParentLink = (id: string) => {
    setSettings({ ...settings, links: settings.links.filter((link) => link.id !== id) });
  };

  const moveParentLink = (index: number, direction: "up" | "down") => {
    const newLinks = [...settings.links];
    if (direction === "up" && index > 0) {
      [newLinks[index - 1], newLinks[index]] = [newLinks[index], newLinks[index - 1]];
    } else if (direction === "down" && index < newLinks.length - 1) {
      [newLinks[index], newLinks[index + 1]] = [newLinks[index + 1], newLinks[index]];
    }
    setSettings({ ...settings, links: newLinks });
  };

  const addChildLink = (parentId: string) => {
    setSettings({
      ...settings,
      links: settings.links.map((link) => {
        if (link.id === parentId) {
          const newChild = {
            id: Date.now().toString(),
            label: "New Child Link",
            href: "/",
            isVisible: true,
          };
          return { ...link, children: [...(link.children || []), newChild] };
        }
        return link;
      }),
    });
  };

  const updateChildLink = (parentId: string, childId: string, field: string, value: any) => {
    setSettings({
      ...settings,
      links: settings.links.map((link) => {
        if (link.id === parentId) {
          return {
            ...link,
            children: (link.children || []).map((child) =>
              child.id === childId ? { ...child, [field]: value } : child,
            ),
          };
        }
        return link;
      }),
    });
  };

  const deleteChildLink = (parentId: string, childId: string) => {
    setSettings({
      ...settings,
      links: settings.links.map((link) => {
        if (link.id === parentId) {
          return { ...link, children: (link.children || []).filter((child) => child.id !== childId) };
        }
        return link;
      }),
    });
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex justify-between items-center bg-white p-4 rounded-lg border border-zinc-200">
        <div>
          <h2 className="text-lg font-medium">Save Changes</h2>
          <p className="text-sm text-zinc-500">Don't forget to save your changes to make them public.</p>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save All Changes"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <div>
                <CardTitle>Navigation Links</CardTitle>
                <CardDescription>Manage the main navigation structure</CardDescription>
              </div>
              <Button onClick={addParentLink} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" /> Add Link
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {settings.links.map((link, index) => (
                <div key={link.id} className="border border-zinc-200 rounded-lg p-4 bg-zinc-50">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => moveParentLink(index, "up")}
                        disabled={index === 0}
                        className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveParentLink(index, "down")}
                        disabled={index === settings.links.length - 1}
                        className="p-1 text-zinc-400 hover:text-zinc-900 disabled:opacity-30"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                            Label
                          </label>
                          <Input
                            value={link.label}
                            onChange={(e) => updateParentLink(link.id, "label", e.target.value)}
                          />
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                            URL (href)
                          </label>
                          <Input
                            value={link.href}
                            onChange={(e) => updateParentLink(link.id, "href", e.target.value)}
                          />
                        </div>
                        <div className="pt-6 flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateParentLink(link.id, "isVisible", !link.isVisible)}
                          >
                            {link.isVisible ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4 text-zinc-400" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => deleteParentLink(link.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="pl-6 border-l-2 border-zinc-200 space-y-3 mt-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-zinc-600">
                            Dropdown Links ({(link.children || []).length})
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => addChildLink(link.id)}
                            className="h-8 text-xs"
                          >
                            <Plus className="w-3 h-3 mr-1" /> Add Dropdown Item
                          </Button>
                        </div>

                        {(link.children || []).map((child) => (
                          <div
                            key={child.id}
                            className="flex gap-3 items-end bg-white p-3 rounded border border-zinc-100"
                          >
                            <div className="flex-1">
                              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1 block">
                                Label
                              </label>
                              <Input
                                className="h-8 text-sm"
                                value={child.label}
                                onChange={(e) => updateChildLink(link.id, child.id, "label", e.target.value)}
                              />
                            </div>
                            <div className="flex-1">
                              <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1 block">
                                URL
                              </label>
                              <Input
                                className="h-8 text-sm"
                                value={child.href}
                                onChange={(e) => updateChildLink(link.id, child.id, "href", e.target.value)}
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateChildLink(link.id, child.id, "isVisible", !child.isVisible)}
                            >
                              {child.isVisible ? (
                                <Eye className="w-3 h-3 text-zinc-600" />
                              ) : (
                                <EyeOff className="w-3 h-3 text-zinc-300" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => deleteChildLink(link.id, child.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {settings.links.length === 0 && (
                <div className="text-center py-8 text-zinc-500 border border-dashed rounded-lg">
                  No navigation links found.
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Call to Action Button</CardTitle>
              <CardDescription>Global button displayed in the header</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium">Show Button</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setSettings({
                      ...settings,
                      ctaButton: { ...settings.ctaButton, isVisible: !settings.ctaButton.isVisible },
                    })
                  }
                >
                  {settings.ctaButton.isVisible ? (
                    <>
                      <Eye className="w-4 h-4 mr-2" /> Visible
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-4 h-4 mr-2" /> Hidden
                    </>
                  )}
                </Button>
              </div>

              {settings.ctaButton.isVisible && (
                <>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                      Button Label
                    </label>
                    <Input
                      value={settings.ctaButton.label}
                      onChange={(e) =>
                        setSettings({ ...settings, ctaButton: { ...settings.ctaButton, label: e.target.value } })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-1 block">
                      Button URL
                    </label>
                    <Input
                      value={settings.ctaButton.href}
                      onChange={(e) =>
                        setSettings({ ...settings, ctaButton: { ...settings.ctaButton, href: e.target.value } })
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
