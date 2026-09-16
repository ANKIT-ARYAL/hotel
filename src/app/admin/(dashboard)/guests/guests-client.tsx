'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, User } from 'lucide-react'

export function GuestsClientView({ initialGuests }: { initialGuests: any[] }) {
  const [guests, setGuests] = useState(initialGuests)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<any>(null)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const openDialog = (guest?: any) => {
    if (guest) {
      setEditingGuest(guest)
      setName(guest.name)
      setEmail(guest.email)
      setPhone(guest.phone || '')
    } else {
      setEditingGuest(null)
      setName('')
      setEmail('')
      setPhone('')
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const payload = { name, email, phone }

    try {
      if (editingGuest) {
        const res = await fetch(`/api/guests/${editingGuest.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await res.json()
        updated.bookings = editingGuest.bookings // preserve relation for UI
        setGuests(guests.map(g => g.id === updated.id ? updated : g))
      } else {
        const res = await fetch(`/api/guests`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await res.json()
        created.bookings = []
        setGuests([created, ...guests])
      }
      toast.success('Success!');
      setIsDialogOpen(false)
    } catch (e) {
      console.error('Failed to save guest', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this guest? This may affect their bookings.')) return
    try {
      await fetch(`/api/guests/${id}`, { method: 'DELETE' })
      setGuests(guests.filter(g => g.id !== id))
    } catch (e) {
      console.error('Failed to delete guest', e)
    }
  }

  const thisMonthGuests = guests.filter(g => {
    const d = new Date(g.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Guest Directory (CRM)</h1>
          <p className="text-base text-gray-500 mt-1">Manage guest profiles, contact information, and history.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Guest
        </Button>
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
                  <TableRow key={guest.id}>
                    <TableCell className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                        <User className="h-4 w-4" />
                      </div>
                      {guest.name}
                    </TableCell>
                    <TableCell>{guest.email}</TableCell>
                    <TableCell>{guest.phone || 'N/A'}</TableCell>
                    <TableCell>{guest.bookings?.length || 0} stays</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(guest)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(guest.id)} className="text-red-600">
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingGuest ? 'Edit Guest' : 'Add New Guest'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Full Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Email Address</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Phone Number</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="(123) 456-7890" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { toast.success('Success!'); setIsDialogOpen(false); }}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
