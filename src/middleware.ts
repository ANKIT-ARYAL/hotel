import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAuthenticated = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith('/admin/login');
  const isAdminRoute = nextUrl.pathname.startsWith('/admin');

  const requestHeaders = new Headers(req.headers);
  if (isAdminRoute) {
    requestHeaders.set('x-is-admin', 'true');
  }

  if (nextUrl.pathname === '/admin') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    return NextResponse.redirect(new URL('/admin/login', nextUrl));
  }

  if (isAuthRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/dashboard', nextUrl));
    }
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (isAdminRoute && !isAuthenticated) {
    return NextResponse.redirect(new URL('/admin/login', nextUrl));
  }

  return NextResponse.next({ request: { headers: requestHeaders } });
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
