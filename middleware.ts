// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  const protectedRoutes = ['/voting', '/admin'];
  
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  
  if (isProtectedRoute) {
    const session = request.cookies.get('wallet_session');
    
    if (!session?.value) {
      const homeUrl = new URL('/', request.url);
      return NextResponse.redirect(homeUrl);
    }
    
    const addressRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!addressRegex.test(session.value)) {
      const response = NextResponse.redirect(new URL('/', request.url));
      response.cookies.set({
        name: 'wallet_session',
        value: '',
        path: '/',
        maxAge: 0,
      });
      return response;
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/voting/:path*',
    '/admin/:path*',
  ],
};