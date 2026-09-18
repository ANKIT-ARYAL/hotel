"use client";

import { useState } from "react";

import { Edit, Eye, EyeOff, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { DiningVenue } from "@/components/dining/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface VenueManagerProps {
  venues: DiningVenue[];
  onVenuesChange: (venues: DiningVenue[]) => void;
}

export function VenueManager({ venues, onVenuesChange }: VenueManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<DiningVenue>>({});
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVenue, setNewVenue] = useState<Partial<DiningVenue>>({
    name: "",
    details: "",
    image: "",
  });

  const handleUpload = async (file: File, onSuccess: (url: string) => void) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const data = await res.json();
        onSuccess(data.url);
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Error uploading file");
    }
  };

  const startEdit = (venue: DiningVenue) => {
    setEditingId(venue.id);
    setEditForm({ ...venue });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (venue: DiningVenue) => {
    setUploadingId(venue.id);
    const updated = venues.map((v) => (v.id === venue.id ? { ...v, ...editForm } : v));
    onVenuesChange(updated);
    setEditingId(null);
    setEditForm({});
    setUploadingId(null);
    toast.success("Venue updated");
  };

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    form: typeof editForm,
    setForm: typeof setEditForm,
  ) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId(editingId);
    handleUpload(file, (url) => {
      setForm({ ...form, image: url });
      setUploadingId(null);
    });
  };

  const handleNewImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId("new");
    handleUpload(file, (url) => {
      setNewVenue({ ...newVenue, image: url });
      setUploadingId(null);
    });
  };

  const addVenue = () => {
    if (!newVenue.name || !newVenue.details) {
      toast.error("Please fill in name and details");
      return;
    }
    const venue: DiningVenue = {
      id: Date.now().toString(),
      name: newVenue.name,
      details: newVenue.details,
      image: newVenue.image || "",
    };
    onVenuesChange([...(venues || []), venue]);
    setNewVenue({ name: "", details: "", image: "" });
    setShowAddForm(false);
    toast.success("Venue added");
  };

  const deleteVenue = (id: string) => {
    if (!confirm("Delete this venue?")) return;
    onVenuesChange((venues || []).filter((v) => v.id !== id));
    toast.success("Venue deleted");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manage Venues</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or remove dining venues with images</p>
        </div>
        {!showAddForm && editingId === null && (
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Venue
          </Button>
        )}
      </div>

      {showAddForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Add New Venue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Venue Name</label>
              <Input
                value={newVenue.name || ""}
                onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })}
                placeholder="e.g., The Courtyard, The Lounge"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Details</label>
              <Textarea
                value={newVenue.details || ""}
                onChange={(e) => setNewVenue({ ...newVenue, details: e.target.value })}
                placeholder="e.g., Fine Dining • Open 18:00 - 23:00"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" /> Venue Image
              </label>
              {newVenue.image && (
                <div className="mb-2 relative w-full h-40 rounded bg-zinc-100 overflow-hidden">
                  <img src={newVenue.image} className="w-full h-full object-cover" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleNewImageUpload}
                className="text-xs"
                disabled={uploadingId === "new"}
              />
              {uploadingId === "new" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="flex gap-2">
              <Button onClick={addVenue} disabled={uploadingId === "new"}>
                Add Venue
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setNewVenue({ name: "", details: "", image: "" });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {venues?.length === 0 && !showAddForm && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No venues added yet. Click "Add Venue" to create one.
            </CardContent>
          </Card>
        )}

        {venues?.map((venue) => (
          <Card key={venue.id} className={editingId === venue.id ? "border-blue-200" : ""}>
            <CardContent className="space-y-4">
              {editingId === venue.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Venue Name</label>
                    <Input
                      value={editForm.name || ""}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Details</label>
                    <Textarea
                      value={editForm.details || ""}
                      onChange={(e) => setEditForm({ ...editForm, details: e.target.value })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" /> Venue Image
                    </label>
                    {editForm.image && (
                      <div className="mb-2 relative w-full h-40 rounded bg-zinc-100 overflow-hidden">
                        <img src={editForm.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, editForm, setEditForm)}
                      className="text-xs"
                      disabled={uploadingId === venue.id}
                    />
                    {uploadingId === venue.id && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => saveEdit(venue)} disabled={uploadingId === venue.id}>
                      {uploadingId === venue.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-4 items-start">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 rounded bg-zinc-100 overflow-hidden">
                    {venue.image ? (
                      <img src={venue.image} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold">{venue.name}</h4>
                    <p className="text-sm text-muted-foreground">{venue.details}</p>
                    {venue.image && <p className="text-xs text-green-600">Image set</p>}
                  </div>
                  <div className="flex items-start gap-2">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(venue)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteVenue(venue.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
