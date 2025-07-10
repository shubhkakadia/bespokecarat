"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, ROLES } from '../lib/auth';

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = null,
  redirectTo = '/login'
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const hasAccess = isAuthenticated(requiredRole);
      
      if (!hasAccess) {
        // Redirect to login if not authenticated
        router.push(redirectTo);
        return;
      }
      
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [requiredRole, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Show children if authorized
  return isAuthorized ? children : null;
}

// Convenience components for specific roles
export function AdminRoute({ children, fallback, redirectTo = '/login' }) {
  return (
    <ProtectedRoute 
      requiredRole={ROLES.ADMIN} 
      fallback={fallback}
      redirectTo={redirectTo}
    >
      {children}
    </ProtectedRoute>
  );
}

export function CustomerRoute({ children, fallback, redirectTo = '/login' }) {
  return (
    <ProtectedRoute 
      requiredRole={ROLES.CUSTOMER} 
      fallback={fallback}
      redirectTo={redirectTo}
    >
      {children}
    </ProtectedRoute>
  );
} 