import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback-secret-for-dev-only'
);

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;
  
  const isLoginPage = pathname.startsWith('/login');
  const isAdminPage = pathname.startsWith('/admin');

  // Verify token if it exists
  let isValidToken = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
    } catch (err) {
      // Token is invalid or expired
      isValidToken = false;
    }
  }

  // Case 1: Accessing admin page without valid token
  if (isAdminPage && !isValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    // Clear the invalid token cookie if it exists
    const response = NextResponse.redirect(url);
    if (token) response.cookies.delete('token');
    return response;
  }

  // Case 2: Accessing login page with valid token
  if (isLoginPage && isValidToken) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
