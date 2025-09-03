"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, use, useRef } from "react";
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Filter,
  ChevronDown,
} from "lucide-react";
import productsData from "../../../../products_dummy2.json";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductSearchPage({ params }) {
  const { type } = use(params);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [showFilters, setShowFilters] = useState(false);
  const [searchMaxPrice, setSearchMaxPrice] = useState(100000);
  const hasSetInitialPriceRange = useRef(false);

  const productsPerPage = 24; 

  // Sort products based on selected option
  const sortProducts = (products, sortOption) => {
    const sortedProducts = [...products];

    switch (sortOption) {
      case "price-low-high":
        return sortedProducts.sort(
          (a, b) => getProductPrice(a) - getProductPrice(b)
        );
      case "price-high-low":
        return sortedProducts.sort(
          (a, b) => getProductPrice(b) - getProductPrice(a)
        );
      case "latest":
        return sortedProducts.sort((a, b) => {
          const dateA = new Date(a.dateAdded || "2023-01-01");
          const dateB = new Date(b.dateAdded || "2023-01-01");
          return dateB - dateA;
        });
      case "best-selling":
        return sortedProducts.sort(
          (a, b) => (b.salesCount || 0) - (a.salesCount || 0)
        );
      case "relevance":
      default:
        return sortedProducts; // Keep original order for relevance
    }
  };

  // Filter products by price range
  const filterByPrice = (products, minPrice, maxPrice) => {
    return products.filter((product) => {
      const price = getProductPrice(product);
      return price >= minPrice && price <= maxPrice;
    });
  };

  // Get min and max prices from all products to set slider bounds
  const getPriceRange = (products) => {
    if (products.length === 0) return { min: 0, max: 50000 };
    const prices = products
      .map(getProductPrice)
      .filter(
        (price) => typeof price === "number" && !isNaN(price) && price > 0
      );

    if (prices.length === 0) return { min: 0, max: 50000 };
    setSearchMaxPrice(Math.max(...prices));
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  };

  // Get products for the current type
  useEffect(() => {
    let products = [];
    if (type === "all") {
      // Show all products from all types
      Object.values(productsData.productTypes || {}).forEach((typeProducts) => {
        products = [...products, ...typeProducts];
      });
    } else if (productsData.productTypes && productsData.productTypes[type]) {
      // Show products from specific type
      products = productsData.productTypes[type];
    } else {
      // If type doesn't exist, show all products from all types
      Object.values(productsData.productTypes || {}).forEach((typeProducts) => {
        products = [...products, ...typeProducts];
      });
    }

    // Set initial price range based on available products (only once)
    if (!hasSetInitialPriceRange.current) {
      const availablePriceRange = getPriceRange(products);
      if (!isNaN(availablePriceRange.min) && !isNaN(availablePriceRange.max)) {
        setPriceRange(availablePriceRange);
        hasSetInitialPriceRange.current = true;
      }
    }

    // Filter products based on search query
    if (searchQuery.trim()) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shape?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    products = filterByPrice(products, priceRange.min, priceRange.max);

    // Sort products
    products = sortProducts(products, sortBy);

    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when filtering
  }, [type, searchQuery, sortBy, priceRange]);

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle wishlist toggle
  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlist);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlist(newWishlist);
  };

  // Handle cart toggle
  const toggleCart = (productId) => {
    const newCart = new Set(cart);
    if (newCart.has(productId)) {
      newCart.delete(productId);
    } else {
      newCart.add(productId);
    }
    setCart(newCart);
  };

  // Get product price (lowest variant price)
  const getProductPrice = (product) => {
    if (product.productType === "layout") {
      return product.layoutPrice;
    }
    if (!product.variants || product.variants.length === 0) return 0;
    const prices = product.variants
      .map((variant) => variant.price)
      .filter(
        (price) => typeof price === "number" && !isNaN(price) && price > 0
      );
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // Product descriptions by type
  const getTypeDescription = (productType) => {
    const descriptions = {
      diamond:
        "Discover our exquisite collection of lab-grown diamonds, each certified for quality and brilliance. Our diamonds are ethically sourced and created using cutting-edge technology to ensure perfect clarity and sparkle.",
      melee:
        "Explore our collection of small melee diamonds, perfect for pavé and halo settings. These precision-cut stones add sparkle and elegance to any jewelry piece.",
      colorstone:
        "Browse our vibrant collection of colored gemstones, featuring sapphires, rubies, and other precious stones. Each stone is carefully selected for its color, clarity, and brilliance.",
      alphabet:
        "Discover our unique alphabet diamond collection, featuring diamonds shaped into letters. Perfect for personalized jewelry pieces that tell your story.",
      cuts: "Explore our diverse collection of diamond cuts, from classic round brilliants to fancy shapes like princess, emerald, and marquise. Each cut is expertly crafted to maximize brilliance and beauty.",
      layout:
        "Discover our innovative jewelry layouts and designs, featuring creative arrangements of stones and metals. From classic solitaires to modern cluster designs, find the perfect layout for your style.",
      all: "Explore our premium collection of fine jewelry, featuring exceptional craftsmanship and the finest materials. Each piece is designed to celebrate life's precious moments.",
      default:
        "Explore our premium collection of fine jewelry, featuring exceptional craftsmanship and the finest materials. Each piece is designed to celebrate life's precious moments.",
    };
    return descriptions[productType] || descriptions.default;
  };

  return (
    <div className="min-h-screen bg-whitesmoke">
      <Navbar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 capitalize">
              {type} Collection
            </h1>
            <p className="text-lg md:text-xl text-primary-100 max-w-3xl mx-auto">
              {getTypeDescription(type)}
            </p>
          </div>
        </div>
      </div>

      {/* Collection Type Navigation */}
      <div className="bg-white border-b border-neutral shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/collections/all"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "all"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              All Products
            </Link>
            <Link
              href="/collections/diamond"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "diamond"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Diamonds
            </Link>
            <Link
              href="/collections/melee"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "melee"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Melee
            </Link>
            <Link
              href="/collections/colorstone"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "colorstone"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Color Stones
            </Link>
            <Link
              href="/collections/alphabet"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "alphabet"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Alphabet
            </Link>
            <Link
              href="/collections/cuts"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "cuts"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Cuts
            </Link>
            <Link
              href="/collections/layout"
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                type === "layout"
                  ? "bg-primary-600 text-white"
                  : "text-secondary hover:text-primary-600 hover:bg-primary-50"
              }`}
            >
              Layout
            </Link>
          </div>
        </div>
      </div>

      {/* Search and Sort Section */}
      <div className="bg-white border-b border-neutral shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-secondary">
              {filteredProducts.length} products found
            </span>

            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-neutral rounded-lg px-4 py-2 pr-10 text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
              >
                <option value="relevance">Sort by: Relevance</option>
                <option value="best-selling">Sort by: Best Selling</option>
                <option value="price-low-high">
                  Sort by: Price Low to High
                </option>
                <option value="price-high-low">
                  Sort by: Price High to Low
                </option>
                <option value="latest">Sort by: Latest</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-8">
          {/* Left Sidebar - Filters */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg border border-neutral p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <Filter className="h-5 w-5 text-text-dark" />
                  <h3 className="text-lg font-semibold text-text-dark">
                    Filters
                  </h3>
                </div>

                {/* Price Range Filter */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold text-text-dark mb-4">
                      Price Range
                    </h4>
                    <div className="space-y-4">
                      {/* Dual Thumb Range Slider */}
                      <div className="relative">
                        <div className="relative h-2 bg-surface-200 rounded-lg">
                          {/* Track highlighting the selected range */}
                          <div
                            className="absolute h-2 bg-primary-600 rounded-lg"
                            style={{
                              left: `${
                                ((isNaN(priceRange.min) ? 0 : priceRange.min) /
                                  100000) *
                                100
                              }%`,
                              right: `${
                                100 -
                                ((isNaN(priceRange.max)
                                  ? 50000
                                  : priceRange.max) /
                                  searchMaxPrice) *
                                  100
                              }%`,
                            }}
                          ></div>

                          {/* Min Range Input */}
                          <input
                            type="range"
                            min={0}
                            max={100000}
                            step={100}
                            value={isNaN(priceRange.min) ? 0 : priceRange.min}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (
                                !isNaN(value) &&
                                value <= priceRange.max &&
                                value >= 0
                              ) {
                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: value,
                                }));
                              }
                            }}
                            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer dual-range-slider"
                            style={{ zIndex: 1 }}
                          />

                          {/* Max Range Input */}
                          <input
                            type="range"
                            min={0}
                            max={searchMaxPrice}
                            step={100}
                            value={
                              isNaN(priceRange.max) ? 50000 : priceRange.max
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (
                                !isNaN(value) &&
                                value >= priceRange.min &&
                                value <= 100000
                              ) {
                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: value,
                                }));
                              }
                            }}
                            className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer dual-range-slider"
                            style={{ zIndex: 2 }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-secondary">Min:</span>
                          <input
                            type="number"
                            min={0}
                            max={isNaN(priceRange.max) ? 50000 : priceRange.max}
                            value={isNaN(priceRange.min) ? 0 : priceRange.min}
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 0;
                              if (
                                !isNaN(value) &&
                                value <= priceRange.max &&
                                value >= 0
                              ) {
                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: value,
                                }));
                              }
                            }}
                            className="w-24 px-2 py-1 text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-secondary">Max:</span>
                          <input
                            type="number"
                            min={isNaN(priceRange.min) ? 0 : priceRange.min}
                            max={100000}
                            value={
                              isNaN(priceRange.max) ? 50000 : priceRange.max
                            }
                            onChange={(e) => {
                              const value = parseInt(e.target.value) || 100000;
                              if (
                                !isNaN(value) &&
                                value >= priceRange.min &&
                                value <= 100000
                              ) {
                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: value,
                                }));
                              }
                            }}
                            className="w-24 px-2 py-1 text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div className="text-sm text-secondary text-center">
                        $
                        {(isNaN(priceRange.min)
                          ? 0
                          : priceRange.min
                        ).toLocaleString()}{" "}
                        - $
                        {(isNaN(priceRange.max)
                          ? 50000
                          : priceRange.max
                        ).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden w-full mb-6">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral rounded-lg text-sm font-medium text-text-dark hover:bg-surface-200 transition-colors cursor-pointer w-full sm:w-auto"
            >
              <Filter className="h-4 w-4" />
              Filters
            </button>

            {/* Mobile Filter Panel */}
            {showFilters && (
              <div className="mt-4 bg-white rounded-lg border border-neutral p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-text-dark mb-4">
                  Filters
                </h3>

                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-semibold text-text-dark mb-4">
                    Price Range
                  </h4>
                  <div className="space-y-4">
                    {/* Dual Thumb Range Slider */}
                    <div className="relative">
                      <div className="relative h-2 bg-surface-200 rounded-lg">
                        {/* Track highlighting the selected range */}
                        <div
                          className="absolute h-2 bg-primary-600 rounded-lg"
                          style={{
                            left: `${
                              ((isNaN(priceRange.min) ? 0 : priceRange.min) /
                                100000) *
                              100
                            }%`,
                            right: `${
                              100 -
                              ((isNaN(priceRange.max)
                                ? 50000
                                : priceRange.max) /
                                100000) *
                                100
                            }%`,
                          }}
                        ></div>

                        {/* Min Range Input */}
                        <input
                          type="range"
                          min={0}
                          max={100000}
                          step={100}
                          value={priceRange.min}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (
                              !isNaN(value) &&
                              value <= priceRange.max &&
                              value >= 0
                            ) {
                              setPriceRange((prev) => ({
                                ...prev,
                                min: value,
                              }));
                            }
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer dual-range-slider"
                          style={{ zIndex: 1 }}
                        />

                        {/* Max Range Input */}
                        <input
                          type="range"
                          min={0}
                          max={100000}
                          step={100}
                          value={priceRange.max}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (
                              !isNaN(value) &&
                              value >= priceRange.min &&
                              value <= 100000
                            ) {
                              setPriceRange((prev) => ({
                                ...prev,
                                max: value,
                              }));
                            }
                          }}
                          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none cursor-pointer dual-range-slider"
                          style={{ zIndex: 2 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary">Min:</span>
                        <input
                          type="number"
                          min={0}
                          max={priceRange.max}
                          value={priceRange.min}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            if (
                              !isNaN(value) &&
                              value <= priceRange.max &&
                              value >= 0
                            ) {
                              setPriceRange((prev) => ({
                                ...prev,
                                min: value,
                              }));
                            }
                          }}
                          className="w-24 px-2 py-1 text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-secondary">Max:</span>
                        <input
                          type="number"
                          min={priceRange.min}
                          max={100000}
                          value={priceRange.max}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 100000;
                            if (
                              !isNaN(value) &&
                              value >= priceRange.min &&
                              value <= 100000
                            ) {
                              setPriceRange((prev) => ({
                                ...prev,
                                max: value,
                              }));
                            }
                          }}
                          className="w-24 px-2 py-1 text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                        />
                      </div>
                    </div>

                    <div className="text-sm text-secondary text-center">
                      $
                      {(isNaN(priceRange.min)
                        ? 0
                        : priceRange.min
                      ).toLocaleString()}{" "}
                      - $
                      {(isNaN(priceRange.max)
                        ? 50000
                        : priceRange.max
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Content - Products */}
          <div className="flex-1 lg:ml-0">
            {currentProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">💎</div>
                <h3 className="text-2xl font-semibold text-text-dark mb-2">
                  No products found
                </h3>
                <p className="text-secondary">
                  Try adjusting your search criteria
                </p>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
                  {currentProducts.map((product) => (
                    <div
                      onClick={() =>
                        router.push(`/products/${product.productId}`)
                      }
                      key={product.productId}
                      className="cursor-pointer rounded-lg group bg-white border-neutral transition-all duration-300 overflow-hidden"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(product.productId);
                          }}
                          className={`cursor-pointer absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                            wishlist.has(product.productId)
                              ? "bg-red-500 text-white shadow-lg"
                              : "bg-white/80 text-secondary hover:bg-white hover:text-red-500"
                          }`}
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              wishlist.has(product.productId)
                                ? "fill-current"
                                : ""
                            }`}
                          />
                        </button>

                        {/* Cart Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCart(product.productId);
                          }}
                          className={`cursor-pointer absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                            cart.has(product.productId)
                              ? "bg-primary-600 text-white shadow-lg"
                              : "bg-white/80 text-secondary hover:bg-white hover:text-primary-600"
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" />
                        </button>

                        {/* Availability Badge */}
                        {!product.availability && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                            Out of Stock
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-text-dark mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                          {product.name}
                        </h3>

                        {product.shape && (
                          <p className="text-sm text-secondary mb-2">
                            {product.shape} Cut
                          </p>
                        )}

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-primary-600">
                            ${getProductPrice(product).toLocaleString()}
                          </div>

                          {product.certification && (
                            <div className="text-xs text-secondary bg-surface-200 px-2 py-1 rounded">
                              {product.certification} Certified
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="cursor-pointer p-2 rounded-lg border border-neutral disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-200 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {Array.from(
                      { length: Math.min(5, totalPages) },
                      (_, index) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = index + 1;
                        } else if (currentPage <= 3) {
                          pageNum = index + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + index;
                        } else {
                          pageNum = currentPage - 2 + index;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`cursor-pointer px-4 py-2 rounded-lg border transition-colors ${
                              currentPage === pageNum
                                ? "bg-primary-600 text-white border-primary-600"
                                : "border-neutral hover:bg-primary-500 hover:text-white"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      }
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="cursor-pointer p-2 rounded-lg border border-neutral disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-200 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
