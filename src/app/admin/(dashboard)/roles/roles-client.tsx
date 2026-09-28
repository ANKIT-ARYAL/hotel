"use client";
import { useState } from "react";

import { Edit, MoreHorizontal, Plus, Shield, Trash2 } from "lucide-react";
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

export function RolesClientView({ initialRoles }: { initialRoles: any[] }) {
  const [roles, setRoles] = useState(initialRoles);
  const [roleTypeFilter, setRoleTypeFilter] = useState<"ALL" | "WITH_USERS" | "NO_USERS">("ALL");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<any>(null);
  const [name, setName] = useState("");

  const withUsersCount = roles.filter((r) => (r._count?.users || 0) > 0).length;
  const noUsersCount = roles.filter((r) => (r._count?.users || 0) === 0).length;

  const filteredRoles = roles.filter((r) => {
    if (roleTypeFilter === "WITH_USERS") return (r._count?.users || 0) > 0;
    if (roleTypeFilter === "NO_USERS") return (r._count?.users || 0) === 0;
    return true;
  });

  // Form state
  const [permissions, setPermissions] = useState<string[]>([]);

  const AVAILABLE_TABS = [
    "Reception",
    "Dashboard",
    "Bookings",
    "Reservations",
    "Rooms",
    "Guests",
    "Amenities",
    "Promotions",
    "Categories",
    "Reviews",
    "Users",
    "Roles",
    "Homepage",
    "Dining",
    "Spa",
    "Experiences",
    "Gallery",
    "Navbar",
    "Footer",
    "Settings",
  ];

  const togglePermission = (tab: string) => {
    setPermissions((prev) => (prev.includes(tab) ? prev.filter((t) => t !== tab) : [...prev, tab]));
  };

  const openDialog = (r?: any) => {
    if (r) {
      setEditingRole(r);
      setName(r.name);
      setPermissions(r.permissions || []);
    } else {
      setEditingRole(null);
      setName("");
      setPermissions([]);
    }
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      name,
      permissions,
    };

    try {
      if (editingRole) {
        const res = await fetch(`/api/roles/${editingRole.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        updated._count = editingRole._count;
        setRoles(roles.map((r) => (r.id === updated.id ? updated : r)));
      } else {
        const res = await fetch(`/api/roles`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        created._count = { users: 0 };
        setRoles([created, ...roles]);
      }
      toast.success("Success!");
      setIsDialogOpen(false);
    } catch (e) {
      console.error("Failed to save role", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await fetch(`/api/roles/${id}`, { method: "DELETE" });
      setRoles(roles.filter((r) => r.id !== id));
    } catch (e) {
      console.error("Failed to delete role", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-gray-200 pb-4">
        <div>
          <h1
            className="text-3xl font-bold tracking-tight text-gray-900"
            style={{ fontSize: "var(--admin-heading-size)" }}
          >
            Access Roles
          </h1>
          <p className="text-base text-gray-500 mt-1">Manage system roles and permission sets.</p>
        </div>
        <Button onClick={() => openDialog()} className="mt-4 sm:mt-0 bg-gray-900 text-white">
          <Plus className="w-4 h-4 mr-2" /> Create Role
        </Button>
      </div>

      {/* Top Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card
          onClick={() => setRoleTypeFilter("ALL")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            roleTypeFilter === "ALL"
              ? "border-primary ring-2 ring-primary/20 bg-primary/5"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">All Roles</CardTitle>
              {roleTypeFilter === "ALL" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-gray-900">{roles.length}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setRoleTypeFilter(roleTypeFilter === "WITH_USERS" ? "ALL" : "WITH_USERS")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            roleTypeFilter === "WITH_USERS"
              ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/40"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Assigned to Staff</CardTitle>
              {roleTypeFilter === "WITH_USERS" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-blue-600">{withUsersCount}</div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setRoleTypeFilter(roleTypeFilter === "NO_USERS" ? "ALL" : "NO_USERS")}
          className={`shadow-sm cursor-pointer select-none transition-all ${
            roleTypeFilter === "NO_USERS"
              ? "border-gray-500 ring-2 ring-gray-500/20 bg-gray-50"
              : "hover:border-gray-300 hover:shadow-md"
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-500 font-normal">Unassigned Roles</CardTitle>
              {roleTypeFilter === "NO_USERS" && (
                <span className="text-[10px] font-semibold uppercase tracking-wider bg-gray-200 text-gray-800 px-2 py-0.5 rounded-full">
                  Filtered
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-semibold text-gray-600">{noUsersCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold">Roles Configuration</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              Showing {filteredRoles.length} of {roles.length}
            </span>
            {roleTypeFilter !== "ALL" && (
              <button
                onClick={() => setRoleTypeFilter("ALL")}
                className="text-xs text-primary underline underline-offset-4 hover:opacity-80"
              >
                Clear filter
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Role Name</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Assigned Users</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRoles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-12 text-center text-gray-400">
                      No roles match this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRoles.map((r) => (
                  <TableRow
                    key={r.id}
                    data-hide-actions="true"
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => openDialog(r)}
                  >
                    <TableCell data-label="Role Name" className="font-medium flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-500">
                        <Shield className="h-4 w-4" />
                      </div>
                      {r.name}
                    </TableCell>
                    <TableCell data-label="Permissions" className="text-gray-500 max-w-xs truncate">
                      {r.permissions.length > 0 ? (
                        r.permissions.map((p: string, i: number) => (
                          <span
                            key={i}
                            className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-0.5 rounded mr-1 mb-1"
                          >
                            {p}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400">None</span>
                      )}
                    </TableCell>
                    <TableCell data-label="Assigned Users" className="text-base text-gray-700 font-medium">{r._count?.users || 0}</TableCell>
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
                              openDialog(r);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(r.id);
                            }}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Edit Role" : "Create New Role"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label className="text-base font-medium">Role Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. MANAGER" />
            </div>
            <div className="grid gap-2">
              <label className="text-base font-medium">Accessible Tabs</label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border rounded-md bg-gray-50">
                {AVAILABLE_TABS.map((tab) => (
                  <label
                    key={tab}
                    className="flex items-center space-x-2 cursor-pointer bg-white px-2 py-1 border rounded shadow-sm text-sm"
                  >
                    <input type="checkbox" checked={permissions.includes(tab)} onChange={() => togglePermission(tab)} />
                    <span>{tab}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-gray-900 text-white">
              Save Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
