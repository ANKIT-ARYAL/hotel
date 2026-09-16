'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { CalendarDays, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

type Booking = any; // We can type this properly later

export function BookingsClient({ initialBookings }: { initialBookings: Booking[] }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update');
      const updated = await res.json();
      setBookings(bookings.map(b => b.id === id ? { ...b, status: updated.status } : b));
      setSelectedBooking((prev: Booking | null) => prev ? { ...prev, status: updated.status } : null);
      setIsDialogOpen(false);
      toast.success(`Booking ${newStatus.toLowerCase()} successfully!`);
      router.refresh();
    } catch (e: any) {
      toast.error(e.message || 'Failed to update booking status');
    } finally {
      setIsUpdating(false);
    }
  };

  const openDialog = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'PENDING': return <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-semibold flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'CONFIRMED': return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Confirmed</span>;
      case 'CANCELLED': return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelled</span>;
      default: return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Bookings</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <CalendarDays className="w-4 h-4" />
          Export Schedule
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs text-gray-700 uppercase border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-semibold">Guest</th>
                <th className="px-6 py-4 font-semibold">Room</th>
                <th className="px-6 py-4 font-semibold">Check In/Out</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Payment</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? bookings.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{booking.guest.name}</div>
                    <div className="text-gray-400">{booking.guest.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">Room {booking.room.number}</div>
                    <div className="text-gray-400">{booking.room.category.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{format(new Date(booking.checkIn), 'MMM dd, yyyy')}</div>
                    <div className="text-gray-400">to {format(new Date(booking.checkOut), 'MMM dd, yyyy')}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ${booking.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {booking.paymentMethod ? (
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-gray-900">{booking.paymentMethod === 'CREDIT_CARD' ? 'Card' : booking.paymentMethod}</span>
                        {booking.paymentAmount && <span>${booking.paymentAmount.toFixed(2)} Fee</span>}
                        {booking.paymentRefId && <span className="text-xs text-gray-400 break-all">{booking.paymentRefId}</span>}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(booking.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => openDialog(booking)}
                      className="text-primary hover:text-primary/80 font-medium text-xs transition-colors"
                    >
                      Manage
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          
          {selectedBooking && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Guest Information</h4>
                  <p className="text-sm text-gray-500">{selectedBooking.guest.name}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.guest.email}</p>
                  <p className="text-sm text-gray-500">{selectedBooking.guest.phone || 'No phone provided'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Stay Details</h4>
                  <p className="text-sm text-gray-500">Room {selectedBooking.room.number} ({selectedBooking.room.category.name})</p>
                  <p className="text-sm text-gray-500">In: {format(new Date(selectedBooking.checkIn), 'MMM dd, yyyy')}</p>
                  <p className="text-sm text-gray-500">Out: {format(new Date(selectedBooking.checkOut), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md border border-gray-100">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Payment Status</h4>
                  {selectedBooking.paymentMethod ? (
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">Method: <span className="font-medium text-gray-900">{selectedBooking.paymentMethod}</span></p>
                      {selectedBooking.paymentAmount && <p className="text-sm text-gray-600">Fee Paid: <span className="font-medium text-green-600">${selectedBooking.paymentAmount.toFixed(2)}</span></p>}
                      {selectedBooking.paymentRefId && <p className="text-sm text-gray-600 break-all">Ref: <span className="font-mono text-xs">{selectedBooking.paymentRefId}</span></p>}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No payment details provided.</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Total Amount</h4>
                  <p className="text-2xl font-bold text-gray-900">${selectedBooking.totalAmount.toFixed(2)}</p>
                  <div className="mt-2">{getStatusBadge(selectedBooking.status)}</div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Close</Button>
            <div className="flex-1"></div>
            {selectedBooking?.status !== 'CANCELLED' && (
              <Button 
                variant="destructive" 
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(selectedBooking!.id, 'CANCELLED')}
              >
                Cancel Booking
              </Button>
            )}
            {selectedBooking?.status !== 'CONFIRMED' && (
              <Button 
                className="bg-gray-900 text-white" 
                disabled={isUpdating}
                onClick={() => handleUpdateStatus(selectedBooking!.id, 'CONFIRMED')}
              >
                Confirm Booking
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
