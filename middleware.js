import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';

// Define protected routes and their required roles
const protectedRoutes = {
  '/admin': 'admin',
  '/admin/products': 'admin',
  '/admin/orders': 'admin',
  '/admin/users': 'admin',
  '/admin/enquiry': 'admin',
  '/admin/settings': 'admin',
  '/dashboard': 'customer',
  '/dashboard/orders': 'customer',
  '/dashboard/wishlist': 'customer',
  '/dashboard/profile': 'customer',
  '/dashboard/settings': 'customer',
};

// Token keys for different roles
const TOKEN_KEYS = {
  CUSTOMER: 'token',
  ADMIN: 'admin_token'
};

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is protected
  const requiredRole = protectedRoutes[pathname];
  
  if (requiredRole) {
    // Get the appropriate token based on the required role
    const tokenKey = requiredRole === 'admin' ? TOKEN_KEYS.ADMIN : TOKEN_KEYS.CUSTOMER;
    const token = request.cookies.get(tokenKey)?.value;
    
    // If no token is found, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Basic token validation (you can enhance this)
    if (!token.startsWith('mock_')) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 