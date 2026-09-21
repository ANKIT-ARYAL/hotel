/**
 * FlyUp eCommerce CMS
 * Developed & Maintained by FlyUp Technology Pvt. Ltd.
 * @author FlyUp Technology Pvt. Ltd.
 *
 * HTML sanitizer for user-provided rich text content.
 * Strips dangerous HTML elements and attributes while preserving
 * formatting tags produced by the TipTap editor.
 */

const DANGEROUS_TAGS = /<\s*\/?\s*(script|iframe|object|embed|form|input|textarea|button|select|meta|link|base|applet|style)\b[^>]*>/gi;
const EVENT_HANDLERS = /\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi;
const JAVASCRIPT_URLS = /\b(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi;
const DATA_URLS = /\b(href|src)\s*=\s*(?:"data:(?!image\/)[^"]*"|'data:(?!image\/)[^']*')/gi;

/**
 * Sanitizes HTML string by removing dangerous elements and attributes.
 * Preserves safe formatting tags (p, h1-h6, strong, em, ul, ol, li, a, img, br, span, div, blockquote, code, pre, table, tr, td, th, thead, tbody, sub, sup, hr).
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";

  let clean = html;

  // Remove dangerous tags and their content for script/style
  clean = clean.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  clean = clean.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");

  // Remove dangerous self-closing / void tags
  clean = clean.replace(DANGEROUS_TAGS, "");

  // Remove event handler attributes (onclick, onerror, onload, etc.)
  clean = clean.replace(EVENT_HANDLERS, "");

  // Remove javascript: URLs
  clean = clean.replace(JAVASCRIPT_URLS, "");

  // Remove data: URLs (except images)
  clean = clean.replace(DATA_URLS, "");

  return clean;
}
