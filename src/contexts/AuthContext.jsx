"use client";

import React, { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  logoutUser,
  restoreSession,
} from "../state/action/loggedInUser";
import { getAuthToken } from "./auth";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { userData, loading, error, isAuthenticated } = useSelector(
    (state) => state.loggedInUser
  );

  // Initialize authentication on app start
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  const login = async (formdata) => {
    return await dispatch(loginUser(formdata));
  };

  const logout = async () => {
    const authToken = getAuthToken();
    return await dispatch(logoutUser(authToken));
  };

  // Helper functions to check user types
  const isAdmin = () => {
    return (
      userData?.user_type === "admin" || userData?.user_type === "master-admin"
    );
  };

  const isCustomer = () => {
    return userData?.user_type === "customer";
  };

  const isMasterAdmin = () => {
    return userData?.user_type === "master-admin";
  };

  const getUserType = () => {
    return userData?.user_type || null;
  };

  const getUserData = () => {
    return userData;
  };

  // Get token from cookies
  const getToken = () => {
    return getAuthToken();
  };

  const value = {
    userData,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    isAdmin,
    isCustomer,
    isMasterAdmin,
    getUserType,
    getUserData,
    getToken,
    isLoggedIn: () => isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
