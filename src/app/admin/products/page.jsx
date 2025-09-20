"use client";

import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { AdminRoute } from "../../../components/ProtectedRoute";
import Sidebar from "@/app/admin/components/sidebar";
import {
  Plus,
  Search,
  Filter,
  Download,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAuthToken } from "@/contexts/auth";
import { toast } from "react-toastify";

export default function ProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("diamond");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterAvailability, setFilterAvailability] = useState("all");

  // API related state
  const [apiData, setApiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API fetch function
  const fetchProductsData = async () => {
    try {
      const authToken = getAuthToken();
      console.log(authToken);
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return null;
      }
      setLoading(true);
      setError(null);

      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `/api/client/homepage`,
        headers: {
          Authorization: authToken,
        },
      };

      const response = await axios.request(config);

      if (response.data.status) {
        // Transform API data to match current component structure
        const transformedData = transformApiData(response.data.data);
        setApiData(transformedData);
      } else {
        setError("Failed to fetch products data");
      }
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message || "Failed to fetch products data");
    } finally {
      setLoading(false);
    }
  };

  // Transform API response to match current component structure
  const transformApiData = (data) => {
    const transformed = {
      diamond: [],
      melee: [],
      colorstone: [],
      cuts: [],
      layout: [],
      alphabet: [],
    };

    // Transform Diamonds
    if (data.Diamonds) {
      transformed.diamond = data.Diamonds.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        shape: item.shape,
        description: item.description,
        availability: item.is_available,
        images:
          item.medias
            ?.filter((m) => m.file_type === "image")
            .map((m) => m.filelink) || [],
        videos:
          item.medias
            ?.filter((m) => m.file_type === "video")
            .map((m) => m.filelink) || [],
        variants: item.variants || [],
      }));
    }

    // Transform Melees
    if (data.Melees) {
      transformed.melee = data.Melees.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        shape: item.shape,
        description: item.description,
        availability: item.is_available,
        images:
          item.medias
            ?.filter((m) => m.file_type === "image")
            .map((m) => m.filelink) || [],
        videos:
          item.medias
            ?.filter((m) => m.file_type === "video")
            .map((m) => m.filelink) || [],
        variants: item.sieve_sizes || [],
      }));
    }

    // Transform Colorstones
    if (data.Colorstones) {
      transformed.colorstone = data.Colorstones.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        color: item.color,
        description: item.description,
        availability: item.is_available,
        images:
          item.medias
            ?.filter((m) => m.file_type === "image")
            .map((m) => m.filelink) || [],
        videos:
          item.medias
            ?.filter((m) => m.file_type === "video")
            .map((m) => m.filelink) || [],
        variants: item.variants || [],
      }));
    }

    // Transform Cuts
    if (data.Cuts) {
      transformed.cuts = data.Cuts.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        shape: item.shape,
        cutType: item.cut_type,
        description: item.description,
        availability: item.is_available,
        images:
          item.medias
            ?.filter((m) => m.file_type === "image")
            .map((m) => m.filelink) || [],
        videos:
          item.medias
            ?.filter((m) => m.file_type === "video")
            .map((m) => m.filelink) || [],
        variants: item.variants || [],
      }));
    }

    // Transform Layouts
    if (data.Layouts) {
      transformed.layout = data.Layouts.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        layoutPrice: item.price,
        description: item.description,
        availability: item.is_available,
        images:
          item.medias
            ?.filter((m) => m.file_type === "image")
            .map((m) => m.filelink) || [],
        videos:
          item.medias
            ?.filter((m) => m.file_type === "video")
            .map((m) => m.filelink) || [],
        variants: item.diamond_details || [],
      }));
    }

    // Transform Alphabets
    if (data.Alphabets) {
      transformed.alphabet = data.Alphabets.map((item) => ({
        productId: item.id,
        name: item.name,
        sku: item.sku,
        character: item.character,
        description: item.description,
        availability: item.is_available,
        images:
          item.medias
            ?.filter((m) => m.file_type === "image")
            .map((m) => m.filelink) || [],
        videos:
          item.medias
            ?.filter((m) => m.file_type === "video")
            .map((m) => m.filelink) || [],
        variants: item.variants || [],
      }));
    }

    return transformed;
  };

  // useEffect to fetch data on component mount
  useEffect(() => {
    fetchProductsData();
  }, []);

  // Get products data for current tab
  const currentProducts = apiData[activeTab] || [];

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let products = [...currentProducts];

    // Apply search filter
    if (searchTerm) {
      products = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.shape &&
            product.shape.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (product.color &&
            product.color.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply availability filter
    if (filterAvailability !== "all") {
      products = products.filter((product) =>
        filterAvailability === "available"
          ? product.availability
          : !product.availability
      );
    }

    // Apply sorting
    products.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return products;
  }, [currentProducts, searchTerm, filterAvailability, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset pagination when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSearchTerm("");
  };

  // Get variant count for a product
  const getVariantCount = (product) => {
    if (activeTab === "diamond") return product.variants?.length || 0;
    if (activeTab === "melee") return product.variants?.length || 0;
    if (activeTab === "colorstone") return product.variants?.length || 0;
    if (activeTab === "cuts") return product.variants?.length || 0;
    if (activeTab === "layout") return product.variants?.length || 0;
    if (activeTab === "alphabet") return product.variants?.length || 0;
    return 0;
  };

  // Export to Excel function (placeholder)
  const handleExportToExcel = () => {
    // In a real implementation, this would generate and download an Excel file
    alert("Export to Excel functionality would be implemented here");
  };

  // Action handlers (placeholders)
  const handleView = (sku) => {
    router.push(`/admin/products/${sku}`);
  };

  const renderTableHeaders = () => {
    const commonHeaders = (
      <>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
          Image
        </th>
        <th
          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
          onClick={() => {
            if (sortBy === "name") {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc");
            } else {
              setSortBy("name");
              setSortOrder("asc");
            }
          }}
        >
          Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
        </th>
      </>
    );

    switch (activeTab) {
      case "diamond":
      case "melee":
        return (
          <tr>
            {commonHeaders}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "shape") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("shape");
                  setSortOrder("asc");
                }
              }}
            >
              Shape {sortBy === "shape" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "sku") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("sku");
                  setSortOrder("asc");
                }
              }}
            >
              SKU {sortBy === "sku" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "availability") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("availability");
                  setSortOrder("asc");
                }
              }}
            >
              Availability{" "}
              {sortBy === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Variants
            </th>
          </tr>
        );
      case "colorstone":
        return (
          <tr>
            {commonHeaders}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "color") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("color");
                  setSortOrder("asc");
                }
              }}
            >
              Color {sortBy === "color" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "sku") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("sku");
                  setSortOrder("asc");
                }
              }}
            >
              SKU {sortBy === "sku" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "availability") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("availability");
                  setSortOrder("asc");
                }
              }}
            >
              Availability{" "}
              {sortBy === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Variants
            </th>
          </tr>
        );
      case "cuts":
        return (
          <tr>
            {commonHeaders}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "cutType") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("cutType");
                  setSortOrder("asc");
                }
              }}
            >
              Cut Type{" "}
              {sortBy === "cutType" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "sku") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("sku");
                  setSortOrder("asc");
                }
              }}
            >
              SKU {sortBy === "sku" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "availability") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("availability");
                  setSortOrder("asc");
                }
              }}
            >
              Availability{" "}
              {sortBy === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Variants
            </th>
          </tr>
        );
      case "layout":
        return (
          <tr>
            {commonHeaders}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => {
                if (sortBy === "layoutPrice") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("layoutPrice");
                  setSortOrder("asc");
                }
              }}
            >
              Price{" "}
              {sortBy === "layoutPrice" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "sku") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("sku");
                  setSortOrder("asc");
                }
              }}
            >
              SKU {sortBy === "sku" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "availability") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("availability");
                  setSortOrder("asc");
                }
              }}
            >
              Availability{" "}
              {sortBy === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Diamonds
            </th>
          </tr>
        );
      case "alphabet":
        return (
          <tr>
            {commonHeaders}
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "character") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("character");
                  setSortOrder("asc");
                }
              }}
            >
              Character{" "}
              {sortBy === "character" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "sku") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("sku");
                  setSortOrder("asc");
                }
              }}
            >
              SKU {sortBy === "sku" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
              onClick={() => {
                if (sortBy === "availability") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("availability");
                  setSortOrder("asc");
                }
              }}
            >
              Availability{" "}
              {sortBy === "availability" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Variants
            </th>
          </tr>
        );

      default:
        return null;
    }
  };

  const renderTableRows = () => {
    return paginatedProducts.map((product) => (
      <tr
        key={product.sku}
        className="bg-white hover:bg-gray-100 cursor-pointer"
        onClick={() => handleView(product.sku)}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
            {product.images && product.images.length > 0 ? (
              <Image
                src={product.images[0]}
                alt={product.name}
                width={50}
                height={50}
                className="h-full w-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="text-gray-400 text-xs">No Image</div>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {product.name}
          </div>
          <div className="text-sm text-gray-500">
            {product.description?.substring(0, 50)}...
          </div>
        </td>
        {(activeTab === "diamond" || activeTab === "melee") && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {product.shape}
          </td>
        )}
        {activeTab === "colorstone" && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {product.color}
          </td>
        )}
        {activeTab === "cuts" && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {product.cutType}
          </td>
        )}
        {activeTab === "layout" && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            ${product.layoutPrice}
          </td>
        )}
        {activeTab === "alphabet" && (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {product.character}
          </td>
        )}
        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
          {product.sku}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              product.availability
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.availability ? "Available" : "Unavailable"}
          </span>
        </td>
        {activeTab === "layout" ? (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {getVariantCount(product)} types
          </td>
        ) : (
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {getVariantCount(product)} variants
          </td>
        )}
      </tr>
    ));
  };

  return (
    <AdminRoute>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 p-4 overflow-auto bg-whitesmoke ">
          <div className="flex flex-col ">
            <div className="flex items-center justify-between mb-4 ">
              <h1 className="text-2xl font-semibold">Products Management</h1>

              <div className="flex gap-3">
                <button
                  onClick={fetchProductsData}
                  disabled={loading}
                  className="cursor-pointer px-4 py-2 gap-2 bg-gray-100 text-gray-700 rounded-lg flex items-center hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
                  />
                  Refresh
                </button>
                <Link
                  href="/admin/products/addproduct"
                  className="cursor-pointer px-4 py-2 gap-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700 transition-colors"
                >
                  <Plus />
                  Add Product
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg">
              {/* Product Type Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => handleTabChange("diamond")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "diamond"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Diamond
                  </button>
                  <button
                    onClick={() => handleTabChange("melee")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "melee"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Melee
                  </button>
                  <button
                    onClick={() => handleTabChange("colorstone")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "colorstone"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Color Stone
                  </button>
                  <button
                    onClick={() => handleTabChange("cuts")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "cuts"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Cuts
                  </button>
                  <button
                    onClick={() => handleTabChange("layout")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "layout"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Layout
                  </button>
                  <button
                    onClick={() => handleTabChange("alphabet")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === "alphabet"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Alphabets
                  </button>
                </nav>
              </div>

              {/* Controls Section */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  {/* Search */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-full"
                    />
                  </div>

                  {/* Right side buttons */}
                  <div className="flex gap-3">
                    {/* Sort By Button */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:bg-gray-50"
                      >
                        <option value="name">Sort by Name</option>
                        <option value="sku">Sort by SKU</option>
                        <option value="availability">
                          Sort by Availability
                        </option>
                        {(activeTab === "diamond" || activeTab === "melee") && (
                          <option value="shape">Sort by Shape</option>
                        )}
                        {activeTab === "colorstone" && (
                          <option value="color">Sort by Color</option>
                        )}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Filters Button */}
                    <div className="relative">
                      <select
                        value={filterAvailability}
                        onChange={(e) => setFilterAvailability(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer hover:bg-gray-50"
                      >
                        <option value="all">Filters</option>
                        <option value="available">Available Only</option>
                        <option value="unavailable">Unavailable Only</option>
                      </select>
                      <Filter className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                    </div>

                    {/* Export Button */}
                    <button
                      onClick={handleExportToExcel}
                      className="cursor-pointer px-4 py-2 gap-2 bg-white border border-gray-300 rounded-lg flex items-center hover:bg-gray-50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Export To Excel</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      <span className="text-gray-600">Loading products...</span>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-red-600 text-center mb-4">
                      <p className="text-lg font-semibold">
                        Error loading products
                      </p>
                      <p className="text-sm">{error}</p>
                    </div>
                    <button
                      onClick={fetchProductsData}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">{renderTableHeaders()}</thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {paginatedProducts.length > 0 ? (
                        renderTableRows()
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            className="px-6 py-12 text-center text-gray-500"
                          >
                            No products found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Pagination */}
              {!loading && !error && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    {/* Left side - Items per page and showing info */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="appearance-none border border-gray-300 rounded-lg px-3 py-1 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white cursor-pointer"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="text-sm text-gray-700">
                        Showing {startIndex + 1}-
                        {Math.min(
                          startIndex + itemsPerPage,
                          filteredProducts.length
                        )}{" "}
                        of {filteredProducts.length}
                      </div>
                    </div>

                    {/* Right side - Pagination controls */}
                    {totalPages > 1 && (
                      <div className="flex items-center gap-1">
                        {/* Previous button */}
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>

                        {/* Page numbers */}
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(10, totalPages) },
                            (_, i) => {
                              let pageNum;
                              if (totalPages <= 10) {
                                pageNum = i + 1;
                              } else if (currentPage <= 5) {
                                pageNum = i + 1;
                              } else if (currentPage >= totalPages - 4) {
                                pageNum = totalPages - 9 + i;
                              } else {
                                pageNum = currentPage - 4 + i;
                              }

                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={`w-8 h-8 text-sm font-medium rounded-lg cursor-pointer ${
                                    currentPage === pageNum
                                      ? "bg-blue-600 text-white"
                                      : "text-gray-700 hover:bg-gray-100"
                                  }`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                          )}

                          {/* Show ellipsis and last pages if needed */}
                          {totalPages > 10 && currentPage < totalPages - 4 && (
                            <>
                              <span className="px-2 text-gray-500">...</span>
                              <button
                                onClick={() => setCurrentPage(totalPages - 1)}
                                className="w-8 h-8 text-sm font-medium rounded text-gray-700 hover:bg-gray-100"
                              >
                                {totalPages - 1}
                              </button>
                              <button
                                onClick={() => setCurrentPage(totalPages)}
                                className="w-8 h-8 text-sm font-medium rounded text-gray-700 hover:bg-gray-100"
                              >
                                {totalPages}
                              </button>
                            </>
                          )}
                        </div>

                        {/* Next button */}
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="cursor-pointer p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
