'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Trash2, CheckCircle, Star } from 'lucide-react'

export function ReviewsClientView({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews)

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: true })
      })
      const updated = await res.json()
      // Merge back relations so UI doesn't break
      const existing = reviews.find(r => r.id === id)
      setReviews(reviews.map(r => r.id === id ? { ...updated, guest: existing.guest, booking: existing.booking } : r))
    } catch (e) {
      console.error('Failed to approve review', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to reject and delete this review permanently?')) return
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' })
      setReviews(reviews.filter(r => r.id !== id))
    } catch (e) {
      console.error('Failed to delete review', e)
    }
  }

  const pendingReviews = reviews.filter(r => !r.isApproved).length
  const approvedReviews = reviews.filter(r => r.isApproved).length

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Guest Reviews</h1>
          <p className="text-base text-gray-500 mt-1">Moderate guest feedback before it appears publicly on the frontend.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm border-orange-100 bg-orange-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-orange-600 font-normal">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-600">{pendingReviews}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-green-100 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-green-600 font-normal">Approved & Public</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{approvedReviews}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Moderation Queue</CardTitle>
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
                {reviews.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-semibold text-gray-900">{r.guest?.name || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">Room {r.booking?.room?.number} ({r.booking?.room?.category?.name})</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700 max-w-md italic">
                      "{r.comment || 'No written feedback provided.'}"
                    </TableCell>
                    <TableCell>
                      {r.isApproved ? (
                        <span className="px-2 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-700">Public</span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-sm font-semibold bg-orange-100 text-orange-700">Pending</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
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
                ))}
                {reviews.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No guest reviews found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
