"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import axios from "axios";
import { AdminRoute } from "../../../components/ProtectedRoute";
import Sidebar from "@/app/admin/components/sidebar";
import {
  Plus,
  Search,
  Filter,
  Download,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getAuthToken } from "@/contexts/auth";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

export default function ProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("diamond");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterAvailability, setFilterAvailability] = useState("all");

  // Checkbox filter states
  const [shapeFilters, setShapeFilters] = useState({});
  const [colorFilters, setColorFilters] = useState({});
  const [cutTypeFilters, setCutTypeFilters] = useState({});
  const [characterFilters, setCharacterFilters] = useState({});
  const [selectedShapes, setSelectedShapes] = useState(new Set());
  const [selectedColors, setSelectedColors] = useState(new Set());
  const [selectedCutTypes, setSelectedCutTypes] = useState(new Set());
  const [selectedCharacters, setSelectedCharacters] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const filterPopupRef = useRef(null);

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

  // Update filter options when data changes
  useEffect(() => {
    if (Object.keys(apiData).length > 0) {
      updateFilterOptions();
    }
  }, [apiData]);

  // Handle click outside to close filter popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterPopupRef.current &&
        !filterPopupRef.current.contains(event.target)
      ) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilters]);

  // Function to update filter options based on current tab data
  const updateFilterOptions = () => {
    const currentProducts = apiData[activeTab] || [];

    if (activeTab === "diamond" || activeTab === "melee") {
      // Use lowercase for grouping but keep original case for display
      const shapeMap = new Map();
      currentProducts.forEach((p) => {
        if (p.shape) {
          const lowerShape = p.shape.toLowerCase();
          if (!shapeMap.has(lowerShape)) {
            shapeMap.set(lowerShape, p.shape); // Store original case for display
          }
        }
      });

      const shapeObj = {};
      const originalShapes = [];
      shapeMap.forEach((originalShape, lowerShape) => {
        shapeObj[originalShape] = true;
        originalShapes.push(originalShape);
      });

      setShapeFilters(shapeObj);
      setSelectedShapes(new Set(originalShapes)); // Select all by default
    } else if (activeTab === "colorstone") {
      // Use lowercase for grouping but keep original case for display
      const colorMap = new Map();
      currentProducts.forEach((p) => {
        if (p.color) {
          const lowerColor = p.color.toLowerCase();
          if (!colorMap.has(lowerColor)) {
            colorMap.set(lowerColor, p.color); // Store original case for display
          }
        }
      });

      const colorObj = {};
      const originalColors = [];
      colorMap.forEach((originalColor, lowerColor) => {
        colorObj[originalColor] = true;
        originalColors.push(originalColor);
      });

      setColorFilters(colorObj);
      setSelectedColors(new Set(originalColors)); // Select all by default
    } else if (activeTab === "cuts") {
      // Use lowercase for grouping but keep original case for display
      const cutTypeMap = new Map();
      currentProducts.forEach((p) => {
        if (p.cutType) {
          const lowerCutType = p.cutType.toLowerCase();
          if (!cutTypeMap.has(lowerCutType)) {
            cutTypeMap.set(lowerCutType, p.cutType); // Store original case for display
          }
        }
      });

      const cutTypeObj = {};
      const originalCutTypes = [];
      cutTypeMap.forEach((originalCutType, lowerCutType) => {
        cutTypeObj[originalCutType] = true;
        originalCutTypes.push(originalCutType);
      });

      setCutTypeFilters(cutTypeObj);
      setSelectedCutTypes(new Set(originalCutTypes)); // Select all by default
    } else if (activeTab === "alphabet") {
      // Use lowercase for grouping but keep original case for display
      const characterMap = new Map();
      currentProducts.forEach((p) => {
        if (p.character) {
          const lowerCharacter = p.character.toLowerCase();
          if (!characterMap.has(lowerCharacter)) {
            characterMap.set(lowerCharacter, p.character); // Store original case for display
          }
        }
      });

      const characterObj = {};
      const originalCharacters = [];
      characterMap.forEach((originalCharacter, lowerCharacter) => {
        characterObj[originalCharacter] = true;
        originalCharacters.push(originalCharacter);
      });

      setCharacterFilters(characterObj);
      setSelectedCharacters(new Set(originalCharacters)); // Select all by default
    }
  };

  // Handle checkbox filter changes
  const handleShapeFilterChange = (shape, checked) => {
    const newSelected = new Set(selectedShapes);
    if (checked) {
      newSelected.add(shape);
    } else {
      newSelected.delete(shape);
    }
    setSelectedShapes(newSelected);
  };

  const handleColorFilterChange = (color, checked) => {
    const newSelected = new Set(selectedColors);
    if (checked) {
      newSelected.add(color);
    } else {
      newSelected.delete(color);
    }
    setSelectedColors(newSelected);
  };

  const handleCutTypeFilterChange = (cutType, checked) => {
    const newSelected = new Set(selectedCutTypes);
    if (checked) {
      newSelected.add(cutType);
    } else {
      newSelected.delete(cutType);
    }
    setSelectedCutTypes(newSelected);
  };

  const handleCharacterFilterChange = (character, checked) => {
    const newSelected = new Set(selectedCharacters);
    if (checked) {
      newSelected.add(character);
    } else {
      newSelected.delete(character);
    }
    setSelectedCharacters(newSelected);
  };

  // Handle select all functionality
  const handleSelectAllShapes = (checked) => {
    if (checked) {
      setSelectedShapes(new Set(Object.keys(shapeFilters)));
    } else {
      setSelectedShapes(new Set());
    }
  };

  const handleSelectAllColors = (checked) => {
    if (checked) {
      setSelectedColors(new Set(Object.keys(colorFilters)));
    } else {
      setSelectedColors(new Set());
    }
  };

  const handleSelectAllCutTypes = (checked) => {
    if (checked) {
      setSelectedCutTypes(new Set(Object.keys(cutTypeFilters)));
    } else {
      setSelectedCutTypes(new Set());
    }
  };

  const handleSelectAllCharacters = (checked) => {
    if (checked) {
      setSelectedCharacters(new Set(Object.keys(characterFilters)));
    } else {
      setSelectedCharacters(new Set());
    }
  };

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

    // Apply checkbox filters based on product type (case-insensitive)
    if (activeTab === "diamond" || activeTab === "melee") {
      if (selectedShapes.size > 0) {
        products = products.filter((product) => {
          if (!product.shape) return false;
          // Check if any selected shape matches (case-insensitive)
          return Array.from(selectedShapes).some(
            (selectedShape) =>
              selectedShape.toLowerCase() === product.shape.toLowerCase()
          );
        });
      }
    } else if (activeTab === "colorstone") {
      if (selectedColors.size > 0) {
        products = products.filter((product) => {
          if (!product.color) return false;
          // Check if any selected color matches (case-insensitive)
          return Array.from(selectedColors).some(
            (selectedColor) =>
              selectedColor.toLowerCase() === product.color.toLowerCase()
          );
        });
      }
    } else if (activeTab === "cuts") {
      if (selectedCutTypes.size > 0) {
        products = products.filter((product) => {
          if (!product.cutType) return false;
          // Check if any selected cut type matches (case-insensitive)
          return Array.from(selectedCutTypes).some(
            (selectedCutType) =>
              selectedCutType.toLowerCase() === product.cutType.toLowerCase()
          );
        });
      }
    } else if (activeTab === "alphabet") {
      if (selectedCharacters.size > 0) {
        products = products.filter((product) => {
          if (!product.character) return false;
          // Check if any selected character matches (case-insensitive)
          return Array.from(selectedCharacters).some(
            (selectedCharacter) =>
              selectedCharacter.toLowerCase() ===
              product.character.toLowerCase()
          );
        });
      }
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
  }, [
    currentProducts,
    searchTerm,
    filterAvailability,
    sortBy,
    sortOrder,
    activeTab,
    selectedShapes,
    selectedColors,
    selectedCutTypes,
    selectedCharacters,
  ]);

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
    // Update filter options for the new tab
    setTimeout(() => {
      updateFilterOptions();
    }, 100);
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

  // Export to Excel function with variants
  const handleExportToExcel = () => {
    try {
      if (filteredProducts.length === 0) {
        toast.warning("No data to export");
        return;
      }

      // Create a single sheet with all products and their variants
      const allData = [];

      filteredProducts.forEach((product, productIndex) => {
        // If product has variants, create a row for each variant
        if (product.variants && product.variants.length > 0) {
          product.variants.forEach((variant, variantIndex) => {
            const row = {
              "S.No": allData.length + 1,
              "Product Name": product.name || "",
              SKU: product.sku || "",
              Description: product.description || "",
              Availability: product.availability ? "Available" : "Unavailable",
            };

            // Add product-specific fields
            switch (activeTab) {
              case "diamond":
              case "melee":
                row["Shape"] = product.shape || "";
                break;
              case "colorstone":
                row["Color"] = product.color || "";
                break;
              case "cuts":
                row["Cut Type"] = product.cutType || "";
                break;
              case "layout":
                row["Price"] = product.layoutPrice || "";
                break;
              case "alphabet":
                row["Character"] = product.character || "";
                break;
            }

            // Add variant fields
            Object.keys(variant).forEach((key) => {
              row[`Variant ${key}`] = variant[key] || "";
            });

            allData.push(row);
          });
        } else {
          // If no variants, create a single row for the product
          const row = {
            "S.No": allData.length + 1,
            "Product Name": product.name || "",
            SKU: product.sku || "",
            Description: product.description || "",
            Availability: product.availability ? "Available" : "Unavailable",
          };

          // Add product-specific fields
          switch (activeTab) {
            case "diamond":
            case "melee":
              row["Shape"] = product.shape || "";
              break;
            case "colorstone":
              row["Color"] = product.color || "";
              break;
            case "cuts":
              row["Cut Type"] = product.cutType || "";
              break;
            case "layout":
              row["Price"] = product.layoutPrice || "";
              break;
            case "alphabet":
              row["Character"] = product.character || "";
              break;
          }

          allData.push(row);
        }
      });

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(allData);

      // Set column widths for better readability
      const colWidths = [
        { wch: 8 }, // S.No
        { wch: 25 }, // Product Name
        { wch: 20 }, // SKU
        { wch: 40 }, // Description
        { wch: 15 }, // Availability
        { wch: 15 }, // Product-specific field
        { wch: 15 }, // Variant fields
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
      ];
      ws["!cols"] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(
        wb,
        ws,
        `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Products`
      );

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `${activeTab}_products_${currentDate}.xlsx`;

      // Write and download the file
      XLSX.writeFile(wb, filename);

      toast.success(
        `${allData.length} ${activeTab} records exported successfully!`
      );
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export products to Excel");
    }
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

                    {/* Advanced Filters Button */}
                    <div className="relative" ref={filterPopupRef}>
                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="cursor-pointer px-4 py-2 gap-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700 transition-colors"
                      >
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                      </button>

                      {/* Filter Popup */}
                      {showFilters && (
                        <div className="absolute top-full right-0 mt-2 w-70 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                          <div className="p-4">
                            <div className="grid grid-cols-1 gap-4">
                              {/* Availability Filters */}
                              <div>
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                  Availability
                                </h3>
                                <div className="space-y-2">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={filterAvailability === "all"}
                                      onChange={(e) =>
                                        setFilterAvailability(
                                          e.target.checked ? "all" : "available"
                                        )
                                      }
                                      className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      All
                                    </span>
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={
                                        filterAvailability === "available"
                                      }
                                      onChange={(e) =>
                                        setFilterAvailability(
                                          e.target.checked ? "available" : "all"
                                        )
                                      }
                                      className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      Available
                                    </span>
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={
                                        filterAvailability === "unavailable"
                                      }
                                      onChange={(e) =>
                                        setFilterAvailability(
                                          e.target.checked
                                            ? "unavailable"
                                            : "all"
                                        )
                                      }
                                      className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <span className="text-sm text-gray-700">
                                      Unavailable
                                    </span>
                                  </label>
                                </div>
                              </div>

                              {/* Shape Filters (for Diamond and Melee) */}
                              {(activeTab === "diamond" ||
                                activeTab === "melee") && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Shapes
                                  </h3>
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedShapes.size ===
                                          Object.keys(shapeFilters).length
                                        }
                                        onChange={(e) =>
                                          handleSelectAllShapes(
                                            e.target.checked
                                          )
                                        }
                                        className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span className="text-sm font-medium text-gray-700">
                                        Select All
                                      </span>
                                    </label>
                                    {Object.keys(shapeFilters).map((shape) => (
                                      <label
                                        key={shape}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedShapes.has(shape)}
                                          onChange={(e) =>
                                            handleShapeFilterChange(
                                              shape,
                                              e.target.checked
                                            )
                                          }
                                          className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          {shape}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Color Filters (for Color Stone) */}
                              {activeTab === "colorstone" && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Colors
                                  </h3>
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedColors.size ===
                                          Object.keys(colorFilters).length
                                        }
                                        onChange={(e) =>
                                          handleSelectAllColors(
                                            e.target.checked
                                          )
                                        }
                                        className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span className="text-sm font-medium text-gray-700">
                                        Select All
                                      </span>
                                    </label>
                                    {Object.keys(colorFilters).map((color) => (
                                      <label
                                        key={color}
                                        className="flex items-center"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedColors.has(color)}
                                          onChange={(e) =>
                                            handleColorFilterChange(
                                              color,
                                              e.target.checked
                                            )
                                          }
                                          className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-gray-700">
                                          {color}
                                        </span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Cut Type Filters (for Cuts) */}
                              {activeTab === "cuts" && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Cut Types
                                  </h3>
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedCutTypes.size ===
                                          Object.keys(cutTypeFilters).length
                                        }
                                        onChange={(e) =>
                                          handleSelectAllCutTypes(
                                            e.target.checked
                                          )
                                        }
                                        className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span className="text-sm font-medium text-gray-700">
                                        Select All
                                      </span>
                                    </label>
                                    {Object.keys(cutTypeFilters).map(
                                      (cutType) => (
                                        <label
                                          key={cutType}
                                          className="flex items-center"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={selectedCutTypes.has(
                                              cutType
                                            )}
                                            onChange={(e) =>
                                              handleCutTypeFilterChange(
                                                cutType,
                                                e.target.checked
                                              )
                                            }
                                            className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                          />
                                          <span className="text-sm text-gray-700">
                                            {cutType}
                                          </span>
                                        </label>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Character Filters (for Alphabet) */}
                              {activeTab === "alphabet" && (
                                <div>
                                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    Characters
                                  </h3>
                                  <div className="space-y-2 max-h-32 overflow-y-auto">
                                    <label className="flex items-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedCharacters.size ===
                                          Object.keys(characterFilters).length
                                        }
                                        onChange={(e) =>
                                          handleSelectAllCharacters(
                                            e.target.checked
                                          )
                                        }
                                        className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                      />
                                      <span className="text-sm font-medium text-gray-700">
                                        Select All
                                      </span>
                                    </label>
                                    {Object.keys(characterFilters).map(
                                      (character) => (
                                        <label
                                          key={character}
                                          className="flex items-center"
                                        >
                                          <input
                                            type="checkbox"
                                            checked={selectedCharacters.has(
                                              character
                                            )}
                                            onChange={(e) =>
                                              handleCharacterFilterChange(
                                                character,
                                                e.target.checked
                                              )
                                            }
                                            className="cursor-pointer mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                          />
                                          <span className="text-sm text-gray-700">
                                            {character}
                                          </span>
                                        </label>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Export to Excel Button */}
                    <button
                      onClick={handleExportToExcel}
                      disabled={filteredProducts.length === 0}
                      className="cursor-pointer px-4 py-2 gap-2 bg-green-600 text-white rounded-lg flex items-center hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export to Excel</span>
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
