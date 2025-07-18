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

// Single token key for all users
const TOKEN_KEY = 'token';

// Helper function to decode JWT token
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

// Helper function to get user role from token
function getUserRoleFromToken(token) {
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  const userType = decoded.user_type;
  if (userType === 'admin' || userType === 'master-admin') {
    return 'admin';
  }
  if (userType === 'customer') {
    return 'customer';
  }
  
  return null;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if the current path is protected
  const requiredRole = protectedRoutes[pathname];
  
  if (requiredRole) {
    // Get the single token
    const token = request.cookies.get(TOKEN_KEY)?.value;
    
    // If no token is found, redirect to login
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
    
    // Get user role from token
    const userRole = getUserRoleFromToken(token);
    
    // If cannot determine role or role doesn't match, redirect to login
    if (!userRole || userRole !== requiredRole) {
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