"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";
import { 
  ShoppingBag, 
  Clock, 
  Package, 
  Truck, 
  CheckCircle, 
  Star,
  ArrowLeft,
  Mail
} from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
                    My Orders
                  </h1>
                  <p className="text-secondary text-base sm:text-lg">
                    Track and manage your luxury jewelry orders
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-6 lg:p-8 xl:p-12 text-center">
              {/* Animated Icon */}
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
              </div>

              {/* Main Content */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-dark mb-3 sm:mb-4">
                Coming Soon
              </h2>
              <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                We're crafting an exceptional order management experience for you. 
                Soon you'll be able to track your precious jewelry orders, view detailed 
                order history, and manage your luxury purchases with ease.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Truck className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">Real-time Tracking</h3>
                  <p className="text-xs sm:text-sm text-secondary">Track your orders from crafting to delivery</p>
                </div>
                
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-accent-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">Order History</h3>
                  <p className="text-xs sm:text-sm text-secondary">Complete history of your luxury purchases</p>
                </div>
                
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-warm-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Star className="h-5 w-5 sm:h-6 sm:w-6 text-accent-warm-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">Premium Support</h3>
                  <p className="text-xs sm:text-sm text-secondary">Dedicated support for your orders</p>
                </div>
              </div>

              {/* Contact Support */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border-primary">
                <p className="text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                  Need immediate assistance with an existing order?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/contactus"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-accent-cool-500 hover:bg-accent-cool-600 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
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
