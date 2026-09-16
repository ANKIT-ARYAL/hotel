'use client'
import { toast } from 'sonner';

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Plus, Edit, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export function FinanceClientView({ initialTransactions }: { initialTransactions: any[] }) {
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTx, setEditingTx] = useState<any>(null)

  // Form state
  const [amount, setAmount] = useState('')
  const [type, setType] = useState('INCOME')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')

  const openDialog = (tx?: any) => {
    if (tx) {
      setEditingTx(tx)
      setAmount(String(tx.amount))
      setType(tx.type)
      setDescription(tx.description)
      setDate(new Date(tx.date).toISOString().split('T')[0])
    } else {
      setEditingTx(null)
      setAmount('')
      setType('INCOME')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
    }
    setIsDialogOpen(true)
  }

  const handleSave = async () => {
    const payload = {
      amount: parseFloat(amount) || 0,
      type,
      description,
      date: new Date(date).toISOString()
    }

    try {
      if (editingTx) {
        const res = await fetch(`/api/finance/${editingTx.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const updated = await res.json()
        setTransactions(transactions.map(t => t.id === updated.id ? updated : t))
      } else {
        const res = await fetch(`/api/finance`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
        const created = await res.json()
        setTransactions([created, ...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))
      }
      toast.success('Success!');
      setIsDialogOpen(false)
    } catch (e) {
      console.error('Failed to save transaction', e)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return
    try {
      await fetch(`/api/finance/${id}`, { method: 'DELETE' })
      setTransactions(transactions.filter(t => t.id !== id))
    } catch (e) {
      console.error('Failed to delete transaction', e)
    }
  }

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val)
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((sum, t) => sum + t.amount, 0)
  const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((sum, t) => sum + t.amount, 0)
  const netProfit = totalIncome - totalExpense

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Finance Ledger</h1>
          <p className="text-base text-gray-500 mt-1">Track all income, expenses, and overall profit.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Transaction
        </Button>
      </div>

      {/* Children: Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-green-600">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-red-600">{formatCurrency(totalExpense)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Net Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{formatCurrency(netProfit)}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium text-gray-500 font-normal">Transaction Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-gray-900">{transactions.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Sub-children: Data Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Ledger History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <span className={`flex items-center text-sm font-semibold ${
                        tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {tx.type === 'INCOME' ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                        {tx.type}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{tx.description}</TableCell>
                    <TableCell>{formatDate(tx.date)}</TableCell>
                    <TableCell className={tx.type === 'INCOME' ? 'text-green-600 font-semibold' : 'text-gray-900 font-medium'}>
                      {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openDialog(tx)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(tx.id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {transactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                      No transactions found.
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
            <DialogTitle>{editingTx ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Type</label>
              <select 
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm"
                value={type} 
                onChange={e => setType(e.target.value)}
              >
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Description</label>
              <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. Utility Bill" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-base font-medium">Amount</label>
                <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" />
              </div>
              <div className="grid gap-2">
                <label className="text-base font-medium">Date</label>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
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
