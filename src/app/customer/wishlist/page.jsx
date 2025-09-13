"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";
import { 
  Heart, 
  Clock, 
  Sparkles, 
  Bookmark,
  ArrowLeft,
  Search,
  Filter,
  Share2
} from "lucide-react";
import Link from "next/link";

export default function WishlistPage() {
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-warm-500 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                  <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-dark">
                    My Wishlist
                  </h1>
                  <p className="text-secondary text-base sm:text-lg">
                    Save and organize your favorite luxury pieces
                  </p>
                </div>
              </div>
            </div>

            {/* Coming Soon Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-border-primary p-4 sm:p-6 lg:p-8 xl:p-12 text-center">
              {/* Animated Icon */}
              <div className="relative mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-accent-warm-500 to-accent-warm-700 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 animate-pulse">
                  <Heart className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-accent-500 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 w-5 h-5 sm:w-6 sm:h-6 bg-accent-cool-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>

              {/* Main Content */}
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-dark mb-3 sm:mb-4">
                Coming Soon
              </h2>
              <p className="text-base sm:text-lg text-secondary mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
                We're creating a beautiful wishlist experience where you can save your 
                favorite jewelry pieces, organize them by collections, and share your 
                curated selections with loved ones.
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-warm-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Bookmark className="h-5 w-5 sm:h-6 sm:w-6 text-accent-warm-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">Save Favorites</h3>
                  <p className="text-xs sm:text-sm text-secondary">Save jewelry pieces you love for later</p>
                </div>
                
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">Smart Organization</h3>
                  <p className="text-xs sm:text-sm text-secondary">Organize by type, price, or occasion</p>
                </div>
                
                <div className="bg-surface-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-border-light sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-accent-cool-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Share2 className="h-5 w-5 sm:h-6 sm:w-6 text-accent-cool-600" />
                  </div>
                  <h3 className="font-semibold text-text-dark mb-2 text-sm sm:text-base">Share & Collaborate</h3>
                  <p className="text-xs sm:text-sm text-secondary">Share wishlists with family and friends</p>
                </div>
              </div>

              {/* Wishlist Preview Mockup */}
              <div className="bg-gradient-to-r from-accent-warm-50 to-accent-cool-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-accent-warm-200">
                <h3 className="font-semibold text-text-dark mb-3 sm:mb-4 text-sm sm:text-base">Preview of What's Coming</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-white rounded-lg p-3 sm:p-4 border border-border-light">
                      <div className="w-full h-24 sm:h-32 bg-gradient-to-br from-surface-200 to-surface-300 rounded-lg mb-2 sm:mb-3 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-secondary" />
                      </div>
                      <div className="space-y-1.5 sm:space-y-2">
                        <div className="h-2.5 sm:h-3 bg-surface-300 rounded w-3/4"></div>
                        <div className="h-2.5 sm:h-3 bg-surface-300 rounded w-1/2"></div>
                        <div className="flex items-center justify-between">
                          <div className="h-3 sm:h-4 bg-accent-warm-300 rounded w-12 sm:w-16"></div>
                          <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-accent-warm-400" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Browse Collection CTA */}
              <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border-primary">
                <p className="text-secondary mb-3 sm:mb-4 text-sm sm:text-base">
                  In the meantime, explore our stunning jewelry collection
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/collections/diamond"
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors duration-200 text-sm sm:text-base"
                  >
                    <Search className="h-4 w-4" />
                    Browse Collection
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
