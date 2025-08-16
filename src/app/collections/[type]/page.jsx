"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, use } from "react";
import {
  Heart,
  ShoppingCart,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import productsData from "../../../../products_dummy2.json";

export default function ProductSearchPage({ params }) {
  const { type } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [wishlist, setWishlist] = useState(new Set());
  const [cart, setCart] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const productsPerPage = 24;

  // Get products for the current type
  useEffect(() => {
    let products = [];
    if (productsData.productTypes && productsData.productTypes[type]) {
      products = productsData.productTypes[type];
    } else {
      // If type doesn't exist, show all products from all types
      Object.values(productsData.productTypes || {}).forEach((typeProducts) => {
        products = [...products, ...typeProducts];
      });
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

    setFilteredProducts(products);
    setCurrentPage(1); // Reset to first page when filtering
  }, [type, searchQuery]);

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
    if (!product.variants || product.variants.length === 0) return 0;
    return Math.min(...product.variants.map((variant) => variant.price));
  };

  // Product descriptions by type
  const getTypeDescription = (productType) => {
    const descriptions = {
      diamond:
        "Discover our exquisite collection of lab-grown diamonds, each certified for quality and brilliance. Our diamonds are ethically sourced and created using cutting-edge technology to ensure perfect clarity and sparkle.",
      ring: "Explore our stunning collection of custom rings, featuring unique designs and premium materials. Each ring is carefully crafted to perfection for your special moments.",
      necklace:
        "Browse our elegant necklace collection, featuring timeless designs that complement any style. From delicate chains to statement pieces.",
      earring:
        "Discover our beautiful earring collection, featuring classic and contemporary designs for every occasion.",
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

      {/* Search and Filter Section */}
      <div className="bg-white border-b border-neutral shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <span className="text-secondary">
              {filteredProducts.length} products found
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {currentProducts.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💎</div>
            <h3 className="text-2xl font-semibold text-text-dark mb-2">
              No products found
            </h3>
            <p className="text-secondary">Try adjusting your search criteria</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {currentProducts.map((product) => (
                <div
                  key={product.productId}
                  className="rounded-lg group bg-white border-neutral transition-all duration-300 overflow-hidden"
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
                      onClick={() => toggleWishlist(product.productId)}
                      className={`cursor-pointer absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                        wishlist.has(product.productId)
                          ? "bg-red-500 text-white shadow-lg"
                          : "bg-white/80 text-secondary hover:bg-white hover:text-red-500"
                      }`}
                    >
                      <Heart
                        className={`h-5 w-5 ${
                          wishlist.has(product.productId) ? "fill-current" : ""
                        }`}
                      />
                    </button>

                    {/* Cart Button */}
                    <button
                      onClick={() => toggleCart(product.productId)}
                      className={`cursor-pointer absolute bottom-3 right-3 p-2 rounded-full transition-all duration-200 ${
                        cart.has(product.productId)
                          ? "bg-primary-600 text-white shadow-lg"
                          : "bg-white/80 text-secondary hover:bg-primary-600 hover:text-white"
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

                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
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
                })}

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

      <Footer />
    </div>
  );
}
