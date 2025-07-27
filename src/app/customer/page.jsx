"use client";

import React, { useState } from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";
import { ShoppingBag, Heart, User, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function CustomerDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Redirect anyway for better UX
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const dashboardItems = [
    {
      title: "My Orders",
      description: "View and track your orders",
      icon: ShoppingBag,
      href: "/customer/orders",
      color: "bg-blue-500",
    },
    {
      title: "Wishlist",
      description: "Your saved items",
      icon: Heart,
      href: "/customer/wishlist",
      color: "bg-red-500",
    },
    {
      title: "Profile",
      description: "Manage your account",
      icon: User,
      href: "/customer/profile",
      color: "bg-green-500",
    },
    {
      title: "Settings",
      description: "Account preferences",
      icon: Settings,
      href: "/customer/settings",
      color: "bg-purple-500",
    },
  ];

  return (
    <CustomerRoute>
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex flex-col">
        <Navbar />

        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-text-dark mb-2">
                Welcome to Your Dashboard
              </h1>
              <p className="text-secondary">
                Manage your account, orders, and preferences
              </p>
            </div>

            {/* Dashboard Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {dashboardItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block bg-white rounded-xl border border-border p-6 hover:shadow-soft transition-shadow duration-200"
                >
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-lg ${item.color} text-white`}>
                      <item.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-text-dark mb-2">
                    {item.title}
                  </h3>
                  <p className="text-secondary text-sm">{item.description}</p>
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-xl font-semibold text-text-dark mb-4">
                Quick Actions
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => router.push("/")}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Browse Products
                </button>
                <button
                  onClick={() => router.push("/contactus")}
                  className="px-4 py-2 bg-surface-100 text-text-dark rounded-lg hover:bg-surface-200 transition-colors duration-200"
                >
                  Contact Support
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="px-4 py-2 bg-accent-warm-100 text-accent-warm-800 rounded-lg hover:bg-accent-warm-200 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoggingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-warm-800"></div>
                      Logging out...
                    </>
                  ) : (
                    <>
                      <LogOut className="h-4 w-4" />
                      Logout
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </CustomerRoute>
  );
}
