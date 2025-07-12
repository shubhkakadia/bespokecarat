"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  isAuthenticated, 
  getUserRole, 
  clearAllAuthTokens, 
  ROLES 
} from '../lib/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const role = getUserRole();
      setUserRole(role);
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = (role) => {
    setUserRole(role);
  };

  const logout = () => {
    clearAllAuthTokens();
    setUserRole(null);
  };

  const isAdmin = () => userRole === ROLES.ADMIN;
  const isCustomer = () => userRole === ROLES.CUSTOMER;
  const isLoggedIn = () => !!userRole;

  const value = {
    userRole,
    isLoading,
    login,
    logout,
    isAdmin,
    isCustomer,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 