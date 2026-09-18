"use client";

import { useState } from "react";

import { ChevronDown, ChevronUp, Edit, Image as ImageIcon, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import type { MenuCategory, MenuItem, TypographyOverrides } from "@/components/dining/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface MenuManagerProps {
  categories: MenuCategory[];
  onCategoriesChange: (categories: MenuCategory[]) => void;
  typography?: TypographyOverrides;
  onTypographyChange?: (typography: TypographyOverrides) => void;
}

const DIETARY_TAGS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "gluten-free", label: "Gluten-Free" },
  { value: "dairy-free", label: "Dairy-Free" },
  { value: "nut-free", label: "Nut-Free" },
] as const;

export function MenuManager({ categories, onCategoriesChange, typography = {}, onTypographyChange }: MenuManagerProps) {
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editCategoryForm, setEditCategoryForm] = useState<Partial<MenuCategory>>({});
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState<Partial<MenuItem>>({});
  const [editingItemCategoryId, setEditingItemCategoryId] = useState<string | null>(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategory, setNewCategory] = useState<Partial<MenuCategory>>({
    title: "",
    image: "",
    items: [],
  });
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [showTypography, setShowTypography] = useState(false);

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

  const startEditCategory = (category: MenuCategory) => {
    setEditingCategoryId(category.id);
    setEditCategoryForm({ ...category, items: category.items.map((i) => ({ ...i })) });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryForm({});
  };

  const saveEditCategory = () => {
    const updated = categories.map((c) =>
      c.id === editingCategoryId ? { ...c, ...editCategoryForm, items: editCategoryForm.items || [] } : c,
    );
    onCategoriesChange(updated);
    setEditingCategoryId(null);
    setEditCategoryForm({});
    toast.success("Category updated");
  };

  const handleCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId(editingCategoryId || "new-category");
    handleUpload(file, (url) => {
      setEditCategoryForm({ ...editCategoryForm, image: url });
      setUploadingId(null);
    });
  };

  const handleNewCategoryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId("new-category");
    handleUpload(file, (url) => {
      setNewCategory({ ...newCategory, image: url });
      setUploadingId(null);
    });
  };

  const handleItemImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    setUploadingId(editingItemId || "new-item");
    handleUpload(file, (url) => {
      setEditItemForm({ ...editItemForm, image: url });
      setUploadingId(null);
    });
  };

  const addCategory = () => {
    if (!newCategory.title) {
      toast.error("Please enter a category title");
      return;
    }
    const category: MenuCategory = {
      id: Date.now().toString(),
      title: newCategory.title,
      image: newCategory.image || "",
      items: [],
    };
    onCategoriesChange([...(categories || []), category]);
    setNewCategory({ title: "", image: "", items: [] });
    setShowAddCategoryForm(false);
    toast.success("Category added");
  };

  const deleteCategory = (id: string) => {
    if (!confirm("Delete this category and all its items?")) return;
    onCategoriesChange((categories || []).filter((c) => c.id !== id));
    toast.success("Category deleted");
  };

  const moveCategory = (id: string, direction: "up" | "down") => {
    const index = categories.findIndex((c) => c.id === id);
    if (direction === "up" && index > 0) {
      const newCategories = [...categories];
      [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      onCategoriesChange(newCategories);
    } else if (direction === "down" && index < categories.length - 1) {
      const newCategories = [...categories];
      [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      onCategoriesChange(newCategories);
    }
  };

  const startEditItem = (categoryId: string, item: MenuItem) => {
    setEditingItemCategoryId(categoryId);
    setEditingItemId(item.id);
    setEditItemForm({ ...item, dietaryTags: item.dietaryTags || [], image: item.image || "" });
  };

  const cancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemCategoryId(null);
    setEditItemForm({});
  };

  const saveEditItem = () => {
    if (!editingItemCategoryId || !editingItemId) return;
    const updated = categories.map((c) => {
      if (c.id === editingItemCategoryId) {
        return {
          ...c,
          items: c.items.map((i) =>
            i.id === editingItemId ? { ...i, ...editItemForm, dietaryTags: editItemForm.dietaryTags || [] } : i,
          ),
        };
      }
      return c;
    });
    onCategoriesChange(updated);
    setEditingItemId(null);
    setEditingItemCategoryId(null);
    setEditItemForm({});
    toast.success("Item updated");
  };

  const addItem = (categoryId: string) => {
    if (!editItemForm.name) {
      toast.error("Please enter an item name");
      return;
    }
    const item: MenuItem = {
      id: Date.now().toString(),
      name: editItemForm.name,
      description: editItemForm.description || "",
      price: editItemForm.price || "",
      dietaryTags: editItemForm.dietaryTags || [],
      image: editItemForm.image || "",
    };
    const updated = categories.map((c) => (c.id === categoryId ? { ...c, items: [...c.items, item] } : c));
    onCategoriesChange(updated);
    setEditItemForm({ name: "", description: "", price: "", dietaryTags: [], image: "" });
    setEditingItemId(null);
    setEditingItemCategoryId(null);
    toast.success("Item added");
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    if (!confirm("Delete this item?")) return;
    const updated = categories.map((c) =>
      c.id === categoryId ? { ...c, items: c.items.filter((i) => i.id !== itemId) } : c,
    );
    onCategoriesChange(updated);
    toast.success("Item deleted");
  };

  const moveItem = (categoryId: string, itemId: string, direction: "up" | "down") => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;
    const index = category.items.findIndex((i) => i.id === itemId);
    if (direction === "up" && index > 0) {
      const newItems = [...category.items];
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      const updated = categories.map((c) => (c.id === categoryId ? { ...c, items: newItems } : c));
      onCategoriesChange(updated);
    } else if (direction === "down" && index < category.items.length - 1) {
      const newItems = [...category.items];
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      const updated = categories.map((c) => (c.id === categoryId ? { ...c, items: newItems } : c));
      onCategoriesChange(updated);
    }
  };

  const toggleDietaryTag = (tag: string) => {
    const currentTags = editItemForm.dietaryTags || [];
    const newTags = currentTags.includes(tag) ? currentTags.filter((t) => t !== tag) : [...currentTags, tag];
    setEditItemForm({ ...editItemForm, dietaryTags: newTags });
  };

  const handleTypographyChange = (key: keyof TypographyOverrides, value: string) => {
    if (!onTypographyChange) return;
    const newTypography = { ...typography, [key]: value || undefined };
    onTypographyChange(newTypography);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Manage Menu Categories & Items</h3>
          <p className="text-sm text-muted-foreground">Add, edit, or remove menu categories and their items</p>
        </div>
        {!showAddCategoryForm && editingCategoryId === null && (
          <Button onClick={() => setShowAddCategoryForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        )}
      </div>

      {showAddCategoryForm && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Title</label>
              <Input
                value={newCategory.title || ""}
                onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
                placeholder="e.g., Starters, Mains, Desserts"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center">
                <ImageIcon className="w-3 h-3 mr-1" /> Category Hero Image (Optional)
              </label>
              {newCategory.image && (
                <div className="mb-2 relative w-full h-40 rounded bg-zinc-100 overflow-hidden">
                  <img src={newCategory.image} className="w-full h-full object-cover" />
                </div>
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleNewCategoryImageUpload}
                className="text-xs"
                disabled={uploadingId === "new-category"}
              />
              {uploadingId === "new-category" && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
            </div>
            <div className="flex gap-2">
              <Button onClick={addCategory} disabled={uploadingId === "new-category"}>
                Add Category
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddCategoryForm(false);
                  setNewCategory({ title: "", image: "", items: [] });
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {categories?.length === 0 && !showAddCategoryForm && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No categories added yet. Click "Add Category" to create one.
            </CardContent>
          </Card>
        )}

        {categories?.map((category) => (
          <Card key={category.id} className={editingCategoryId === category.id ? "border-blue-200" : ""}>
            <CardContent className="space-y-4">
              {editingCategoryId === category.id ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category Title</label>
                    <Input
                      value={editCategoryForm.title || ""}
                      onChange={(e) => setEditCategoryForm({ ...editCategoryForm, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center">
                      <ImageIcon className="w-3 h-3 mr-1" /> Category Hero Image (Optional)
                    </label>
                    {editCategoryForm.image && (
                      <div className="mb-2 relative w-full h-40 rounded bg-zinc-100 overflow-hidden">
                        <img src={editCategoryForm.image} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleCategoryImageUpload}
                      className="text-xs"
                      disabled={uploadingId === editingCategoryId}
                    />
                    {uploadingId === editingCategoryId && (
                      <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={saveEditCategory} disabled={uploadingId === editingCategoryId}>
                      {uploadingId === editingCategoryId ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Save Category"
                      )}
                    </Button>
                    <Button variant="outline" onClick={cancelEditCategory}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="relative w-24 h-24 md:w-32 md:h-32 rounded bg-zinc-100 overflow-hidden flex-shrink-0">
                        {category.image ? (
                          <img src={category.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-semibold">{category.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {category.items.length} item{category.items.length !== 1 ? "s" : ""}
                        </p>
                        {category.image && <p className="text-xs text-green-600">Image set</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveCategory(category.id, "up")}
                        disabled={categories.indexOf(category) === 0}
                      >
                        <ChevronUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveCategory(category.id, "down")}
                        disabled={categories.indexOf(category) === categories.length - 1}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => startEditCategory(category)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium">Items</h5>
                  {editingCategoryId === category.id && editingItemId === null && (
                    <Button
                      size="sm"
                      onClick={() => {
                        setEditingItemCategoryId(category.id);
                        setEditItemForm({ name: "", description: "", price: "", dietaryTags: [], image: "" });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Item
                    </Button>
                  )}
                </div>

                {editingItemCategoryId === category.id && editingItemId === null && (
                  <Card className="border-blue-200">
                    <CardContent className="space-y-4 p-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Item Name</label>
                        <Input
                          value={editItemForm.name || ""}
                          onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                          placeholder="e.g., Grilled Octopus"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea
                          value={editItemForm.description || ""}
                          onChange={(e) => setEditItemForm({ ...editItemForm, description: e.target.value })}
                          placeholder="Brief description of the dish"
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Price</label>
                        <Input
                          value={editItemForm.price || ""}
                          onChange={(e) => setEditItemForm({ ...editItemForm, price: e.target.value })}
                          placeholder="e.g., $24"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center">
                          <ImageIcon className="w-3 h-3 mr-1" /> Dish Image (Optional)
                        </label>
                        {editItemForm.image && (
                          <div className="mb-2 relative w-24 h-24 rounded bg-zinc-100 overflow-hidden">
                            <img src={editItemForm.image} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleItemImageUpload}
                          className="text-xs"
                          disabled={uploadingId === "new-item"}
                        />
                        {uploadingId === "new-item" && (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Dietary Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {DIETARY_TAGS.map(({ value, label }) => (
                            <Label key={value} className="cursor-pointer">
                              <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                checked={editItemForm.dietaryTags?.includes(value) || false}
                                onChange={() => toggleDietaryTag(value)}
                              />
                              <span className="ml-1 text-sm">{label}</span>
                            </Label>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => addItem(category.id)}>Add Item</Button>
                        <Button variant="outline" onClick={cancelEditItem}>
                          Cancel
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-2">
                  {category.items.map((item) => (
                    <Card
                      key={item.id}
                      className={
                        editingItemId === item.id && editingItemCategoryId === category.id ? "border-blue-200" : ""
                      }
                    >
                      <CardContent className="space-y-3 p-4">
                        {editingItemId === item.id && editingItemCategoryId === category.id ? (
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Item Name</label>
                              <Input
                                value={editItemForm.name || ""}
                                onChange={(e) => setEditItemForm({ ...editItemForm, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Description</label>
                              <Textarea
                                value={editItemForm.description || ""}
                                onChange={(e) => setEditItemForm({ ...editItemForm, description: e.target.value })}
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Price</label>
                              <Input
                                value={editItemForm.price || ""}
                                onChange={(e) => setEditItemForm({ ...editItemForm, price: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium flex items-center">
                                <ImageIcon className="w-3 h-3 mr-1" /> Dish Image (Optional)
                              </label>
                              {editItemForm.image && (
                                <div className="mb-2 relative w-24 h-24 rounded bg-zinc-100 overflow-hidden">
                                  <img src={editItemForm.image} className="w-full h-full object-cover" />
                                </div>
                              )}
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleItemImageUpload}
                                className="text-xs"
                                disabled={uploadingId === editingItemId}
                              />
                              {uploadingId === editingItemId && (
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Dietary Tags</label>
                              <div className="flex flex-wrap gap-2">
                                {DIETARY_TAGS.map(({ value, label }) => (
                                  <Label key={value} className="cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="w-4 h-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500"
                                      checked={editItemForm.dietaryTags?.includes(value) || false}
                                      onChange={() => toggleDietaryTag(value)}
                                    />
                                    <span className="ml-1 text-sm">{label}</span>
                                  </Label>
                                ))}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={saveEditItem}>Save</Button>
                              <Button variant="outline" onClick={cancelEditItem}>
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <h5 className="font-medium">{item.name}</h5>
                                {item.price && <span className="text-sm font-medium text-zinc-700">{item.price}</span>}
                              </div>
                              {item.description && <p className="text-sm text-muted-foreground">{item.description}</p>}
                              {item.dietaryTags && item.dietaryTags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {item.dietaryTags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-zinc-100 text-zinc-600 border border-zinc-200"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                              {item.image && (
                                <div className="mt-2 relative w-16 h-16 rounded bg-zinc-100 overflow-hidden">
                                  <img src={item.image} className="w-full h-full object-cover" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveItem(category.id, item.id, "up")}
                                disabled={category.items.indexOf(item) === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => moveItem(category.id, item.id, "down")}
                                disabled={category.items.indexOf(item) === category.items.length - 1}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => startEditItem(category.id, item)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteItem(category.id, item.id)}
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
                  {category.items.length === 0 && editingItemCategoryId !== category.id && (
                    <p className="text-sm text-muted-foreground text-center py-4">No items in this category yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {onTypographyChange && (
        <details className="group border-t pt-4 mt-4">
          <summary className="font-medium cursor-pointer flex items-center gap-2">
            <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" />
            Typography Overrides
          </summary>
          <div className="grid gap-4 mt-4 grid-cols-1 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category Title Size</label>
              <Input
                type="text"
                value={typography.categoryTitleSize || ""}
                onChange={(e) => handleTypographyChange("categoryTitleSize", e.target.value)}
                placeholder="e.g., text-xl, text-2xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Name Size</label>
              <Input
                type="text"
                value={typography.itemNameSize || ""}
                onChange={(e) => handleTypographyChange("itemNameSize", e.target.value)}
                placeholder="e.g., text-lg, text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Item Description Size</label>
              <Input
                type="text"
                value={typography.itemDescSize || ""}
                onChange={(e) => handleTypographyChange("itemDescSize", e.target.value)}
                placeholder="e.g., text-sm, text-base"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Price Size</label>
              <Input
                type="text"
                value={typography.priceSize || ""}
                onChange={(e) => handleTypographyChange("priceSize", e.target.value)}
                placeholder="e.g., text-lg, text-base"
              />
            </div>
          </div>
        </details>
      )}
    </div>
  );
}
