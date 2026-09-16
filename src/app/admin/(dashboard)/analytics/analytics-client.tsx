'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, Activity } from 'lucide-react'

export function AnalyticsClientView({ initialEvents }: { initialEvents: any[] }) {
  const [events, setEvents] = useState(initialEvents)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)

  // Form state
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [value, setValue] = useState('')
  const [date, setDate] = useState('')

  const openDialog = (evt?: any) => {
    if (evt) {
      setEditingEvent(evt)
      setName(evt.name)
      setCategory(evt.category)
      setValue(String(evt.value))
      setDate(new Date(evt.date).toISOString().split('T')[0])
    } else {
      setEditingEvent(null)
      setName('')
      setCategory('PAGE_VIEW')
      setValue('1')
      setDate(new Date().toISOString().split('T')[0])
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      name,
      category,
      value: parseFloat(value) || 0,
      date: new Date(date).toISOString()
    }

    try {
      if (editingEvent) {
        const res = await fetch(`/api/analytics/${editingEvent.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await res.json()
        setEvents(events.map(e => e.id === updated.id ? updated : e))
      } else {
        const res = await fetch(`/api/analytics`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await res.json()
        setEvents([created, ...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }
      toast.success('Success!');
      setIsDialogOpen(false)
    } catch (e) {
      console.error('Failed to save analytics event', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event log?')) return
    try {
      await fetch(`/api/analytics/${id}`, { method: 'DELETE' })
      setEvents(events.filter(e => e.id !== id))
    } catch (e) {
      console.error('Failed to delete analytics event', e)
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // Metrics
  const uniqueCategories = new Set(events.map(e => e.category)).size
  const highestValueEvent = events.length > 0 ? Math.max(...events.map(e => e.value)) : 0
  const recentEvents = events.filter(e => {
    const d = new Date(e.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Analytics Data</h1>
          <p className="text-base text-gray-500 mt-1">Review raw event logs, categories, and system metrics.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Log Event
        </Button>
      </div>

      {/* Children: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Events Logged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{events.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Tracked Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">{uniqueCategories}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Highest Event Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{highestValueEvent}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Events This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-purple-600">{recentEvents}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-children: Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Raw Analytics Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Recorded Value</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((evt) => (
                  <TableRow key={evt.id}>
                    <TableCell className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-md bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                        <Activity className="h-4 w-4" />
                      </div>
                      {evt.name}
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        {evt.category}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-900">{evt.value}</TableCell>
                    <TableCell className="text-base text-gray-500">{formatDate(evt.date)}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(evt)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(evt.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {events.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No analytics events found.
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
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Log Custom Event'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Event Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Booking Completed" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Category</label>
              <Input value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. CONVERSION" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-base font-medium">Value</label>
                <Input type="number" value={value} onChange={e => setValue(e.target.value)} placeholder="0" />
              </div>
              <div className="grid gap-2">
                <label className="text-base font-medium">Date</label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { toast.success('Success!'); setIsDialogOpen(false); }}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
