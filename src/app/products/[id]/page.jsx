"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, use, useRef, useMemo } from "react";
import axios from "axios";
import Image from "next/image";
import {
  ShoppingCart,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Mail,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CustomerRoute } from "@/components/ProtectedRoute";
import { getAuthToken } from "@/contexts/auth";
import { toast } from "react-toastify";

export default function ProductPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentMediaList, setCurrentMediaList] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchEndX, setTouchEndX] = useState(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const descriptionContentRef = useRef(null);
  const [descriptionMaxHeight, setDescriptionMaxHeight] = useState(0);
  const carouselRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  // Get 5 random products from recommended products
  const displayRecommendedProducts = useMemo(() => {
    if (recommendedProducts.length === 0) return [];
    if (recommendedProducts.length <= 5) return recommendedProducts;

    // Shuffle and take first 5
    const shuffled = [...recommendedProducts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  }, [recommendedProducts]);

  useEffect(() => {
    const updateHeight = () => {
      if (descriptionContentRef.current) {
        setDescriptionMaxHeight(
          isDescriptionOpen ? descriptionContentRef.current.scrollHeight : 0
        );
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [isDescriptionOpen, product?.description]);

  // Variant selection states
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedClarity, setSelectedClarity] = useState("");
  const [selectedCaratWeight, setSelectedCaratWeight] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedDimension, setSelectedDimension] = useState("");
  const [selectedColorRange, setSelectedColorRange] = useState("");
  const [selectedClarityRange, setSelectedClarityRange] = useState("");

  const [availableVariants, setAvailableVariants] = useState([]);

  useEffect(() => {
    if (product?.medias && Array.isArray(product.medias)) {
      // Create a combined media list from the API response
      // Sort to show images first, then videos
      const sortedMedia = [...product.medias].sort((a, b) => {
        if (a.file_type === "image" && b.file_type === "video") return -1;
        if (a.file_type === "video" && b.file_type === "image") return 1;
        return 0;
      });

      // Keep both filelink and file_type for each media
      const mediaList = sortedMedia.map((media) => ({
        filelink: media.filelink,
        file_type: media.file_type,
      }));

      // Only set currentMediaIndex if we have valid media
      if (mediaList.length > 0 && mediaList[0]?.filelink) {
        setCurrentMediaIndex(0);
      }
      setCurrentMediaList(mediaList);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const productData = await getProductById(id);

      setProduct(productData);

      // After product is known, load similar products from same product type
      if (productData?.product_type) {
        const recommended = await getRecommendedProducts(
          productData.product_type,
          id,
          6
        );
        setRecommendedProducts(recommended || []);
      } else {
        setRecommendedProducts([]);
      }

      // Set initial variant selection based on product type
      if (productData?.variants?.length > 0) {
        setAvailableVariants(productData.variants);
        const firstVariant = productData.variants[0];

        // For diamonds, set color and clarity
        if (productData.product_type === "diamonds") {
          setSelectedColor(firstVariant.color);
          setSelectedClarity(firstVariant.clarity);
          setSelectedCaratWeight(firstVariant.carat_weight);
        }
        // For colorstones, set shape, carat weight, and dimension
        else if (productData.product_type === "colorstones") {
          setSelectedShape(firstVariant.shape);
          setSelectedCaratWeight(firstVariant.carat_weight);
          setSelectedDimension(firstVariant.dimension || "");
        }
        // For cuts and alphabets, set carat weight and dimension
        else if (
          productData.product_type === "cuts" ||
          productData.product_type === "alphabets"
        ) {
          setSelectedCaratWeight(firstVariant.carat_weight);
          setSelectedDimension(firstVariant.dimension || "");
        }
      }

      // Handle melee with sieve_sizes - set initial defaults
      if (
        productData?.sieve_sizes?.length > 0 &&
        productData.product_type === "melees"
      ) {
        // Find the first valid combination instead of setting options independently
        const firstValidSieve = productData.sieve_sizes[0];
        setSelectedColorRange(firstValidSieve.color_range);
        setSelectedClarityRange(firstValidSieve.clarity_range);
        setSelectedCaratWeight(firstValidSieve.size);
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Function to get product data from API
  const getProductById = async (id) => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return null;
      }
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `/api/product-id?sku=${id}`,
        headers: {
          Authorization: authToken,
        },
      };

      const response = await axios.request(config);

      if (
        response.data &&
        response.data.status &&
        response.data.data &&
        response.data.data.product
      ) {
        // Return the complete data structure including product_type
        const apiData = response.data.data;
        const productData = {
          ...apiData.product,
          product_type: apiData.product_type,
        };

        return productData;
      }

      return null;
    } catch (error) {
      console.error("Error loading product:", error);
      return null;
    }
  };

  // Function to get recommended products
  const getRecommendedProducts = async (
    productType,
    currentProductId,
    limit = 5
  ) => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return null;
      }
      // Normalize collection key to allowed values
      const typeMap = {
        diamond: "diamonds",
        diamonds: "diamonds",
        melee: "melees",
        melees: "melees",
        colorstone: "colorstones",
        colorstones: "colorstones",
        alphabet: "alphabets",
        alphabets: "alphabets",
        cut: "cuts",
        cuts: "cuts",
        layout: "layouts",
        layouts: "layouts",
      };
      const collectionType =
        typeMap[String(productType).toLowerCase()] ||
        String(productType).toLowerCase();

      const response = await fetch(
        `/api/client/product/collection?c=${encodeURIComponent(
          collectionType
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        if (response.status === 404) return [];
        return [];
      }
      const json = await response.json();
      const list = json?.data?.products || [];
      const normalized = (Array.isArray(list) ? list : [])
        .filter((p) => p && (p.sku || p.id))
        .filter((p) => (p.sku || p.id) !== currentProductId);
      // Shuffle
      for (let i = normalized.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [normalized[i], normalized[j]] = [normalized[j], normalized[i]];
      }
      return normalized.slice(0, limit);
    } catch (error) {
      if (error?.response?.status === 404) {
        // Endpoint not available; hide section silently
        return [];
      }
      console.error("Error loading recommended products:", error);
      return [];
    }
  };

  // Helper functions for variant management
  const getDistinctColors = () => {
    if (!product?.variants) {
      return [];
    }
    const colors = [...new Set(product.variants.map((v) => v.color))].sort();
    return colors;
  };

  const getDistinctClarities = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.clarity))].sort();
  };

  const getDistinctCaratWeights = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.carat_weight))].sort(
      (a, b) => a - b
    );
  };

  const getDistinctShape = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.shape))].sort(
      (a, b) => a - b
    );
  };

  const getDistinctDimensions = () => {
    if (!product?.variants) return [];
    return [
      ...new Set(product.variants.map((v) => v.dimension).filter(Boolean)),
    ].sort();
  };

  // get distinct colorrange
  const getDistinctColorRange = () => {
    if (product?.product_type === "melees" && product?.sieve_sizes) {
      return [...new Set(product.sieve_sizes.map((s) => s.color_range))].sort();
    }
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.colorRange))].sort();
  };

  // get distinct clarityrange
  const getDistinctClarityRange = () => {
    if (product?.product_type === "melees" && product?.sieve_sizes) {
      return [
        ...new Set(product.sieve_sizes.map((s) => s.clarity_range)),
      ].sort();
    }
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.clarityRange))].sort();
  };

  // get distinct sieve sizes for melee
  const getDistinctSieveSizes = () => {
    if (product?.product_type === "melees" && product?.sieve_sizes) {
      return [...new Set(product.sieve_sizes.map((s) => s.size))].sort();
    }
    return [];
  };

  // Get the currently selected variant
  const getSelectedVariant = () => {
    // For Melees, handle sieve_sizes differently
    if (product?.product_type === "melees") {
      if (
        !product?.sieve_sizes ||
        selectedCaratWeight === null ||
        !selectedColorRange ||
        !selectedClarityRange
      ) {
        return product?.sieve_sizes?.[0] || {};
      }

      const selectedSieve = product.sieve_sizes.find(
        (s) =>
          s.size === selectedCaratWeight &&
          s.color_range === selectedColorRange &&
          s.clarity_range === selectedClarityRange
      );

      return selectedSieve || product.sieve_sizes[0];
    }

    // For Layouts, return the product itself as it has price at product level
    if (product?.product_type === "layouts") {
      return product;
    }

    // For products with variants
    if (!product?.variants || product.variants.length === 0) {
      return {};
    }

    if (product.product_type === "diamonds") {
      // For diamonds, check color, clarity, and carat weight
      if (!selectedColor || !selectedClarity || selectedCaratWeight === null) {
        return product.variants[0];
      }
      const selectedVariant =
        product.variants.find(
          (v) =>
            v.color === selectedColor &&
            v.clarity === selectedClarity &&
            v.carat_weight === selectedCaratWeight
        ) || product.variants[0];
      return selectedVariant;
    } else if (product.product_type === "colorstones") {
      // For color stones, check shape, carat weight, and dimension
      if (!selectedShape || selectedCaratWeight === null) {
        return product.variants[0];
      }
      const selectedVariant =
        product.variants.find(
          (v) =>
            v.shape === selectedShape &&
            v.carat_weight === selectedCaratWeight &&
            (!selectedDimension || v.dimension === selectedDimension)
        ) ||
        product.variants.find(
          (v) =>
            v.shape === selectedShape && v.carat_weight === selectedCaratWeight
        ) ||
        product.variants[0];
      return selectedVariant;
    } else if (
      product.product_type === "cuts" ||
      product.product_type === "alphabets"
    ) {
      // For cuts and alphabets, check carat weight and dimension
      if (selectedCaratWeight === null) {
        return product.variants[0];
      }
      const selectedVariant =
        product.variants.find(
          (v) =>
            v.carat_weight === selectedCaratWeight &&
            (!selectedDimension || v.dimension === selectedDimension)
        ) ||
        product.variants.find((v) => v.carat_weight === selectedCaratWeight) ||
        product.variants[0];
      return selectedVariant;
    }

    return product.variants[0];
  };

  // Check if a combination is available
  const isVariantAvailable = (
    color,
    clarity,
    caratWeight,
    shape = null,
    colorRange = null,
    clarityRange = null
  ) => {
    if (product.product_type === "diamonds") {
      if (!product?.variants) return false;
      return product.variants.some(
        (v) =>
          v.color === color &&
          v.clarity === clarity &&
          v.carat_weight === caratWeight
      );
    } else if (product.product_type === "colorstones") {
      if (!product?.variants) return false;
      // Note: dimension parameter is not passed to isVariantAvailable,
      // so we check shape and carat weight only here
      return product.variants.some(
        (v) => v.shape === shape && v.carat_weight === caratWeight
      );
    } else if (product.product_type === "melees") {
      if (!product?.sieve_sizes) return false;
      return product.sieve_sizes.some(
        (s) =>
          s.color_range === colorRange &&
          s.clarity_range === clarityRange &&
          s.size === caratWeight
      );
    } else if (
      product.product_type === "cuts" ||
      product.product_type === "alphabets"
    ) {
      if (!product?.variants) return false;
      return product.variants.some((v) => v.carat_weight === caratWeight);
    }

    return false;
  };

  // Check if an option should be disabled based on current selections
  const isOptionDisabled = (type, value) => {
    if (product.product_type === "diamonds") {
      if (!product?.variants) return false;
      const currentColor = type === "color" ? value : selectedColor;
      const currentClarity = type === "clarity" ? value : selectedClarity;
      const currentCaratWeight =
        type === "caratWeight" ? value : selectedCaratWeight;

      // If not all selections are made, don't disable
      if (!currentColor || !currentClarity || currentCaratWeight === null) {
        return false;
      }

      return !isVariantAvailable(
        currentColor,
        currentClarity,
        currentCaratWeight
      );
    } else if (product.product_type === "colorstones") {
      if (!product?.variants) return false;
      const currentShape = type === "shape" ? value : selectedShape;
      const currentCaratWeight =
        type === "caratWeight" ? value : selectedCaratWeight;
      const currentDimension = type === "dimension" ? value : selectedDimension;

      // If not all selections are made, don't disable
      if (!currentShape || currentCaratWeight === null) {
        return false;
      }

      // Check if there's a variant with the current combination
      const hasVariant = product.variants.some(
        (v) =>
          v.shape === currentShape &&
          v.carat_weight === currentCaratWeight &&
          (!currentDimension || v.dimension === currentDimension)
      );

      return !hasVariant;
    } else if (product.product_type === "melees") {
      if (!product?.sieve_sizes) return false;
      const currentColorRange =
        type === "colorRange" ? value : selectedColorRange;
      const currentClarityRange =
        type === "clarityRange" ? value : selectedClarityRange;
      const currentSieveSize =
        type === "sieveSize" ? value : selectedCaratWeight;

      // If not all selections are made, don't disable
      if (
        !currentColorRange ||
        !currentClarityRange ||
        currentSieveSize === null
      ) {
        return false;
      }

      return !isVariantAvailable(
        null,
        null,
        currentSieveSize,
        null,
        currentColorRange,
        currentClarityRange
      );
    } else if (
      product.product_type === "cuts" ||
      product.product_type === "alphabets"
    ) {
      if (!product?.variants) return false;
      const currentCaratWeight =
        type === "caratWeight" ? value : selectedCaratWeight;
      const currentDimension = type === "dimension" ? value : selectedDimension;

      // If carat weight is not selected, don't disable
      if (currentCaratWeight === null) {
        return false;
      }

      // Check if there's a variant with the current combination
      const hasVariant = product.variants.some(
        (v) =>
          v.carat_weight === currentCaratWeight &&
          (!currentDimension || v.dimension === currentDimension)
      );

      return !hasVariant;
    }

    return false;
  };

  // Find the first available variant based on a new selection
  const findDefaultVariant = (type, value) => {
    // For melee products, search in sieve_sizes
    if (product?.product_type === "melees" && product?.sieve_sizes) {
      const matchingSieves = product.sieve_sizes.filter((sieve) => {
        switch (type) {
          case "colorRange":
            return sieve.color_range === value;
          case "clarityRange":
            return sieve.clarity_range === value;
          case "sieveSize":
            return sieve.size === value;
          default:
            return false;
        }
      });
      return matchingSieves.length > 0 ? matchingSieves[0] : null;
    }

    // For other products, search in variants
    if (!product?.variants) return null;

    const matchingVariants = product.variants.filter((variant) => {
      switch (type) {
        case "color":
          return variant.color === value;
        case "clarity":
          return variant.clarity === value;
        case "caratWeight":
          return variant.carat_weight === value;
        case "shape":
          return variant.shape === value;
        case "dimension":
          return variant.dimension === value;
        case "colorRange":
          return variant.colorRange === value;
        case "clarityRange":
          return variant.clarityRange === value;
        case "sieveSize":
          return variant.sieveSize === value;
        default:
          return false;
      }
    });

    // Return the first matching variant, or null if none found
    return matchingVariants.length > 0 ? matchingVariants[0] : null;
  };

  // Handle option selection with auto-selection of default combination
  const handleOptionSelect = (type, value) => {
    if (type === "color") {
      setSelectedColor(value);

      // If this selection would result in an unavailable combination, find a default
      const wouldBeUnavailable =
        selectedClarity &&
        selectedCaratWeight !== null &&
        !isVariantAvailable(value, selectedClarity, selectedCaratWeight);

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("color", value);
        if (defaultVariant) {
          setSelectedClarity(defaultVariant.clarity);
          setSelectedCaratWeight(defaultVariant.carat_weight);
        }
      }
    } else if (type === "clarity") {
      setSelectedClarity(value);

      // If this selection would result in an unavailable combination, find a default
      const wouldBeUnavailable =
        selectedColor &&
        selectedCaratWeight !== null &&
        !isVariantAvailable(selectedColor, value, selectedCaratWeight);

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("clarity", value);
        if (defaultVariant) {
          setSelectedColor(defaultVariant.color);
          setSelectedCaratWeight(defaultVariant.carat_weight);
        }
      }
    } else if (type === "caratWeight") {
      setSelectedCaratWeight(value);

      // If this selection would result in an unavailable combination, find a default
      let wouldBeUnavailable = false;

      if (product.product_type === "diamonds") {
        wouldBeUnavailable =
          selectedColor &&
          selectedClarity &&
          !isVariantAvailable(selectedColor, selectedClarity, value);
      } else if (product.product_type === "colorstones") {
        wouldBeUnavailable =
          selectedShape &&
          !isVariantAvailable(null, null, value, selectedShape);
        // Also check dimension if selected
        if (!wouldBeUnavailable && selectedDimension) {
          wouldBeUnavailable = !product.variants.some(
            (v) =>
              v.shape === selectedShape &&
              v.carat_weight === value &&
              v.dimension === selectedDimension
          );
        }
      } else if (product.product_type === "melees") {
        wouldBeUnavailable =
          selectedColorRange &&
          selectedClarityRange &&
          !isVariantAvailable(
            null,
            null,
            value,
            null,
            selectedColorRange,
            selectedClarityRange
          );
      } else if (
        product.product_type === "cuts" ||
        product.product_type === "alphabets"
      ) {
        // Also check dimension if selected
        if (selectedDimension) {
          wouldBeUnavailable = !product.variants.some(
            (v) => v.carat_weight === value && v.dimension === selectedDimension
          );
        }
      }

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("caratWeight", value);
        if (defaultVariant) {
          if (product.product_type === "diamonds") {
            setSelectedColor(defaultVariant.color);
            setSelectedClarity(defaultVariant.clarity);
          } else if (product.product_type === "colorstones") {
            setSelectedShape(defaultVariant.shape);
            if (defaultVariant.dimension) {
              setSelectedDimension(defaultVariant.dimension);
            }
          } else if (product.product_type === "melees") {
            setSelectedColorRange(defaultVariant.color_range);
            setSelectedClarityRange(defaultVariant.clarity_range);
          } else if (
            product.product_type === "cuts" ||
            product.product_type === "alphabets"
          ) {
            if (defaultVariant.dimension) {
              setSelectedDimension(defaultVariant.dimension);
            }
          }
        }
      }
    } else if (type === "shape") {
      setSelectedShape(value);

      // If this selection would result in an unavailable combination, find a default
      const wouldBeUnavailable =
        selectedCaratWeight !== null &&
        !isVariantAvailable(null, null, selectedCaratWeight, value);

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("shape", value);
        if (defaultVariant) {
          setSelectedCaratWeight(defaultVariant.carat_weight);
          if (defaultVariant.dimension) {
            setSelectedDimension(defaultVariant.dimension);
          }
        }
      }
    } else if (type === "dimension") {
      setSelectedDimension(value);

      // If this selection would result in an unavailable combination, find a default
      if (product.product_type === "colorstones") {
        const wouldBeUnavailable =
          selectedShape &&
          selectedCaratWeight !== null &&
          !product.variants.some(
            (v) =>
              v.shape === selectedShape &&
              v.carat_weight === selectedCaratWeight &&
              v.dimension === value
          );

        if (wouldBeUnavailable) {
          const defaultVariant = findDefaultVariant("dimension", value);
          if (defaultVariant) {
            setSelectedShape(defaultVariant.shape);
            setSelectedCaratWeight(defaultVariant.carat_weight);
          }
        }
      } else if (
        product.product_type === "cuts" ||
        product.product_type === "alphabets"
      ) {
        const wouldBeUnavailable =
          selectedCaratWeight !== null &&
          !product.variants.some(
            (v) =>
              v.carat_weight === selectedCaratWeight && v.dimension === value
          );

        if (wouldBeUnavailable) {
          const defaultVariant = findDefaultVariant("dimension", value);
          if (defaultVariant) {
            setSelectedCaratWeight(defaultVariant.carat_weight);
          }
        }
      }
    } else if (type === "colorRange") {
      setSelectedColorRange(value);

      // For melee products, find a compatible sieve size and clarity range
      if (product.product_type === "melees" && product.sieve_sizes) {
        // Find compatible combinations
        const compatibleSieves = product.sieve_sizes.filter(
          (s) => s.color_range === value
        );
        if (compatibleSieves.length > 0) {
          // If current clarity range is not compatible, select the first available one
          const currentlySelected = compatibleSieves.find(
            (s) =>
              s.clarity_range === selectedClarityRange &&
              s.size === selectedCaratWeight
          );

          if (!currentlySelected) {
            const firstCompatible = compatibleSieves[0];
            if (
              !compatibleSieves.some(
                (s) => s.clarity_range === selectedClarityRange
              )
            ) {
              setSelectedClarityRange(firstCompatible.clarity_range);
            }
            if (!compatibleSieves.some((s) => s.size === selectedCaratWeight)) {
              setSelectedCaratWeight(firstCompatible.size);
            }
          }
        }
      }
    } else if (type === "clarityRange") {
      setSelectedClarityRange(value);

      // For melee products, find a compatible sieve size and color range
      if (product.product_type === "melees" && product.sieve_sizes) {
        // Find compatible combinations
        const compatibleSieves = product.sieve_sizes.filter(
          (s) => s.clarity_range === value
        );
        if (compatibleSieves.length > 0) {
          // If current color range is not compatible, select the first available one
          const currentlySelected = compatibleSieves.find(
            (s) =>
              s.color_range === selectedColorRange &&
              s.size === selectedCaratWeight
          );

          if (!currentlySelected) {
            const firstCompatible = compatibleSieves[0];
            if (
              !compatibleSieves.some(
                (s) => s.color_range === selectedColorRange
              )
            ) {
              setSelectedColorRange(firstCompatible.color_range);
            }
            if (!compatibleSieves.some((s) => s.size === selectedCaratWeight)) {
              setSelectedCaratWeight(firstCompatible.size);
            }
          }
        }
      }
    } else if (type === "sieveSize") {
      setSelectedCaratWeight(value);

      // For melee products, find a compatible color range and clarity range
      if (product.product_type === "melees" && product.sieve_sizes) {
        // Find compatible combinations
        const compatibleSieves = product.sieve_sizes.filter(
          (s) => s.size === value
        );
        if (compatibleSieves.length > 0) {
          // If current selections are not compatible, select the first available ones
          const currentlySelected = compatibleSieves.find(
            (s) =>
              s.color_range === selectedColorRange &&
              s.clarity_range === selectedClarityRange
          );

          if (!currentlySelected) {
            const firstCompatible = compatibleSieves[0];
            if (
              !compatibleSieves.some(
                (s) => s.color_range === selectedColorRange
              )
            ) {
              setSelectedColorRange(firstCompatible.color_range);
            }
            if (
              !compatibleSieves.some(
                (s) => s.clarity_range === selectedClarityRange
              )
            ) {
              setSelectedClarityRange(firstCompatible.clarity_range);
            }
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (product?.product_type) {
      // Map product_type (plural) to collection type (singular)
      const typeMap = {
        diamonds: "diamond",
        melees: "melee",
        colorstones: "colorstone",
        alphabets: "alphabet",
        cuts: "cuts",
        layouts: "layout",
      };
      const collectionType = typeMap[product.product_type] || "all";
      router.push(`/collections/${collectionType}`);
    } else {
      // Fallback to all collections if product type is not available
      router.push("/collections/all");
    }
  };

  const handleQuantityChange = (type) => {
    if (type === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log(`Added ${quantity} items to cart`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  // Helper function to determine if a media item is a video
  const isVideo = (mediaUrl) => {
    if (!mediaUrl) return false;
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov", ".avi"];
    return (
      videoExtensions.some((ext) => mediaUrl.toLowerCase().includes(ext)) ||
      mediaUrl.toLowerCase().includes("/videos/")
    );
  };

  const nextMedia = () => {
    const validMedia = currentMediaList.filter((media) => media?.filelink);
    if (validMedia.length > 1) {
      setCurrentMediaIndex((prev) => {
        const nextIndex = (prev + 1) % currentMediaList.length;
        // Ensure the next index has valid media
        return currentMediaList[nextIndex]?.filelink ? nextIndex : prev;
      });
    }
  };

  const prevMedia = () => {
    const validMedia = currentMediaList.filter((media) => media?.filelink);
    if (validMedia.length > 1) {
      setCurrentMediaIndex((prev) => {
        const prevIndex =
          (prev - 1 + currentMediaList.length) % currentMediaList.length;
        // Ensure the previous index has valid media
        return currentMediaList[prevIndex]?.filelink ? prevIndex : prev;
      });
    }
  };

  const handleTouchStart = (e) => {
    if (e.changedTouches && e.changedTouches.length > 0) {
      setTouchStartX(e.changedTouches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (
      e.changedTouches &&
      e.changedTouches.length > 0 &&
      touchStartX !== null
    ) {
      const endX = e.changedTouches[0].clientX;
      setTouchEndX(endX);
      const deltaX = endX - touchStartX;
      if (Math.abs(deltaX) > 30) {
        if (deltaX < 0) {
          nextMedia();
        } else {
          prevMedia();
        }
      }
      setTouchStartX(null);
      setTouchEndX(null);
    }
  };

  // Carousel scroll functions
  const checkScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const cardWidth =
        carouselRef.current.querySelector(".carousel-card")?.offsetWidth || 0;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = cardWidth + gap;

      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Check scroll buttons after a short delay to ensure DOM is rendered
    const timer = setTimeout(() => {
      checkScrollButtons();
    }, 100);

    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }

    return () => {
      clearTimeout(timer);
      if (carousel) {
        carousel.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      }
    };
  }, [displayRecommendedProducts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-whitesmoke">
        <Navbar />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-primary-600"></div>
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-semibold text-text-dark mb-2">
                Loading Product Details...
              </h3>
              <p className="text-sm sm:text-base text-secondary-600">
                Please wait while we fetch the latest information
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100">
        <Navbar />

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-text-dark mb-4">
                Oops!
              </h1>
              <h2 className="text-2xl lg:text-3xl font-semibold text-secondary-700 mb-4">
                Product Not Found
              </h2>
              <p className="text-lg text-secondary-600 max-w-2xl mx-auto leading-relaxed">
                We're sorry, but the product you're looking for doesn't exist or
                may have been removed from our collection.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button
                onClick={() => router.back()}
                className="cursor-pointer w-full sm:w-auto bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Go Back</span>
              </button>

              <Link
                href="/collections/all"
                className="cursor-pointer w-full sm:w-auto bg-white text-primary-600 border-2 border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Browse Products</span>
              </Link>
            </div>

            {/* Help Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-text-dark mb-4">
                Need Help Finding Something?
              </h3>
              <p className="text-secondary-600 mb-6">
                Our team is here to help you find exactly what you're looking
                for.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Search Again */}
                <div className="bg-surface-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg
                      className="w-6 h-6 text-primary-600"
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
                  <h4 className="font-semibold text-text-dark mb-2">
                    Search Again
                  </h4>
                  <p className="text-sm text-secondary-600 mb-3">
                    Try searching with different keywords
                  </p>
                  <Link
                    href="/collections/all"
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                  >
                    Browse All Products →
                  </Link>
                </div>

                {/* Contact Support */}
                <div className="bg-surface-50 rounded-lg p-4 text-center">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="w-6 h-6 text-accent-600" />
                  </div>
                  <h4 className="font-semibold text-text-dark mb-2">
                    Contact Us
                  </h4>
                  <p className="text-sm text-secondary-600 mb-3">
                    Get personalized assistance
                  </p>
                  <a
                    href="mailto:sales@khodalgems.com"
                    className="text-accent-600 hover:text-accent-700 font-medium text-sm"
                  >
                    Email Support →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const getWhatsAppMessage = () => {
    const message =
      product?.name?.toString() +
      ", \n" +
      product?.sku?.toString() +
      ", \n" +
      quantity?.toString() +
      ", \n" +
      JSON.stringify(currentVariant) +
      ", \n";
    return message;
  };

  // Get the currently selected variant for pricing
  const currentVariant = getSelectedVariant();

  return (
    <CustomerRoute>
      <div>
        <Navbar />

        {/* Back Button */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 pt-3 sm:pt-4">
          <button
            onClick={handleBack}
            className="cursor-pointer flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors mb-3 sm:mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm sm:text-base font-medium">
              Back to Search
            </span>
          </button>
        </div>

        {/* Main Product Section */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
            {/* Left Side - Images */}
            <div className="space-y-3 sm:space-y-4">
              {/* Main Media Display */}
              <div
                className="group relative aspect-square bg-surface-100 rounded-md sm:rounded-lg overflow-hidden shadow-sm"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {currentMediaList.length > 0 &&
                currentMediaIndex >= 0 &&
                currentMediaIndex < currentMediaList.length &&
                currentMediaList[currentMediaIndex]?.filelink ? (
                  <>
                    {currentMediaList[currentMediaIndex].file_type ===
                    "video" ? (
                      <video
                        autoPlay
                        muted
                        src={currentMediaList[currentMediaIndex].filelink}
                        className="w-full h-full object-cover"
                        poster="" // You can add a poster image here if available
                      >
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <Image
                        src={currentMediaList[currentMediaIndex].filelink}
                        alt={product.name}
                        fill
                        className="object-cover"
                        priority
                      />
                    )}

                    {/* Navigation arrows */}
                    {currentMediaList.filter((media) => media?.filelink)
                      .length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          className="cursor-pointer absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
                        >
                          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={nextMedia}
                          className="cursor-pointer absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-1.5 sm:p-2 transition-all duration-200 shadow-lg hover:shadow-xl opacity-0 group-hover:opacity-100"
                        >
                          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-surface-400">
                    <p>No media available</p>
                  </div>
                )}
              </div>
              {/* Media Thumbnails */}
              {currentMediaList.filter((media) => media?.filelink).length >
                1 && (
                <div className="flex justify-center space-x-2 overflow-x-auto pb-2 -mx-1 px-1 sm:mx-0 sm:px-0">
                  {currentMediaList.map(
                    (media, index) =>
                      media?.filelink && (
                        <button
                          key={index}
                          onClick={() => setCurrentMediaIndex(index)}
                          className={`cursor-pointer w-12 h-12 sm:w-16 sm:h-16 rounded-lg border-2 overflow-hidden flex-shrink-0 transition-all duration-200 ${
                            currentMediaIndex === index
                              ? "border-primary-600 ring-2 ring-primary-200"
                              : "border-surface-300 hover:border-surface-400 hover:scale-105"
                          }`}
                        >
                          {media.file_type === "video" ? (
                            <div className="w-full h-full bg-surface-200 flex items-center justify-center relative">
                              <video
                                src={media.filelink}
                                muted
                                className="object-cover w-full h-full"
                                preload="metadata"
                                onLoadedMetadata={(e) => {
                                  // Prevent downloading full video, only metadata/thumbnail
                                  e.currentTarget.currentTime = 1; // Grab frame at 1s for preview
                                }}
                              />
                              <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                                VIDEO
                              </div>
                            </div>
                          ) : (
                            <Image
                              src={media.filelink}
                              alt={`${product.name} ${index + 1}`}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          )}
                        </button>
                      )
                  )}
                </div>
              )}
            </div>

            {/* Right Side - Product Information */}
            <div className="space-y-4 sm:space-y-6">
              {/* Product Title and Basic Info */}
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-text-dark mb-2 sm:mb-3">
                  {product.name}
                </h1>
                <p className="text-sm sm:text-base text-secondary-700 mb-1 sm:mb-2">
                  SKU: {product.sku}
                </p>
                {/* Product-specific information based on type */}
                <div className="space-y-1 sm:space-y-2 mb-3 sm:mb-4">
                  {product.product_type === "layouts" ? (
                    <p className="text-sm sm:text-base text-secondary-700">
                      Layout Type: {product.layout_type}
                    </p>
                  ) : product.product_type === "cuts" ? (
                    <>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Shape: {product.shape}
                      </p>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Cut Type: {product.cut_type}
                      </p>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Color Range: {product.color_range}
                      </p>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Clarity Range: {product.clarity_range}
                      </p>
                    </>
                  ) : product.product_type === "alphabets" ? (
                    <>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Character: {product.character}
                      </p>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Color Range: {product.color_range}
                      </p>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Clarity Range: {product.clarity_range}
                      </p>
                    </>
                  ) : product.product_type === "colorstones" ? (
                    <>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Shape: {product.shape || "N/A"}
                      </p>
                      <p className="text-sm sm:text-base text-secondary-700">
                        Color: {product.color}
                      </p>
                    </>
                  ) : product.product_type === "melees" ? (
                    <p className="text-sm sm:text-base text-secondary-700">
                      Shape: {product.shape}
                    </p>
                  ) : (
                    <p className="text-sm sm:text-base text-secondary-700">
                      Shape: {product.shape}
                    </p>
                  )}
                </div>

                {/* Description moved to bottom */}
              </div>

              {/* Variants Selection */}
              {(() => {
                const hasVariants =
                  product?.variants && product.variants.length > 0;
                const hasSieveSizes =
                  product?.sieve_sizes && product.sieve_sizes.length > 0;
                const isNotLayout = product.product_type !== "layouts";
                return (hasVariants || hasSieveSizes) && isNotLayout;
              })() && (
                <div className="space-y-3 sm:space-y-4 border-b border-surface-300 pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-text-dark">
                    Select Options
                  </h3>

                  {/* Diamond Variants */}
                  {(() => {
                    return product.product_type === "diamonds";
                  })() && (
                    <>
                      {/* Color Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Color: {selectedColor}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctColors().map((color) => (
                            <button
                              key={color}
                              onClick={() => handleOptionSelect("color", color)}
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedColor === color
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("color", color)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clarity Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Clarity: {selectedClarity}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctClarities().map((clarity) => (
                            <button
                              key={clarity}
                              onClick={() =>
                                handleOptionSelect("clarity", clarity)
                              }
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedClarity === clarity
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("clarity", clarity)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {clarity}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Carat Weight Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Carat Weight: {selectedCaratWeight}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctCaratWeights().map((weight) => (
                            <button
                              key={weight}
                              onClick={() =>
                                handleOptionSelect("caratWeight", weight)
                              }
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedCaratWeight === weight
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("caratWeight", weight)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {weight} ct
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Colorstone Variants */}
                  {product.product_type === "colorstones" && (
                    <>
                      {/* Shape Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Shape: {selectedShape}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctShape().map((shape) => (
                            <button
                              key={shape}
                              onClick={() => handleOptionSelect("shape", shape)}
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedShape === shape
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("shape", shape)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {shape}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Carat Weight Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Carat Weight: {selectedCaratWeight}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctCaratWeights().map((weight) => (
                            <button
                              key={weight}
                              onClick={() =>
                                handleOptionSelect("caratWeight", weight)
                              }
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedCaratWeight === weight
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("caratWeight", weight)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {weight} ct
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dimension Selection */}
                      {getDistinctDimensions().length > 0 && (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                            Dimension: {selectedDimension || "Select"}
                          </label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {getDistinctDimensions().map((dimension) => {
                              // Check if this dimension is available with current shape and carat weight
                              const isAvailable = product.variants.some(
                                (v) =>
                                  v.shape === selectedShape &&
                                  v.carat_weight === selectedCaratWeight &&
                                  v.dimension === dimension
                              );
                              const isDisabled =
                                !isAvailable &&
                                selectedShape &&
                                selectedCaratWeight !== null;

                              return (
                                <button
                                  key={dimension}
                                  onClick={() =>
                                    handleOptionSelect("dimension", dimension)
                                  }
                                  disabled={isDisabled}
                                  className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                    selectedDimension === dimension
                                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                      : isDisabled
                                      ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100 cursor-not-allowed"
                                      : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                  }`}
                                >
                                  {dimension}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Melee Variants */}
                  {product.product_type === "melees" && product.sieve_sizes && (
                    <>
                      {/* Color Range Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Color Range: {selectedColorRange}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctColorRange().map((colorRange) => (
                            <button
                              key={colorRange}
                              onClick={() =>
                                handleOptionSelect("colorRange", colorRange)
                              }
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedColorRange === colorRange
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled("colorRange", colorRange)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {colorRange}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clarity Range Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Clarity Range: {selectedClarityRange}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctClarityRange().map((clarityRange) => (
                            <button
                              key={clarityRange}
                              onClick={() =>
                                handleOptionSelect("clarityRange", clarityRange)
                              }
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedClarityRange === clarityRange
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled(
                                      "clarityRange",
                                      clarityRange
                                    )
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {clarityRange}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sieve Size Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Sieve Size: {selectedCaratWeight}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctSieveSizes().map((size) => (
                            <button
                              key={size}
                              onClick={() =>
                                handleOptionSelect("sieveSize", size)
                              }
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedCaratWeight === size
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled("sieveSize", size)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Cuts Variants */}
                  {product.product_type === "cuts" && (
                    <>
                      {/* Carat Weight Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Carat Weight: {selectedCaratWeight}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctCaratWeights().map((weight) => (
                            <button
                              key={weight}
                              onClick={() =>
                                handleOptionSelect("caratWeight", weight)
                              }
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedCaratWeight === weight
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("caratWeight", weight)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {weight} ct
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dimension Selection */}
                      {getDistinctDimensions().length > 0 && (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                            Dimension: {selectedDimension || "Select"}
                          </label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {getDistinctDimensions().map((dimension) => {
                              // Check if this dimension is available with current carat weight
                              const isAvailable = product.variants.some(
                                (v) =>
                                  v.carat_weight === selectedCaratWeight &&
                                  v.dimension === dimension
                              );
                              const isDisabled =
                                !isAvailable && selectedCaratWeight !== null;

                              return (
                                <button
                                  key={dimension}
                                  onClick={() =>
                                    handleOptionSelect("dimension", dimension)
                                  }
                                  disabled={isDisabled}
                                  className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                    selectedDimension === dimension
                                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                      : isDisabled
                                      ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100 cursor-not-allowed"
                                      : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                  }`}
                                >
                                  {dimension}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Alphabets Variants */}
                  {product.product_type === "alphabets" && (
                    <>
                      {/* Carat Weight Selection */}
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                          Carat Weight: {selectedCaratWeight}
                        </label>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {getDistinctCaratWeights().map((weight) => (
                            <button
                              key={weight}
                              onClick={() =>
                                handleOptionSelect("caratWeight", weight)
                              }
                              className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                selectedCaratWeight === weight
                                  ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                  : isOptionDisabled("caratWeight", weight)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                              }`}
                            >
                              {weight} ct
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Dimension Selection */}
                      {getDistinctDimensions().length > 0 && (
                        <div>
                          <label className="block text-xs sm:text-sm font-medium text-text-dark mb-2">
                            Dimension: {selectedDimension || "Select"}
                          </label>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            {getDistinctDimensions().map((dimension) => {
                              // Check if this dimension is available with current carat weight
                              const isAvailable = product.variants.some(
                                (v) =>
                                  v.carat_weight === selectedCaratWeight &&
                                  v.dimension === dimension
                              );
                              const isDisabled =
                                !isAvailable && selectedCaratWeight !== null;

                              return (
                                <button
                                  key={dimension}
                                  onClick={() =>
                                    handleOptionSelect("dimension", dimension)
                                  }
                                  disabled={isDisabled}
                                  className={`cursor-pointer px-2 sm:px-3 py-1.5 sm:py-2 border rounded-md text-xs sm:text-sm transition-all duration-200 ${
                                    selectedDimension === dimension
                                      ? "bg-primary-600 text-white border-primary-600 shadow-md"
                                      : isDisabled
                                      ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100 cursor-not-allowed"
                                      : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200 hover:shadow-sm"
                                  }`}
                                >
                                  {dimension}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Layout Diamond Details Display */}
              {product?.product_type === "layouts" &&
                product?.diamond_details &&
                product.diamond_details.length > 0 && (
                  <div className="space-y-4 border-b border-surface-300 pb-6">
                    <h3 className="text-lg font-semibold text-text-dark">
                      Diamond Details
                    </h3>
                    <p className="text-sm text-secondary-700 mb-4">
                      This layout includes the following diamond specifications:
                    </p>
                    <div className="overflow-x-auto shadow-sm rounded-lg border border-surface-200">
                      <table className="w-full min-w-[600px]">
                        <thead className="bg-surface-100">
                          <tr>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-text-dark border-b border-surface-300">
                              Shape
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-text-dark border-b border-surface-300">
                              Pieces
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-text-dark border-b border-surface-300">
                              Carat Weight
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-text-dark border-b border-surface-300">
                              Dimensions
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-text-dark border-b border-surface-300">
                              Color Range
                            </th>
                            <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-semibold text-text-dark border-b border-surface-300">
                              Clarity Range
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white">
                          {product.diamond_details.map((detail, index) => (
                            <tr
                              key={detail.id || index}
                              className={`${
                                index % 2 === 0 ? "bg-white" : "bg-surface-50"
                              } hover:bg-surface-100 transition-colors`}
                            >
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-dark border-b border-surface-200">
                                {detail.shape}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-dark border-b border-surface-200">
                                {detail.pcs}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-dark border-b border-surface-200">
                                {detail.carat_weight} ct
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-dark border-b border-surface-200">
                                {detail.dimension}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-dark border-b border-surface-200">
                                {detail.color_range}
                              </td>
                              <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-text-dark border-b border-surface-200">
                                {detail.clarity_range}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {/* Price */}
              {(currentVariant.price ||
                currentVariant.price_per_carat ||
                (product.product_type === "layouts" && product.price)) && (
                <div className="border-b border-surface-300 pb-4 sm:pb-6">
                  <h3 className="text-base sm:text-lg font-semibold text-text-dark mb-2">
                    Price
                  </h3>
                  <div className="text-2xl sm:text-3xl lg:text-3xl xl:text-4xl font-bold text-primary-600">
                    {product.product_type === "layouts"
                      ? `$${product.price?.toLocaleString()}`
                      : product.product_type === "melees"
                      ? `$${currentVariant.price_per_carat?.toLocaleString()} per carat`
                      : `$${currentVariant.price?.toLocaleString()}`}
                  </div>

                  {product.product_type === "layouts" ? (
                    <div className="space-y-1">
                      <p className="text-secondary-700">
                        {product.layout_type} Layout •{" "}
                        {product.diamond_details?.length || 0} diamond
                        specifications included
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-secondary-600">
                        <span className="bg-surface-100 px-3 py-1 rounded-full">
                          <strong>Total Pieces:</strong>{" "}
                          {product.diamond_details?.reduce(
                            (sum, detail) => sum + (detail.pcs || 0),
                            0
                          )}
                        </span>
                        <span className="bg-surface-100 px-3 py-1 rounded-full">
                          <strong>Total Carat Weight:</strong>{" "}
                          {product.diamond_details
                            ?.reduce(
                              (sum, detail) => sum + (detail.carat_weight || 0),
                              0
                            )
                            .toFixed(2)}{" "}
                          ct
                        </span>
                      </div>
                    </div>
                  ) : product.product_type === "melees" ? (
                    <p className="text-secondary-700">
                      {currentVariant.size}
                      {currentVariant.color_range &&
                        currentVariant.clarity_range && (
                          <>
                            {" "}
                            • {currentVariant.color_range} •{" "}
                            {currentVariant.clarity_range}
                          </>
                        )}
                    </p>
                  ) : (
                    currentVariant.carat_weight && (
                      <p className="text-secondary-700">
                        {currentVariant.carat_weight} carats
                        {product.product_type === "diamonds" &&
                          currentVariant.color &&
                          currentVariant.clarity && (
                            <>
                              {" "}
                              • {currentVariant.color} •{" "}
                              {currentVariant.clarity}
                            </>
                          )}
                        {product.product_type === "colorstones" &&
                          currentVariant.shape && (
                            <> • {currentVariant.shape}</>
                          )}
                        {currentVariant.dimension && (
                          <> • {currentVariant.dimension}</>
                        )}
                      </p>
                    )
                  )}
                </div>
              )}

              {/* Certification */}
              {product?.certification && (
                <div className="bg-accent-50 p-4 rounded-md sm:rounded-lg">
                  <h3 className="text-base sm:text-lg font-semibold text-accent-800 mb-1">
                    Certification
                  </h3>
                  <p className="text-sm text-accent-800">
                    Certified by {product.certification}
                  </p>
                  <p className="text-sm text-accent-700">
                    Comes with official certification documentation
                  </p>
                </div>
              )}

              {/* Quantity Selector - disabled during development */}
              {/*
              <div className="flex items-center space-x-3 sm:space-x-4">
                <label className="text-sm sm:text-base font-medium text-text-dark">
                  Quantity:
                </label>
                <div className="flex items-center border border-surface-300 rounded-md">
                  <button
                    onClick={() => handleQuantityChange("decrease")}
                    disabled={quantity <= 1}
                    className="cursor-pointer p-2 sm:p-3 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 sm:px-4 py-2 min-w-[50px] sm:min-w-[60px] text-center text-sm sm:text-base font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange("increase")}
                    className="cursor-pointer p-2 sm:p-3 hover:bg-surface-100 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              */}

              {/* Action Buttons - disabled during development */}
              {/*
              <div className="hidden sm:flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={handleAddToCart}
                  className="cursor-pointer flex-1 bg-primary-600 text-white py-3 sm:py-4 px-6 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base font-medium">
                    Add to Cart
                  </span>
                </button>
                <button
                  onClick={handleLike}
                  className={`cursor-pointer p-3 sm:p-4 rounded-lg border transition-all duration-200 self-start sm:self-auto ${
                    isLiked
                      ? "bg-red-50 border-red-300 text-red-600 shadow-md"
                      : "bg-surface-50 border-surface-300 text-secondary-700 hover:bg-surface-100 hover:shadow-sm"
                  }`}
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                </button>
              </div>
              */}

              {/* Quick Contact Buttons */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-semibold text-text-dark">
                  Quick Contact
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Email */}

                  {/* message: hello */}

                  <a
                    href="mailto:sales@khodalgems.com"
                    className="cursor-pointer col-span-1 flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="text-sm sm:text-base font-medium">
                      Email Us
                    </span>
                  </a>

                  {/* message: [productname], [sku], [quantity], [selected variant], [price] */}
                  <a
                    href={`https://wa.me/+919409658456?text=${getWhatsAppMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer col-span-1 flex items-center justify-center space-x-2 py-3 sm:py-4 px-4 border border-green-200 text-green-600 rounded-lg hover:bg-green-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm sm:text-base font-medium">
                      WhatsApp Us
                    </span>
                  </a>
                </div>
              </div>

              {/* Description removed from here to be shown full width below */}

              {/* Reviews Section */}
              {/* <div className="border-t border-surface-300 pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <div className="text-sm text-secondary-700">
                    <span className="font-medium">4.8</span> (127 reviews)
                  </div>
                </div>
                <button className="cursor-pointer text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Write a Review
                </button>
              </div>
            </div> */}
            </div>
          </div>
        </div>

        {/* Full-width Description (Accordion) below the grid */}
        {product?.description && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
            <div className="bg-white rounded-md sm:rounded-lg border border-surface-300">
              <button
                type="button"
                aria-expanded={isDescriptionOpen}
                onClick={() => setIsDescriptionOpen((prev) => !prev)}
                className="cursor-pointer w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4"
              >
                <span className="text-base sm:text-lg font-semibold text-text-dark">
                  Description
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-secondary-700 transition-transform duration-200 ${
                    isDescriptionOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                style={{
                  maxHeight: descriptionMaxHeight,
                  transition: "max-height 300ms ease",
                  overflow: "hidden",
                }}
                aria-hidden={!isDescriptionOpen}
              >
                <div
                  ref={descriptionContentRef}
                  className={`px-4 sm:px-6 pb-4 sm:pb-5 transition-opacity duration-300 ${
                    isDescriptionOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <div
                    className="text-sm sm:text-base lg:text-lg text-text-dark leading-relaxed [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-4 [&>h1]:mb-2 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-4 [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mt-3 [&>h3]:mb-2 [&>p]:my-2 [&>ul]:my-2 [&>ul]:list-disc [&>ul]:ml-6 [&>ol]:my-2 [&>ol]:list-decimal [&>ol]:ml-6 [&>li]:my-1 [&>strong]:font-bold [&>em]:italic [&>u]:underline"
                    dangerouslySetInnerHTML={{
                      __html: product.description || "",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sticky Bottom Action Bar (Mobile) - disabled during development */}
        {/**
        <div className="sm:hidden sticky bottom-0 z-50 w-full bg-white border-t border-surface-300 p-3">
          <div className="max-w-7xl mx-auto px-3 flex items-center gap-3">
            <button
              onClick={handleLike}
              aria-label="Like"
              className={`cursor-pointer p-3 rounded-lg border transition-all duration-200 ${
                isLiked
                  ? "bg-red-50 border-red-300 text-red-600 shadow-md"
                  : "bg-surface-50 border-surface-300 text-secondary-700 hover:bg-surface-100 hover:shadow-sm"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={handleAddToCart}
              className="cursor-pointer flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">Add to Cart</span>
            </button>
          </div>
        </div>
        */}

        {/* You May Also Like Section */}
        {displayRecommendedProducts.length > 0 && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12 lg:py-16">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-dark mb-6 sm:mb-8 text-center">
              You May Also Like
            </h2>

            {/* Mobile Carousel */}
            <div className="sm:hidden relative">
              {/* Navigation Arrows */}
              {canScrollLeft && (
                <button
                  onClick={() => scrollCarousel("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-5 h-5 text-text-dark" />
                </button>
              )}
              {canScrollRight && (
                <button
                  onClick={() => scrollCarousel("right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-all duration-200"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-5 h-5 text-text-dark" />
                </button>
              )}

              {/* Carousel Container */}
              <div
                ref={carouselRef}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 -mx-3 px-3 hide-scrollbar"
                style={{
                  WebkitOverflowScrolling: "touch",
                }}
                onScroll={checkScrollButtons}
              >
                {displayRecommendedProducts.map((recProduct, idx) => (
                  <div
                    key={`${
                      recProduct.sku || recProduct.id || "rec"
                    }_${idx}_ymal`}
                    className="carousel-card group flex-shrink-0 w-[160px] snap-start"
                  >
                    <div className="bg-white rounded-lg p-2 hover:shadow-lg transition-all duration-300 border border-surface-200 hover:border-primary-200 h-full">
                      {/* Product Image */}
                      <div className="aspect-square bg-surface-100 rounded-md mb-2 overflow-hidden">
                        {recProduct.medias?.length > 0 &&
                        recProduct.medias[0]?.filelink ? (
                          <Image
                            src={recProduct.medias[0].filelink}
                            alt={recProduct.name || "Product"}
                            width={160}
                            height={160}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-surface-400">
                            <p className="text-xs">No image</p>
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-1.5">
                        <h3 className="font-medium text-text-dark truncate text-xs">
                          {recProduct.name}
                        </h3>
                        <p className="text-xs text-secondary-700 truncate">
                          {recProduct.shape}
                        </p>
                        {recProduct.variants?.[0]?.price && (
                          <p className="text-sm font-semibold text-primary-600">
                            ${recProduct.variants[0].price.toLocaleString()}
                          </p>
                        )}
                        <Link
                          href={`/products/${recProduct.sku || recProduct.id}`}
                          className="cursor-pointer w-full bg-primary-600 text-white py-1.5 px-2 rounded-lg hover:bg-primary-700 transition-all duration-200 text-xs font-medium shadow-sm hover:shadow-md text-center block"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Grid */}
            <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
              {displayRecommendedProducts.map((recProduct, idx) => (
                <div
                  key={`${
                    recProduct.sku || recProduct.id || "rec"
                  }_${idx}_ymal`}
                  className="group"
                >
                  <div className="bg-white rounded-lg p-3 sm:p-4 hover:shadow-lg transition-all duration-300 border border-surface-200 hover:border-primary-200">
                    {/* Product Image */}
                    <div className="aspect-square bg-surface-100 rounded-md mb-3 sm:mb-4 overflow-hidden">
                      {recProduct.medias?.length > 0 &&
                      recProduct.medias[0]?.filelink ? (
                        <Image
                          src={recProduct.medias[0].filelink}
                          alt={recProduct.name || "Product"}
                          width={200}
                          height={200}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-surface-400">
                          <p className="text-xs sm:text-sm">No image</p>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      <h3 className="font-medium text-text-dark truncate text-sm sm:text-base">
                        {recProduct.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-secondary-700">
                        {recProduct.shape}
                      </p>
                      {recProduct.variants?.[0]?.price && (
                        <p className="text-base sm:text-lg font-semibold text-primary-600">
                          ${recProduct.variants[0].price.toLocaleString()}
                        </p>
                      )}
                      <Link
                        href={`/products/${recProduct.sku || recProduct.id}`}
                        className="cursor-pointer w-full bg-primary-600 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-primary-700 transition-all duration-200 text-xs sm:text-sm font-medium shadow-sm hover:shadow-md text-center block"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </CustomerRoute>
  );
}
