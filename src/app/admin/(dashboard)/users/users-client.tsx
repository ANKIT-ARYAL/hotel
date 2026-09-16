'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, Users } from 'lucide-react'

export function UsersClientView({ initialUsers, roles }: { initialUsers: any[], roles: any[] }) {
  const [users, setUsers] = useState(initialUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [roleId, setRoleId] = useState(roles[0]?.id || '')

  const openDialog = (u?: any) => {
    if (u) {
      setEditingUser(u)
      setName(u.name || '')
      setEmail(u.email)
      setPassword('') // Don't show existing password
      setRoleId(u.roleId || '')
    } else {
      setEditingUser(null)
      setName('')
      setEmail('')
      setPassword('')
      setRoleId(roles[0]?.id || '')
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const payload: any = { name, email, roleId }
    if (password) payload.password = password

    try {
      if (editingUser) {
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await res.json()
        updated.role = roles.find((r: any) => r.id === updated.roleId)
        setUsers(users.map(u => u.id === updated.id ? updated : u))
      } else {
        const res = await fetch(`/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await res.json()
        created.role = roles.find((r: any) => r.id === created.roleId)
        setUsers([created, ...users])
      }
      toast.success('Success!');
      setIsDialogOpen(false)
    } catch (e) {
      console.error('Failed to save user', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return
    try {
      await fetch(`/api/users/${id}`, { method: 'DELETE' })
      setUsers(users.filter(u => u.id !== id))
    } catch (e) {
      console.error('Failed to delete user', e)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">System Users</h1>
          <p className="text-base text-gray-500 mt-1">Manage staff access, administrators, and credentials.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{users.length}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Active Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-blue-600">{roles.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">User Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                        <Users className="h-4 w-4" />
                      </div>
                      {u.name || 'No Name'}
                    </TableCell>
                    <TableCell className="text-gray-500">{u.email}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                        {u.role?.name || 'No Role'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(u)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(u.id)} className="text-red-600">
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
            <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">{editingUser ? 'New Password (leave blank to keep)' : 'Password'}</label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Role</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm"
                value={roleId} 
                onChange={e => setRoleId(e.target.value)}
              >
                {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { toast.success('Success!'); setIsDialogOpen(false); }}>Cancel</Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">Save User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
