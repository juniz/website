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
