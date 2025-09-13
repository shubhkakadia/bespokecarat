"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";
import {
  Settings,
  Clock,
  Shield,
  Bell,
  Palette,
  ArrowLeft,
  Mail,
  Lock,
  Globe,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-cool-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Settings className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
                    My Settings
                  </h1>
                  <p className="text-secondary text-base sm:text-lg">
                    Customize your luxury jewelry experience
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-6 lg:p-8 xl:p-12 text-center">
              {/* Animated Icon */}
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent-cool-500 to-accent-cool-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <Settings className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-accent-500 rounded-full flex items-center justify-center">
                  <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>

              {/* Main Content */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-dark mb-3 sm:mb-4">
                Coming Soon
              </h2>
              <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                We're developing a comprehensive settings panel where you can
                personalize your account preferences, manage notifications, and
                customize your luxury jewelry shopping experience.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-cool-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-accent-cool-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">
                    Notifications
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary">
                    Manage email and push notifications
                  </p>
                </div>

                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Palette className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">
                    Appearance
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary">
                    Customize theme and display preferences
                  </p>
                </div>

                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">
                    Privacy & Security
                  </h3>
                  <p className="text-xs sm:text-sm text-secondary">
                    Manage your privacy and security settings
                  </p>
                </div>
              </div>

              {/* Settings Preview Mockup */}
              <div className="bg-gradient-to-r from-accent-cool-50 to-primary-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-accent-cool-200">
                <h3 className="font-semibold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">
                  Preview of Settings Panel
                </h3>
                <div className="bg-white rounded-lg p-4 sm:p-6 border border-border-light max-w-sm sm:max-w-lg mx-auto text-left">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Notification Settings */}
                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-surface-50 rounded-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-accent-cool-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-text-dark text-sm sm:text-base">
                            Email Notifications
                          </p>
                          <p className="text-xs sm:text-sm text-secondary">
                            Order updates and promotions
                          </p>
                        </div>
                      </div>
                      <div className="w-10 h-5 sm:w-12 sm:h-6 bg-primary-500 rounded-full relative flex-shrink-0">
                        <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>

                    {/* Theme Settings */}
                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-surface-50 rounded-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-text-dark text-sm sm:text-base">
                            Theme
                          </p>
                          <p className="text-xs sm:text-sm text-secondary">
                            Light mode
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-primary-500 rounded border-2 border-primary-600"></div>
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-surface-300 rounded"></div>
                      </div>
                    </div>

                    {/* Language Settings */}
                    <div className="flex items-center justify-between p-2.5 sm:p-3 bg-surface-50 rounded-lg">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-accent-500 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-text-dark text-sm sm:text-base">
                            Language
                          </p>
                          <p className="text-xs sm:text-sm text-secondary">
                            English (US)
                          </p>
                        </div>
                      </div>
                      <div className="text-secondary text-sm sm:text-base flex-shrink-0">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border-primary">
                <p className="text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                  Need help with current settings? Contact our support team
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
