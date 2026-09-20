/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChart3,
  BedDouble,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Compass,
  CreditCard,
  HelpCircle,
  Home,
  Image,
  Layers,
  Menu,
  MessageSquare,
  Phone,
  Settings,
  Shield,
  Sparkles,
  Star,
  Tag,
  Users,
  Utensils,
} from "lucide-react";

import { handleSignOut } from "@/app/actions/auth";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: Home },
  { name: "Bookings", href: "/admin/bookings", icon: CalendarDays },
  { name: "Messages", href: "/admin/messages", icon: MessageSquare },
  { name: "Rooms", href: "/admin/rooms", icon: BedDouble },
  { name: "Categories", href: "/admin/categories", icon: CalendarDays },
  { name: "Amenities", href: "/admin/amenities", icon: Sparkles },
  { name: "Promotions", href: "/admin/promotions", icon: Tag },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Guests", href: "/admin/guests", icon: Users },
];

const pages = [
  { name: "Homepage", href: "/admin/pages/homepage", icon: Layers },
  { name: "About Us", href: "/admin/pages/about", icon: Compass },
  { name: "Rooms & Suites", href: "/admin/pages/rooms", icon: BedDouble },
  { name: "Dining", href: "/admin/pages/dining", icon: Utensils },
  { name: "Spa", href: "/admin/pages/spa", icon: Sparkles },
  { name: "Experiences", href: "/admin/pages/experiences", icon: Compass },
  { name: "Gallery", href: "/admin/pages/gallery", icon: Image },
  { name: "FAQs", href: "/admin/pages/faq", icon: HelpCircle },
  { name: "Contact", href: "/admin/pages/contact", icon: Phone },
];

const settings = [
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Roles", href: "/admin/roles", icon: Shield },
  { name: "Navbar", href: "/admin/settings/navbar", icon: Menu },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function SidebarContent({
  isCollapsed,
  setIsCollapsed,
  session,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  session?: any;
}) {
  const pathname = usePathname();
  const [unreadBookings, setUnreadBookings] = React.useState(0);
  const [unreadMessages, setUnreadMessages] = React.useState(0);

  React.useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch("/api/notifications/unread");
        if (res.ok) {
          const data = await res.json();
          setUnreadBookings(data.bookings);
          setUnreadMessages(data.messages);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const userPermissions = session?.user?.role?.permissions || [];
  
  const hasPermission = (itemName: string) => {
    if (userPermissions.includes("ALL")) return true;
    return userPermissions.includes(itemName);
  };

  const filteredNavigation = navigation.filter(item => hasPermission(item.name));
  const filteredPages = pages.filter(item => hasPermission(item.name));
  const filteredSettings = settings.filter(item => hasPermission(item.name));

  return (
    <>
      <div
        className={`h-16 flex flex-shrink-0 items-center border-b border-gray-100 ${isCollapsed ? "justify-center" : "px-6 justify-between"}`}
      >
        {!isCollapsed && (
          <span
            className="font-bold text-lg uppercase text-primary"
            style={{ fontFamily: "var(--theme-heading-font)" }}
          >
            HOTEL LUXURY
          </span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-500"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3">
        {filteredNavigation.length > 0 && (
          <div className="space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">Operations</p>
            )}
            {filteredNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 text-lg font-medium rounded-md transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <div className="flex items-center">
                    <item.icon
                      className={cn(
                        "flex-shrink-0 h-5 w-5",
                        !isCollapsed && "mr-3",
                        isActive ? "text-primary" : "text-gray-400",
                      )}
                    />
                    {!isCollapsed && item.name}
                  </div>
                  {!isCollapsed && item.name === "Bookings" && unreadBookings > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadBookings}
                    </span>
                  )}
                  {!isCollapsed && item.name === "Messages" && unreadMessages > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {filteredPages.length > 0 && (
          <div className="mt-8 space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">Pages</p>
            )}
            {filteredPages.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-lg font-medium rounded-md transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      !isCollapsed && "mr-3",
                      isActive ? "text-primary" : "text-gray-400",
                    )}
                  />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </div>
        )}

        {filteredSettings.length > 0 && (
          <div className="mt-8 space-y-1">
            {!isCollapsed && (
              <p className="px-3 text-base font-semibold text-gray-400 uppercase tracking-wider mb-2">System</p>
            )}
            {filteredSettings.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-2 text-lg font-medium rounded-md transition-colors",
                    isActive ? "bg-primary/10 text-primary" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon
                    className={cn(
                      "flex-shrink-0 h-5 w-5",
                      !isCollapsed && "mr-3",
                      isActive ? "text-primary" : "text-gray-400",
                    )}
                  />
                  {!isCollapsed && item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        <form action={handleSignOut}>
          <button
            type="submit"
            className="flex w-full items-center px-3 py-2 text-lg font-medium rounded-md transition-colors text-red-600 hover:bg-red-50"
          >
            <svg
              className={cn("flex-shrink-0 h-5 w-5 text-red-500", !isCollapsed && "mr-3")}
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {!isCollapsed && "Logout"}
          </button>
        </form>
      </div>
    </>
  );
}

export function Sidebar({
  isCollapsed,
  setIsCollapsed,
  session,
}: {
  isCollapsed?: boolean;
  setIsCollapsed?: (val: boolean) => void;
  session?: any;
}) {
  return (
    <div
      className={cn(
        "hidden md:flex fixed left-0 top-0 bottom-0 bg-white border-r border-gray-200 min-h-screen flex-col flex-shrink-0 z-40 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
      )}
    >
      <SidebarContent isCollapsed={!!isCollapsed} setIsCollapsed={setIsCollapsed || (() => {})} session={session} />
    </div>
  );
}
