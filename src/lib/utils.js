import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path) {
  if (!path) return null;
  
  // Jika sudah absolute (http/https), data URL, atau blob URL, kembalikan apa adanya
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  
  // Pastikan tidak ada double slash
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  return `${cleanBackendUrl}${cleanPath}`;
}

/**
 * Returns a frontend-proxied OG image URL.
 * OG images MUST be served from the same domain as the page (or at minimum
 * a publicly accessible URL without CORS restrictions) so that social media
 * crawlers (WhatsApp, Telegram, Facebook) can fetch them.
 *
 * This routes backend image paths through /api/image?url=... on the frontend.
 */
export function getOgImageUrl(path, frontendBase) {
  if (!path) return null;

  // Get the full backend URL for the image
  const fullUrl = getImageUrl(path);
  if (!fullUrl) return null;

  // If already a frontend URL, return as-is
  const base = frontendBase || process.env.NEXT_PUBLIC_SITE_URL || 'https://rsbhayangkaranganjuk.com';
  if (fullUrl.startsWith(base)) return fullUrl;

  // Proxy through frontend domain
  return `${base}/api/image?url=${encodeURIComponent(fullUrl)}`;
}

