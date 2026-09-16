'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, Sparkles } from 'lucide-react'

export function AmenitiesClientView({ initialAmenities }: { initialAmenities: any[] }) {
  const [amenities, setAmenities] = useState(initialAmenities)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingAmenity, setEditingAmenity] = useState<any>(null)

  const [name, setName] = useState('')
  const [icon, setIcon] = useState('')

  const openDialog = (a?: any) => {
    if (a) {
      setEditingAmenity(a)
      setName(a.name)
      setIcon(a.icon || '')
    } else {
      setEditingAmenity(null)
      setName('')
      setIcon('')
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const payload = { name, icon }
    try {
      if (editingAmenity) {
        const res = await fetch(`/api/amenities/${editingAmenity.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await res.json()
        setAmenities(amenities.map(a => a.id === updated.id ? updated : a))
      } else {
        const res = await fetch(`/api/amenities`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await res.json()
        setAmenities([created, ...amenities])
      }
      toast.success('Success!');
      setIsDialogOpen(false)
    } catch (e) {
      console.error('Failed to save amenity', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this amenity?')) return
    try {
      await fetch(`/api/amenities/${id}`, { method: 'DELETE' })
      setAmenities(amenities.filter(a => a.id !== id))
    } catch (e) {
      console.error('Failed to delete amenity', e)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Room Amenities</h1>
          <p className="text-base text-gray-500 mt-1">Manage standard features and amenities offered across room categories.</p>
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
                {amenities.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      {a.name}
                    </TableCell>
                    <TableCell className="text-gray-500">{a.icon || 'None'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(a)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(a.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingAmenity ? 'Edit Amenity' : 'Add New Amenity'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Amenity Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Free Wi-Fi" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Icon ID (Lucide)</label>
              <Input value={icon} onChange={e => setIcon(e.target.value)} placeholder="e.g. wifi" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { toast.success('Success!'); setIsDialogOpen(false); }}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">Save Amenity</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
