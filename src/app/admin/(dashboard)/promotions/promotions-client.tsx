"use client";
import { useState } from "react";

import { DollarSign, Edit, MoreHorizontal, Percent, Plus, Tag, Trash2 } from "lucide-react";
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

export function PromotionsClientView({ initialPromotions }: { initialPromotions: any[] }) {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [promoFilter, setPromoFilter] = useState<"ALL" | "ACTIVE" | "EXPIRED">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  const isCodeActive = (p: any) => {
    const isExpired = p.validUntil && new Date(p.validUntil) < new Date();
    const isMaxedOut = p.usageLimit && p.usageCount >= p.usageLimit;
    return !isExpired && !isMaxedOut;
  };

  const activeCount = promotions.filter(isCodeActive).length;
  const expiredCount = promotions.filter((p) => !isCodeActive(p)).length;

  const filteredPromotions = promotions.filter((p) => {
    if (promoFilter === "ACTIVE") return isCodeActive(p);
    if (promoFilter === "EXPIRED") return !isCodeActive(p);
    return true;
  });

  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [isPercentage, setIsPercentage] = useState(true);
  const [usageLimit, setUsageLimit] = useState("");
  const [validUntil, setValidUntil] = useState("");

  const openDialog = (p?: any) => {
    if (p) {
      setEditingPromo(p);
      setCode(p.code);
      setDiscountValue(String(p.discountValue));
      setIsPercentage(p.isPercentage);
      setUsageLimit(p.usageLimit ? String(p.usageLimit) : "");
      setValidUntil(p.validUntil ? new Date(p.validUntil).toISOString().split("T")[0] : "");
    } else {
      setEditingPromo(null);
      setCode("");
      setDiscountValue("");
      setIsPercentage(true);
      setUsageLimit("");
      setValidUntil("");
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      code: code.toUpperCase(),
      discountValue: parseFloat(discountValue) || 0,
      isPercentage,
    };
    if (usageLimit) payload.usageLimit = parseInt(usageLimit);
    if (validUntil) payload.validUntil = new Date(validUntil).toISOString();

    try {
      if (editingPromo) {
        const res = await fetch(`/api/promotions/${editingPromo.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setPromotions(promotions.map((p) => (p.id === updated.id ? updated : p)));
      } else {
        const res = await fetch(`/api/promotions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        setPromotions([created, ...promotions]);
      }
      toast.success("Success!");
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to save promotion", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion code?")) return;
    try {
      await fetch(`/api/promotions/${id}`, { method: "DELETE" });
      setPromotions(promotions.filter((p) => p.id !== id));
    } catch (e) {
      console.error("Failed to delete promotion", e);
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
            Promotions & Coupons
          </h1>
          <p className="text-base text-gray-500 mt-1">Manage active discount codes and promotional campaigns.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Code
        </Button>
      </div>

      {/* Top Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          onClick={() => setPromoFilter("ALL")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            promoFilter === "ALL"
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">All Codes</CardTitle>
              {promoFilter === "ALL" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-gray-900">{promotions.length}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setPromoFilter(promoFilter === "ACTIVE" ? "ALL" : "ACTIVE")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            promoFilter === "ACTIVE"
              ? "border-green-500 ring-2 ring-green-500/20 bg-green-50/40"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Active Now</CardTitle>
              {promoFilter === "ACTIVE" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-green-600">{activeCount}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setPromoFilter(promoFilter === "EXPIRED" ? "ALL" : "EXPIRED")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            promoFilter === "EXPIRED"
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Expired / Maxed</CardTitle>
              {promoFilter === "EXPIRED" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-amber-600">{expiredCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Discount Codes List</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Showing {filteredPromotions.length} of {promotions.length}
            </span>
            {promoFilter !== "ALL" && (
              <button
                onClick={() => setPromoFilter("ALL")}
                className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
              >
                Clear filter
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Promo Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage Limits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromotions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-gray-400">
                      No promo codes match this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPromotions.map((p) => {
                  const isExpired = p.validUntil && new Date(p.validUntil) < new Date();
                  const isMaxedOut = p.usageLimit && p.usageCount >= p.usageLimit;
                  return (
                    <TableRow
                      key={p.id}
                      data-hide-actions="true"
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => openDialog(p)}
                    >
                      <TableCell data-label="Promo Code" className="font-medium flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                          <Tag className="h-4 w-4" />
                        </div>
                        {p.code}
                      </TableCell>
                      <TableCell data-label="Discount" className="font-semibold text-gray-900">
                        {p.isPercentage ? `${p.discountValue}% OFF` : `$${p.discountValue} OFF`}
                      </TableCell>
                      <TableCell data-label="Usage Limits" className="text-gray-500">
                        {p.usageCount} / {p.usageLimit || "∞"} used
                      </TableCell>
                      <TableCell data-label="Status">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            isExpired || isMaxedOut ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}
                        >
                          {isExpired ? "Expired" : isMaxedOut ? "Limit Reached" : "Active"}
                        </span>
                      </TableCell>
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
                                openDialog(p);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(p.id);
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
                }))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPromo ? "Edit Promotion" : "Add New Promotion"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Coupon Code</label>
              <Input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="e.g. SUMMER50" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-base font-medium">Discount Value</label>
                <div className="relative">
                  <Input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className={isPercentage ? "pr-8" : "pl-8"}
                  />
                  {isPercentage ? (
                    <Percent className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                  ) : (
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-base font-medium">Type</label>
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm"
                  value={isPercentage ? "true" : "false"}
                  onChange={(e) => setIsPercentage(e.target.value === "true")}
                >
                  <option value="true">Percentage (%)</option>
                  <option value="false">Flat Amount ($)</option>
                </select>
              </div>
            </div>

            <div className="grid gap-2">
              <label className="text-base font-medium">Max Usages (Optional)</label>
              <Input
                type="number"
                value={usageLimit}
                onChange={(e) => setUsageLimit(e.target.value)}
                placeholder="Leave blank for unlimited"
              />
            </div>

            <div className="grid gap-2">
              <label className="text-base font-medium">Valid Until (Optional)</label>
              <Input type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">
              Save Promotion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
