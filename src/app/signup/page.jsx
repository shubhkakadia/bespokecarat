"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  ArrowRight,
} from "lucide-react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const axios = require("axios");

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeToNewsletter: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedFields, setFocusedFields] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Special handling for phone number - only allow integers
    if (name === "phone") {
      // Remove all non-digit characters
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

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

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone validation (optional but if provided, validate format)
    if (
      formData.phone &&
      (formData.phone.length < 10 || formData.phone.length > 15)
    ) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    // Confirm Password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await signupAPI(formData);

      if (response.status === "true" || response.status === true) {
        toast.success("Account created successfully! Redirecting to login...", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Navigate to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(response.message || "Signup failed. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Signup error:", error);

      let errorMessage = "Signup failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);

    try {
      // TODO: Implement Google OAuth signup
      console.log("Google signup initiated");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
    } catch (error) {
      console.error("Google signup error:", error);
      setErrors({ general: "Google signup failed. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!formData.password) return { score: 0, label: "", color: "" };

    let score = 0;
    if (formData.password.length >= 8) score++;
    if (/[a-z]/.test(formData.password)) score++;
    if (/[A-Z]/.test(formData.password)) score++;
    if (/\d/.test(formData.password)) score++;
    if (/[^A-Za-z0-9]/.test(formData.password)) score++;

    if (score <= 2)
      return { score, label: "Weak", color: "text-accent-warm-600" };
    if (score <= 3) return { score, label: "Fair", color: "text-accent-600" };
    if (score <= 4)
      return { score, label: "Good", color: "text-accent-cool-600" };
    return { score, label: "Strong", color: "text-green-600" };
  };

  const strength = passwordStrength();

  const signupAPI = async (formData) => {
    try {
      let data = JSON.stringify({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone_number: formData.phone,
        company_name: formData.company,
        accepted_terms: formData.agreeToTerms,
        newsletter: formData.subscribeToNewsletter,
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/signup`,
        headers: {
          "Content-Type": "application/json",
        },
        data: data,
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error("Signup API error:", error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex flex-col">
      <Navbar />

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-text-dark mb-2">
              Create Your Account
            </h2>
            <p className="text-secondary text-sm">
              Join our exclusive community of diamond enthusiasts and
              professionals
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-whitesmoke rounded-2xl shadow-soft border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General Error */}
              {errors.general && (
                <div className="bg-accent-warm-50 border border-accent-warm-200 text-accent-warm-800 px-4 py-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                      <User className="h-5 w-5 text-secondary" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("firstName")}
                      onBlur={() => handleBlur("firstName")}
                      className={`bg-white block w-full pl-12 pr-3 h-12 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                        errors.firstName
                          ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                          : "border-border focus:ring-primary-600 focus:border-primary-600"
                      }`}
                      placeholder=""
                    />
                    <label
                      htmlFor="firstName"
                      className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                        isFieldActive("firstName")
                          ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                          : "top-3 text-sm text-secondary"
                      }`}
                    >
                      First Name *
                    </label>
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-accent-warm-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                      <User className="h-5 w-5 text-secondary" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("lastName")}
                      onBlur={() => handleBlur("lastName")}
                      className={`bg-white block w-full pl-12 pr-3 h-12 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                        errors.lastName
                          ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                          : "border-border focus:ring-primary-600 focus:border-primary-600"
                      }`}
                      placeholder=""
                    />
                    <label
                      htmlFor="lastName"
                      className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                        isFieldActive("lastName")
                          ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                          : "top-3 text-sm text-secondary"
                      }`}
                    >
                      Last Name *
                    </label>
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-accent-warm-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    className={`bg-white block w-full pl-12 pr-3 h-12 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                      errors.email
                        ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                        : "border-border focus:ring-primary-600 focus:border-primary-600"
                    }`}
                    placeholder=""
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                      isFieldActive("email")
                        ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                        : "top-3 text-sm text-secondary"
                    }`}
                  >
                    Email Address *
                  </label>
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-accent-warm-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone and Company Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                      <Phone className="h-5 w-5 text-secondary" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      autoComplete="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("phone")}
                      onBlur={() => handleBlur("phone")}
                      onKeyPress={(e) => {
                        if (
                          !/[0-9]/.test(e.key) &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          e.key !== "Tab" &&
                          e.key !== "Enter"
                        ) {
                          e.preventDefault();
                        }
                      }}
                      className={`bg-white block w-full pl-12 pr-3 h-12 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                        errors.phone
                          ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                          : "border-border focus:ring-primary-600 focus:border-primary-600"
                      }`}
                      placeholder=""
                      maxLength="15"
                    />
                    <label
                      htmlFor="phone"
                      className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                        isFieldActive("phone")
                          ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                          : "top-3 text-sm text-secondary"
                      }`}
                    >
                      Phone Number
                    </label>
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-accent-warm-600">
                      {errors.phone}
                    </p>
                  )}
                  {formData.phone && (
                    <p className="mt-1 text-xs text-secondary">
                      Numbers only, 10-15 digits
                    </p>
                  )}
                </div>

                {/* Company */}
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                      <Building className="h-5 w-5 text-secondary" />
                    </div>
                    <input
                      id="company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={formData.company}
                      onChange={handleInputChange}
                      onFocus={() => handleFocus("company")}
                      onBlur={() => handleBlur("company")}
                      className="bg-white block w-full pl-12 pr-3 h-12 border border-border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200"
                      placeholder=""
                    />
                    <label
                      htmlFor="company"
                      className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                        isFieldActive("company")
                          ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                          : "top-3 text-sm text-secondary"
                      }`}
                    >
                      Company Name
                    </label>
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("password")}
                    onBlur={() => handleBlur("password")}
                    className={`bg-white block w-full pl-12 pr-12 h-12 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                      errors.password
                        ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                        : "border-border focus:ring-primary-600 focus:border-primary-600"
                    }`}
                    placeholder=""
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                      isFieldActive("password")
                        ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                        : "top-3 text-sm text-secondary"
                    }`}
                  >
                    Password *
                  </label>
                  <div className="absolute inset-y-0 right-3 w-8 flex items-center">
                    <button
                      type="button"
                      className="flex items-center justify-center w-8 h-8 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary hover:text-text-dark" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary hover:text-text-dark" />
                      )}
                    </button>
                  </div>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-medium ${strength.color}`}>
                        Password strength: {strength.label}
                      </span>
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 w-8 rounded-full ${
                              level <= strength.score
                                ? strength.score <= 2
                                  ? "bg-accent-warm-500"
                                  : strength.score <= 3
                                  ? "bg-accent-500"
                                  : strength.score <= 4
                                  ? "bg-accent-cool-500"
                                  : "bg-green-500"
                                : "bg-surface-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="mt-1 text-sm text-accent-warm-600">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 w-6 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-secondary" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus("confirmPassword")}
                    onBlur={() => handleBlur("confirmPassword")}
                    className={`bg-white block w-full pl-12 pr-12 h-12 border rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 ${
                      errors.confirmPassword
                        ? "border-accent-warm-300 focus:ring-accent-warm-500 focus:border-accent-warm-500"
                        : "border-border focus:ring-primary-600 focus:border-primary-600"
                    }`}
                    placeholder=""
                  />
                  <label
                    htmlFor="confirmPassword"
                    className={`absolute left-12 transition-all duration-200 pointer-events-none z-10 ${
                      isFieldActive("confirmPassword")
                        ? "top-0 text-xs text-primary-600 bg-background-secondary px-1 -mt-2"
                        : "top-3 text-sm text-secondary"
                    }`}
                  >
                    Confirm Password *
                  </label>
                  <div className="absolute inset-y-0 right-3 w-8 flex items-center">
                    <button
                      type="button"
                      className="flex items-center justify-center w-8 h-8 cursor-pointer"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-secondary hover:text-text-dark" />
                      ) : (
                        <Eye className="h-5 w-5 text-secondary hover:text-text-dark" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-accent-warm-600">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms and Newsletter */}
              <div className="space-y-4">
                {/* Terms Agreement */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border rounded cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="agreeToTerms"
                      className="text-text-dark cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer"
                      >
                        Privacy Policy
                      </Link>{" "}
                      *
                    </label>
                    {errors.agreeToTerms && (
                      <p className="mt-1 text-sm text-accent-warm-600">
                        {errors.agreeToTerms}
                      </p>
                    )}
                  </div>
                </div>

                {/* Newsletter Subscription */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="subscribeToNewsletter"
                      name="subscribeToNewsletter"
                      type="checkbox"
                      checked={formData.subscribeToNewsletter}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-border rounded cursor-pointer"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="subscribeToNewsletter"
                      className="text-secondary cursor-pointer"
                    >
                      Subscribe to our newsletter for exclusive diamond insights
                      and special offers
                    </label>
                  </div>
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
                    Creating account...
                  </div>
                ) : (
                  <div className="flex items-center">
                    Create Account
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

            {/* Google Signup Button */}
            <div className="mt-6">
              <button
                onClick={handleGoogleSignup}
                disabled={isLoading}
                className="bg-white group relative w-full flex justify-center py-3 px-4 border border-border text-sm font-medium rounded-lg text-text-dark hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600 mr-2"></div>
                    Creating account...
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
                    Sign up with Google
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-secondary text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary-600 hover:text-primary-500 font-medium cursor-pointer"
              >
                Sign in here
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
