/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

import NextAuth from "next-auth";

import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

const permissionMap: Record<string, string> = {
  "/admin/reception": "Reception",
  "/admin/dashboard": "Dashboard",
  "/admin/bookings": "Bookings",
  "/admin/reservations": "Reservations",
  "/admin/messages": "Messages",
  "/admin/rooms": "Rooms",
  "/admin/categories": "Categories",
  "/admin/amenities": "Amenities",
  "/admin/promotions": "Promotions",
  "/admin/reviews": "Reviews",
  "/admin/guests": "Guests",
  "/admin/pages/homepage": "Homepage",
  "/admin/pages/about": "About Us",
  "/admin/pages/rooms": "Rooms & Suites",
  "/admin/pages/dining": "Dining",
  "/admin/pages/spa": "Spa",
  "/admin/pages/experiences": "Experiences",
  "/admin/pages/gallery": "Gallery",
  "/admin/pages/faq": "FAQs",
  "/admin/pages/contact": "Contact",
  "/admin/pages/user-dashboard": "User Dashboard",
  "/admin/users": "Users",
  "/admin/roles": "Roles",
  "/admin/settings/navbar": "Navbar",
  "/admin/settings/footer": "Footer",
  "/admin/settings": "Settings",
};

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/admin/login");
  const isAdminRoute = nextUrl.pathname.startsWith("/admin") && !isAuthRoute;

  const requestHeaders = new Headers(req.headers);
  if (isAdminRoute) {
    requestHeaders.set("x-is-admin", "true");
  }

  if (nextUrl.pathname === "/admin") {
    if (isAuthenticated) {
      const roleName = (req.auth?.user?.role as any)?.name;
      return NextResponse.redirect(new URL(roleName === "USER" ? "/account" : "/admin/dashboard", nextUrl));
    }
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      const roleName = (req.auth?.user?.role as any)?.name;
      return NextResponse.redirect(new URL(roleName === "USER" ? "/account" : "/admin/dashboard", nextUrl));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL("/admin/login", nextUrl));
  }

  if (isAdminRoute && isAuthenticated) {
    const roleName = (req.auth?.user?.role as any)?.name;
    if (roleName === "USER") {
      return NextResponse.redirect(new URL("/account", nextUrl));
    }
  }

  // RBAC check
  if (isAdminRoute && isAuthenticated) {
    const userRole = req.auth?.user?.role as any;
    const permissions = userRole?.permissions || [];
    
    if (!permissions.includes("ALL")) {
      // Find the required permission for the current path
      // Sort keys by length descending to match the most specific path first
      const paths = Object.keys(permissionMap).sort((a, b) => b.length - a.length);
      const matchedPath = paths.find(p => nextUrl.pathname.startsWith(p));
      
      if (matchedPath) {
        const requiredPermission = permissionMap[matchedPath];
        if (!permissions.includes(requiredPermission)) {
          // If they don't have access, redirect them to dashboard (if they have dashboard access)
          // or just return a 403. Let's redirect to dashboard.
          if (nextUrl.pathname !== "/admin/dashboard") {
             return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
          }
        }
      }
    }
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
