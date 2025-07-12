import { getCookie, setCookie, deleteCookie } from 'cookies-next';

// Cookie configuration
const COOKIE_OPTIONS = {
  maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  httpOnly: false // Set to true if you want httpOnly cookies (requires server-side handling)
};

// Token keys for different roles
export const TOKEN_KEYS = {
  CUSTOMER: 'token',
  ADMIN: 'admin_token'
};

// Role types
export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin'
};

/**
 * Set authentication token for a specific role
 * @param {string} token - The authentication token
 * @param {string} role - The role (customer or admin)
 */
export const setAuthToken = (token, role) => {
  const key = role === ROLES.ADMIN ? TOKEN_KEYS.ADMIN : TOKEN_KEYS.CUSTOMER;
  setCookie(key, token, COOKIE_OPTIONS);
};

/**
 * Set authentication token based on userType from backend
 * @param {string} token - The authentication token
 * @param {string} userType - The userType from backend ('customer' or 'admin')
 */
export const setAuthTokenByUserType = (token, userType) => {
  const role = userType === 'admin' ? ROLES.ADMIN : ROLES.CUSTOMER;
  setAuthToken(token, role);
};

/**
 * Get authentication token for a specific role
 * @param {string} role - The role (customer or admin)
 * @returns {string|null} - The token or null if not found
 */
export const getAuthToken = (role) => {
  const key = role === ROLES.ADMIN ? TOKEN_KEYS.ADMIN : TOKEN_KEYS.CUSTOMER;
  return getCookie(key) || null;
};

/**
 * Check if user is authenticated for a specific role
 * @param {string} role - The role (customer or admin)
 * @returns {boolean} - True if authenticated
 */
export const isAuthenticated = (role) => {
  const token = getAuthToken(role);
  return !!token;
};

/**
 * Check if user is authenticated as admin
 * @returns {boolean} - True if admin is authenticated
 */
export const isAdminAuthenticated = () => {
  return isAuthenticated(ROLES.ADMIN);
};

/**
 * Check if user is authenticated as customer
 * @returns {boolean} - True if customer is authenticated
 */
export const isCustomerAuthenticated = () => {
  return isAuthenticated(ROLES.CUSTOMER);
};

/**
 * Clear authentication token for a specific role
 * @param {string} role - The role (customer or admin)
 */
export const clearAuthToken = (role) => {
  const key = role === ROLES.ADMIN ? TOKEN_KEYS.ADMIN : TOKEN_KEYS.CUSTOMER;
  deleteCookie(key);
};

/**
 * Clear all authentication tokens
 */
export const clearAllAuthTokens = () => {
  deleteCookie(TOKEN_KEYS.CUSTOMER);
  deleteCookie(TOKEN_KEYS.ADMIN);
};

/**
 * Get user role based on available tokens
 * @returns {string|null} - The role or null if not authenticated
 */
export const getUserRole = () => {
  if (isAdminAuthenticated()) {
    return ROLES.ADMIN;
  }
  if (isCustomerAuthenticated()) {
    return ROLES.CUSTOMER;
  }
  return null;
};

/**
 * Get userType from backend format based on available tokens
 * @returns {string|null} - The userType ('customer' or 'admin') or null if not authenticated
 */
export const getUserType = () => {
  const role = getUserRole();
  if (role === ROLES.ADMIN) {
    return 'admin';
  }
  if (role === ROLES.CUSTOMER) {
    return 'customer';
  }
  return null;
};

/**
 * Validate token format (basic validation)
 * @param {string} token - The token to validate
 * @returns {boolean} - True if token format is valid
 */
export const validateTokenFormat = (token) => {
  // Basic validation - you can enhance this based on your token format
  return token && typeof token === 'string' && token.length > 10;
};

/**
 * Decode token payload (basic implementation)
 * @param {string} token - The token to decode
 * @returns {object|null} - The decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    // This is a basic implementation - replace with your actual token decoding logic
    // For JWT tokens, you might want to use a library like jwt-decode
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}; 