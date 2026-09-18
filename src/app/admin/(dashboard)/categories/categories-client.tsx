"use client";
import { useState } from "react";

import { Edit, Image as ImageIcon, Layers, MoreHorizontal, Plus, Trash2 } from "lucide-react";
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

export function CategoriesClientView({
  initialCategories,
  allAmenities,
}: {
  initialCategories: any[];
  allAmenities: any[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const openDialog = (c?: any) => {
    if (c) {
      setEditingCategory(c);
      setName(c.name);
      setDescription(c.description || "");
      setBasePrice(String(c.basePrice));
      setSelectedAmenities(c.amenities.map((a: any) => a.id));
      setImages(c.images?.map((i: any) => i.url) || []);
    } else {
      setEditingCategory(null);
      setName("");
      setDescription("");
      setBasePrice("");
      setSelectedAmenities([]);
      setImages([]);
    }
    setIsDialogOpen(true);
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data.url) {
        setImages([...images, data.url]);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSave = async () => {
    const payload = {
      name,
      description,
      basePrice: parseFloat(basePrice) || 0,
      amenities: selectedAmenities,
      images,
    };

    try {
      if (editingCategory) {
        // Since we are updating relations manually, we might need a custom API endpoint logic
        // But for simplicity, we assume the PUT /api/categories handles standard fields.
        // In a real app, nested relation updates (amenities/images) need specific Prisma syntax.
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setCategories(categories.map((c) => (c.id === updated.id ? updated : c)));
      } else {
        const res = await fetch(`/api/categories`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setCategories([created, ...categories]);
      }
      toast.success("Success!");
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to save category", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All related rooms might break.")) return;
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      setCategories(categories.filter((c) => c.id !== id));
    } catch (e) {
      console.error("Failed to delete category", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Room Categories
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Configure OYO-style dynamic room types and their standard base prices.
          </p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Category
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Categories Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Base Price</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((c) => (
                  <TableRow
                    key={c.id}
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openDialog(c)}
                  >
                    <TableCell className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500 overflow-hidden">
                        {c.images && c.images.length > 0 ? (
                          <img src={c.images[0].url} alt={c.name} className="w-full h-full object-cover" />
                        ) : (
                          <Layers className="h-4 w-4" />
                        )}
                      </div>
                      {c.name}
                    </TableCell>
                    <TableCell className="text-gray-900 font-semibold">${c.basePrice}</TableCell>
                    <TableCell className="text-gray-500">{c._count?.rooms || 0} Units</TableCell>
                    <TableCell className="text-right">
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
                              openDialog(c);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(c.id);
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
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Create Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-1 md:grid-cols-2">
            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-base font-medium">Category Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. OYO Townhouse" />
              </div>
              <div className="grid gap-2">
                <label className="text-base font-medium">Base Price</label>
                <Input
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <label className="text-base font-medium">Description</label>
                <textarea
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm"
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details about the category..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <label className="text-base font-medium">Amenities</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-md bg-gray-50">
                  {allAmenities.map((am) => (
                    <label
                      key={am.id}
                      className="flex items-center space-x-2 cursor-pointer bg-white px-2 py-1 border rounded shadow-sm text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(am.id)}
                        onChange={() => toggleAmenity(am.id)}
                      />
                      <span>{am.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <label className="text-base font-medium">Images</label>
                <div className="flex items-center space-x-2">
                  <Input type="file" onChange={handleImageUpload} accept="image/*" />
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {images.map((url, i) => (
                    <div
                      key={i}
                      className="relative w-16 h-16 border rounded bg-gray-100 flex items-center justify-center overflow-hidden"
                    >
                      <img src={url} alt="Room" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                        className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
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
              Save Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
