"use client";

import React, { useState, useEffect } from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";
import {
  ShoppingBag,
  Heart,
  User,
  Settings,
  LogOut,
  Clock,
  ArrowRight,
  Package,
  Bell,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function CustomerDashboard() {
  const router = useRouter();
  const { logout, userData } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name.charAt(0)}${userData.last_name.charAt(
        0
      )}`.toUpperCase();
    }
    return "C";
  };

  const getFullName = () => {
    if (userData?.first_name && userData?.last_name) {
      return `${userData.first_name} ${userData.last_name}`;
    }
    return "Customer";
  };

  const dashboardItems = [
    {
      title: "My Orders",
      description: "Track your orders",
      icon: ShoppingBag,
      href: "/customer/orders",
      color: "bg-primary-500",
      bgColor: "bg-primary-50",
      borderColor: "border-primary-200",
      status: "coming-soon",
      count: 0,
    },
    {
      title: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      href: "/customer/wishlist",
      color: "bg-accent-warm-500",
      bgColor: "bg-accent-warm-50",
      borderColor: "border-accent-warm-200",
      status: "coming-soon",
      count: 0,
    },
    {
      title: "Profile",
      description: "Manage your account",
      icon: User,
      href: "/customer/profile",
      color: "bg-accent-500",
      bgColor: "bg-accent-50",
      borderColor: "border-accent-200",
      status: "coming-soon",
      count: 0,
    },
    {
      title: "Settings",
      description: "Account preferences",
      icon: Settings,
      href: "/customer/settings",
      color: "bg-accent-cool-500",
      bgColor: "bg-accent-cool-50",
      borderColor: "border-accent-cool-200",
      status: "coming-soon",
      count: 0,
    },
  ];

  const quickActions = [
    {
      title: "Browse Collection",
      description: "Discover our latest pieces",
      icon: Package,
      action: () => router.push("/collections/diamond"),
      color: "bg-primary-500 hover:bg-primary-600",
      gradient: "from-primary-500 to-primary-700",
    },
    {
      title: "Get Support",
      description: "24/7 customer care",
      icon: Bell,
      action: () => router.push("/contactus"),
      color: "bg-accent-cool-500 hover:bg-accent-cool-600",
      gradient: "from-accent-cool-500 to-accent-cool-700",
    },
  ];

  return (
    <CustomerRoute>
      <div className="min-h-screen bg-gradient-to-br from-surface-50 via-white to-surface-100 flex flex-col">
        <Navbar />

        <div className="flex-1 px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header with User Info */}
            <div className="mb-6 sm:mb-8 lg:mb-12">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 xl:p-12 text-primary-600 bg-primary-50 border border-primary-600/30">
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 sm:mb-6 lg:mb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-50/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center text-primary-600 text-xl sm:text-2xl font-bold border border-primary-600/30">
                            {getInitials()}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2">
                            {getGreeting()},{" "}
                            {userData?.first_name || "Customer"}!
                          </h1>
                          <p className="text-primary-600/90 text-base sm:text-lg lg:text-xl">
                            Welcome to your bespoke carat dashboard
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-primary-600/80">
                        <div className="flex items-center gap-2 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/20">
                          <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {currentTime.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/20">
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate max-w-[200px] sm:max-w-none">
                            {userData?.email || "customer@example.com"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 backdrop-blur-sm px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-white/20">
                          <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span className="truncate">
                            {userData?.phone_number || "No phone"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-primary-50/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 text-center border border-primary-600/20 w-full sm:w-auto sm:min-w-[120px]">
                      <div className="text-xl sm:text-2xl font-bold">2024</div>
                      <div className="text-xs sm:text-sm text-primary-600/80">
                        Since
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Items with Enhanced Design */}
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-primary-500 to-accent-500 rounded-full"></div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                  Your Account
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {dashboardItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="group relative overflow-hidden bg-white rounded-xl sm:rounded-2xl shadow-sm border border-border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div
                      className={`${item.bgColor} ${item.borderColor} border rounded-xl sm:rounded-2xl p-4 sm:p-6`}
                    >
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <div
                          className={`${item.color} p-3 sm:p-4 rounded-lg sm:rounded-xl text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <div className="flex items-center gap-2">
                          {item.status === "coming-soon" && (
                            <span className="text-xs bg-accent-100 text-accent-700 px-2 py-1 rounded-full font-medium">
                              Coming Soon
                            </span>
                          )}
                          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-secondary group-hover:text-primary-600 transition-colors duration-200" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-text-dark mb-2">
                        {item.title}
                      </h3>
                      <p className="text-secondary text-sm mb-3">
                        {item.description}
                      </p>
                      {item.count > 0 && (
                        <div className="text-xl sm:text-2xl font-bold text-primary-600">
                          {item.count}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-10 lg:mb-12">
              {/* Enhanced Quick Actions */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-accent-500 to-accent-cool-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                    Quick Actions
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`bg-gradient-to-br ${action.gradient} text-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl group relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <action.icon className="h-6 w-6 sm:h-8 sm:w-8 mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-200" />
                        <h3 className="text-lg sm:text-xl font-bold mb-2">
                          {action.title}
                        </h3>
                        <p className="text-sm opacity-90">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enhanced Account Information */}
              <div>
                <div className="flex items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <div className="w-1 h-6 sm:h-8 bg-gradient-to-b from-accent-warm-500 to-accent-500 rounded-full"></div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-text-dark">
                    Account Info
                  </h2>
                </div>
                <div className="bg-white border border-border-primary rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-primary-50 to-accent-50 rounded-lg sm:rounded-xl border border-primary-100">
                      <User className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-secondary font-medium">
                          Full Name
                        </p>
                        <p className="font-bold text-text-dark text-base sm:text-lg truncate">
                          {getFullName()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-accent-50 to-accent-cool-50 rounded-lg sm:rounded-xl border border-accent-100">
                      <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-accent-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-secondary font-medium">
                          Email
                        </p>
                        <p className="font-bold text-text-dark text-base sm:text-lg truncate">
                          {userData?.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-accent-warm-50 to-accent-50 rounded-lg sm:rounded-xl border border-accent-warm-100">
                      <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-accent-warm-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-secondary font-medium">
                          Phone
                        </p>
                        <p className="font-bold text-text-dark text-base sm:text-lg truncate">
                          {userData?.phone_number || "Not provided"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-accent-cool-50 to-primary-50 rounded-lg sm:rounded-xl border border-accent-cool-100">
                      <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-accent-cool-600 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm text-secondary font-medium">
                          Member Since
                        </p>
                        <p className="font-bold text-text-dark text-base sm:text-lg">
                          2024
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Logout Section */}
            <div className="flex justify-center">
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="cursor-pointer px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                {isLoggingOut ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Logging out...</span>
                    <span className="sm:hidden">Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="hidden sm:inline">Logout</span>
                    <span className="sm:hidden">Logout</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </CustomerRoute>
  );
}
