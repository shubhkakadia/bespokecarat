"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";
import {
  User,
  Clock,
  Shield,
  Edit3,
  Camera,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Award,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function ProfilePage() {
  const { userData } = useAuth();
  return (
    <CustomerRoute>
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
        <Navbar />

        <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="mb-6 sm:mb-8">
              <Link
                href="/customer"
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors duration-200 mb-4 sm:mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm sm:text-base">Back to Dashboard</span>
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
                    My Profile
                  </h1>
                  <p className="text-secondary text-base sm:text-lg">
                    Manage your personal information and preferences
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-6 lg:p-8 xl:p-12 text-center">
              {/* Animated Icon */}
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent-500 to-accent-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-accent-cool-500 rounded-full flex items-center justify-center">
                  <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>

              {/* Main Content */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-dark mb-3 sm:mb-4">
                Coming Soon
              </h2>
              <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                We're building a comprehensive profile management system where
                you can update your personal information, manage your
                preferences, and customize your luxury jewelry experience.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Edit3 className="h-5 w-5 sm:h-6 sm:w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">
                    Personal Info
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary">
                    Update your contact details and preferences
                  </p>
                </div>

                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">
                    Profile Photo
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary">
                    Upload and manage your profile picture
                  </p>
                </div>

                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-cool-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 text-accent-cool-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">
                    Loyalty Program
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary">
                    Track your rewards and membership status
                  </p>
                </div>
              </div>

              {/* Profile Preview Mockup */}
              <div className="bg-gradient-to-r from-accent-50 to-accent-cool-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-accent-200">
                <h3 className="font-semibold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">
                  Preview of Your Profile
                </h3>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-border-light max-w-sm sm:max-w-md mx-auto">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-semibold">
                      JD
                    </div>
                    <div className="flex-1">
                      <div className="h-3 sm:h-4 bg-surface-300 rounded w-24 sm:w-32 mb-1.5 sm:mb-2"></div>
                      <div className="h-2.5 sm:h-3 bg-surface-300 rounded w-20 sm:w-24"></div>
                    </div>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                      <div className="h-2.5 sm:h-3 bg-surface-300 rounded w-32 sm:w-40"></div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                      <div className="h-2.5 sm:h-3 bg-surface-300 rounded w-24 sm:w-32"></div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-primary-500" />
                      <div className="h-2.5 sm:h-3 bg-surface-300 rounded w-28 sm:w-36"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Account Info */}
              <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-primary-200">
                <h3 className="font-semibold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">
                  Current Account Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-left">
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg border border-border-light">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-secondary">Name</p>
                      <p className="font-medium text-text-dark text-sm sm:text-base truncate">
                        {userData?.first_name} {userData?.last_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg border border-border-light">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-secondary">Email</p>
                      <p className="font-medium text-text-dark text-sm sm:text-base truncate">
                        {userData?.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg border border-border-light">
                    <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm text-secondary">Phone</p>
                      <p className="font-medium text-text-dark text-sm sm:text-base truncate">
                        {userData?.phone_number}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border-primary">
                <p className="text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                  Need to update your information now? Contact our support team
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/contactus"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Support
                  </Link>
                  <Link
                    href="/customer"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 border border-border-primary hover:bg-surface-50 text-text-dark rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </CustomerRoute>
  );
}
