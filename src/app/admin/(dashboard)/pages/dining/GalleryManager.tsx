"use client";

import { useState } from "react";

import { GripVertical, Image as ImageIcon, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GalleryManagerProps {
  images: { id: string; url: string }[];
  onChange: (images: { id: string; url: string }[]) => void;
}

export function GalleryManager({ images, onChange }: GalleryManagerProps) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    const newImages = [...(images || [])];

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          newImages.push({
            id: Date.now().toString() + i,
            url: data.url,
          });
        } else {
          toast.error("Failed to upload image " + file.name);
        }
      } catch (err) {
        toast.error("Error uploading file " + file.name);
      }
    }

    onChange(newImages);
    setUploading(false);

    // Reset file input
    e.target.value = "";
  };

  const removeImage = (idToRemove: string) => {
    onChange((images || []).filter((img) => img.id !== idToRemove));
  };

  const moveImage = (index: number, direction: "up" | "down") => {
    if ((direction === "up" && index === 0) || (direction === "down" && index === images.length - 1)) return;

    const newImages = [...images];
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium flex items-center gap-2">
          <ImageIcon className="w-4 h-4" /> Gallery Images
        </label>
        <div>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            className="w-[250px] text-xs"
          />
        </div>
      </div>

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Uploading images...
        </div>
      )}

      {(!images || images.length === 0) && !uploading && (
        <div className="p-8 text-center text-sm text-muted-foreground border border-dashed rounded-lg bg-zinc-50/50">
          No images uploaded yet. Select files above to add to the gallery.
        </div>
      )}

      {images && images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <Card key={img.id} className="overflow-hidden group">
              <div className="aspect-[4/3] relative bg-zinc-100">
                <img src={img.url} className="w-full h-full object-cover" alt="Gallery image" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={() => moveImage(idx, "up")}
                    disabled={idx === 0}
                  >
                    &larr;
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full"
                    onClick={() => removeImage(img.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full"
                    onClick={() => moveImage(idx, "down")}
                    disabled={idx === images.length - 1}
                  >
                    &rarr;
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
