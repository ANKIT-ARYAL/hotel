/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * @author FlyUp Technology Pvt. Ltd.
 *
 * API route authentication helper.
 * Validates the session from NextAuth for API route handlers.
 */

import { auth } from "@/lib/auth";

/**
 * Checks if the current request has a valid admin session.
 * Returns the session if authenticated, or a 401 Response if not.
 *
 * Usage:
 *   const authResult = await requireApiAuth();
 *   if (authResult instanceof Response) return authResult;
 *   // authResult is the session
 */
export async function requireApiAuth() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    return session;
  } catch {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function requireAdminApiAuth() {
  const session = await requireApiAuth();
  if (session instanceof Response) return session;
  const roleName = (session.user?.role as { name?: string } | undefined)?.name;
  if (roleName !== "ADMIN") return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { "Content-Type": "application/json" } });
  return session;
}
