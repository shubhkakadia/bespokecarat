"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  ShoppingBagIcon,
  ChevronDownIcon,
  UserIcon,
  LogOutIcon,
  SettingsIcon,
  ShoppingCartIcon,
  Gem,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import SearchCard from "./SearchCard";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { getAuthToken } from "@/contexts/auth";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchAbortRef = useRef(null);
  const searchBoxRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const [isProductsDropdownOpen, setIsProductsDropdownOpen] = useState(false);
  const [isMobileDiamondDropdownOpen, setIsMobileDiamondDropdownOpen] =
    useState(false);
  const [isAvatarDropdownOpen, setIsAvatarDropdownOpen] = useState(false);
  const avatarDropdownRef = useRef(null);
  const mobileDiamondDropdownRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);
  const debounceRef = useRef(null);
  const router = useRouter();
  const pathname = usePathname();
  const authToken = getAuthToken();

  const isActivePath = (path) => {
    if (!pathname) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const isDiamondsActive = () => {
    if (!pathname) return false;
    return (
      pathname.startsWith("/products") || pathname.startsWith("/collections")
    );
  };

  const { isAuthenticated, isAdmin, isCustomer, userData, logout, getToken } =
    useAuth();

  // Dropdown hover handlers with delay
  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setIsProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setIsProductsDropdownOpen(false);
    }, 300); // 300ms delay before hiding
  };

  const handleMobileDiamondDropdownToggle = () => {
    setIsMobileDiamondDropdownOpen(!isMobileDiamondDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        avatarDropdownRef.current &&
        !avatarDropdownRef.current.contains(event.target)
      ) {
        setIsAvatarDropdownOpen(false);
      }
      if (
        searchBoxRef.current &&
        !searchBoxRef.current.contains(event.target) &&
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setSearchOpen(false);
      }
      if (
        mobileDiamondDropdownRef.current &&
        !mobileDiamondDropdownRef.current.contains(event.target)
      ) {
        setIsMobileDiamondDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clean up timeout on unmount
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (searchAbortRef.current) {
        searchAbortRef.current.abort();
      }
    };
  }, []);

  // Debounced search - Only for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !searchQuery || searchQuery.trim().length === 0) {
      setSearchResults([]);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        // Abort previous request if any
        if (searchAbortRef.current) searchAbortRef.current.abort();
        const controller = new AbortController();
        searchAbortRef.current = controller;

        const res = await axios.get(`/api/client/product/search`, {
          params: { q: searchQuery.trim() },
          headers: { Authorization: authToken },
          signal: controller.signal,
        });
        const data = Array.isArray(res?.data?.data) ? res.data.data : [];
        setSearchResults(data.slice(0, 5));
      } catch (err) {
        if (axios.isCancel?.(err)) return;
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, getToken, isAuthenticated]);

  const navigateToProduct = (item) => {
    if (!item) return;
    const sku = item.sku || item.id;
    setSearchOpen(false);
    setSearchQuery("");
    router.push(`/products/${sku}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Don't redirect, just show the login message in the dropdown
      return;
    }
    if (searchQuery.trim()) {
      // Redirect to collections page with search query as type
      const searchType = searchQuery.trim().toLowerCase().replace(/\s+/g, "");
      setSearchOpen(false);
      setSearchQuery("");
      router.push(`/collections/${searchType}`);
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
      return "/customer";
    }
    return "/customer";
  };

  return (
    <nav className="bg-surface shadow-soft border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="/BESPOKE/03.png"
                alt="Bespoke Carat"
                width={200}
                height={40}
              />
              {/* <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <Gem className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-text-dark">
                Bespoke Carat
              </span> */}
            </Link>
          </div>

          {/* Left Side - Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link
              href="/"
              className={`${
                isActivePath("/") ? "text-primary" : "text-secondary"
              } hover:text-primary-600 px-2 xl:px-3 py-2 text-sm font-medium transition duration-200`}
            >
              Home
            </Link>

            {/* Products Dropdown */}
            <div
              className="relative group"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <button
                className={`${
                  isDiamondsActive() ? "text-primary" : "text-secondary"
                } hover:text-primary-600 px-2 xl:px-3 py-2 text-sm font-medium transition duration-200 flex items-center`}
              >
                Diamonds
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              </button>

              {/* Products Dropdown Menu with animation */}
              <div
                className={`fixed left-0 top-14 sm:top-16 w-full bg-white border-t border-gray-200 shadow-2xl z-50 transform transition-all duration-300 ease-out ${
                  isProductsDropdownOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                }`}
                onMouseEnter={handleDropdownEnter}
                onMouseLeave={handleDropdownLeave}
              >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    {/* Left Content - Categories */}
                    <div className="lg:col-span-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {/* Shop by Shape */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-gray-900 font-semibold text-base sm:text-lg border-b border-gray-200 pb-2">
                            Shop by Shape
                          </h3>
                          <div className="space-y-1">
                            <Link
                              href="/collections/round"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Round
                            </Link>
                            <Link
                              href="/collections/pear"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Pear
                            </Link>
                            <Link
                              href="/collections/oval"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Oval
                            </Link>
                            <Link
                              href="/collections/princess"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Princess
                            </Link>
                            <Link
                              href="/collections/asscher"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Asscher
                            </Link>
                            <Link
                              href="/collections/marquise"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Marquise
                            </Link>
                            <Link
                              href="/collections/emerald"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Emerald
                            </Link>
                            <Link
                              href="/collections/cushion"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Cushion
                            </Link>
                            <Link
                              href="/collections/radiant"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Radiant
                            </Link>
                            <Link
                              href="/collections/heart"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Heart
                            </Link>
                            <Link
                              href="/collections/shapes"
                              className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors"
                            >
                              View All
                            </Link>
                          </div>
                        </div>

                        {/* Shop by Cut */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-gray-900 font-semibold text-base sm:text-lg border-b border-gray-200 pb-2">
                            Shop by Cut
                          </h3>
                          <div className="space-y-1">
                            <Link
                              href="/collections/oldcut"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Old Cut
                            </Link>
                            <Link
                              href="/collections/antiquecut"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Antique Cut
                            </Link>
                            <Link
                              href="/collections/rosecut"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Rose Cut
                            </Link>
                            <Link
                              href="/collections/piecut"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Pie Cut
                            </Link>
                            <Link
                              href="/collections/portraitcut"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Portrait Cut
                            </Link>
                            <Link
                              href="/collections/stepcut"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Step Cut
                            </Link>
                            <Link
                              href="/collections/cuts"
                              className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors"
                            >
                              View All
                            </Link>
                          </div>
                        </div>

                        {/* Color Diamonds */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="text-gray-900 font-semibold text-base sm:text-lg border-b border-gray-200 pb-2">
                            Color Diamonds
                          </h3>
                          <div className="space-y-1">
                            <Link
                              href="/collections/pink"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Pink
                            </Link>
                            <Link
                              href="/collections/yellow"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Yellow
                            </Link>
                            <Link
                              href="/collections/blue"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Blue
                            </Link>
                            <Link
                              href="/collections/champagne"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              Champagne
                            </Link>
                            <Link
                              href="/collections/colorstone"
                              className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors"
                            >
                              View All
                            </Link>
                          </div>
                        </div>

                        {/* Lab Gemstones & Melee */}
                        <div className="space-y-4">
                          {/* Melee */}
                          <div className="space-y-1">
                            <h3 className="text-gray-900 font-semibold text-lg border-b border-gray-200 pb-2">
                              Melee
                            </h3>
                            <Link
                              href="/collections/1ctroundmelee"
                              className="block text-gray-700 hover:text-primary-600 transition-colors py-1"
                            >
                              1ct Round Melee
                            </Link>
                            <Link
                              href="/collections/melee"
                              className="cursor-pointer mt-3 px-4 py-1 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm rounded transition-colors"
                            >
                              View All
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Image */}
                    <div className="lg:col-span-4">
                      <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 sm:h-64 lg:h-80 flex items-center justify-center">
                        <div className="text-center text-gray-500 shadow-lg">
                          <Image
                            src="/layout.jpg"
                            alt="Diamond Shapes"
                            className="w-full h-full object-cover rounded-lg"
                            width={400}
                            height={400}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link
              href="/diamondjournal"
              className={`${
                isActivePath("/diamondjournal")
                  ? "text-primary"
                  : "text-secondary"
              } hover:text-primary-600 px-2 xl:px-3 py-2 text-sm font-medium transition duration-200`}
            >
              Diamond Journal
            </Link>

            <Link
              href="/aboutus"
              className={`${
                isActivePath("/aboutus") ? "text-primary" : "text-secondary"
              } hover:text-primary-600 px-2 xl:px-3 py-2 text-sm font-medium transition duration-200`}
            >
              About Us
            </Link>

            {/* Contact Us moved to left side */}
            <Link
              href="/contactus"
              className={`${
                isActivePath("/contactus") ? "text-primary" : "text-secondary"
              } hover:text-primary-600 px-2 xl:px-3 py-2 text-sm font-medium transition duration-200`}
            >
              Contact Us
            </Link>
          </div>

          {/* Right Side - Search, Cart, Sign In */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative"
              ref={searchBoxRef}
            >
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search diamonds..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                  onFocus={() => setSearchOpen(true)}
                  className="text-gray-800 w-64 xl:w-72 pl-12 pr-4 py-2.5 xl:py-3 rounded-xl bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-300 placeholder-gray-400 text-sm shadow-sm hover:shadow-md focus:shadow-lg"
                />
                {searchOpen && searchQuery.length > 0 && (
                  <div className="absolute left-0 right-0 mt-3 w-full sm:w-[28rem] xl:w-[30rem] max-h-[32rem] overflow-auto rounded-2xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 z-50">
                    <div>
                      <div className="p-4 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                          <div className="text-xs font-medium text-gray-600">
                            {!isAuthenticated
                              ? "Authentication required"
                              : searchLoading
                              ? "Searching diamonds..."
                              : searchResults.length > 0
                              ? `${searchResults.length} result${
                                  searchResults.length === 1 ? "" : "s"
                                } found`
                              : searchQuery
                              ? "No diamonds found"
                              : "Start typing to search"}
                          </div>
                          {searchLoading && isAuthenticated && (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-500 border-t-transparent"></div>
                          )}
                        </div>
                      </div>
                      <div className="p-3 space-y-1">
                        {!isAuthenticated ? (
                          <div className="p-6 text-center">
                            <div className="text-gray-400 text-4xl mb-3 flex items-center justify-center">
                              <Gem className="h-8 w-8" />
                            </div>
                            <div className="text-sm font-medium text-gray-600 mb-1">
                              You need to login to view full inventory
                            </div>
                            <div className="text-xs text-gray-400 mb-4">
                              Sign in to search and browse our complete diamond
                              collection
                            </div>
                            <Link
                              href="/login"
                              className="inline-block bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                              onClick={() => setSearchOpen(false)}
                            >
                              Sign In
                            </Link>
                          </div>
                        ) : (
                          <>
                            {!searchLoading &&
                              searchResults.map((item) => {
                                const firstImage =
                                  item?.medias?.find(
                                    (m) => m.file_type === "image"
                                  )?.filelink ||
                                  "/placeholders/Heart Diamond.png";
                                const subtitle =
                                  item?.shape ||
                                  item?.color ||
                                  item?.description ||
                                  "";
                                let price;
                                if (
                                  Array.isArray(item?.variants) &&
                                  item.variants.length
                                ) {
                                  price = item.variants[0]?.price;
                                }
                                if (
                                  price == null &&
                                  Array.isArray(item?.sieve_sizes) &&
                                  item.sieve_sizes.length
                                ) {
                                  price = item.sieve_sizes[0]?.price_per_carat;
                                }
                                if (
                                  item?.product_type.toLowerCase() ===
                                    "layouts" &&
                                  item?.price
                                ) {
                                  price = item?.price;
                                }
                                return (
                                  <SearchCard
                                    key={`${item.product_type}-${item.id}`}
                                    image={firstImage}
                                    title={item?.name || item?.sku}
                                    subtitle={subtitle}
                                    badge={item?.product_type}
                                    price={price}
                                    onClick={() => navigateToProduct(item)}
                                    onAddToCart={() => {
                                      addToCart(item);
                                      // Add to cart logic here
                                    }}
                                    onToggleLike={() => {
                                      toggleWishlist(item);
                                      // Toggle wishlist logic here
                                    }}
                                    isLiked={false} // This would come from your wishlist state
                                  />
                                );
                              })}
                            {!searchLoading &&
                              searchResults.length === 0 &&
                              searchQuery && (
                                <div className="p-6 text-center">
                                  <div className="text-gray-400 text-4xl mb-3 flex items-center justify-center">
                                    <Gem className="h-8 w-8" />
                                  </div>
                                  <div className="text-sm font-medium text-gray-600 mb-1">
                                    No diamonds found
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Try different keywords or browse our
                                    collections
                                  </div>
                                </div>
                              )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors duration-200"
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
            {/* <button className="cursor-pointer relative p-2 text-secondary">
              <ShoppingBagIcon className="h-5 w-5 hover:text-primary-600" />
              <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </button> */}

            {/* Sign In Button or Avatar */}
            {isAuthenticated ? (
              <div className="relative" ref={avatarDropdownRef}>
                <button
                  onClick={() => setIsAvatarDropdownOpen(!isAvatarDropdownOpen)}
                  className="cursor-pointer flex items-center space-x-1.5 xl:space-x-2 p-1 rounded-full hover:bg-surface-100 transition duration-200"
                >
                  <div className="w-7 h-7 xl:w-8 xl:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs xl:text-sm font-semibold">
                    {getInitials()}
                  </div>
                  <ChevronDownIcon className="w-3.5 h-3.5 xl:w-4 xl:h-4 text-secondary" />
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
                className="text-white cursor-pointer bg-primary-600 hover:bg-primary text-brand px-3 xl:px-4 py-2 rounded-md text-xs xl:text-sm font-medium transition duration-200 shadow-accent"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                // Close mobile diamond dropdown when menu is closed
                if (isMenuOpen) {
                  setIsMobileDiamondDropdownOpen(false);
                }
              }}
              className="p-2 rounded-md text-secondary hover:text-primary-600 hover:bg-surface-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-600"
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
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
            <div className="absolute inset-x-0 top-full p-3 sm:p-4 space-y-2 bg-background-secondary border-t border-border rounded-xl shadow-lg overflow-visible">
              {/* Mobile Search */}
              <form
                onSubmit={handleSearch}
                className="px-2 sm:px-3 py-2 sm:py-3"
              >
                <div className="flex justify-between items-center gap-2 sm:gap-3">
                  <div className="relative flex-1" ref={mobileSearchRef}>
                    <input
                      type="text"
                      placeholder="Search diamonds..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchOpen(true);
                      }}
                      onFocus={() => setSearchOpen(true)}
                      className="text-gray-700 w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none bg-gray-50 hover:bg-white transition-all duration-200 placeholder-gray-400 text-sm"
                    />

                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400"
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

                    {/* Mobile Search Dropdown */}
                    {searchOpen && searchQuery.length > 0 && (
                      <div className="absolute left-0 right-0 mt-2 w-full max-h-[20rem] sm:max-h-[24rem] overflow-auto rounded-xl border border-gray-100 bg-white shadow-2xl ring-1 ring-black/5 backdrop-blur-sm animate-in slide-in-from-top-2 duration-300 z-[60]">
                        <div>
                          <div className="p-3 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-sm z-10 rounded-t-xl">
                            <div className="flex items-center justify-between">
                              <div className="text-xs font-medium text-gray-600">
                                {!isAuthenticated
                                  ? "Authentication required"
                                  : searchLoading
                                  ? "Searching diamonds..."
                                  : searchResults.length > 0
                                  ? `${searchResults.length} result${
                                      searchResults.length === 1 ? "" : "s"
                                    } found`
                                  : searchQuery
                                  ? "No diamonds found"
                                  : "Start typing to search"}
                              </div>
                              {searchLoading && isAuthenticated && (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-primary-500 border-t-transparent"></div>
                              )}
                            </div>
                          </div>
                          <div className="p-2 space-y-1">
                            {!isAuthenticated ? (
                              <div className="p-4 text-center">
                                <div className="text-gray-400 text-3xl mb-2 flex items-center justify-center">
                                  <Gem className="h-6 w-6" />
                                </div>
                                <div className="text-sm font-medium text-gray-600 mb-1">
                                  You need to login to view full inventory
                                </div>
                                <div className="text-xs text-gray-400 mb-3">
                                  Sign in to search and browse our complete
                                  diamond collection
                                </div>
                                <Link
                                  href="/login"
                                  className="inline-block bg-primary-600 text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-primary-700 transition-colors"
                                  onClick={() => setSearchOpen(false)}
                                >
                                  Sign In
                                </Link>
                              </div>
                            ) : (
                              <>
                                {!searchLoading &&
                                  searchResults.map((item) => {
                                    const firstImage =
                                      item?.medias?.find(
                                        (m) => m.file_type === "image"
                                      )?.file_url || null;
                                    return (
                                      <SearchCard
                                        key={item.id}
                                        image={firstImage}
                                        title={item.name}
                                        subtitle={item.description}
                                        badge={item.category}
                                        price={item.price}
                                        onClick={() => navigateToProduct(item)}
                                        onAddToCart={() => {}}
                                        onToggleLike={() => {}}
                                      />
                                    );
                                  })}
                                {!searchLoading &&
                                  searchResults.length === 0 &&
                                  searchQuery && (
                                    <div className="p-4 text-center">
                                      <div className="text-gray-400 text-3xl mb-2 flex items-center justify-center">
                                        <Gem className="h-6 w-6" />
                                      </div>
                                      <div className="text-sm font-medium text-gray-600 mb-1">
                                        No diamonds found
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        Try different keywords or browse our
                                        collections
                                      </div>
                                    </div>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* <button className="cursor-pointer relative p-2 sm:p-2.5 text-gray-600 hover:text-primary-600 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
                    <ShoppingBagIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-[9px] sm:text-[10px] rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-medium shadow-sm">
                      3
                    </span>
                  </button> */}
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <Link
                href="/"
                className={`${
                  isActivePath("/") ? "text-primary" : "text-secondary"
                } hover:text-primary-600 block px-2 sm:px-3 py-2 text-sm sm:text-base font-medium`}
              >
                Home
              </Link>
              <Link
                href="/diamondjournal"
                className={`${
                  isActivePath("/diamondjournal")
                    ? "text-primary"
                    : "text-secondary"
                } hover:text-primary-600 block px-2 sm:px-3 py-2 text-sm sm:text-base font-medium`}
              >
                Diamond Journal
              </Link>
              <div className="relative" ref={mobileDiamondDropdownRef}>
                <button
                  onClick={handleMobileDiamondDropdownToggle}
                  className={`${
                    isDiamondsActive() ? "text-primary" : "text-secondary"
                  } hover:text-primary-600 flex items-center justify-between w-full px-2 sm:px-3 py-2 text-sm sm:text-base font-medium`}
                >
                  Diamonds
                  <ChevronDownIcon
                    className={`ml-1 h-4 w-4 transition-transform duration-200 ${
                      isMobileDiamondDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Mobile Diamond Dropdown */}
                {isMobileDiamondDropdownOpen && (
                  <div className="mt-2 ml-4 max-h-[45vh] overflow-y-auto bg-gray-50 rounded-lg p-2 border border-gray-200 shadow-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 relative mb-4 z-10">
                    <div className="space-y-2">
                      {/* Shop by Shape */}
                      <div className="space-y-1">
                        <h3 className="text-gray-900 font-semibold text-xs border-b border-gray-300 pb-1">
                          Shop by Shape
                        </h3>
                        <div className="grid grid-cols-2 gap-1">
                          <Link
                            href="/collections/round"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Round
                          </Link>
                          <Link
                            href="/collections/pear"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Pear
                          </Link>
                          <Link
                            href="/collections/oval"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Oval
                          </Link>
                          <Link
                            href="/collections/princess"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Princess
                          </Link>
                          <Link
                            href="/collections/asscher"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Asscher
                          </Link>
                          <Link
                            href="/collections/marquise"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Marquise
                          </Link>
                          <Link
                            href="/collections/emerald"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Emerald
                          </Link>
                          <Link
                            href="/collections/cushion"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Cushion
                          </Link>
                          <Link
                            href="/collections/radiant"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Radiant
                          </Link>
                          <Link
                            href="/collections/heart"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Heart
                          </Link>
                        </div>
                        <Link
                          href="/collections/shapes"
                          className="block text-primary-600 hover:text-primary-700 text-xs font-medium mt-1"
                          onClick={() => setIsMobileDiamondDropdownOpen(false)}
                        >
                          View All Shapes →
                        </Link>
                      </div>

                      {/* Shop by Cut */}
                      <div className="space-y-1">
                        <h3 className="text-gray-900 font-semibold text-xs border-b border-gray-300 pb-1">
                          Shop by Cut
                        </h3>
                        <div className="grid grid-cols-2 gap-1">
                          <Link
                            href="/collections/oldcut"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Old Cut
                          </Link>
                          <Link
                            href="/collections/antiquecut"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Antique Cut
                          </Link>
                          <Link
                            href="/collections/rosecut"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Rose Cut
                          </Link>
                          <Link
                            href="/collections/piecut"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Pie Cut
                          </Link>
                          <Link
                            href="/collections/portraitcut"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Portrait Cut
                          </Link>
                          <Link
                            href="/collections/stepcut"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Step Cut
                          </Link>
                        </div>
                        <Link
                          href="/collections/cuts"
                          className="block text-primary-600 hover:text-primary-700 text-xs font-medium mt-1"
                          onClick={() => setIsMobileDiamondDropdownOpen(false)}
                        >
                          View All Cuts →
                        </Link>
                      </div>

                      {/* Color Diamonds */}
                      <div className="space-y-1">
                        <h3 className="text-gray-900 font-semibold text-xs border-b border-gray-300 pb-1">
                          Color Diamonds
                        </h3>
                        <div className="grid grid-cols-2 gap-1">
                          <Link
                            href="/collections/pink"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Pink
                          </Link>
                          <Link
                            href="/collections/yellow"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Yellow
                          </Link>
                          <Link
                            href="/collections/blue"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Blue
                          </Link>
                          <Link
                            href="/collections/champagne"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            Champagne
                          </Link>
                        </div>
                        <Link
                          href="/collections/colorstone"
                          className="block text-primary-600 hover:text-primary-700 text-xs font-medium mt-1"
                          onClick={() => setIsMobileDiamondDropdownOpen(false)}
                        >
                          View All Colors →
                        </Link>
                      </div>

                      {/* Melee */}
                      <div className="space-y-1">
                        <h3 className="text-gray-900 font-semibold text-xs border-b border-gray-300 pb-1">
                          Melee
                        </h3>
                        <div className="space-y-1">
                          <Link
                            href="/collections/1ctroundmelee"
                            className="block text-gray-700 hover:text-primary-600 transition-colors py-0.5 text-xs"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            1ct Round Melee
                          </Link>
                          <Link
                            href="/collections/melee"
                            className="block text-primary-600 hover:text-primary-700 text-xs font-medium mt-1"
                            onClick={() =>
                              setIsMobileDiamondDropdownOpen(false)
                            }
                          >
                            View All Melee →
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* Scroll indicator fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-gray-50 to-transparent pointer-events-none"></div>
                  </div>
                )}
              </div>
              <Link
                href="/aboutus"
                className={`${
                  isActivePath("/aboutus") ? "text-primary" : "text-secondary"
                } hover:text-primary-600 block px-2 sm:px-3 py-2 text-sm sm:text-base font-medium`}
              >
                About Us
              </Link>
              <Link
                href="/contactus"
                className={`${
                  isActivePath("/contactus") ? "text-primary" : "text-secondary"
                } hover:text-primary-600 block px-2 sm:px-3 py-2 text-sm sm:text-base font-medium`}
              >
                Contact Us
              </Link>

              {/* Mobile Cart and Sign In/Avatar */}
              <div className="flex items-center justify-between px-2 sm:px-3 py-2">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                    <div className="flex items-center space-x-2">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold">
                        {getInitials()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {userData?.name || userData?.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {userData?.user_type}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-800 text-xs sm:text-sm flex-shrink-0"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="text-white bg-primary-600 hover:bg-primary text-brand px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium shadow-accent"
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
