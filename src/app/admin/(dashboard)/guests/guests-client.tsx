"use client";
import { useState } from "react";

import { Edit, MoreHorizontal, Plus, Trash2, User } from "lucide-react";
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

export function GuestsClientView({ initialGuests }: { initialGuests: any[] }) {
  const [guests, setGuests] = useState(initialGuests);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const openDialog = (guest: any) => {
    setSelectedGuest(guest);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this guest? This may affect their bookings.")) return;
    try {
      await fetch(`/api/guests/${id}`, { method: "DELETE" });
      setGuests(guests.filter((g) => g.id !== id));
    } catch (e) {
      console.error("Failed to delete guest", e);
    }
  };

  const thisMonthGuests = guests.filter((g) => {
    const d = new Date(g.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Guest Directory (CRM)
          </h1>
          <p className="text-base text-gray-500 mt-1">Manage guest profiles, contact information, and history.</p>
        </div>
      </div>

      {/* Children: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Guests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{guests.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">+{thisMonthGuests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-children: Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Registered Guests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Total Bookings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {guests.map((guest) => (
                  <TableRow
                    key={guest.id}
                    data-hide-actions="true"
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openDialog(guest)}
                  >
                    <TableCell data-label="Name" className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                        <User className="h-4 w-4" />
                      </div>
                      {guest.name}
                    </TableCell>
                    <TableCell data-label="Email">{guest.email}</TableCell>
                    <TableCell data-label="Phone">{guest.phone || "N/A"}</TableCell>
                    <TableCell data-label="Total Bookings">{guest.bookings?.length || 0} stays</TableCell>
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
                              openDialog(guest);
                            }}
                          >
                            <User className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(guest.id);
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
                {guests.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No guests found.
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
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Guest Profile</DialogTitle>
          </DialogHeader>

          {selectedGuest && (
            <div className="space-y-6 py-4">
              {(() => {
                const roomCount = selectedGuest.bookings?.length || 0;
                const spaCount = selectedGuest.spaReservations?.length || 0;
                const diningCount = selectedGuest.diningReservations?.length || 0;
                const types = [roomCount && "Room guest", spaCount && "Spa guest", diningCount && "Dining guest"].filter(Boolean);
                return <div className="rounded-md border border-gray-100 bg-gray-50 p-4"><h4 className="text-sm font-semibold text-gray-900">Guest activity</h4><div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"><div><p className="text-xs uppercase tracking-wide text-gray-500">Room bookings</p><p className="mt-1 text-2xl font-semibold">{roomCount}</p></div><div><p className="text-xs uppercase tracking-wide text-gray-500">Spa reservations</p><p className="mt-1 text-2xl font-semibold">{spaCount}</p></div><div><p className="text-xs uppercase tracking-wide text-gray-500">Dining reservations</p><p className="mt-1 text-2xl font-semibold">{diningCount}</p></div></div><p className="mt-4 text-sm text-gray-600"><span className="font-semibold text-gray-900">Guest type:</span> {types.length ? types.join(" · ") : "Registered guest — no activity yet"}</p></div>;
              })()}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Personal Information</h4>
                  <p className="text-sm text-gray-500 font-medium text-lg">{selectedGuest.name}</p>
                  <p className="text-sm text-gray-500">{selectedGuest.email}</p>
                  <p className="text-sm text-gray-500">{selectedGuest.phone || "No phone provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Account Info</h4>
                  <p className="text-sm text-gray-500">Total Stays: {selectedGuest.bookings?.length || 0}</p>
                  <p className="text-sm text-gray-500">
                    Registered: {new Date(selectedGuest.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-md border border-gray-100">
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Booking History</h4>
                {selectedGuest.bookings && selectedGuest.bookings.length > 0 ? (
                  <div className="space-y-3">
                    {selectedGuest.bookings.map((b: any) => (
                      <div key={b.id} className="text-sm border-b pb-2 last:border-0 last:pb-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">Room {b.room?.number || "N/A"}</span>
                          <span className="text-xs font-semibold px-2 py-1 bg-gray-200 rounded-full">{b.status}</span>
                        </div>
                        <p className="text-gray-500 text-xs">
                          {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}
                        </p>
                        <p className="text-gray-900 font-medium text-xs mt-1">${b.totalAmount}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No previous bookings found.</p>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-gray-100 bg-gray-50 p-4"><h4 className="mb-3 text-sm font-semibold text-gray-900">Spa reservations</h4>{selectedGuest.spaReservations?.length ? selectedGuest.spaReservations.map((item: any) => <div key={item.id} className="border-b py-2 text-sm last:border-0"><p className="font-medium">{item.service}</p><p className="text-xs text-gray-500">{new Date(item.scheduledAt).toLocaleString()} · {item.status}</p></div>) : <p className="text-sm italic text-gray-500">No spa reservations found.</p>}</div>
                <div className="rounded-md border border-gray-100 bg-gray-50 p-4"><h4 className="mb-3 text-sm font-semibold text-gray-900">Dining reservations</h4>{selectedGuest.diningReservations?.length ? selectedGuest.diningReservations.map((item: any) => <div key={item.id} className="border-b py-2 text-sm last:border-0"><p className="font-medium">{item.restaurant}</p><p className="text-xs text-gray-500">{new Date(item.scheduledAt).toLocaleString()} · {item.status}</p></div>) : <p className="text-sm italic text-gray-500">No dining reservations found.</p>}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
