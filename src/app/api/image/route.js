/**
 * Image proxy route — /api/image?url=<encoded-backend-url>
 *
 * Proxies backend upload images through the frontend domain so that
 * social media crawlers (WhatsApp, Telegram, Facebook) can fetch OG
 * images without being blocked by backend CORS restrictions.
 *
 * Usage in OG meta:  /api/image?url=https://backend.example.com/uploads/...
 */

import { NextResponse } from 'next/server';

const BACKEND_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Validate that the target URL belongs to our own backend to prevent open-redirect abuse
function isTrustedUrl(url) {
  try {
    const parsed = new URL(url);
    const backendHost = new URL(BACKEND_BASE).hostname;
    return parsed.hostname === backendHost || parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  } catch {
    return false;
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return new NextResponse('Missing url param', { status: 400 });
  }

  // Decode and validate
  let decodedUrl;
  try {
    decodedUrl = decodeURIComponent(targetUrl);
  } catch {
    return new NextResponse('Invalid url', { status: 400 });
  }

  if (!isTrustedUrl(decodedUrl)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const upstream = await fetch(decodedUrl, {
      headers: { 'User-Agent': 'NextJS-Image-Proxy/1.0' },
      cache: 'force-cache',
    });

    if (!upstream.ok) {
      return new NextResponse('Image not found', { status: 404 });
    }

    const contentType = upstream.headers.get('content-type') || 'image/jpeg';
    const imageBuffer = await upstream.arrayBuffer();

    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache for 24 hours on CDN/proxies, 1 hour browser
        'Cache-Control': 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
        // Allow any origin to fetch this image (needed for social bots)
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('[image-proxy] Error fetching image:', err);
    return new NextResponse('Proxy error', { status: 502 });
  }
}
