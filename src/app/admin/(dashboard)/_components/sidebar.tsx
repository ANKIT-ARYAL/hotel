"use client";

import React from 'react';
import { handleSignOut } from "@/app/actions/auth";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Building2,
  Home,
  CalendarDays,
  BedDouble,
  Users,
  CreditCard,
  BarChart3,
  Settings,
  Shield,
  Layers,
  Sparkles,
  Tag,
  Star,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Amenities", href: "/admin/amenities", icon: Sparkles },
  { name: "Promotions", href: "/admin/promotions", icon: Tag },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Guests", href: "/admin/guests", icon: Users },
  { name: "Finance", href: "/admin/finance", icon: CreditCard },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

const pages = [
  { name: "Homepage", href: "/admin/pages/homepage", icon: Layers },
  { name: "Rooms & Suites", href: "/admin/pages/rooms", icon: BedDouble },
];

const settings = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Roles", href: "/admin/roles", icon: Shield },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function SidebarContent() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = React.useState(0);

  React.useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch('/api/bookings?status=PENDING');
        if (res.ok) {
          const data = await res.json();
          setPendingCount(data.length);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchPending();
    const interval = setInterval(fetchPending, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="h-16 flex flex-shrink-0 items-center px-6 border-b border-gray-100">
        <Building2 className="w-6 h-6 text-primary mr-3" />
        <span className="font-bold text-lg text-gray-900">Hotel Admin</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-1">
          <p className="px-3 text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Operations
          </p>
          {navigation.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2 text-lg font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <div className="flex items-center">
                  <item.icon
                    className={cn(
                      "mr-3 flex-shrink-0 h-5 w-5",
                      isActive ? "text-primary" : "text-gray-400",
                    )}
                  />
                  {item.name}
                </div>
                {item.name === "Bookings" && pendingCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-1">
          <p className="px-3 text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Pages
          </p>
          {pages.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-lg font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-primary" : "text-gray-400",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="mt-8 space-y-1">
          <p className="px-3 text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">
            System
          </p>
          {settings.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-lg font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <item.icon
                  className={cn(
                    "mr-3 flex-shrink-0 h-5 w-5",
                    isActive ? "text-primary" : "text-gray-400",
                  )}
                />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      <div className="p-4 border-t border-gray-100">
        <form action={handleSignOut}>
          <button
            type="submit"
            className="flex w-full items-center px-3 py-2 text-lg font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
          >
            <svg
              className="mr-3 flex-shrink-0 h-5 w-5 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Logout
          </button>
        </form>
      </div>
    </>
  );
}

export function Sidebar() {
  return (
    <div className="hidden md:flex fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 min-h-screen flex-col flex-shrink-0 z-40">
      <SidebarContent />
    </div>
  );
}
