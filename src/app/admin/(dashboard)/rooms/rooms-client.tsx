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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any>(null);

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

      {/* Children: Overview Cards */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{rooms.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">
              {rooms.filter((r) => r.status === "AVAILABLE").length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">
              {rooms.filter((r) => r.status === "OCCUPIED").length}
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Maintenance/Cleaning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-500">
              {rooms.filter((r) => ["MAINTENANCE", "CLEANING"].includes(r.status)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-children: Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Rooms Directory</CardTitle>
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
                {rooms.map((room, idx) => (
                  <TableRow
                    key={room.id || `room-${idx}`}
                    data-has-image="true"
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openDialog(room)}
                  >
                    <TableCell data-label="Room" className="font-medium flex items-center">
                      {room.image ? (
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img src={room.image} alt={room.number} className="w-full h-full object-cover" />
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
                ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No rooms found.
                    </TableCell>
                  </TableRow>
                )}
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
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ocean View Suite" />
              </div>
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
                {image && <img src={image} alt="Preview" className="w-full h-32 object-cover rounded-md mt-2" />}
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
