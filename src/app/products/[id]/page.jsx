"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Plus,
  Minus,
  Star,
  Phone,
  MessageCircle,
  Video,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import productsData from "../../../../products_dummy2.json";

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

  // Variant selection states
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedClarity, setSelectedClarity] = useState("");
  const [selectedCaratWeight, setSelectedCaratWeight] = useState("");
  const [selectedShape, setSelectedShape] = useState("");
  const [selectedColorRange, setSelectedColorRange] = useState("");
  const [selectedClarityRange, setSelectedClarityRange] = useState("");

  const [availableVariants, setAvailableVariants] = useState([]);

  useEffect(() => {
    if (product?.images || product?.video) {
      // Create a combined media list with images first, then videos
      const mediaList = [];
      if (product.images && Array.isArray(product.images)) {
        mediaList.push(...product.images);
      }
      if (product.video && Array.isArray(product.video)) {
        mediaList.push(...product.video);
      }

      // Debug: Log the media list to console
      console.log("Media list created:", {
        totalMedia: mediaList.length,
        images: product.images?.length || 0,
        videos: product.video?.length || 0,
        mediaList,
      });

      // Only set currentMediaIndex if we have valid media
      if (mediaList.length > 0 && mediaList[0]) {
        setCurrentMediaIndex(0);
      }
      setCurrentMediaList(mediaList);
    }
  }, [product]);

  // Function to get product data from JSON
  const getProductById = async (id) => {
    try {
      // Search through all product types
      for (const productType in productsData.productTypes) {
        const products = productsData.productTypes[productType];
        const product = products.find((p) => p.productId === id);
        if (product) {
          return product;
        }
      }

      return null;
    } catch (error) {
      console.error("Error loading product:", error);
      return null;
    }
  };

  // Function to get recommended products
  const getRecommendedProducts = async (currentProductId, limit = 5) => {
    try {
      const allProducts = [];

      // Collect all products from all types
      for (const productType in productsData.productTypes) {
        allProducts.push(...productsData.productTypes[productType]);
      }

      // Filter out current product and get random 5
      const filteredProducts = allProducts.filter(
        (p) => p.productId !== currentProductId
      );
      const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (error) {
      console.error("Error loading recommended products:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const productData = await getProductById(id);
      const recommended = await getRecommendedProducts(id);
      setProduct(productData);
      setRecommendedProducts(recommended);

      // Set initial variant selection if product has variants
      if (productData?.variants?.length > 0) {
        setAvailableVariants(productData.variants);
        // Select first variant as default
        const firstVariant = productData.variants[0];

        // For diamonds, set color and clarity
        if (productData.productType === "diamond") {
          setSelectedColor(firstVariant.color);
          setSelectedClarity(firstVariant.clarity);
        }

        // For color stones, set shape
        if (productData.productType === "colorstone") {
          setSelectedShape(firstVariant.shape);
        }

        // For melee, set color and clarity ranges
        if (productData.productType === "melee") {
          setSelectedColorRange(firstVariant.colorRange);
          setSelectedClarityRange(firstVariant.clarityRange);
        }

        // Set carat weight for diamond and colorstone, or sieve size info for melee
        if (productData.productType === "melee") {
          setSelectedCaratWeight(firstVariant.sieveSize); // Store sieve size in caratWeight state for consistency
        } else if (productData.productType === "layout") {
          // For layouts, we don't select individual variants
          // Variants are displayed as a complete list
        } else {
          setSelectedCaratWeight(firstVariant.caratWeight);
        }
      }

      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Helper functions for variant management
  const getDistinctColors = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.color))].sort();
  };

  const getDistinctClarities = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.clarity))].sort();
  };

  const getDistinctCaratWeights = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.caratWeight))].sort(
      (a, b) => a - b
    );
  };

  const getDistinctShape = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.shape))].sort(
      (a, b) => a - b
    );
  };

  // get distinct colorrange
  const getDistinctColorRange = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.colorRange))].sort();
  };

  // get distinct clarityrange
  const getDistinctClarityRange = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.clarityRange))].sort();
  };

  // get distinct sieve sizes for melee
  const getDistinctSieveSizes = () => {
    if (!product?.variants) return [];
    return [...new Set(product.variants.map((v) => v.sieveSize))].sort();
  };

  // Get the currently selected variant
  const getSelectedVariant = () => {
    if (!product?.variants) {
      return product?.variants?.[0] || {};
    }

    if (product.productType === "diamond") {
      // For diamonds, check color, clarity, and carat weight
      if (!selectedColor || !selectedClarity || selectedCaratWeight === null) {
        return product.variants[0];
      }
      return (
        product.variants.find(
          (v) =>
            v.color === selectedColor &&
            v.clarity === selectedClarity &&
            v.caratWeight === selectedCaratWeight
        ) || product.variants[0]
      );
    } else if (product.productType === "colorstone") {
      // For color stones, check shape and carat weight
      if (!selectedShape || selectedCaratWeight === null) {
        return product.variants[0];
      }
      return (
        product.variants.find(
          (v) =>
            v.shape === selectedShape && v.caratWeight === selectedCaratWeight
        ) || product.variants[0]
      );
    } else if (product.productType === "melee") {
      // For melee, check color range, clarity range, and sieve size
      if (
        !selectedColorRange ||
        !selectedClarityRange ||
        selectedCaratWeight === null
      ) {
        return product.variants[0];
      }
      return (
        product.variants.find(
          (v) =>
            v.colorRange === selectedColorRange &&
            v.clarityRange === selectedClarityRange &&
            v.sieveSize === selectedCaratWeight
        ) || product.variants[0]
      );
    } else if (
      product.productType === "alphabet" ||
      product.productType === "cuts"
    ) {
      return (
        product.variants.find((v) => v.caratWeight === selectedCaratWeight) ||
        product.variants[0]
      );
    } else if (product.productType === "layout") {
      // For layouts, return the product itself as it has layoutPrice
      return product;
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
    if (!product?.variants) return false;

    if (product.productType === "diamond") {
      return product.variants.some(
        (v) =>
          v.color === color &&
          v.clarity === clarity &&
          v.caratWeight === caratWeight
      );
    } else if (product.productType === "colorstone") {
      return product.variants.some(
        (v) => v.shape === shape && v.caratWeight === caratWeight
      );
    } else if (product.productType === "melee") {
      return product.variants.some(
        (v) =>
          v.colorRange === colorRange &&
          v.clarityRange === clarityRange &&
          v.sieveSize === caratWeight
      );
    }

    return false;
  };

  // Check if an option should be disabled based on current selections
  const isOptionDisabled = (type, value) => {
    if (!product?.variants) return false;

    if (product.productType === "diamond") {
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
    } else if (product.productType === "colorstone") {
      const currentShape = type === "shape" ? value : selectedShape;
      const currentCaratWeight =
        type === "caratWeight" ? value : selectedCaratWeight;

      // If not all selections are made, don't disable
      if (!currentShape || currentCaratWeight === null) {
        return false;
      }

      return !isVariantAvailable(null, null, currentCaratWeight, currentShape);
    } else if (product.productType === "melee") {
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
    }

    return false;
  };

  // Find the first available variant based on a new selection
  const findDefaultVariant = (type, value) => {
    if (!product?.variants) return null;

    // Filter variants that contain the newly selected option
    const matchingVariants = product.variants.filter((variant) => {
      switch (type) {
        case "color":
          return variant.color === value;
        case "clarity":
          return variant.clarity === value;
        case "caratWeight":
          return variant.caratWeight === value;
        case "shape":
          return variant.shape === value;
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
          setSelectedCaratWeight(defaultVariant.caratWeight);
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
          setSelectedCaratWeight(defaultVariant.caratWeight);
        }
      }
    } else if (type === "caratWeight") {
      setSelectedCaratWeight(value);

      // If this selection would result in an unavailable combination, find a default
      let wouldBeUnavailable = false;

      if (product.productType === "diamond") {
        wouldBeUnavailable =
          selectedColor &&
          selectedClarity &&
          !isVariantAvailable(selectedColor, selectedClarity, value);
      } else if (product.productType === "colorstone") {
        wouldBeUnavailable =
          selectedShape &&
          !isVariantAvailable(null, null, value, selectedShape);
      } else if (product.productType === "melee") {
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
      }

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("caratWeight", value);
        if (defaultVariant) {
          if (product.productType === "diamond") {
            setSelectedColor(defaultVariant.color);
            setSelectedClarity(defaultVariant.clarity);
          } else if (product.productType === "colorstone") {
            setSelectedShape(defaultVariant.shape);
          } else if (product.productType === "melee") {
            setSelectedColorRange(defaultVariant.colorRange);
            setSelectedClarityRange(defaultVariant.clarityRange);
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
          setSelectedCaratWeight(defaultVariant.caratWeight);
        }
      }
    } else if (type === "colorRange") {
      setSelectedColorRange(value);

      // If this selection would result in an unavailable combination, find a default
      const wouldBeUnavailable =
        selectedClarityRange &&
        selectedCaratWeight !== null &&
        !isVariantAvailable(
          null,
          null,
          selectedCaratWeight,
          null,
          value,
          selectedClarityRange
        );

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("colorRange", value);
        if (defaultVariant) {
          setSelectedClarityRange(defaultVariant.clarityRange);
          setSelectedCaratWeight(defaultVariant.sieveSize);
        }
      }
    } else if (type === "clarityRange") {
      setSelectedClarityRange(value);

      // If this selection would result in an unavailable combination, find a default
      const wouldBeUnavailable =
        selectedColorRange &&
        selectedCaratWeight !== null &&
        !isVariantAvailable(
          null,
          null,
          selectedCaratWeight,
          null,
          selectedColorRange,
          value
        );

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("clarityRange", value);
        if (defaultVariant) {
          setSelectedColorRange(defaultVariant.colorRange);
          setSelectedCaratWeight(defaultVariant.sieveSize);
        }
      }
    } else if (type === "sieveSize") {
      setSelectedCaratWeight(value);

      // If this selection would result in an unavailable combination, find a default
      const wouldBeUnavailable =
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

      if (wouldBeUnavailable) {
        const defaultVariant = findDefaultVariant("sieveSize", value);
        if (defaultVariant) {
          setSelectedColorRange(defaultVariant.colorRange);
          setSelectedClarityRange(defaultVariant.clarityRange);
        }
      }
    }
  };

  const handleBack = () => {
    router.back();
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
    const validMedia = currentMediaList.filter((media) => media);
    if (validMedia.length > 1) {
      setCurrentMediaIndex((prev) => {
        const nextIndex = (prev + 1) % currentMediaList.length;
        // Ensure the next index has valid media
        return currentMediaList[nextIndex] ? nextIndex : prev;
      });
    }
  };

  const prevMedia = () => {
    const validMedia = currentMediaList.filter((media) => media);
    if (validMedia.length > 1) {
      setCurrentMediaIndex((prev) => {
        const prevIndex =
          (prev - 1 + currentMediaList.length) % currentMediaList.length;
        // Ensure the previous index has valid media
        return currentMediaList[prevIndex] ? prevIndex : prev;
      });
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Loading...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p>The product you're looking for doesn't exist.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the currently selected variant for pricing
  const currentVariant = getSelectedVariant();

  return (
    <div>
      <Navbar />

      {/* Back Button */}
      <div className="container mx-auto px-4 pt-4">
        <button
          onClick={handleBack}
          className="cursor-pointer flex items-center space-x-2 text-secondary-700 hover:text-primary-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>
      </div>

      {/* Main Product Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Side - Images */}
          <div className="space-y-4">
            {/* Main Media Display */}
            <div className="relative aspect-square bg-surface-100 rounded-lg overflow-hidden">
              {currentMediaList.length > 0 &&
              currentMediaIndex >= 0 &&
              currentMediaIndex < currentMediaList.length &&
              currentMediaList[currentMediaIndex] ? (
                <>
                  {isVideo(currentMediaList[currentMediaIndex]) ? (
                    <video
                      src={currentMediaList[currentMediaIndex]}
                      controls
                      className="w-full h-full object-cover"
                      poster="" // You can add a poster image here if available
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={currentMediaList[currentMediaIndex]}
                      alt={product.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  )}

                  {/* Navigation arrows */}
                  {currentMediaList.filter((media) => media).length > 1 && (
                    <>
                      <button
                        onClick={prevMedia}
                        className="cursor-pointer absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextMedia}
                        className="cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
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
            {currentMediaList.filter((media) => media).length > 1 && (
              <div className="flex justify-center space-x-2">
                {currentMediaList.map(
                  (media, index) =>
                    media && (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`cursor-pointer w-16 h-16 rounded-lg border-2 overflow-hidden ${
                          currentMediaIndex === index
                            ? "border-primary-600"
                            : "border-surface-300 hover:border-surface-400"
                        }`}
                      >
                        {isVideo(media) ? (
                          <div className="w-full h-full bg-surface-200 flex items-center justify-center relative">
                            <Video className="w-8 h-8 text-surface-600" />
                            <div className="absolute bottom-1 right-1 bg-black bg-opacity-60 text-white text-xs px-1 rounded">
                              VIDEO
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={media}
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
          <div className="space-y-6">
            {/* Product Title and Basic Info */}
            <div>
              <h1 className="text-3xl font-bold text-text-dark mb-2">
                {product.name}
              </h1>
              <p className="text-secondary-700 mb-1">SKU: {product.sku}</p>
              {product.productType === "layout" ? (
                <p className="text-secondary-700 mb-4">
                  Layout Type: {product.layoutType}
                </p>
              ) : (
                <p className="text-secondary-700 mb-4">
                  Shape: {product.shape}
                </p>
              )}
              <p className="text-lg text-text-dark">{product.description}</p>
            </div>

            {/* Variants Selection */}
            {product?.variants &&
              product.variants.length > 0 &&
              product.productType !== "layout" && (
                <div className="space-y-4 border-b border-surface-300 pb-6">
                  <h3 className="text-lg font-semibold text-text-dark">
                    Select Options
                  </h3>

                  {product.productType === "diamond" && (
                    <>
                      {/* Color Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Color: {selectedColor}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctColors().map((color) => (
                            <button
                              key={color}
                              onClick={() => handleOptionSelect("color", color)}
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedColor === color
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled("color", color)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {color}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Clarity Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Clarity: {selectedClarity}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctClarities().map((clarity) => (
                            <button
                              key={clarity}
                              onClick={() =>
                                handleOptionSelect("clarity", clarity)
                              }
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedClarity === clarity
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled("clarity", clarity)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {clarity}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {product.productType === "colorstone" && (
                    <>
                      {/* Color Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Shape: {selectedShape}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctShape().map((shape) => (
                            <button
                              key={shape}
                              onClick={() => handleOptionSelect("shape", shape)}
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedShape === shape
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled("shape", shape)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {shape}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  {product.productType === "melee" && (
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

                      {/* Sieve Size Selection for Melee */}
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

                  {(product.productType === "diamond" ||
                    product.productType === "colorstone" ||
                    product.productType === "alphabet" ||
                    product.productType === "cuts") && (
                    <>
                      {/* Carat Weight Selection */}
                      <div>
                        <label className="block text-sm font-medium text-text-dark mb-2">
                          Carat Weight: {selectedCaratWeight}
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {getDistinctCaratWeights().map((weight) => (
                            <button
                              key={weight}
                              onClick={() =>
                                handleOptionSelect("caratWeight", weight)
                              }
                              className={`cursor-pointer px-4 py-2 border rounded-md text-sm transition-colors ${
                                selectedCaratWeight === weight
                                  ? "bg-primary-600 text-white border-primary-600"
                                  : isOptionDisabled("caratWeight", weight)
                                  ? "bg-surface-200 text-secondary-400 border-surface-300 opacity-50 hover:opacity-100"
                                  : "bg-surface-50 text-text-dark border-surface-300 hover:bg-surface-200"
                              }`}
                            >
                              {weight} ct
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

            {/* Layout Variants Display */}
            {product?.productType === "layout" &&
              product?.variants &&
              product.variants.length > 0 && (
                <div className="space-y-4 border-b border-surface-300 pb-6">
                  <h3 className="text-lg font-semibold text-text-dark">
                    Layout Variants
                  </h3>
                  <p className="text-sm text-secondary-700 mb-4">
                    This layout includes all the following variants:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-surface-300 rounded-lg">
                      <thead className="bg-surface-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-surface-300">
                            Shape
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-surface-300">
                            Pieces
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-surface-300">
                            Carat Weight
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-surface-300">
                            Dimensions
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-surface-300">
                            Color Range
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-text-dark border-b border-surface-300">
                            Clarity Range
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {product.variants.map((variant, index) => (
                          <tr
                            key={variant.id || index}
                            className={`${
                              index % 2 === 0 ? "bg-white" : "bg-surface-50"
                            } hover:bg-surface-100 transition-colors`}
                          >
                            <td className="px-4 py-3 text-sm text-text-dark border-b border-surface-200">
                              {variant.shape}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-dark border-b border-surface-200">
                              {variant.totalPcs}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-dark border-b border-surface-200">
                              {variant.totalCaratWeight} ct
                            </td>
                            <td className="px-4 py-3 text-sm text-text-dark border-b border-surface-200">
                              {variant.dimensions}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-dark border-b border-surface-200">
                              {variant.colorRange}
                            </td>
                            <td className="px-4 py-3 text-sm text-text-dark border-b border-surface-200">
                              {variant.clarityRange}
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
              (product.productType === "layout" && product.layoutPrice)) && (
              <div className="border-b border-surface-300 pb-4">
                <div className="text-3xl font-bold text-primary-600">
                  {product.productType === "layout"
                    ? `$${product.layoutPrice?.toLocaleString()}`
                    : product.productType === "melee"
                    ? `$${currentVariant.price?.toLocaleString()} per piece`
                    : `$${currentVariant.price?.toLocaleString()}`}
                </div>
                {product.productType === "layout" ? (
                  <div className="space-y-1">
                    <p className="text-secondary-700">
                      {product.layoutType} Layout •{" "}
                      {product.variants?.length || 0} variants included
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-secondary-600">
                      <span className="bg-surface-100 px-3 py-1 rounded-full">
                        <strong>Pieces:</strong>{" "}
                        {product.variants?.reduce(
                          (sum, variant) => sum + (variant.totalPcs || 0),
                          0
                        )}
                      </span>
                      <span className="bg-surface-100 px-3 py-1 rounded-full">
                        <strong>Carat Weight:</strong>{" "}
                        {product.variants
                          ?.reduce(
                            (sum, variant) =>
                              sum + (variant.totalCaratWeight || 0),
                            0
                          )
                          .toFixed(2)}{" "}
                        ct
                      </span>
                    </div>
                  </div>
                ) : (
                  (currentVariant.caratWeight || currentVariant.sieveSize) && (
                    <p className="text-secondary-700">
                      {product.productType === "melee" ? (
                        <>
                          {currentVariant.sieveSize}
                          {currentVariant.colorRange &&
                            currentVariant.clarityRange && (
                              <>
                                {" "}
                                • {currentVariant.colorRange} •{" "}
                                {currentVariant.clarityRange}
                              </>
                            )}
                        </>
                      ) : (
                        <>
                          {currentVariant.caratWeight} carats
                          {product.productType === "diamond" &&
                            currentVariant.color &&
                            currentVariant.clarity && (
                              <>
                                {" "}
                                • {currentVariant.color} •{" "}
                                {currentVariant.clarity}
                              </>
                            )}
                          {product.productType === "colorstone" &&
                            currentVariant.shape && (
                              <> • {currentVariant.shape}</>
                            )}
                        </>
                      )}
                    </p>
                  )
                )}
              </div>
            )}

            {/* Certification */}
            <div className="bg-accent-50 p-4 rounded-lg">
              <p className="text-sm font-semibold text-accent-800">
                Certified by {product.certification}
              </p>
              <p className="text-sm text-accent-700">
                Comes with official certification documentation
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-text-dark">
                Quantity:
              </label>
              <div className="flex items-center border border-surface-300 rounded-md">
                <button
                  onClick={() => handleQuantityChange("decrease")}
                  disabled={quantity <= 1}
                  className="cursor-pointer p-2 hover:bg-surface-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange("increase")}
                  className="cursor-pointer p-2 hover:bg-surface-100"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={handleAddToCart}
                className="cursor-pointer flex-1 bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
              <button
                onClick={handleLike}
                className={`cursor-pointer p-3 rounded-md border transition-colors ${
                  isLiked
                    ? "bg-red-50 border-red-300 text-red-600"
                    : "bg-surface-50 border-surface-300 text-secondary-700 hover:bg-surface-100"
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Quick Contact Buttons */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-text-dark">
                Quick Contact
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button className="cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 border border-primary-200 text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">Virtual Appointment</span>
                </button>
                <button className="cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 border border-primary-200 text-primary-600 rounded-md hover:bg-primary-50 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Order on Call</span>
                </button>
                <button className="cursor-pointer flex items-center justify-center space-x-2 py-3 px-4 border border-green-200 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">WhatsApp Us</span>
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="border-t border-surface-300 pt-6">
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
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {recommendedProducts.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-text-dark mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendedProducts.map((recProduct) => (
              <div key={recProduct.productId} className="group">
                <div className="bg-surface-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
                  {/* Product Image */}
                  <div className="aspect-square bg-surface-100 rounded-md mb-4 overflow-hidden">
                    {recProduct.images?.[0] ? (
                      <Image
                        src={recProduct.images[0]}
                        alt={recProduct.name}
                        width={200}
                        height={200}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-surface-400">
                        <p className="text-sm">No image</p>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-2">
                    <h3 className="font-medium text-text-dark truncate">
                      {recProduct.name}
                    </h3>
                    <p className="text-sm text-secondary-700">
                      {recProduct.shape}
                    </p>
                    {recProduct.variants?.[0]?.price && (
                      <p className="text-lg font-semibold text-primary-600">
                        ${recProduct.variants[0].price.toLocaleString()}
                      </p>
                    )}
                    <button className="cursor-pointer w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
