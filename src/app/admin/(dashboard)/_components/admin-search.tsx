'use client'

import * as React from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

export function AdminSearch() {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [])

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative w-full max-w-md inline-flex items-center rounded-md bg-gray-50 border-none px-3 py-2 text-sm text-gray-400 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        <Search className="mr-2 h-4 w-4 shrink-0" />
        <span>Search...</span>
        <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Quick Links">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/dashboard'))}>
              Dashboard
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/bookings'))}>
              Bookings
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/rooms'))}>
              Rooms
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/guests'))}>
              Guests
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/settings'))}>
              System Settings
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/admin/pages/homepage'))}>
              Homepage Editor
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
