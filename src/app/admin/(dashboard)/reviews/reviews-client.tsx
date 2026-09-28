"use client";
import { useState } from "react";

import { CheckCircle, MoreHorizontal, Star, Trash2 } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ReviewsClientView({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);
  const [reviewFilter, setReviewFilter] = useState<"ALL" | "PENDING" | "APPROVED">("ALL");

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      const updated = await res.json();
      // Merge back relations so UI doesn't break
      const existing = reviews.find((r) => r.id === id);
      setReviews(
        reviews.map((r) => (r.id === id ? { ...updated, guest: existing.guest, booking: existing.booking } : r)),
      );
    } catch (e) {
      console.error("Failed to approve review", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to reject and delete this review permanently?")) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      setReviews(reviews.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete review", e);
    }
  };

  const pendingReviews = reviews.filter((r) => !r.isApproved).length;
  const approvedReviews = reviews.filter((r) => r.isApproved).length;

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === "PENDING") return !r.isApproved;
    if (reviewFilter === "APPROVED") return r.isApproved;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Guest Reviews
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Moderate guest feedback before it appears publicly on the frontend.
          </p>
        </div>
      </div>

      {/* Top Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          onClick={() => setReviewFilter("ALL")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            reviewFilter === "ALL"
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">All Reviews</CardTitle>
              {reviewFilter === "ALL" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-gray-900">{reviews.length}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setReviewFilter(reviewFilter === "PENDING" ? "ALL" : "PENDING")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            reviewFilter === "PENDING"
              ? "border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/50"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-orange-600 font-normal">Pending Approval</CardTitle>
              {reviewFilter === "PENDING" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-orange-600">{pendingReviews}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setReviewFilter(reviewFilter === "APPROVED" ? "ALL" : "APPROVED")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            reviewFilter === "APPROVED"
              ? "border-green-500 ring-2 ring-green-500/20 bg-green-50/50"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-600 font-normal">Approved & Public</CardTitle>
              {reviewFilter === "APPROVED" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-green-600">{approvedReviews}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Moderation Queue</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Showing {filteredReviews.length} of {reviews.length}
            </span>
            {reviewFilter !== "ALL" && (
              <button
                onClick={() => setReviewFilter("ALL")}
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
                  <TableHead>Guest & Room</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-gray-400">
                      No reviews match this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReviews.map((r) => (
                  <TableRow
                    key={r.id}
                    data-hide-actions="true"
                    onClick={() => {
                      if (window.matchMedia("(max-width: 1023px)").matches) setSelectedReview(r);
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell data-label="Guest & Room">
                      <div className="font-semibold text-gray-900">{r.guest?.name || "Unknown"}</div>
                      <div className="text-sm text-gray-500">
                        Room {r.booking?.room?.number} ({r.booking?.room?.category?.name})
                      </div>
                    </TableCell>
                    <TableCell data-label="Rating">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < r.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell data-label="Comment" className="text-gray-700 max-w-md italic">
                      "{r.comment || "No written feedback provided."}"
                    </TableCell>
                    <TableCell data-label="Status">
                      {r.isApproved ? (
                        <span className="px-2 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell data-label="Actions" className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!r.isApproved && (
                            <DropdownMenuItem onClick={() => handleApprove(r.id)} className="text-green-600">
                              <CheckCircle className="mr-2 h-4 w-4" /> Approve
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => handleDelete(r.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Reject & Delete
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

      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Review Actions</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Choose an action for this guest review.
          </p>
          <DialogFooter className="flex-col gap-2 sm:flex-row">
            {selectedReview && !selectedReview.isApproved && (
              <Button
                type="button"
                variant="outline"
                className="w-full text-green-600 sm:w-auto"
                onClick={() => {
                  void handleApprove(selectedReview.id);
                  setSelectedReview(null);
                }}
              >
                Approve
              </Button>
            )}
            {selectedReview && (
              <Button
                type="button"
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => {
                  void handleDelete(selectedReview.id);
                  setSelectedReview(null);
                }}
              >
                Reject & Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
