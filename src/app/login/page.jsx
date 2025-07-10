"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Phone } from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { setAuthTokenByUserType, ROLES } from "../../lib/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedFields, setFocusedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleFocus = (fieldName) => {
    setFocusedFields((prev) => ({
      ...prev,
      [fieldName]: true,
    }));
  };

  const handleBlur = (fieldName) => {
    setFocusedFields((prev) => ({
      ...prev,
      [fieldName]: false,
    }));
  };

  const isFieldActive = (fieldName) => {
    return focusedFields[fieldName] || formData[fieldName];
  };

  const isEmail = (value) => {
    return /\S+@\S+\.\S+/.test(value);
  };

  const isPhone = (value) => {
    return (
      /^[\d\s\-\+\(\)]+$/.test(value) && value.replace(/\D/g, "").length >= 10
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.emailOrPhone) {
      newErrors.emailOrPhone = "Email or phone number is required";
    } else if (
      !isEmail(formData.emailOrPhone) &&
      !isPhone(formData.emailOrPhone)
    ) {
      newErrors.emailOrPhone =
        "Please enter a valid email address or phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement actual login logic here
      console.log("Login attempt:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock API response - replace with actual API call
      // The backend should return user data including userType
      const mockResponse = {
        token: `mock_token_${Date.now()}`,
        userType: 'customer', // This will come from backend
        user: {
          id: 1,
          email: formData.emailOrPhone,
          userType: 'customer'
        }
      };
      
      // Set the appropriate token based on userType from backend
      setAuthTokenByUserType(mockResponse.token, mockResponse.userType);
      
      // Update auth context
      const userRole = mockResponse.userType === 'admin' ? ROLES.ADMIN : ROLES.CUSTOMER;
      login(userRole);

      // Redirect based on userType from backend
      if (mockResponse.userType === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrors({ general: "Login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // TODO: Implement Google OAuth login
      console.log("Google login initiated");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Google login error:", error);
      setErrors({ general: "Google login failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which icon to show based on input content
  const getInputIcon = () => {
    if (!formData.emailOrPhone)
      return <Mail className="h-5 w-5 text-secondary" />;
    if (isEmail(formData.emailOrPhone))
      return <Mail className="h-5 w-5 text-secondary" />;
    if (isPhone(formData.emailOrPhone))
      return <Phone className="h-5 w-5 text-secondary" />;
    return <Mail className="h-5 w-5 text-secondary" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-text-dark mb-2">
              Sign in to your account
            </h2>
            <p className="text-secondary text-sm">
              Welcome back! Please enter your details
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-whitesmoke rounded-xl border p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-accent-warm-50 border border-accent-warm-200 text-accent-warm-800 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* Email or Phone Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  {getInputIcon()}
                </div>
                <input
                  id="emailOrPhone"
                  name="emailOrPhone"
                  type="text"
                  autoComplete="username"
                  required
                  value={formData.emailOrPhone}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("emailOrPhone")}
                  onBlur={() => handleBlur("emailOrPhone")}
                  className={`bg-white block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                    errors.emailOrPhone
                      ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                      : "border-border focus:ring-primary-600 focus:border-primary-600"
                  }`}
                  placeholder=""
                />
                <label
                  htmlFor="emailOrPhone"
                  className={`absolute left-10 transition-all duration-200 pointer-events-none z-10 ${
                    isFieldActive("emailOrPhone")
                      ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                      : "top-3 text-sm text-secondary"
                  }`}
                >
                  Email or Phone Number
                </label>
                {errors.emailOrPhone && (
                  <p className="mt-1 text-sm text-accent-warm-600">
                    {errors.emailOrPhone}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Lock className="h-5 w-5 text-secondary" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("password")}
                  onBlur={() => handleBlur("password")}
                  className={`bg-white  block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                    errors.password
                      ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                      : "border-border focus:ring-primary-600 focus:border-primary-600"
                  }`}
                  placeholder=""
                />
                <label
                  htmlFor="password"
                  className={`absolute left-10 transition-all duration-200 pointer-events-none z-10 ${
                    isFieldActive("password")
                      ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                      : "top-3 text-sm text-secondary"
                  }`}
                >
                  Password
                </label>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="flex items-center justify-center w-5 h-5 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-secondary hover:text-text-dark" />
                    ) : (
                      <Eye className="h-5 w-5 text-secondary hover:text-text-dark" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-accent-warm-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border rounded cursor-pointer"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-secondary cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-accent cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Sign in
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-whitesmoke text-secondary">
                    Or continue with
                  </span>
                </div>
              </div>
            </div>

            {/* Google Login Button */}
            <div className="mt-6">
              <button
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-border text-sm font-medium rounded-lg text-text-dark bg-background-secondary hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="bg-white animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-secondary text-sm">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer"
              >
                Sign up here
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <div className="text-center">
            <Link
              href="/"
              className="text-secondary hover:text-primary-600 text-sm font-medium transition duration-200 cursor-pointer"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
