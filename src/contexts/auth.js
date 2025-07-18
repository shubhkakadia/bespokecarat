import { getCookie, setCookie, deleteCookie } from "cookies-next";

// Cookie configuration for 7-day expiry
const COOKIE_OPTIONS = {
  maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  path: "/",
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  httpOnly: false,
};

export const USER_TYPES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  MASTER_ADMIN: "master-admin",
};

// Simple token management
export const setAuthToken = (token) => {
  setCookie("auth_token", token, COOKIE_OPTIONS);
};

export const getAuthToken = () => {
  return getCookie("auth_token") || null;
};

export const clearAuthToken = () => {
  deleteCookie("auth_token");
};

// Check if user has a valid session (token exists)
export const hasValidSession = () => {
  return !!getAuthToken();
};

// Helper functions for user types
export const isAdminUserType = (userType) => {
  return userType === USER_TYPES.ADMIN || userType === USER_TYPES.MASTER_ADMIN;
};

export const isCustomerUserType = (userType) => {
  return userType === USER_TYPES.CUSTOMER;
};

export const isMasterAdminUserType = (userType) => {
  return userType === USER_TYPES.MASTER_ADMIN;
};
