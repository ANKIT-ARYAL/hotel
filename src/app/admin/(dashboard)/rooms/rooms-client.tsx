/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";

import { Edit, Key, MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

export function RoomsClientView({
  initialRooms,
  categories,
  allAmenities,
}: {
  initialRooms: any[];
  categories: any[];
  allAmenities: any[];
}) {
  const [rooms, setRooms] = useState(initialRooms);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

  const availableCount = rooms.filter((r) => r.status === "AVAILABLE").length;
  const occupiedCount = rooms.filter((r) => r.status === "OCCUPIED").length;
  const maintenanceCount = rooms.filter((r) => ["MAINTENANCE", "CLEANING"].includes(r.status)).length;

  const filteredRooms = rooms.filter((r) => {
    if (statusFilter === "AVAILABLE") return r.status === "AVAILABLE";
    if (statusFilter === "OCCUPIED") return r.status === "OCCUPIED";
    if (statusFilter === "MAINTENANCE") return ["MAINTENANCE", "CLEANING"].includes(r.status);
    return true;
  });

  // Form state
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [status, setStatus] = useState("AVAILABLE");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // SEO & Slug
  const [slug, setSlug] = useState("");
  const [focusKeyphrase, setFocusKeyphrase] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [keywords, setKeywords] = useState("");

  const openDialog = (room?: any) => {
    if (room) {
      setEditingRoom(room);
      setName(room.name || "");
      setNumber(room.number);
      setCategoryId(room.categoryId);
      setStatus(room.status);
      setPrice(String(room.price));
      setDescription(room.description || "");
      setImage(room.image || "");
      setVideoUrl(room.videoUrl || "");
      setSelectedAmenities(room.amenities ? room.amenities.map((a: any) => a.id) : []);
      
      setSlug(room.slug || "");
      setFocusKeyphrase(room.focusKeyphrase || "");
      setSeoTitle(room.seoTitle || "");
      setMetaDescription(room.metaDescription || "");
      setKeywords(room.keywords || "");
    } else {
      setEditingRoom(null);
      setName("");
      setNumber("");
      
      const defaultCatId = categories[0]?.id || "";
      setCategoryId(defaultCatId);
      const defaultCat = categories.find((c) => c.id === defaultCatId);
      setSelectedAmenities(defaultCat && defaultCat.amenities ? defaultCat.amenities.map((a: any) => a.id) : []);
      
      setStatus("AVAILABLE");
      setPrice("");
      setDescription("");
      setImage("");
      setVideoUrl("");
      
      setSlug("");
      setFocusKeyphrase("");
      setSeoTitle("");
      setMetaDescription("");
      setKeywords("");
    }
    setIsDialogOpen(true);
  };

  const handleCategoryChange = (newCategoryId: string) => {
    setCategoryId(newCategoryId);
    if (!editingRoom) {
      const selectedCat = categories.find((c) => c.id === newCategoryId);
      if (selectedCat && selectedCat.amenities) {
        setSelectedAmenities(selectedCat.amenities.map((a: any) => a.id));
      } else {
        setSelectedAmenities([]);
      }
    }
  };

  const handleSave = async () => {
    const payload = {
      name,
      number,
      categoryId,
      status,
      price: parseFloat(price) || 0,
      description,
      image,
      videoUrl,
      amenities: selectedAmenities,
    };

    try {
      if (editingRoom) {
        const res = await fetch(`/api/rooms/${editingRoom.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        const selectedCat = categories.find((c) => c.id === updated.categoryId);
        setRooms(rooms.map((r) => (r.id === updated.id ? { ...updated, category: selectedCat } : r)));
      } else {
        const res = await fetch(`/api/rooms`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        const selectedCat = categories.find((c) => c.id === created.categoryId);
        setRooms([...rooms, { ...created, category: selectedCat }].sort((a, b) => a.number.localeCompare(b.number)));
      }
      toast.success("Success!");
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to save room", e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        if (type === "image") setImage(data.url);
        else setVideoUrl(data.url);
      }
    } catch (err) {
      console.error("Upload failed", err);
      toast.error("Upload failed");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this room?")) return;
    try {
      await fetch(`/api/rooms/${id}`, { method: "DELETE" });
      setRooms(rooms.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete room", e);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Rooms Management
          </h1>
          <p className="text-base text-gray-500 mt-1">Manage all property rooms, statuses, and details.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Room
        </Button>
      </div>

      {/* Overview Cards (Clickable Filters) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Card
          onClick={() => setStatusFilter(statusFilter === "ALL" ? "ALL" : "ALL")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            statusFilter === "ALL"
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Total Rooms</CardTitle>
              {statusFilter === "ALL" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-gray-900">{rooms.length}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStatusFilter(statusFilter === "AVAILABLE" ? "ALL" : "AVAILABLE")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            statusFilter === "AVAILABLE"
              ? "border-green-500 ring-2 ring-green-500/20 bg-green-50/40"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Available</CardTitle>
              {statusFilter === "AVAILABLE" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-green-600">{availableCount}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStatusFilter(statusFilter === "OCCUPIED" ? "ALL" : "OCCUPIED")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            statusFilter === "OCCUPIED"
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Occupied</CardTitle>
              {statusFilter === "OCCUPIED" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-blue-600">{occupiedCount}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStatusFilter(statusFilter === "MAINTENANCE" ? "ALL" : "MAINTENANCE")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            statusFilter === "MAINTENANCE"
              ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/40"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Maintenance/Cleaning</CardTitle>
              {statusFilter === "MAINTENANCE" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-orange-500">{maintenanceCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-children: Data Table */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Rooms Directory</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Showing {filteredRooms.length} of {rooms.length}
            </span>
            {statusFilter !== "ALL" && (
              <button
                onClick={() => setStatusFilter("ALL")}
                className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
              >
                Clear filter
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px]">Room</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="!hidden md:!table-cell">Status</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRooms.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-gray-400">
                      No rooms match this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRooms.map((room, idx) => (
                  <TableRow
                    key={room.id || `room-${idx}`}
                    data-has-image="true"
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openDialog(room)}
                  >
                    <TableCell data-label="Room" className="font-medium flex items-center">
                      {room.image ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <Image src={room.image} alt={room.number} className="w-full h-full object-cover"  width={1920} height={1080} />
                        </div>
                      ) : (
                        <Key className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      {room.number}
                    </TableCell>
                    <TableCell data-label="Category">{room.category?.name || "Unknown"}</TableCell>
                    <TableCell data-label="Status" className="!hidden md:!table-cell">
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-semibold ${
                          room.status === "AVAILABLE"
                            ? "bg-green-100 text-green-700"
                            : room.status === "OCCUPIED"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {room.status}
                      </span>
                    </TableCell>
                    <TableCell data-label="Price/Night">{formatCurrency(room.price)}</TableCell>
                    <TableCell data-label="Actions" className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          onClick={(e) => e.stopPropagation()}
                          className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              openDialog(room);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(room.id);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* CRUD Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[calc(100dvh-1rem)] overflow-y-auto overscroll-contain">
          <DialogHeader>
            <DialogTitle>{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Room Name (Optional)</label>
                <Input value={name} onChange={(e) => {
                  setName(e.target.value);
                  if (!editingRoom) {
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                  }
                }} placeholder="e.g. Ocean View Suite" />
              </div>
              {editingRoom && (
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Slug</label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="e.g. ocean-view-suite" />
                </div>
              )}
              <div className="grid gap-2">
                <label className="text-sm font-medium">Room Number</label>
                <Input value={number} onChange={(e) => setNumber(e.target.value)} placeholder="e.g. 101" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={categoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Status</label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="OCCUPIED">Occupied</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="CLEANING">Cleaning</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Price per night $</label>
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="e.g. 150" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed description of the room..."
                />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Room Image</label>
                <div className="flex gap-2 items-center">
                  <Input type="file" onChange={(e) => handleFileUpload(e, "image")} accept="image/*" />
                </div>
                {image && <Image src={image} alt="Preview" className="w-full h-32 object-cover rounded-md mt-2"  width={1920} height={1080} />}
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Room Video</label>
                <div className="flex gap-2 items-center">
                  <Input type="file" onChange={(e) => handleFileUpload(e, "video")} accept="video/*" />
                </div>
                {videoUrl && <video src={videoUrl} controls className="w-full h-32 object-cover rounded-md mt-2" />}
              </div>
            </div>

            {/* Full width row for amenities */}
            <div className="col-span-1 md:col-span-2 space-y-4">
              <div className="grid gap-2 border-t pt-4">
                <label className="text-sm font-medium">Custom Room Amenities</label>
                <p className="text-xs text-gray-500">
                  Select amenities specific to this room. Category amenities are pre-selected when creating a new room.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
                  {allAmenities.map((amenity) => (
                    <label key={amenity.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                        checked={selectedAmenities.includes(amenity.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAmenities([...selectedAmenities, amenity.id]);
                          } else {
                            setSelectedAmenities(selectedAmenities.filter((id) => id !== amenity.id));
                          }
                        }}
                      />
                      <span className="text-sm">{amenity.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-bold mb-4">Search Engine Optimization</h3>
            <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Focus Keyphrase</label>
                <Input value={focusKeyphrase} onChange={(e) => setFocusKeyphrase(e.target.value)} placeholder="e.g. Luxury Suite" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">SEO Title</label>
                <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder="Custom SEO Title" />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Meta Description</label>
                <textarea className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm" rows={3} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} placeholder="Write a compelling meta description..." />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium">Keywords (comma separated, max 5)</label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="hotel, luxury, suite" />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
