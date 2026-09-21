"use client";
import { useState } from "react";

import {
  Bath,
  Briefcase,
  Car,
  Cigarette,
  Coffee,
  Dumbbell,
  Edit,
  Key,
  Monitor,
  MoreHorizontal,
  Phone,
  Plus,
  Snowflake,
  Sparkles,
  Trash2,
  Trees,
  Tv,
  Utensils,
  Wifi,
  Wind,
  Wine,
} from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AMENITY_ICONS = [
  { id: "wifi", name: "Wi-Fi", icon: Wifi },
  { id: "tv", name: "TV", icon: Tv },
  { id: "coffee", name: "Coffee", icon: Coffee },
  { id: "wind", name: "AC / Wind", icon: Wind },
  { id: "bath", name: "Bath", icon: Bath },
  { id: "car", name: "Parking", icon: Car },
  { id: "utensils", name: "Dining", icon: Utensils },
  { id: "dumbbell", name: "Gym", icon: Dumbbell },
  { id: "cigarette", name: "Smoking Area", icon: Cigarette },
  { id: "wine", name: "Mini Bar", icon: Wine },
  { id: "key", name: "Key Access", icon: Key },
  { id: "monitor", name: "Workspace", icon: Monitor },
  { id: "snowflake", name: "Air Conditioning", icon: Snowflake },
  { id: "phone", name: "Phone", icon: Phone },
  { id: "briefcase", name: "Business Center", icon: Briefcase },
  { id: "trees", name: "Garden View", icon: Trees },
  { id: "sparkles", name: "Sparkles", icon: Sparkles },
];

export function AmenitiesClientView({ initialAmenities }: { initialAmenities: any[] }) {
  const [amenities, setAmenities] = useState(initialAmenities);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAmenity, setEditingAmenity] = useState<any>(null);

  const [name, setName] = useState("");
  const [icon, setIcon] = useState("");

  const openDialog = (a?: any) => {
    if (a) {
      setEditingAmenity(a);
      setName(a.name);
      setIcon(a.icon || "");
    } else {
      setEditingAmenity(null);
      setName("");
      setIcon("");
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = { name, icon };
    try {
      if (editingAmenity) {
        const res = await fetch(`/api/amenities/${editingAmenity.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setAmenities(amenities.map((a) => (a.id === updated.id ? updated : a)));
      } else {
        const res = await fetch(`/api/amenities`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setAmenities([created, ...amenities]);
      }
      toast.success("Success!");
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to save amenity", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this amenity?")) return;
    try {
      await fetch(`/api/amenities/${id}`, { method: "DELETE" });
      setAmenities(amenities.filter((a) => a.id !== id));
    } catch (e) {
      console.error("Failed to delete amenity", e);
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
            Room Amenities
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Manage standard features and amenities offered across room categories.
          </p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Amenity
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Amenities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{amenities.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Amenities List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {amenities.map((a) => {
                  const IconComp = AMENITY_ICONS.find((i) => i.id === a.icon)?.icon || Sparkles;
                  return (
                    <TableRow
                      key={a.id}
                      data-hide-actions="true"
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => openDialog(a)}
                    >
                      <TableCell data-label="Name" className="font-medium flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                          <IconComp className="h-4 w-4" />
                        </div>
                        {a.name}
                      </TableCell>
                      <TableCell data-label="Icon Name" className="text-gray-500">{a.icon || "None"}</TableCell>
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
                                openDialog(a);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(a.id);
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAmenity ? "Edit Amenity" : "Add New Amenity"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Amenity Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Free Wi-Fi" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Icon</label>
              <Select value={icon} onValueChange={(val) => setIcon(val || "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {AMENITY_ICONS.map((i) => {
                    const IconComp = i.icon;
                    return (
                      <SelectItem key={i.id} value={i.id}>
                        <div className="flex items-center">
                          <IconComp className="w-4 h-4 mr-2" />
                          {i.name}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">
              Save Amenity
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
