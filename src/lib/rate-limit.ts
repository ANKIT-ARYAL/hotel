/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * @author FlyUp Technology Pvt. Ltd.
 *
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach per IP address.
 */

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up stale entries every 60 seconds
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of rateLimitMap) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }, 60_000);
}

interface RateLimitOptions {
  /** Max number of requests in the window */
  limit?: number;
  /** Window duration in seconds */
  windowSeconds?: number;
}

/**
 * Check if a request should be rate-limited.
 * Returns null if allowed, or a Response if rate-limited.
 */
export function rateLimit(
  request: Request,
  options: RateLimitOptions = {}
): Response | null {
  const { limit = 10, windowSeconds = 60 } = options;

  // Extract IP from headers (Vercel sets x-forwarded-for)
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const key = `${ip}:${new URL(request.url).pathname}`;

  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowSeconds * 1000 });
    return null;
  }

  entry.count++;

  if (entry.count > limit) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Please try again later." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": String(Math.ceil((entry.resetTime - now) / 1000)),
        },
      }
    );
  }

  return null;
}
