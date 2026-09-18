import { Bell, Menu, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { auth } from "@/lib/auth";

import { AdminSearch } from "./admin-search";
import { SidebarContent } from "./sidebar";

export async function Topbar() {
  const session = await auth();

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6">
      <div className="flex items-center flex-1">
        <Sheet>
          <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden mr-2 text-gray-500" />}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64 flex flex-col">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <SidebarContent isCollapsed={false} setIsCollapsed={() => {}} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 flex items-center max-w-md">
          <AdminSearch />
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-500 hidden sm:flex">
          <Bell className="h-5 w-5" />
        </Button>
        <div className="flex items-center space-x-3 sm:border-l border-gray-200 sm:pl-4">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-lg font-medium text-gray-900">{session?.user?.name || "Admin"}</span>
            <span className="text-base text-gray-500 capitalize">
              {((session?.user?.role as any)?.name || session?.user?.role || "Admin").toString().toLowerCase()}
            </span>
          </div>
          <div className="h-8 w-8 flex-shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}
