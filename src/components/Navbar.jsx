"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  ShoppingBagIcon,
  ChevronDownIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon,
  ShoppingCartIcon,
  UsersIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef(null);

  const { isAuthenticated, isAdmin, isCustomer, userData, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target)
      ) {
        setIsAvatarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality here
      console.log("Searching for:", searchQuery);
      // You can add search logic or redirect to search results page
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAvatarDropdownOpen(false);
      // Optionally redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getInitials = () => {
    if (userData?.name) {
      return userData.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    }
    if (userData?.email) {
      return userData.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const getAvatarNavigationPath = () => {
    if (isAdmin()) {
      return "/admin";
    }
    if (isCustomer()) {
      return "/dashboard";
    }
    return "/dashboard";
  };

  return (
    <nav className="bg-surface shadow-soft border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left Side - Navigation Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="text-primary hover:text-primary-600 px-3 py-2 text-sm font-medium transition duration-200"
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsProductsDropdownOpen(true)}
              onMouseLeave={() => setIsProductsDropdownOpen(false)}
            >
              <button className="text-secondary hover:text-primary-600 px-3 py-2 text-sm font-medium transition duration-200 flex items-center">
                Diamonds
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>

              {/* Products Dropdown Menu */}
              {isProductsDropdownOpen && (
                <div
                  className="absolute  top-full mt-1 w-screen bg-white border-t border-gray-200 shadow-2xl z-50"
                  onMouseEnter={() => setIsProductsDropdownOpen(true)}
                  onMouseLeave={() => setIsProductsDropdownOpen(false)}
                >
                  <div className="max-w-7xl px-8 py-8">
                    <div className="grid grid-cols-12 gap-8">
                      {/* Left Content - Categories */}
                      <div className="col-span-8">
                        <div className="grid grid-cols-5 gap-8">
                          {/* Shop by Shape */}
                          <div className="space-y-4">
                            <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
                              Shop by Shape
                            </h3>
                            <div className="space-y-2">
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Round
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Pear
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Oval
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Princess
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Asscher
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Marquise
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Emerald
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Cushion
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Radiant
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Heart
                              </Link>
                              <button className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors">
                                View All
                              </button>
                            </div>
                          </div>

                          {/* Shop by Cut */}
                          <div className="space-y-4">
                            <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
                              Shop by Cut
                            </h3>
                            <div className="space-y-2">
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Old Cut
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Antique Cut
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Rose Cut
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Pie Cut
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Portrait Cut
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Step Cut
                              </Link>
                              <button className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors">
                                View All
                              </button>
                            </div>
                          </div>

                          {/* Color Diamonds */}
                          <div className="space-y-4">
                            <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
                              Color Diamonds
                            </h3>
                            <div className="space-y-2">
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Pink
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Yellow
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Blue
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Champagne
                              </Link>
                              <button className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors">
                                View All
                              </button>
                            </div>
                          </div>

                          {/* Lab Gemstones & Melee */}
                          <div className="space-y-4">
                            {/* Lab Gemstones */}
                            <div className="space-y-2">
                              <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
                                Lab Gemstones
                              </h3>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Emerald
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Ruby
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Sapphire
                              </Link>
                            </div>

                            {/* Melee */}
                            <div className="space-y-2">
                              <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
                                Melee
                              </h3>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                Single Round Melee
                              </Link>
                              <Link
                                href="#"
                                className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                              >
                                1ct Round Melee
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Side - Image */}
                      <div className="col-span-4">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <div className="text-4xl mb-2">💎</div>
                            <p className="text-sm">Diamond Shapes Image</p>
                            <p className="text-xs mt-1">400 x 384px</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/aboutus"
              className="text-secondary hover:text-primary-600 px-3 py-2 text-sm font-medium transition duration-200"
            >
              About Us
            </Link>

            {/* Contact Us moved to left side */}
            <Link
              href="/contactus"
              className="text-secondary hover:text-primary-600 px-3 py-2 text-sm font-medium transition duration-200"
            >
              Contact Us
            </Link>
          </div>

          {/* Center - Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-brand text-primary transition duration-200">
                Bespoke Carat
              </h1>
            </Link>
          </div>

          {/* Right Side - Search, Cart, Sign In */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search diamonds..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-gray-700 w-64 pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none transition duration-200 bg-surface-50"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-secondary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </form>

            {/* Cart Button */}
            <button className="cursor-pointer relative p-2 text-secondary">
              <ShoppingBagIcon className="h-5 w-5 hover:text-primary-600" />
              {/* Cart Badge */}
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Sign In Button or Avatar */}
            {isAuthenticated ? (
              <div className="relative" ref={avatarDropdownRef}>
                <button
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                  className="cursor-pointer flex items-center space-x-2 p-1 rounded-full hover:bg-surface-100 transition duration-200"
                >
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {getInitials()}
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-secondary" />
                </button>

                {/* Avatar Dropdown Menu */}
                {isAvatarDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900">
                        {userData?.name || userData?.email}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {userData?.user_type}
                      </p>
                    </div>

                    <Link
                      href={getAvatarNavigationPath()}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsAvatarDropdownOpen(false)}
                    >
                      {isAdmin() ? (
                        <SettingsIcon className="w-4 h-4 mr-2" />
                      ) : (
                        <UserIcon className="w-4 h-4 mr-2" />
                      )}
                      {isAdmin() ? "Admin Dashboard" : "My Dashboard"}
                    </Link>

                    {isCustomer() && (
                      <Link
                        href="/orders"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsAvatarDropdownOpen(false)}
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        My Orders
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOutIcon className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="text-white cursor-pointer bg-primary-600 hover:bg-primary text-brand px-4 py-2 rounded-md text-sm font-medium transition duration-200 shadow-accent"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-secondary hover:text-primary-600 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute inset-x-0 top-full p-4 space-y-2 bg-background-secondary border-t border-border rounded-xl shadow-lg">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="px-3 py-2">
                <div className="flex justify-between items-center">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search diamonds..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-gray-700 w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:ring-1 focus:ring-primary-600 focus:border-primary-600 outline-none bg-surface-50"
                    />

                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-secondary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <button className="cursor-pointer relative p-2 text-secondary">
                    <ShoppingBagIcon className="h-5 w-6 hover:text-primary-600" />
                    {/* Cart Badge */}
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                      3
                    </span>
                  </button>
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <Link
                href="/"
                className="text-primary hover:text-primary-600 block px-3 py-2 text-base font-medium"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-secondary hover:text-primary-600 block px-3 py-2 text-base font-medium"
              >
                Diamonds
              </Link>
              <Link
                href="/aboutus"
                className="text-secondary hover:text-primary-600 block px-3 py-2 text-base font-medium"
              >
                About Us
              </Link>
              <Link
                href="/contactus"
                className="text-secondary hover:text-primary-600 block px-3 py-2 text-base font-medium"
              >
                Contact Us
              </Link>

              {/* Mobile Cart and Sign In/Avatar */}
              <div className="flex items-center justify-between px-3 py-2">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-4 w-full">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {getInitials()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {userData?.name || userData?.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {userData?.user_type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-white bg-primary-600 hover:bg-primary text-brand px-4 py-2 rounded-md text-sm font-medium shadow-accent"
                  >
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Dashboard Link for authenticated users */}
              {isAuthenticated && (
                <Link
                  href={getAvatarNavigationPath()}
                  className="text-secondary hover:text-primary-600 block px-3 py-2 text-base font-medium"
                >
                  {isAdmin() ? "Admin Dashboard" : "My Dashboard"}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
