import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin and /admin/* routes
  if (pathname.startsWith('/admin')) {
    // Exempt /admin/login from authentication
    if (pathname === '/admin/login') {
      const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
      const verified = await verifyAdminSessionToken(sessionCookie);
      // If already logged in, redirect straight to dashboard
      if (verified) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // Check session cookie for protected admin routes
    const sessionCookie = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
    const verified = await verifyAdminSessionToken(sessionCookie);

    if (!verified) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
