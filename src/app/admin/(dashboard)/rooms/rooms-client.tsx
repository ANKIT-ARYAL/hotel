'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, Key } from 'lucide-react'

export function RoomsClientView({ initialRooms, categories }: { initialRooms: any[], categories: any[] }) {
  const [rooms, setRooms] = useState(initialRooms)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState<any>(null)

  // Form state
  const [number, setNumber] = useState('')
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '')
  const [status, setStatus] = useState('AVAILABLE')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')

  const openDialog = (room?: any) => {
    if (room) {
      setEditingRoom(room)
      setNumber(room.number)
      setCategoryId(room.categoryId)
      setStatus(room.status)
      setPrice(String(room.price))
      setDescription(room.description || '')
    } else {
      setEditingRoom(null)
      setNumber('')
      setCategoryId(categories[0]?.id || '')
      setStatus('AVAILABLE')
      setPrice('')
      setDescription('')
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      number,
      categoryId,
      status,
      price: parseFloat(price) || 0,
      description
    }

    try {
      if (editingRoom) {
        const res = await fetch(`/api/rooms/${editingRoom.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await res.json()
        const selectedCat = categories.find(c => c.id === updated.categoryId)
        setRooms(rooms.map(r => r.id === updated.id ? { ...updated, category: selectedCat } : r))
      } else {
        const res = await fetch(`/api/rooms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await res.json()
        const selectedCat = categories.find(c => c.id === created.categoryId)
        setRooms([...rooms, { ...created, category: selectedCat }].sort((a, b) => a.number.localeCompare(b.number)))
      }
      toast.success('Success!');
      setIsDialogOpen(false)
    } catch (e) {
      console.error('Failed to save room', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return
    try {
      await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      setRooms(rooms.filter(r => r.id !== id))
    } catch (e) {
      console.error('Failed to delete room', e)
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Rooms Management</h1>
          <p className="text-base text-gray-500 mt-1">Manage all property rooms, statuses, and details.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Room
        </Button>
      </div>

      {/* Children: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{rooms.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Available</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{rooms.filter(r => r.status === 'AVAILABLE').length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Occupied</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">{rooms.filter(r => r.status === 'OCCUPIED').length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Maintenance/Cleaning</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-orange-500">{rooms.filter(r => ['MAINTENANCE', 'CLEANING'].includes(r.status)).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-children: Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Rooms Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px]">Room</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price/Night</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium flex items-center">
                      <Key className="w-4 h-4 mr-2 text-gray-400" />
                      {room.number}
                    </TableCell>
                    <TableCell>{room.category?.name || 'Unknown'}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        room.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' :
                        room.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {room.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(room.price)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(room)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(room.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {rooms.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No rooms found.
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
            <DialogTitle>{editingRoom ? 'Edit Room' : 'Add New Room'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Room Number</label>
              <Input value={number} onChange={e => setNumber(e.target.value)} placeholder="e.g. 101" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Category</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={categoryId} 
                onChange={e => setCategoryId(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Status</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={status} 
                onChange={e => setStatus(e.target.value)}
              >
                <option value="AVAILABLE">Available</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
                <option value="CLEANING">Cleaning</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Price per Night</label>
              <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 150" />
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
