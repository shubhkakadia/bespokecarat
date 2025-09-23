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
  Grid3X3,
  Grid2X2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CustomerRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function ProductSearchPage({ params }) {
  const { type } = use(params);
  const router = useRouter();
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000 });
  const [showFilters, setShowFilters] = useState(false);
  const [searchMaxPrice, setSearchMaxPrice] = useState(100000);
  const [apiError, setApiError] = useState(null);
  const [mobileGridView, setMobileGridView] = useState(2); // 1 or 2 products per row on mobile
  const [allProducts, setAllProducts] = useState([]); // Cache all products
  const hasSetInitialPriceRange = useRef(false);

  // Melee-specific filter states
  const [selectedColorRanges, setSelectedColorRanges] = useState([]);
  const [selectedClarityRanges, setSelectedClarityRanges] = useState([]);
  const [selectedSieveSizes, setSelectedSieveSizes] = useState([]);
  const [meleeFilterOptions, setMeleeFilterOptions] = useState({
    colorRanges: [],
    clarityRanges: [],
    sieveSizes: [],
  });

  const productsPerPage = 24;

  // Define which types should use API 1 (collection API)
  const collectionTypes = [
    "diamond",
    "melee",
    "colorstone",
    "alphabet",
    "cuts",
    "layout",
  ];

  // Map collection types to API collection parameter for API 1
  const getCollectionType = (type) => {
    const typeMap = {
      diamond: "diamonds",
      melee: "melees",
      colorstone: "colorstones",
      alphabet: "alphabets",
      cuts: "cuts",
      layout: "layouts",
    };
    return typeMap[type] || type;
  };

  // Check if type should use API 1 (collection API) or API 2 (search API)
  const shouldUseCollectionAPI = (type) => {
    return collectionTypes.includes(type);
  };

  // Fetch products from API
  const fetchProducts = async (type) => {
    try {
      setLoading(true);
      setApiError(null);

      const authToken = getToken();
      if (!authToken) {
        throw new Error("Authentication required");
      }

      // Use API 1 (collection API) for specific collection types
      if (shouldUseCollectionAPI(type)) {
        const collectionType = getCollectionType(type);
        const response = await fetch(
          `/api/client/product/collection?c=${collectionType}`,
          {
            method: "GET",
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (data.status && data.data?.products) {
          return data.data.products;
        }
        return [];
      } else {
        // Use API 2 (search API) for all other types
        const response = await fetch(
          `/api/client/product/search?q=${type.replaceAll("cut", "")}`,
          {
            method: "GET",
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        if (data.status && data.data) {
          // Search API returns data as direct array
          return Array.isArray(data.data) ? data.data : [];
        }
        return [];
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setApiError(error.message);
      return [];
    } finally {
      setLoading(false);
    }
  };

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
          const dateA = new Date(a.createdAt || "2023-01-01");
          const dateB = new Date(b.createdAt || "2023-01-01");
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

  // Fetch products only when type changes (single API call per type)
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const products = await fetchProducts(type);
      setAllProducts(products);

      // Set initial price range based on available products (only once per type)
      if (
        !hasSetInitialPriceRange.current ||
        hasSetInitialPriceRange.current !== type
      ) {
        const availablePriceRange = getPriceRange(products);
        if (
          !isNaN(availablePriceRange.min) &&
          !isNaN(availablePriceRange.max)
        ) {
          setPriceRange(availablePriceRange);
          hasSetInitialPriceRange.current = type; // Mark this type as initialized
        }
      }

      // Clear melee filters when not on melee page
      if (type !== "melee") {
        setSelectedColorRanges([]);
        setSelectedClarityRanges([]);
        setSelectedSieveSizes([]);
        setMeleeFilterOptions({
          colorRanges: [],
          clarityRanges: [],
          sieveSizes: [],
        });
      } else {
        // Extract melee filter options if applicable
        const options = getMeleeFilterOptions(products);
        setMeleeFilterOptions(options);
      }

      setLoading(false);
    };

    loadProducts();
  }, [type]);

  // Apply filters and sorting to cached products (no API calls)
  useEffect(() => {
    if (allProducts.length === 0) return;

    // Filter products based on search query
    let filteredProducts = allProducts;
    if (searchQuery.trim()) {
      filteredProducts = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.shape?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by price range
    filteredProducts = filterByPrice(
      filteredProducts,
      priceRange.min,
      priceRange.max
    );

    // Apply melee-specific filters if applicable
    if (type === "melee") {
      filteredProducts = filterMeleeProducts(
        filteredProducts,
        selectedColorRanges,
        selectedClarityRanges,
        selectedSieveSizes
      );
    }

    // Sort products
    filteredProducts = sortProducts(filteredProducts, sortBy);

    setFilteredProducts(filteredProducts);
    setCurrentPage(1); // Reset to first page when filtering
  }, [
    allProducts,
    searchQuery,
    sortBy,
    priceRange,
    selectedColorRanges,
    selectedClarityRanges,
    selectedSieveSizes,
    type,
  ]);

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

  // Get product price based on product type
  const getProductPrice = (product) => {
    // For layout products, use the direct price field
    if (product.price !== undefined) {
      return parseFloat(product.price) || 0;
    }

    // For melee products, find the lowest price from sieve_sizes
    if (product.sieve_sizes && product.sieve_sizes.length > 0) {
      const prices = product.sieve_sizes
        .map((sieve) => parseFloat(sieve.price_per_carat))
        .filter((price) => !isNaN(price) && price > 0);
      return prices.length > 0 ? Math.min(...prices) : 0;
    }

    // For diamond products, use variants (existing logic)
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map((variant) => variant.price)
        .filter(
          (price) => typeof price === "number" && !isNaN(price) && price > 0
        );
      return prices.length > 0 ? Math.min(...prices) : 0;
    }

    return 0;
  };

  // Get product image from API response
  const getProductImage = (product) => {
    if (product.medias && product.medias.length > 0) {
      const imageMedia = product.medias.find(
        (media) => media.file_type === "image"
      );
      return imageMedia ? imageMedia.filelink : "/placeholder.jpg";
    }
    return "/placeholder.jpg";
  };

  // Extract unique filter options from melee products
  const getMeleeFilterOptions = (products) => {
    const colorRanges = new Set();
    const clarityRanges = new Set();
    const sieveSizes = new Set();

    products.forEach((product) => {
      if (product.sieve_sizes && product.sieve_sizes.length > 0) {
        product.sieve_sizes.forEach((sieve) => {
          if (sieve.color_range) colorRanges.add(sieve.color_range);
          if (sieve.clarity_range) clarityRanges.add(sieve.clarity_range);
          if (sieve.size) sieveSizes.add(sieve.size);
        });
      }
    });

    return {
      colorRanges: Array.from(colorRanges).sort(),
      clarityRanges: Array.from(clarityRanges).sort(),
      sieveSizes: Array.from(sieveSizes).sort(),
    };
  };

  // Filter melee products based on selected melee filters
  const filterMeleeProducts = (
    products,
    colorRanges,
    clarityRanges,
    sieveSizes
  ) => {
    if (
      type !== "melee" ||
      (colorRanges.length === 0 &&
        clarityRanges.length === 0 &&
        sieveSizes.length === 0)
    ) {
      return products;
    }

    return products.filter((product) => {
      if (!product.sieve_sizes || product.sieve_sizes.length === 0) {
        return false;
      }

      return product.sieve_sizes.some((sieve) => {
        const colorMatch =
          colorRanges.length === 0 || colorRanges.includes(sieve.color_range);
        const clarityMatch =
          clarityRanges.length === 0 ||
          clarityRanges.includes(sieve.clarity_range);
        const sizeMatch =
          sieveSizes.length === 0 || sieveSizes.includes(sieve.size);

        return colorMatch && clarityMatch && sizeMatch;
      });
    });
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
    <CustomerRoute>
      <div className="min-h-screen bg-whitesmoke">
        <Navbar />

        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary-700 to-primary-500 text-white py-8 sm:py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 capitalize">
                {type} Collection
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
                {getTypeDescription(type)}
              </p>
            </div>
          </div>
        </div>

        {/* Collection Type Navigation */}
        <div className="bg-white border-b border-neutral shadow-sm">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:gap-4">
              <Link
                href="/collections/diamond"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  type === "diamond"
                    ? "bg-primary-600 text-white"
                    : "text-secondary hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Diamonds
              </Link>
              <Link
                href="/collections/melee"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  type === "melee"
                    ? "bg-primary-600 text-white"
                    : "text-secondary hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Melee
              </Link>
              <Link
                href="/collections/colorstone"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  type === "colorstone"
                    ? "bg-primary-600 text-white"
                    : "text-secondary hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Color Stones
              </Link>
              <Link
                href="/collections/alphabet"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  type === "alphabet"
                    ? "bg-primary-600 text-white"
                    : "text-secondary hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Alphabet
              </Link>
              <Link
                href="/collections/cuts"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                  type === "cuts"
                    ? "bg-primary-600 text-white"
                    : "text-secondary hover:text-primary-600 hover:bg-primary-50"
                }`}
              >
                Cuts
              </Link>
              <Link
                href="/collections/layout"
                className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
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
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <span className="text-sm sm:text-base text-secondary">
                {filteredProducts.length} products found
              </span>

              {/* Sort By Dropdown */}
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-neutral rounded-lg px-3 sm:px-4 py-2 pr-8 sm:pr-10 text-xs sm:text-sm font-medium text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 cursor-pointer w-full"
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
                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-secondary pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Left Sidebar - Filters */}
            <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
              <div className="sticky top-8">
                <div className="bg-white rounded-lg border border-neutral p-4 xl:p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 xl:mb-6">
                    <Filter className="h-4 w-4 xl:h-5 xl:w-5 text-text-dark" />
                    <h3 className="text-base xl:text-lg font-semibold text-text-dark">
                      Filters
                    </h3>
                  </div>

                  {/* Price Range Filter */}
                  <div className="space-y-4 xl:space-y-6">
                    <div>
                      <h4 className="text-xs xl:text-sm font-semibold text-text-dark mb-3 xl:mb-4">
                        Price Range
                      </h4>
                      <div className="space-y-3 xl:space-y-4">
                        <div className="flex items-center gap-2 xl:gap-4">
                          <div className="flex items-center gap-1 xl:gap-2">
                            <span className="text-xs xl:text-sm text-secondary">
                              Min:
                            </span>
                            <input
                              type="number"
                              value={isNaN(priceRange.min) ? 0 : priceRange.min}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;

                                setPriceRange((prev) => ({
                                  ...prev,
                                  min: value,
                                }));
                              }}
                              className="w-20 xl:w-24 px-2 py-1 text-xs xl:text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>
                          <div className="flex items-center gap-1 xl:gap-2">
                            <span className="text-xs xl:text-sm text-secondary">
                              Max:
                            </span>
                            <input
                              type="number"
                              value={
                                isNaN(priceRange.max) ? 50000 : priceRange.max
                              }
                              onChange={(e) => {
                                const value =
                                  parseInt(e.target.value) || 100000;

                                setPriceRange((prev) => ({
                                  ...prev,
                                  max: value,
                                }));
                              }}
                              className="w-20 xl:w-24 px-2 py-1 text-xs xl:text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                            />
                          </div>
                        </div>
                        {priceRange.min > priceRange.max ? (
                          <p className="text-xs xl:text-sm text-red-400 text-center">
                            Min value can not be greater than Max value
                          </p>
                        ) : priceRange.max < priceRange.min ? (
                          <p className="text-xs xl:text-sm text-red-400 text-center">
                            Max value can not be less than Min value
                          </p>
                        ) : null}

                        <div className="text-xs xl:text-sm text-secondary text-center">
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

                    {/* Melee-specific filters */}
                    {type === "melee" && (
                      <>
                        {/* Reset Melee Filters Button */}
                        {(selectedColorRanges.length > 0 ||
                          selectedClarityRanges.length > 0 ||
                          selectedSieveSizes.length > 0) && (
                          <div className="mb-4 xl:mb-6">
                            <button
                              onClick={() => {
                                setSelectedColorRanges([]);
                                setSelectedClarityRanges([]);
                                setSelectedSieveSizes([]);
                              }}
                              className="cursor-pointer w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg text-xs xl:text-sm font-medium transition-colors border border-gray-300 flex items-center justify-center gap-2"
                            >
                              Reset Melee Filters
                              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                                {selectedColorRanges.length +
                                  selectedClarityRanges.length +
                                  selectedSieveSizes.length}
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Color Range Filter */}
                        <div>
                          <h4 className="text-xs xl:text-sm font-semibold text-text-dark mb-3 xl:mb-4">
                            Color Range
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {meleeFilterOptions.colorRanges.map(
                              (colorRange) => {
                                const isSelected =
                                  selectedColorRanges.includes(colorRange);
                                return (
                                  <button
                                    key={colorRange}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedColorRanges(
                                          selectedColorRanges.filter(
                                            (c) => c !== colorRange
                                          )
                                        );
                                      } else {
                                        setSelectedColorRanges([
                                          ...selectedColorRanges,
                                          colorRange,
                                        ]);
                                      }
                                    }}
                                    className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                      isSelected
                                        ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                        : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                    }`}
                                  >
                                    {colorRange}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Clarity Range Filter */}
                        <div>
                          <h4 className="text-xs xl:text-sm font-semibold text-text-dark mb-3 xl:mb-4">
                            Clarity Range
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {meleeFilterOptions.clarityRanges.map(
                              (clarityRange) => {
                                const isSelected =
                                  selectedClarityRanges.includes(clarityRange);
                                return (
                                  <button
                                    key={clarityRange}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedClarityRanges(
                                          selectedClarityRanges.filter(
                                            (c) => c !== clarityRange
                                          )
                                        );
                                      } else {
                                        setSelectedClarityRanges([
                                          ...selectedClarityRanges,
                                          clarityRange,
                                        ]);
                                      }
                                    }}
                                    className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                      isSelected
                                        ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                        : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                    }`}
                                  >
                                    {clarityRange}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Sieve Size Filter */}
                        <div>
                          <h4 className="text-xs xl:text-sm font-semibold text-text-dark mb-3 xl:mb-4">
                            Sieve Size
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {meleeFilterOptions.sieveSizes.map((sieveSize) => {
                              const isSelected =
                                selectedSieveSizes.includes(sieveSize);
                              return (
                                <button
                                  key={sieveSize}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedSieveSizes(
                                        selectedSieveSizes.filter(
                                          (s) => s !== sieveSize
                                        )
                                      );
                                    } else {
                                      setSelectedSieveSizes([
                                        ...selectedSieveSizes,
                                        sieveSize,
                                      ]);
                                    }
                                  }}
                                  className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                    isSelected
                                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                      : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                  }`}
                                >
                                  {sieveSize}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filter and Grid View Controls */}
            <div className="lg:hidden w-full mb-4 sm:mb-6">
              <div className="flex gap-2 sm:gap-3">
                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white border border-neutral rounded-lg text-xs sm:text-sm font-medium text-text-dark hover:bg-surface-200 transition-colors cursor-pointer flex-1"
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  Filters
                </button>

                {/* Grid View Toggle Buttons */}
                <div className="flex bg-white border border-neutral rounded-lg overflow-hidden">
                  <button
                    onClick={() => setMobileGridView(1)}
                    className={`flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                      mobileGridView === 1
                        ? "bg-primary-600 text-white"
                        : "text-text-dark hover:bg-surface-200"
                    }`}
                  >
                    <Grid2X2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={() => setMobileGridView(2)}
                    className={`flex items-center justify-center px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-colors ${
                      mobileGridView === 2
                        ? "bg-primary-600 text-white"
                        : "text-text-dark hover:bg-surface-200"
                    }`}
                  >
                    <Grid3X3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>

              {/* Mobile Filter Panel */}
              {showFilters && (
                <div className="mt-3 sm:mt-4 bg-white rounded-lg border border-neutral p-4 sm:p-6 shadow-sm">
                  <h3 className="text-base sm:text-lg font-semibold text-text-dark mb-3 sm:mb-4">
                    Filters
                  </h3>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-text-dark mb-3 sm:mb-4">
                      Price Range
                    </h4>
                    <div className="space-y-3 sm:space-y-4">
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

                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm text-secondary">
                            Min:
                          </span>
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
                            className="w-20 sm:w-24 px-2 py-1 text-xs sm:text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-xs sm:text-sm text-secondary">
                            Max:
                          </span>
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
                            className="w-20 sm:w-24 px-2 py-1 text-xs sm:text-sm border border-neutral rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div className="text-xs sm:text-sm text-secondary text-center">
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

                    {/* Melee-specific filters for mobile */}
                    {type === "melee" && (
                      <>
                        {/* Reset Melee Filters Button */}
                        {(selectedColorRanges.length > 0 ||
                          selectedClarityRanges.length > 0 ||
                          selectedSieveSizes.length > 0) && (
                          <div className="mt-4 pt-4 border-t border-neutral">
                            <button
                              onClick={() => {
                                setSelectedColorRanges([]);
                                setSelectedClarityRanges([]);
                                setSelectedSieveSizes([]);
                              }}
                              className="w-full px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 rounded-lg text-xs sm:text-sm font-medium transition-colors border border-gray-300 flex items-center justify-center gap-2"
                            >
                              Reset Melee Filters
                              <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">
                                {selectedColorRanges.length +
                                  selectedClarityRanges.length +
                                  selectedSieveSizes.length}
                              </span>
                            </button>
                          </div>
                        )}

                        {/* Color Range Filter */}
                        <div className="mt-4 pt-4 border-t border-neutral">
                          <h4 className="text-xs sm:text-sm font-semibold text-text-dark mb-3 sm:mb-4">
                            Color Range
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {meleeFilterOptions.colorRanges.map(
                              (colorRange) => {
                                const isSelected =
                                  selectedColorRanges.includes(colorRange);
                                return (
                                  <button
                                    key={colorRange}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedColorRanges(
                                          selectedColorRanges.filter(
                                            (c) => c !== colorRange
                                          )
                                        );
                                      } else {
                                        setSelectedColorRanges([
                                          ...selectedColorRanges,
                                          colorRange,
                                        ]);
                                      }
                                    }}
                                    className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                      isSelected
                                        ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                        : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                    }`}
                                  >
                                    {colorRange}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Clarity Range Filter */}
                        <div className="mt-4 pt-4 border-t border-neutral">
                          <h4 className="text-xs sm:text-sm font-semibold text-text-dark mb-3 sm:mb-4">
                            Clarity Range
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {meleeFilterOptions.clarityRanges.map(
                              (clarityRange) => {
                                const isSelected =
                                  selectedClarityRanges.includes(clarityRange);
                                return (
                                  <button
                                    key={clarityRange}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedClarityRanges(
                                          selectedClarityRanges.filter(
                                            (c) => c !== clarityRange
                                          )
                                        );
                                      } else {
                                        setSelectedClarityRanges([
                                          ...selectedClarityRanges,
                                          clarityRange,
                                        ]);
                                      }
                                    }}
                                    className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                      isSelected
                                        ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                        : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                    }`}
                                  >
                                    {clarityRange}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </div>

                        {/* Sieve Size Filter */}
                        <div className="mt-4 pt-4 border-t border-neutral">
                          <h4 className="text-xs sm:text-sm font-semibold text-text-dark mb-3 sm:mb-4">
                            Sieve Size
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {meleeFilterOptions.sieveSizes.map((sieveSize) => {
                              const isSelected =
                                selectedSieveSizes.includes(sieveSize);
                              return (
                                <button
                                  key={sieveSize}
                                  onClick={() => {
                                    if (isSelected) {
                                      setSelectedSieveSizes(
                                        selectedSieveSizes.filter(
                                          (s) => s !== sieveSize
                                        )
                                      );
                                    } else {
                                      setSelectedSieveSizes([
                                        ...selectedSieveSizes,
                                        sieveSize,
                                      ]);
                                    }
                                  }}
                                  className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                    isSelected
                                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                      : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                  }`}
                                >
                                  {sieveSize}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Content - Products */}
            <div className="flex-1">
              {loading ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-b-2 border-primary-600 mx-auto mb-3 sm:mb-4"></div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-text-dark mb-2">
                    Loading products...
                  </h3>
                  <p className="text-sm sm:text-base text-secondary">
                    Please wait while we fetch the latest collection
                  </p>
                </div>
              ) : apiError ? (
                <div className="text-center py-12 sm:py-16 lg:py-20">
                  <div className="text-4xl sm:text-5xl lg:text-6xl mb-3 sm:mb-4">
                    ⚠️
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-text-dark mb-2">
                    Error loading products
                  </h3>
                  <p className="text-sm sm:text-base text-secondary mb-3 sm:mb-4">
                    {apiError}
                  </p>
                  <button
                    onClick={async () => {
                      setLoading(true);
                      setApiError(null);
                      const products = await fetchProducts(type);
                      setAllProducts(products);
                      setLoading(false);
                    }}
                    className="px-3 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                  >
                    Try Again
                  </button>
                </div>
              ) : currentProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 sm:py-20 lg:py-24 px-3 sm:px-4">
                  {/* Main Message */}
                  <div className="text-center max-w-2xl">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                      No {type} products found
                    </h2>
                    <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                      We couldn't find any products matching your search
                      criteria. Don't worry, we have plenty of other beautiful
                      pieces waiting for you.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setPriceRange({ min: 0, max: 100000 });
                          setSortBy("relevance");
                          // Clear melee filters if applicable
                          if (type === "melee") {
                            setSelectedColorRanges([]);
                            setSelectedClarityRanges([]);
                            setSelectedSieveSizes([]);
                          }
                        }}
                        className="px-6 sm:px-8 py-2 sm:py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                      >
                        Clear Filters
                      </button>
                      <Link
                        href="/collections/diamond"
                        className="px-6 sm:px-8 py-2 sm:py-3 border-2 border-primary-600 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200 text-sm sm:text-base"
                      >
                        Browse Diamonds
                      </Link>
                    </div>

                    {/* Collection Links */}
                    <div className="border-t border-gray-200 pt-4 sm:pt-6">
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                        Or explore our collections:
                      </p>
                      <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                        <Link
                          href="/collections/melee"
                          className="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          Melee
                        </Link>
                        <Link
                          href="/collections/colorstone"
                          className="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          Color Stones
                        </Link>
                        <Link
                          href="/collections/layout"
                          className="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          Layouts
                        </Link>
                        <Link
                          href="/collections/alphabet"
                          className="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          Alphabets
                        </Link>

                        <Link
                          href="/collections/cuts"
                          className="px-3 sm:px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:border-primary-300 hover:text-primary-600 transition-all duration-200 text-xs sm:text-sm font-medium"
                        >
                          Cuts
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {/* Products Grid */}
                  <div
                    className={`grid gap-4 sm:gap-6 mb-8 sm:mb-12 ${
                      mobileGridView === 1
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    }`}
                  >
                    {currentProducts.map((product) => (
                      <div
                        onClick={() => router.push(`/products/${product.sku}`)}
                        key={`${product.product_type}-${product.id}-${product.sku}`}
                        className="cursor-pointer rounded-lg group bg-white border border-neutral transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
                      >
                        {/* Product Image */}
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Wishlist Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(product.id);
                            }}
                            className={`cursor-pointer absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                              wishlist.has(product.id)
                                ? "bg-red-500 text-white shadow-lg"
                                : "bg-white/80 text-secondary hover:bg-white hover:text-red-500"
                            }`}
                          >
                            <Heart
                              className={`h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 ${
                                wishlist.has(product.id) ? "fill-current" : ""
                              }`}
                            />
                          </button>

                          {/* Cart Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleCart(product.id);
                            }}
                            className={`cursor-pointer absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-200 ${
                              cart.has(product.id)
                                ? "bg-primary-600 text-white shadow-lg"
                                : "bg-white/80 text-secondary hover:bg-white hover:text-primary-600"
                            }`}
                          >
                            <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
                          </button>

                          {/* Availability Badge */}
                          {!product.is_available && (
                            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-red-500 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-[10px] sm:text-xs font-semibold">
                              Out of Stock
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3 sm:p-4">
                          <h3 className="font-semibold text-text-dark mb-1 sm:mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors text-sm sm:text-base">
                            {product.name}
                          </h3>

                          {product.shape && (
                            <p className="text-xs sm:text-sm text-secondary mb-1 sm:mb-2">
                              {product.shape} Cut
                            </p>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="text-sm sm:text-base lg:text-lg font-bold text-primary-600">
                              ${getProductPrice(product).toLocaleString()}
                            </div>

                            {product.certification && (
                              <div className="text-[10px] sm:text-xs text-secondary bg-surface-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
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
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="cursor-pointer p-1.5 sm:p-2 rounded-lg border border-neutral disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-200 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
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
                              className={`cursor-pointer px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg border transition-colors text-sm sm:text-base ${
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
                        className="cursor-pointer p-1.5 sm:p-2 rounded-lg border border-neutral disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-200 transition-colors"
                      >
                        <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
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
    </CustomerRoute>
  );
}
