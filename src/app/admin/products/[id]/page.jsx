"use client";

import { AdminRoute } from "@/components/ProtectedRoute";
import React, { useState, useMemo, useEffect, use } from "react";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, X, Save, AlertTriangle } from "lucide-react";
import MediaSection from "../components/MediaSection";
import VariantDeletePopup from "../components/VariantDeletePopup";
import ProductDeletePopup from "../components/ProductDeletePopup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getAuthToken } from "@/contexts/auth";
import {
  colorOptions,
  clarityOptions,
  colorRanges,
  clarityRanges,
  layoutTypeOptions,
  cutTypeOptions,
  sieveSizeOptions,
  certificationOptions,
  shapeOptions,
} from "@/components/constants/order";

export default function page({ params }) {
  // Unwrap params Promise using React.use()
  const { id } = use(params);

  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  // Edit functionality state for variants
  const [editingVariant, setEditingVariant] = useState(null);
  const [editedVariantData, setEditedVariantData] = useState({});
  const [savingVariant, setSavingVariant] = useState(false);

  // Edit functionality state for product details
  const [editingProduct, setEditingProduct] = useState(false);
  const [editedProductData, setEditedProductData] = useState({});
  const [savingProduct, setSavingProduct] = useState(false);
  // Local variant and media edit helpers
  const [newVariantTempIdCounter, setNewVariantTempIdCounter] = useState(0);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newVideoFiles, setNewVideoFiles] = useState([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [deletedVariantIds, setDeletedVariantIds] = useState([]);

  // Delete functionality state for variants (simple popup)
  const [showVariantDeletePopup, setShowVariantDeletePopup] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [deletingVariant, setDeletingVariant] = useState(false);

  // Delete functionality state for whole product (complex popup with SKU)
  const [showProductDeletePopup, setShowProductDeletePopup] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(false);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);

  const sortedVariants = useMemo(() => {
    if (!productData || !productData.variants) {
      return [];
    }

    const variants = [...productData.variants];

    variants.sort((a, b) => {
      let aValue = a?.[sortBy];
      let bValue = b?.[sortBy];

      const bothNumbers =
        typeof aValue === "number" && typeof bValue === "number";
      const bothStrings =
        typeof aValue === "string" && typeof bValue === "string";

      if (bothNumbers) {
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      if (bothStrings) {
        const aStr = aValue.toLowerCase();
        const bStr = bValue.toLowerCase();
        if (aStr === bStr) return 0;
        const cmp = aStr > bStr ? 1 : -1;
        return sortOrder === "asc" ? cmp : -cmp;
      }

      // Fallback: coerce to string safely
      const aStr = (aValue ?? "").toString().toLowerCase();
      const bStr = (bValue ?? "").toString().toLowerCase();
      if (aStr === bStr) return 0;
      const cmp = aStr > bStr ? 1 : -1;
      return sortOrder === "asc" ? cmp : -cmp;
    });

    return variants;
  }, [productData, sortBy, sortOrder]);

  // Get product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const authToken = getAuthToken();
        console.log(authToken);
        if (!authToken) {
          toast.error("Authorization failed. Please login again.");
          return;
        }
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `/api/product-id?sku=${id}`,
          headers: {},
        };

        const response = await axios.request(config);

        if (
          response.data &&
          response.data.status &&
          response.data.data &&
          response.data.data.product
        ) {
          // Get the product and product type from the response
          const apiProduct = response.data.data.product;
          const productType = response.data.data.product_type;

          // Process media to separate images and videos
          const mediaFiles = apiProduct.medias || [];
          const images = mediaFiles
            .filter((media) => media.file_type === "image")
            .map((media) => media.filelink);
          const videos = mediaFiles
            .filter((media) => media.file_type === "video")
            .map((media) => media.filelink);

          // Normalize product type to match component expectations
          const normalizeProductType = (type) => {
            switch (type) {
              case "diamonds":
                return "diamond";
              case "colorstones":
                return "colorstone";
              case "cuts":
                return "cuts";
              case "melees":
                return "melee";
              case "layouts":
                return "layout";
              case "alphabets":
                return "alphabet";
              default:
                return type;
            }
          };

          // Transform API response to match the expected format
          const transformedProduct = {
            productId: apiProduct.id,
            name: apiProduct.name,
            slug: apiProduct.slug,
            productType: normalizeProductType(productType),
            description: apiProduct.description,
            isAvailable: apiProduct.is_available,
            availability: apiProduct.is_available,
            media: mediaFiles,
            images: images,
            video: videos,
            sku: apiProduct.sku,
            // Handle different product types and normalize field names
            ...(productType === "diamonds" && {
              shape: apiProduct.shape,
              certification: apiProduct.certification,
              variants: (apiProduct.variants || []).map((variant) => ({
                ...variant,
                caratWeight: variant.carat_weight,
                colorRange: variant.color_range,
                clarityRange: variant.clarity_range,
              })),
            }),
            ...(productType === "colorstones" && {
              color: apiProduct.color,
              certification: apiProduct.certification,
              variants: (apiProduct.variants || []).map((variant) => ({
                ...variant,
                caratWeight: variant.carat_weight,
              })),
            }),
            ...(productType === "layouts" && {
              layoutType: apiProduct.layout_type,
              price: apiProduct.price,
              layoutPrice: apiProduct.price,
              diamondDetails: (apiProduct.diamond_details || []).map(
                (detail) => ({
                  ...detail,
                  caratWeight: detail.carat_weight,
                  colorRange: detail.color_range,
                  clarityRange: detail.clarity_range,
                })
              ),
              variants: (apiProduct.diamond_details || []).map((detail) => ({
                id: detail.id,
                shape: detail.shape,
                totalPcs: detail.pcs,
                totalCaratWeight: detail.carat_weight,
                dimensions: detail.dimension,
                colorRange: detail.color_range,
                clarityRange: detail.clarity_range,
              })),
            }),
            ...(productType === "cuts" && {
              shape: apiProduct.shape,
              cutType: apiProduct.cut_type,
              colorRange: apiProduct.color_range,
              clarityRange: apiProduct.clarity_range,
              variants: (apiProduct.variants || []).map((variant) => ({
                ...variant,
                caratWeight: variant.carat_weight,
              })),
            }),
            ...(productType === "melees" && {
              shape: apiProduct.shape,
              sieveSizes: (apiProduct.sieve_sizes || []).map((size) => ({
                ...size,
                sieveSize: size.size,
                colorRange: size.color_range,
                clarityRange: size.clarity_range,
                pricePerCarat: size.price_per_carat,
              })),
              variants: (apiProduct.sieve_sizes || []).map((size) => ({
                id: size.id,
                sieveSize: size.size,
                colorRange: size.color_range,
                clarityRange: size.clarity_range,
                price: size.price_per_carat,
              })),
            }),
            ...(productType === "alphabets" && {
              character: apiProduct.character,
              colorRange: apiProduct.color_range,
              clarityRange: apiProduct.clarity_range,
              variants: (apiProduct.variants || []).map((variant) => ({
                ...variant,
                caratWeight: variant.carat_weight,
              })),
            }),
          };

          setProductData(transformedProduct);
        } else {
          console.error(`Product with SKU ${id} not found`);
          setProductData(null);
          toast.error("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProductData(null);
        toast.error("Failed to load product data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id, reloadKey]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle media delete (calls admin API)
  const handleDeleteMedia = async (mediaLink, mediaType) => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const FILELINK_PREFIX = "/api/media/";
      let filename = "";
      try {
        // Support absolute URLs and relative links
        const link = mediaLink || "";
        const idx = link.indexOf(FILELINK_PREFIX);
        if (idx !== -1) {
          filename = link.substring(idx + FILELINK_PREFIX.length);
        } else {
          filename = link.split("/").pop() || "";
        }
      } catch (e) {
        filename = mediaLink;
      }

      if (!filename) {
        toast.error("Unable to determine filename for deletion");
        return;
      }

      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `/api/admin/product/media-delete`,
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        data: { filename },
      };

      const response = await axios.request(config);
      if (response?.data?.status) {
        // Optimistically update local state
        setProductData((prev) => {
          if (!prev) return prev;
          const updated = { ...prev };
          if (mediaType === "image") {
            updated.images = (prev.images || []).filter((i) => i !== mediaLink);
          } else if (mediaType === "video") {
            updated.video = (prev.video || []).filter((v) => v !== mediaLink);
          }
          // Also remove from media list if present
          if (prev.media) {
            updated.media = prev.media.filter((m) => m.filelink !== mediaLink);
          }
          return updated;
        });
        toast.success(`${mediaType} deleted successfully!`);
      } else {
        throw new Error(response?.data?.message || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error(error?.message || "Failed to delete media");
    }
  };

  // Handle variant edit
  const handleEditVariant = (variant) => {
    setEditingVariant(variant.id);
    if (productData.productType === "diamond") {
      setEditedVariantData({
        color: variant.color,
        clarity: variant.clarity,
        caratWeight: variant.caratWeight,
        price: variant.price,
      });
    } else if (productData.productType === "melee") {
      setEditedVariantData({
        sieveSize: variant.sieveSize,
        colorRange: variant.colorRange,
        clarityRange: variant.clarityRange,
        price: variant.price,
      });
    } else if (productData.productType === "colorstone") {
      setEditedVariantData({
        dimension: variant.dimension,
        shape: variant.shape,
        caratWeight: variant.caratWeight,
        price: variant.price,
      });
    } else if (productData.productType === "cuts") {
      setEditedVariantData({
        caratWeight: variant.caratWeight,
        dimension: variant.dimension,
        price: variant.price,
      });
    } else if (productData.productType === "alphabet") {
      setEditedVariantData({
        caratWeight: variant.caratWeight,
        price: variant.price,
      });
    } else if (productData.productType === "layout") {
      setEditedVariantData({
        shape: variant.shape,
        totalPcs: variant.totalPcs,
        totalCaratWeight: variant.totalCaratWeight,
        dimensions: variant.dimensions,
        colorRange: variant.colorRange,
        clarityRange: variant.clarityRange,
      });
    }
  };

  // Handle cancel variant edit
  const handleCancelVariantEdit = () => {
    setEditingVariant(null);
    setEditedVariantData({});
  };

  // Handle save variant changes
  const handleSaveVariantChanges = async (variantId) => {
    setSavingVariant(true);
    try {
      // Update the variant locally; actual persistence will happen on Save Product
      setProductData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };

        // Determine the candidate values for uniqueness check
        const current = (prev.variants || []).find((v) => v.id === variantId);
        let candidate = null;
        if (prev.productType === "diamond") {
          candidate = {
            color: (editedVariantData.color ?? current?.color ?? "").trim(),
            clarity: (
              editedVariantData.clarity ??
              current?.clarity ??
              ""
            ).trim(),
            caratWeight: Number(
              editedVariantData.caratWeight ?? current?.caratWeight ?? 0
            ),
          };
        } else if (prev.productType === "colorstone") {
          candidate = {
            dimension: (
              editedVariantData.dimension ??
              current?.dimension ??
              ""
            ).trim(),
            shape: (editedVariantData.shape ?? current?.shape ?? "").trim(),
            caratWeight: Number(
              editedVariantData.caratWeight ?? current?.caratWeight ?? 0
            ),
          };
        }

        // Check for duplicates among other variants
        let duplicate = false;
        if (candidate && prev.productType === "diamond") {
          duplicate = (prev.variants || []).some(
            (v) =>
              v.id !== variantId &&
              (v.color ?? "").trim().toLowerCase() ===
                candidate.color.toLowerCase() &&
              (v.clarity ?? "").trim().toLowerCase() ===
                candidate.clarity.toLowerCase() &&
              Number(v.caratWeight ?? 0) === candidate.caratWeight
          );
        } else if (candidate && prev.productType === "colorstone") {
          duplicate = (prev.variants || []).some(
            (v) =>
              v.id !== variantId &&
              (v.dimension ?? "").trim().toLowerCase() ===
                candidate.dimension.toLowerCase() &&
              (v.shape ?? "").trim().toLowerCase() ===
                candidate.shape.toLowerCase() &&
              Number(v.caratWeight ?? 0) === candidate.caratWeight
          );
        }

        if (duplicate) {
          toast.error(
            "Variant already exists with same Color - Clarity - Carat Weight"
          );
          return prev; // do not apply changes
        }

        updated.variants = (prev.variants || []).map((v) => {
          if (v.id === variantId) {
            return {
              ...v,
              ...(productData.productType === "diamond" && {
                color: editedVariantData.color ?? v.color,
                clarity: editedVariantData.clarity ?? v.clarity,
                caratWeight:
                  editedVariantData.caratWeight !== undefined
                    ? Number(editedVariantData.caratWeight)
                    : v.caratWeight,
                price:
                  editedVariantData.price !== undefined
                    ? Number(editedVariantData.price)
                    : v.price,
              }),
              ...(productData.productType === "melee" && {
                sieveSize:
                  editedVariantData.sieveSize !== undefined
                    ? editedVariantData.sieveSize
                    : v.sieveSize,
                colorRange:
                  editedVariantData.colorRange !== undefined
                    ? editedVariantData.colorRange
                    : v.colorRange,
                clarityRange:
                  editedVariantData.clarityRange !== undefined
                    ? editedVariantData.clarityRange
                    : v.clarityRange,
                price:
                  editedVariantData.price !== undefined
                    ? Number(editedVariantData.price)
                    : v.price,
              }),
              ...(productData.productType === "colorstone" && {
                dimension:
                  editedVariantData.dimension !== undefined
                    ? editedVariantData.dimension
                    : v.dimension,
                shape:
                  editedVariantData.shape !== undefined
                    ? editedVariantData.shape
                    : v.shape,
                caratWeight:
                  editedVariantData.caratWeight !== undefined
                    ? Number(editedVariantData.caratWeight)
                    : v.caratWeight,
                price:
                  editedVariantData.price !== undefined
                    ? Number(editedVariantData.price)
                    : v.price,
              }),
              ...(productData.productType === "cuts" && {
                dimension:
                  editedVariantData.dimension !== undefined
                    ? editedVariantData.dimension
                    : v.dimension,
                caratWeight:
                  editedVariantData.caratWeight !== undefined
                    ? Number(editedVariantData.caratWeight)
                    : v.caratWeight,
                price:
                  editedVariantData.price !== undefined
                    ? Number(editedVariantData.price)
                    : v.price,
              }),
              ...(productData.productType === "alphabet" && {
                caratWeight:
                  editedVariantData.caratWeight !== undefined
                    ? Number(editedVariantData.caratWeight)
                    : v.caratWeight,
                price:
                  editedVariantData.price !== undefined
                    ? Number(editedVariantData.price)
                    : v.price,
              }),
              ...(productData.productType === "layout" && {
                shape:
                  editedVariantData.shape !== undefined
                    ? editedVariantData.shape
                    : v.shape,
                totalPcs:
                  editedVariantData.totalPcs !== undefined
                    ? Number(editedVariantData.totalPcs)
                    : v.totalPcs,
                totalCaratWeight:
                  editedVariantData.totalCaratWeight !== undefined
                    ? Number(editedVariantData.totalCaratWeight)
                    : v.totalCaratWeight,
                dimensions:
                  editedVariantData.dimensions !== undefined
                    ? editedVariantData.dimensions
                    : v.dimensions,
                colorRange:
                  editedVariantData.colorRange !== undefined
                    ? editedVariantData.colorRange
                    : v.colorRange,
                clarityRange:
                  editedVariantData.clarityRange !== undefined
                    ? editedVariantData.clarityRange
                    : v.clarityRange,
              }),
            };
          }
          return v;
        });
        return updated;
      });
      toast.success("Variant updated");
      setEditingVariant(null);
      setEditedVariantData({});
    } catch (error) {
      console.error("Error updating variant locally:", error);
      toast.error("Failed to update variant. Please try again.");
    } finally {
      setSavingVariant(false);
    }
  };

  // Handle variant delete (simple popup)
  const handleDeleteVariant = (variant) => {
    setVariantToDelete(variant);
    setShowVariantDeletePopup(true);
  };

  // Handle confirm variant delete (local + mark for persistence)
  const handleConfirmVariantDelete = async () => {
    setDeletingVariant(true);
    try {
      const id = variantToDelete?.id;
      const isExisting = typeof id === "number" || /^\d+$/.test(String(id));
      if (isExisting) {
        setDeletedVariantIds((prev) =>
          Array.from(new Set([...(prev || []), Number(id)]))
        );
      }

      setProductData((prev) => {
        if (!prev) return prev;
        const updated = { ...prev };
        updated.variants = (prev.variants || []).filter((v) => v.id !== id);
        return updated;
      });

      const productTypeLabel =
        productData.productType === "diamond"
          ? "Diamond"
          : productData.productType === "melee"
          ? "Melee"
          : productData.productType === "colorstone"
          ? "Colorstone"
          : productData.productType === "cuts"
          ? "Cuts"
          : productData.productType === "layout"
          ? "Layout"
          : "Alphabet";
      toast.success(`${productTypeLabel} variant deleted successfully!`);
      setShowVariantDeletePopup(false);
      setVariantToDelete(null);
    } catch (error) {
      console.error("Error deleting variant:", error);
      toast.error("Failed to delete variant. Please try again.");
    } finally {
      setDeletingVariant(false);
    }
  };

  // Handle product edit
  const handleEditProduct = () => {
    setEditingProduct(true);
    setEditedProductData({
      name: productData.name,
      description: productData.description,
      shape: productData.shape,
      certification: productData.certification,
      color: productData.color,
      cutType: productData.cutType,
      colorRange: productData.colorRange,
      clarityRange: productData.clarityRange,
      character: productData.character,
      availability: productData.availability,
    });
  };

  // Handle cancel product edit
  const handleCancelProductEdit = () => {
    setEditingProduct(false);
    setEditedProductData({});
  };

  // Handle save product changes
  const handleSaveProductChanges = async () => {
    setSavingProduct(true);
    try {
      // If product is a diamond, use the diamond edit API with FormData
      if (productData.productType === "diamond") {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const formData = new FormData();

        const name = editedProductData.name ?? productData.name;
        const shape = editedProductData.shape ?? productData.shape;
        const certification =
          editedProductData.certification ?? productData.certification;
        const description =
          editedProductData.description ?? productData.description;
        const isAvailable =
          editedProductData.availability ?? productData.availability ?? false;

        formData.append("name", name ?? "");
        formData.append("shape", shape ?? "");
        formData.append("certification", certification ?? "");
        formData.append("description", description ?? "");
        formData.append("is_available", String(!!isAvailable));

        // Build diamond_variants payload from current variants (including new ones)
        const diamondVariants = (productData.variants || [])
          .map((variant) => ({
            id:
              typeof variant.id === "number" ||
              /^(\d+)$/.test(String(variant.id))
                ? String(variant.id)
                : undefined, // omit id for brand new variants
            color: variant.color,
            clarity: variant.clarity,
            carat_weight: Number(
              variant.caratWeight ?? variant.carat_weight ?? 0
            ),
            price: Number(variant.price ?? 0),
          }))
          .map((v) => {
            const copy = { ...v };
            if (copy.id === undefined) delete copy.id;
            return copy;
          });
        formData.append("diamond_variants", JSON.stringify(diamondVariants));
        if (deletedVariantIds?.length) {
          formData.append(
            "diamond_variants_deleted_ids",
            JSON.stringify(deletedVariantIds)
          );
        }

        // Append new media if any were added during edit mode
        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => formData.append("images", file));
        }
        if (newVideoFiles && newVideoFiles.length > 0) {
          newVideoFiles.forEach((file) => formData.append("videos", file));
        }

        const config = {
          method: "patch",
          maxBodyLength: Infinity,
          url: `/api/admin/product/diamond/edit-diamond?sku=${productData.sku}`,
          headers: {
            Authorization: authToken,
            // Browser will set proper multipart headers
          },
          data: formData,
        };

        const response = await axios.request(config);

        if (response?.data?.status) {
          toast.success("Diamond updated successfully!");
          setEditingProduct(false);
          setEditedProductData({});
          setNewImageFiles([]);
          setNewVideoFiles([]);
          setDeletedVariantIds([]);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error(
            response?.data?.message || "Failed to update diamond"
          );
        }
      } else if (productData.productType === "melee") {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const formData = new FormData();

        const name = editedProductData.name ?? productData.name;
        const shape = editedProductData.shape ?? productData.shape;
        const description =
          editedProductData.description ?? productData.description;
        const isAvailable =
          editedProductData.availability ?? productData.availability ?? false;

        formData.append("name", name ?? "");
        formData.append("shape", shape ?? "");
        formData.append("description", description ?? "");
        formData.append("is_available", String(!!isAvailable));

        // Build sieve_sizes from variants
        const sieveSizes = (productData.variants || [])
          .map((variant) => ({
            id:
              typeof variant.id === "number" ||
              /^(\d+)$/.test(String(variant.id))
                ? String(variant.id)
                : undefined,
            size: variant.sieveSize,
            color_range: variant.colorRange,
            clarity_range: variant.clarityRange,
            price_per_carat: Number(
              variant.price ?? variant.pricePerCarat ?? 0
            ),
          }))
          .map((v) => {
            const copy = { ...v };
            if (copy.id === undefined) delete copy.id;
            return copy;
          });
        formData.append("sieve_sizes", JSON.stringify(sieveSizes));
        if (deletedVariantIds?.length) {
          formData.append(
            "sieve_sizes_deleted_ids",
            JSON.stringify(deletedVariantIds)
          );
        }

        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => formData.append("images", file));
        }
        if (newVideoFiles && newVideoFiles.length > 0) {
          newVideoFiles.forEach((file) => formData.append("videos", file));
        }

        const config = {
          method: "patch",
          maxBodyLength: Infinity,
          url: `/api/admin/product/melee/edit-melee?sku=${productData.sku}`,
          headers: {
            Authorization: authToken,
          },
          data: formData,
        };

        const response = await axios.request(config);

        if (response?.data?.status) {
          toast.success("Melee updated successfully!");
          setEditingProduct(false);
          setEditedProductData({});
          setNewImageFiles([]);
          setNewVideoFiles([]);
          setDeletedVariantIds([]);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error(response?.data?.message || "Failed to update melee");
        }
      } else if (productData.productType === "cuts") {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const formData = new FormData();

        const name = editedProductData.name ?? productData.name;
        const shape = editedProductData.shape ?? productData.shape;
        const cutType = editedProductData.cutType ?? productData.cutType;
        const colorRange =
          editedProductData.colorRange ?? productData.colorRange;
        const clarityRange =
          editedProductData.clarityRange ?? productData.clarityRange;
        const description =
          editedProductData.description ?? productData.description;
        const isAvailable =
          editedProductData.availability ?? productData.availability ?? false;

        formData.append("name", name ?? "");
        formData.append("shape", shape ?? "");
        formData.append("cut_type", cutType ?? "");
        formData.append("color_range", colorRange ?? "");
        formData.append("clarity_range", clarityRange ?? "");
        formData.append("description", description ?? "");
        formData.append("is_available", String(!!isAvailable));

        // Build cut_variants from variants
        const cutVariants = (productData.variants || [])
          .map((variant) => ({
            id:
              typeof variant.id === "number" ||
              /^(\d+)$/.test(String(variant.id))
                ? String(variant.id)
                : undefined,
            dimension: variant.dimension,
            carat_weight: Number(variant.caratWeight ?? 0),
            price: Number(variant.price ?? 0),
          }))
          .map((v) => {
            const copy = { ...v };
            if (copy.id === undefined) delete copy.id;
            return copy;
          });
        formData.append("cut_variants", JSON.stringify(cutVariants));
        if (deletedVariantIds?.length) {
          formData.append(
            "cut_variants_deleted_ids",
            JSON.stringify(deletedVariantIds)
          );
        }

        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => formData.append("images", file));
        }
        if (newVideoFiles && newVideoFiles.length > 0) {
          newVideoFiles.forEach((file) => formData.append("videos", file));
        }

        const config = {
          method: "patch",
          maxBodyLength: Infinity,
          url: `/api/admin/product/cut/edit-cut?sku=${productData.sku}`,
          headers: {
            Authorization: authToken,
          },
          data: formData,
        };

        const response = await axios.request(config);

        if (response?.data?.status) {
          toast.success("Cut updated successfully!");
          setEditingProduct(false);
          setEditedProductData({});
          setNewImageFiles([]);
          setNewVideoFiles([]);
          setDeletedVariantIds([]);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error(response?.data?.message || "Failed to update cut");
        }
      } else if (productData.productType === "colorstone") {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const formData = new FormData();

        const name = editedProductData.name ?? productData.name;
        const color = editedProductData.color ?? productData.color;
        const certification =
          editedProductData.certification ?? productData.certification;
        const description =
          editedProductData.description ?? productData.description;
        const isAvailable =
          editedProductData.availability ?? productData.availability ?? false;

        formData.append("name", name ?? "");
        formData.append("color", color ?? "");
        formData.append("certification", certification ?? "");
        formData.append("description", description ?? "");
        formData.append("is_available", String(!!isAvailable));

        // Build color_stone_variants from variants
        const colorStoneVariants = (productData.variants || [])
          .map((variant) => ({
            id:
              typeof variant.id === "number" ||
              /^(\d+)$/.test(String(variant.id))
                ? String(variant.id)
                : undefined,
            shape: variant.shape,
            dimension: variant.dimension,
            carat_weight: Number(variant.caratWeight ?? 0),
            price: Number(variant.price ?? 0),
          }))
          .map((v) => {
            const copy = { ...v };
            if (copy.id === undefined) delete copy.id;
            return copy;
          });
        formData.append(
          "color_stone_variants",
          JSON.stringify(colorStoneVariants)
        );
        if (deletedVariantIds?.length) {
          formData.append(
            "color_stone_variants_deleted_ids",
            JSON.stringify(deletedVariantIds)
          );
        }

        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => formData.append("images", file));
        }
        if (newVideoFiles && newVideoFiles.length > 0) {
          newVideoFiles.forEach((file) => formData.append("videos", file));
        }

        const config = {
          method: "patch",
          maxBodyLength: Infinity,
          url: `/api/admin/product/color-stone/edit-color-stone?sku=${productData.sku}`,
          headers: {
            Authorization: authToken,
          },
          data: formData,
        };

        const response = await axios.request(config);

        if (response?.data?.status) {
          toast.success("Color stone updated successfully!");
          setEditingProduct(false);
          setEditedProductData({});
          setNewImageFiles([]);
          setNewVideoFiles([]);
          setDeletedVariantIds([]);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error(
            response?.data?.message || "Failed to update color stone"
          );
        }
      } else if (productData.productType === "alphabet") {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const formData = new FormData();

        const name = editedProductData.name ?? productData.name;
        const character = editedProductData.character ?? productData.character;
        const colorRange =
          editedProductData.colorRange ?? productData.colorRange;
        const clarityRange =
          editedProductData.clarityRange ?? productData.clarityRange;
        const description =
          editedProductData.description ?? productData.description;
        const isAvailable =
          editedProductData.availability ?? productData.availability ?? false;

        formData.append("name", name ?? "");
        formData.append("character", character ?? "");
        formData.append("color_range", colorRange ?? "");
        formData.append("clarity_range", clarityRange ?? "");
        formData.append("description", description ?? "");
        formData.append("is_available", String(!!isAvailable));

        const alphabetVariants = (productData.variants || [])
          .map((variant) => ({
            id:
              typeof variant.id === "number" || /^\d+$/.test(String(variant.id))
                ? String(variant.id)
                : undefined,
            carat_weight: Number(
              variant.caratWeight ?? variant.carat_weight ?? 0
            ),
            price: Number(variant.price ?? 0),
          }))
          .map((v) => {
            const copy = { ...v };
            if (copy.id === undefined) delete copy.id;
            return copy;
          });
        formData.append("alphabet_variants", JSON.stringify(alphabetVariants));
        if (deletedVariantIds?.length) {
          formData.append(
            "alphabet_variants_deleted_ids",
            JSON.stringify(deletedVariantIds)
          );
        }

        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => formData.append("images", file));
        }
        if (newVideoFiles && newVideoFiles.length > 0) {
          newVideoFiles.forEach((file) => formData.append("videos", file));
        }

        const config = {
          method: "patch",
          maxBodyLength: Infinity,
          url: `/api/admin/product/alphabet/edit-alphabet?sku=${productData.sku}`,
          headers: {
            Authorization: authToken,
          },
          data: formData,
        };
        const response = await axios.request(config);
        if (response?.data?.status) {
          toast.success("Alphabet updated successfully!");
          setEditingProduct(false);
          setEditedProductData({});
          setNewImageFiles([]);
          setNewVideoFiles([]);
          setDeletedVariantIds([]);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error(
            response?.data?.message || "Failed to update alphabet"
          );
        }
      } else if (productData.productType === "layout") {
        const authToken = getAuthToken();
        if (!authToken) {
          toast.error("Authentication token not found. Please login again.");
          return;
        }

        const formData = new FormData();

        const name = editedProductData.name ?? productData.name;
        const layoutType =
          editedProductData.layoutType ?? productData.layoutType;
        const description =
          editedProductData.description ?? productData.description;
        const isAvailable =
          editedProductData.availability ?? productData.availability ?? false;
        const layoutPrice =
          editedProductData.layoutPrice ??
          productData.layoutPrice ??
          productData.price ??
          0;

        formData.append("name", name ?? "");
        formData.append("layout_type", layoutType ?? "");
        formData.append("description", description ?? "");
        formData.append("is_available", String(!!isAvailable));
        formData.append("price", String(Number(layoutPrice) || 0));

        const diamondDetails = (productData.variants || [])
          .map((variant) => ({
            id:
              typeof variant.id === "number" || /^\d+$/.test(String(variant.id))
                ? String(variant.id)
                : undefined,
            shape: variant.shape ?? "",
            pcs: Number(variant.totalPcs ?? variant.pcs ?? 0),
            carat_weight: Number(
              variant.totalCaratWeight ?? variant.carat_weight ?? 0
            ),
            dimension: variant.dimensions ?? variant.dimension ?? "",
            color_range: variant.colorRange ?? variant.color_range ?? "",
            clarity_range: variant.clarityRange ?? variant.clarity_range ?? "",
          }))
          .map((v) => {
            const copy = { ...v };
            if (copy.id === undefined) delete copy.id;
            return copy;
          });
        formData.append("diamond_details", JSON.stringify(diamondDetails));
        if (deletedVariantIds?.length) {
          formData.append(
            "diamond_details_deleted_ids",
            JSON.stringify(deletedVariantIds)
          );
        }

        if (newImageFiles && newImageFiles.length > 0) {
          newImageFiles.forEach((file) => formData.append("images", file));
        }
        if (newVideoFiles && newVideoFiles.length > 0) {
          newVideoFiles.forEach((file) => formData.append("videos", file));
        }

        const config = {
          method: "patch",
          maxBodyLength: Infinity,
          url: `/api/admin/product/layout/edit-layout?sku=${productData.sku}`,
          headers: {
            Authorization: authToken,
          },
          data: formData,
        };
        const response = await axios.request(config);
        if (response?.data?.status) {
          toast.success("Layout updated successfully!");
          setEditingProduct(false);
          setEditedProductData({});
          setNewImageFiles([]);
          setNewVideoFiles([]);
          setDeletedVariantIds([]);
          setReloadKey((k) => k + 1);
        } else {
          throw new Error(response?.data?.message || "Failed to update layout");
        }
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product. Please try again.");
    } finally {
      setSavingProduct(false);
    }
  };

  // Handle product delete (complex popup with SKU)
  const handleDeleteProduct = () => {
    setShowProductDeletePopup(true);
    setDeleteConfirmationText("");
  };

  // Handle confirm product delete
  const handleConfirmProductDelete = async () => {
    if (deleteConfirmationText !== productData.sku) {
      toast.error("Please enter the correct SKU to confirm deletion");
      return;
    }

    setDeletingProduct(true);
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authentication token not found. Please login again.");
        return;
      }

      const config = {
        method: "delete",
        maxBodyLength: Infinity,
        url: `/api/admin/product/delete-product?sku=${productData.sku}`,
        headers: {
          Authorization: authToken,
        },
      };

      const response = await axios.request(config);

      if (response.data.status) {
        const productTypeLabel =
          productData.productType === "diamond"
            ? "Diamond"
            : productData.productType === "melee"
            ? "Melee"
            : productData.productType === "colorstone"
            ? "Colorstone"
            : productData.productType === "cuts"
            ? "Cuts"
            : productData.productType === "layout"
            ? "Layout"
            : "Alphabet";
        toast.success(
          `${productTypeLabel} product ${productData.sku} deleted successfully!`
        );
        // Redirect to products page
        window.location.href = "/admin/products";
      } else {
        throw new Error(response.data.message || "Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete product. Please try again."
      );
    } finally {
      setDeletingProduct(false);
    }
  };

  // Handle input change for variant editing
  const handleVariantInputChange = (field, value) => {
    setEditedVariantData((prev) => ({
      ...prev,
      [field]:
        field === "caratWeight" || field === "price"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  // Handle input change for product editing
  const handleProductInputChange = (field, value) => {
    setEditedProductData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add a new empty variant for all supported product types
  const handleAddVariant = () => {
    if (
      productData.productType !== "diamond" &&
      productData.productType !== "melee" &&
      productData.productType !== "cuts" &&
      productData.productType !== "colorstone" &&
      productData.productType !== "alphabet" &&
      productData.productType !== "layout"
    )
      return;
    const tempId = `new-${Date.now()}-${newVariantTempIdCounter}`;
    setNewVariantTempIdCounter((c) => c + 1);
    const newVariant =
      productData.productType === "diamond"
        ? {
            id: tempId,
            color: "",
            clarity: "",
            caratWeight: 0,
            price: 0,
          }
        : productData.productType === "melee"
        ? {
            id: tempId,
            sieveSize: "",
            colorRange: "",
            clarityRange: "",
            price: 0,
          }
        : productData.productType === "cuts"
        ? {
            id: tempId,
            dimension: "",
            caratWeight: 0,
            price: 0,
          }
        : productData.productType === "colorstone"
        ? {
            id: tempId,
            dimension: "",
            shape: "",
            caratWeight: 0,
            price: 0,
          }
        : productData.productType === "alphabet"
        ? {
            id: tempId,
            caratWeight: 0,
            price: 0,
          }
        : {
            id: tempId,
            shape: "",
            totalPcs: 0,
            totalCaratWeight: 0,
            dimensions: "",
            colorRange: "",
            clarityRange: "",
          };
    setProductData((prev) => {
      const existing = prev?.variants || [];
      const updated = {
        ...prev,
        variants: [...existing, newVariant],
      };
      return updated;
    });
    setEditingVariant(tempId);
    setEditedVariantData(
      productData.productType === "diamond"
        ? { color: "", clarity: "", caratWeight: 0, price: 0 }
        : productData.productType === "melee"
        ? { sieveSize: "", colorRange: "", clarityRange: "", price: 0 }
        : productData.productType === "cuts"
        ? { dimension: "", caratWeight: 0, price: 0 }
        : productData.productType === "colorstone"
        ? { dimension: "", shape: "", caratWeight: 0, price: 0 }
        : productData.productType === "alphabet"
        ? { caratWeight: 0, price: 0 }
        : {
            shape: "",
            totalPcs: 0,
            totalCaratWeight: 0,
            dimensions: "",
            colorRange: "",
            clarityRange: "",
          }
    );
    toast.success(
      "New variant added. Fill the fields and click Save on the row."
    );
  };

  // Media upload handlers (edit mode only)
  const handleAddImages = (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setNewImageFiles((prev) => [...prev, ...list]);
    // Optionally show temporary previews by object URLs; skipping for brevity
    toast.success(`${list.length} image(s) added`);
  };

  const handleAddVideos = (files) => {
    const list = Array.from(files || []);
    if (list.length === 0) return;
    setNewVideoFiles((prev) => [...prev, ...list]);
    toast.success(`${list.length} video(s) added`);
  };

  // Loading state
  if (loading || !productData) {
    return (
      <div>
        <AdminRoute>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-4 overflow-auto bg-whitesmoke">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-lg text-gray-600">
                    Loading product...
                  </p>
                </div>
              </div>
            </div>
          </div>
          <ToastContainer />
        </AdminRoute>
      </div>
    );
  }

  return (
    <AdminRoute>
      <div className="flex h-screen">
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto bg-whitesmoke ">
          <div className="flex flex-col ">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Link
                  href="/admin/products"
                  className="mr-4 hover:bg-gray-200 rounded-lg p-2"
                >
                  <svg
                    className="w-6 h-6"
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
                </Link>
                <h1 className="text-xl font-semibold text-gray-800">
                  Product Details
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {editingProduct ? (
                  <>
                    <button
                      onClick={handleSaveProductChanges}
                      disabled={savingProduct}
                      className="cursor-pointer px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {savingProduct ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancelProductEdit}
                      disabled={savingProduct}
                      className="cursor-pointer px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleEditProduct}
                      className="cursor-pointer px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Product
                    </button>
                    <button
                      onClick={handleDeleteProduct}
                      className="cursor-pointer px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Product
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="p-2 bg-white rounded-xl flex flex-col gap-4">
              <div className=" border border-gray-200 rounded-xl m-2">
                <div className="flex flex-col">
                  <div className="flex flex-col m-4">
                    <div className="flex items-center gap-4">
                      {productData?.media &&
                      productData.media.length > 0 &&
                      productData.media[0].file_type === "image" ? (
                        <Image
                          src={productData.media[0].filelink}
                          alt="Product Image"
                          width={75}
                          height={75}
                          className="border border-gray-200 rounded-lg"
                        />
                      ) : (
                        <div className="w-[75px] h-[75px] bg-gray-200 border border-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}

                      <h1 className="text-2xl font-semibold text-gray-800">
                        {productData?.name || "Loading..."}
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col m-4 border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 items-center gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm text-gray-500">Product Name</p>
                      <div className="text-sm text-gray-800">
                        {editingProduct ? (
                          <input
                            type="text"
                            value={editedProductData.name || ""}
                            onChange={(e) =>
                              handleProductInputChange("name", e.target.value)
                            }
                            className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            placeholder="Product Name"
                          />
                        ) : (
                          <p className="text-sm text-gray-800">
                            {productData.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm text-gray-500">Product ID</p>
                      <div className="text-sm text-gray-800">
                        {productData.productId}
                      </div>
                    </div>
                    {/* editable color */}
                    {productData.productType === "colorstone" && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Color</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <input
                              type="text"
                              value={
                                editedProductData.color || productData.color
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "color",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Color"
                            />
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.color}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {(productData.productType === "diamond" ||
                      productData.productType === "melee" ||
                      productData.productType === "cuts") && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Shape</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <select
                              value={
                                editedProductData.shape ||
                                productData.shape ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "shape",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="" disabled>
                                Select shape
                              </option>
                              {shapeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.shape}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    {/* editable cut type */}

                    {productData.productType === "cuts" && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Cut Type</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <select
                              value={
                                editedProductData.cutType ||
                                productData.cutType ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "cutType",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="" disabled>
                                Select cut type
                              </option>
                              {cutTypeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.cutType}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {(productData.productType === "cuts" ||
                      productData.productType === "alphabet") && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Color Range</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <select
                              value={
                                editedProductData.colorRange ||
                                productData.colorRange ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "colorRange",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="" disabled>
                                Select color range
                              </option>
                              {colorRanges.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.colorRange}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {(productData.productType === "cuts" ||
                      productData.productType === "alphabet") && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Clarity Range</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <select
                              value={
                                editedProductData.clarityRange ||
                                productData.clarityRange ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "clarityRange",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="" disabled>
                                Select clarity range
                              </option>
                              {clarityRanges.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.clarityRange}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* editable character */}
                    {productData.productType === "alphabet" && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Character</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <input
                              type="text"
                              value={
                                editedProductData.character ||
                                productData.character
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "character",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Character"
                            />
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.character}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {productData.productType === "layout" && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Layout Type</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <select
                              value={
                                editedProductData.layoutType ||
                                productData.layoutType ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "layoutType",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="" disabled>
                                Select layout type
                              </option>
                              {layoutTypeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.layoutType}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm text-gray-500">SKU</p>
                      <div className="text-sm text-gray-800">
                        {productData.sku}
                      </div>
                    </div>

                    {productData.productType === "layout" && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Layout Price</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <input
                              type="number"
                              value={
                                editedProductData.layoutPrice ||
                                productData.layoutPrice
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "layoutPrice",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Layout Price"
                            />
                          ) : (
                            <p className="text-sm text-gray-800">
                              $
                              {productData?.layoutPrice?.toLocaleString() ||
                                "0"}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <p className="text-sm text-gray-500">Availability</p>
                      <div className="text-sm text-gray-800">
                        {editingProduct ? (
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={
                                !!(editedProductData.availability !== undefined
                                  ? editedProductData.availability
                                  : productData.availability)
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "availability",
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                            />
                            <span className="ml-2 text-sm text-gray-800">
                              {editedProductData.availability !== undefined
                                ? editedProductData.availability
                                : productData.availability
                                ? "Available"
                                : "Not Available"}
                            </span>
                          </label>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              productData.availability
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {productData.availability
                              ? "Available"
                              : "Not Available"}
                          </span>
                        )}
                      </div>
                    </div>
                    {(productData.productType === "diamond" ||
                      productData.productType === "colorstone") && (
                      <div className="grid grid-cols-2 gap-4">
                        <p className="text-sm text-gray-500">Certification</p>
                        <div className="text-sm text-gray-800">
                          {editingProduct ? (
                            <select
                              value={
                                editedProductData.certification ||
                                productData.certification ||
                                ""
                              }
                              onChange={(e) =>
                                handleProductInputChange(
                                  "certification",
                                  e.target.value
                                )
                              }
                              className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                              <option value="" disabled>
                                Select certification
                              </option>
                              {certificationOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <p className="text-sm text-gray-800">
                              {productData.certification}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col m-4 border-t border-gray-200 pt-4">
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-gray-500">Description</p>
                    {editingProduct ? (
                      <textarea
                        value={editedProductData.description || ""}
                        onChange={(e) =>
                          handleProductInputChange(
                            "description",
                            e.target.value
                          )
                        }
                        rows={4}
                        className="text-sm text-gray-800 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 resize-vertical"
                        placeholder="Product description..."
                      />
                    ) : (
                      <p className="text-sm text-gray-800">
                        {productData.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl m-2 p-4">
                <h1 className="text-lg font-semibold text-gray-800 mb-4">
                  {productData.productType === "diamond"
                    ? "Diamond"
                    : productData.productType === "melee"
                    ? "Melee"
                    : productData.productType === "colorstone"
                    ? "Colorstone"
                    : productData.productType === "cuts"
                    ? "Cuts"
                    : productData.productType === "alphabet"
                    ? "Alphabet"
                    : productData.productType === "layout"
                    ? "Layout"
                    : "Unknown"}{" "}
                  Variants
                </h1>
                {productData.productType === "diamond" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("color")}
                          >
                            Color{" "}
                            {sortBy === "color" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("clarity")}
                          >
                            Clarity{" "}
                            {sortBy === "clarity" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("caratWeight")}
                          >
                            Carat Weight{" "}
                            {sortBy === "caratWeight" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("price")}
                          >
                            Price{" "}
                            {sortBy === "price" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border border-gray-200">
                        {sortedVariants.map((variant) => (
                          <tr
                            key={variant.id}
                            className="hover:bg-gray-50 border border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.color || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Color</option>
                                  {colorOptions.map((color) => (
                                    <option key={color} value={color}>
                                      {color}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.color
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.clarity || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "clarity",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Clarity</option>
                                  {clarityOptions.map((clarity) => (
                                    <option key={clarity} value={clarity}>
                                      {clarity}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.clarity
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedVariantData.caratWeight || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "caratWeight",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Carat Weight"
                                />
                              ) : (
                                variant.caratWeight
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  value={editedVariantData.price || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Price"
                                />
                              ) : (
                                `$${variant.price.toLocaleString()}`
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {editingVariant === variant.id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveVariantChanges(variant.id)
                                      }
                                      disabled={savingVariant}
                                      className="cursor-pointer text-green-500 hover:text-green-700 p-1 rounded disabled:opacity-50"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelVariantEdit}
                                      disabled={savingVariant}
                                      className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded disabled:opacity-50"
                                      title="Cancel edit"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditVariant(variant)}
                                      className="cursor-pointer text-primary-500 hover:text-primary-700 p-1 rounded"
                                      title="Edit variant"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(variant)
                                      }
                                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {editingProduct && (
                      <div className="mt-3">
                        <button
                          onClick={handleAddVariant}
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded"
                        >
                          + Add Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {productData.productType === "melee" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("sieveSize")}
                          >
                            Sieve Size{" "}
                            {sortBy === "sieveSize" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("colorRange")}
                          >
                            Color Range{" "}
                            {sortBy === "colorRange" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("clarityRange")}
                          >
                            Clarity Range{" "}
                            {sortBy === "clarityRange" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("price")}
                          >
                            Price Per Carat{" "}
                            {sortBy === "price" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border border-gray-200">
                        {sortedVariants.map((variant) => (
                          <tr
                            key={variant.id}
                            className="hover:bg-gray-50 border border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.sieveSize || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "sieveSize",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Size</option>
                                  {sieveSizeOptions.map((size) => (
                                    <option key={size} value={size}>
                                      {size}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.sieveSize
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.colorRange || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "colorRange",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Color Range</option>
                                  {colorRanges.map((range) => (
                                    <option key={range} value={range}>
                                      {range}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.colorRange
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.clarityRange || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "clarityRange",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Clarity Range</option>
                                  {clarityRanges.map((range) => (
                                    <option key={range} value={range}>
                                      {range}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.clarityRange
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  value={editedVariantData.price || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Price Per Carat"
                                />
                              ) : (
                                `$${variant.price.toLocaleString()}`
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {editingVariant === variant.id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveVariantChanges(variant.id)
                                      }
                                      disabled={savingVariant}
                                      className="cursor-pointer text-green-500 hover:text-green-700 p-1 rounded disabled:opacity-50"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelVariantEdit}
                                      disabled={savingVariant}
                                      className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded disabled:opacity-50"
                                      title="Cancel edit"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditVariant(variant)}
                                      className="cursor-pointer text-primary-500 hover:text-primary-700 p-1 rounded"
                                      title="Edit variant"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(variant)
                                      }
                                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {editingProduct && (
                      <div className="mt-3">
                        <button
                          onClick={handleAddVariant}
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded"
                        >
                          + Add Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {productData.productType === "colorstone" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("dimension")}
                          >
                            Dimension{" "}
                            {sortBy === "dimension" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("shape")}
                          >
                            Shape{" "}
                            {sortBy === "shape" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("caratWeight")}
                          >
                            Carat Weight{" "}
                            {sortBy === "caratWeight" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("price")}
                          >
                            Price{" "}
                            {sortBy === "price" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border border-gray-200">
                        {sortedVariants.map((variant) => (
                          <tr
                            key={variant.id}
                            className="hover:bg-gray-50 border border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="text"
                                  value={editedVariantData.dimension || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "dimension",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Dimension (e.g., 8.1x4.4 mm)"
                                />
                              ) : (
                                variant.dimension
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.shape || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "shape",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Shape</option>
                                  {shapeOptions.map((shape) => (
                                    <option key={shape} value={shape}>
                                      {shape}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.shape
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedVariantData.caratWeight || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "caratWeight",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Carat Weight"
                                />
                              ) : (
                                variant.caratWeight
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  value={editedVariantData.price || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Price"
                                />
                              ) : (
                                `$${variant.price.toLocaleString()}`
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {editingVariant === variant.id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveVariantChanges(variant.id)
                                      }
                                      disabled={savingVariant}
                                      className="cursor-pointer text-green-500 hover:text-green-700 p-1 rounded disabled:opacity-50"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelVariantEdit}
                                      disabled={savingVariant}
                                      className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded disabled:opacity-50"
                                      title="Cancel edit"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditVariant(variant)}
                                      className="cursor-pointer text-primary-500 hover:text-primary-700 p-1 rounded"
                                      title="Edit variant"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(variant)
                                      }
                                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {editingProduct && (
                      <div className="mt-3">
                        <button
                          onClick={handleAddVariant}
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded"
                        >
                          + Add Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {productData.productType === "cuts" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("caratWeight")}
                          >
                            Carat Weight{" "}
                            {sortBy === "caratWeight" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("dimension")}
                          >
                            Dimension{" "}
                            {sortBy === "dimension" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("price")}
                          >
                            Price{" "}
                            {sortBy === "price" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border border-gray-200">
                        {sortedVariants.map((variant) => (
                          <tr
                            key={variant.id}
                            className="hover:bg-gray-50 border border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedVariantData.caratWeight || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "caratWeight",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Carat Weight"
                                />
                              ) : (
                                variant.caratWeight
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="text"
                                  value={editedVariantData.dimension || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "dimension",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Dimension (e.g., 6.2x6.7 mm)"
                                />
                              ) : (
                                variant.dimension
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  value={editedVariantData.price || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Price"
                                />
                              ) : (
                                `$${variant.price.toLocaleString()}`
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {editingVariant === variant.id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveVariantChanges(variant.id)
                                      }
                                      disabled={savingVariant}
                                      className="cursor-pointer text-green-500 hover:text-green-700 p-1 rounded disabled:opacity-50"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelVariantEdit}
                                      disabled={savingVariant}
                                      className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded disabled:opacity-50"
                                      title="Cancel edit"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditVariant(variant)}
                                      className="cursor-pointer text-primary-500 hover:text-primary-700 p-1 rounded"
                                      title="Edit variant"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(variant)
                                      }
                                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {editingProduct && (
                      <div className="mt-3">
                        <button
                          onClick={handleAddVariant}
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded"
                        >
                          + Add Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {productData.productType === "alphabet" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("caratWeight")}
                          >
                            Carat Weight{" "}
                            {sortBy === "caratWeight" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th
                            className="px-4 py-2 text-left text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 select-none"
                            onClick={() => handleSort("price")}
                          >
                            Price{" "}
                            {sortBy === "price" &&
                              (sortOrder === "asc" ? "↑" : "↓")}
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border border-gray-200">
                        {sortedVariants.map((variant) => (
                          <tr
                            key={variant.id}
                            className="hover:bg-gray-50 border border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={editedVariantData.caratWeight || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "caratWeight",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Carat Weight"
                                />
                              ) : (
                                variant.caratWeight
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  value={editedVariantData.price || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Price"
                                />
                              ) : (
                                `$${variant.price.toLocaleString()}`
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {editingVariant === variant.id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveVariantChanges(variant.id)
                                      }
                                      disabled={savingVariant}
                                      className="cursor-pointer text-green-500 hover:text-green-700 p-1 rounded disabled:opacity-50"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelVariantEdit}
                                      disabled={savingVariant}
                                      className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded disabled:opacity-50"
                                      title="Cancel edit"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditVariant(variant)}
                                      className="cursor-pointer text-primary-500 hover:text-primary-700 p-1 rounded"
                                      title="Edit variant"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(variant)
                                      }
                                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {editingProduct && (
                      <div className="mt-3">
                        <button
                          onClick={handleAddVariant}
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded"
                        >
                          + Add Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {productData.productType === "layout" && (
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Shape
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Total Pcs
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Total Carat Weight
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Dimensions
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Color Range
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Clarity Range
                          </th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white border border-gray-200">
                        {productData?.variants?.map((variant) => (
                          <tr
                            key={variant.id}
                            className="hover:bg-gray-50 border border-gray-200"
                          >
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.shape || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "shape",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Shape</option>
                                  {shapeOptions.map((shape) => (
                                    <option key={shape} value={shape}>
                                      {shape}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.shape
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  value={editedVariantData.totalPcs || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "totalPcs",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Total Pcs"
                                />
                              ) : (
                                variant.totalPcs
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={
                                    editedVariantData.totalCaratWeight || ""
                                  }
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "totalCaratWeight",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Total Carat Weight"
                                />
                              ) : (
                                variant.totalCaratWeight
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <input
                                  type="text"
                                  value={editedVariantData.dimensions || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "dimensions",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                  placeholder="Dimensions"
                                />
                              ) : (
                                variant.dimensions
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.colorRange || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "colorRange",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Color Range</option>
                                  {colorRanges.map((range) => (
                                    <option key={range} value={range}>
                                      {range}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.colorRange
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800">
                              {editingVariant === variant.id ? (
                                <select
                                  value={editedVariantData.clarityRange || ""}
                                  onChange={(e) =>
                                    handleVariantInputChange(
                                      "clarityRange",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                >
                                  <option value="">Select Clarity Range</option>
                                  {clarityRanges.map((range) => (
                                    <option key={range} value={range}>
                                      {range}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                variant.clarityRange
                              )}
                            </td>
                            <td className="px-4 py-2">
                              <div className="flex items-center gap-2">
                                {editingVariant === variant.id ? (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleSaveVariantChanges(variant.id)
                                      }
                                      disabled={savingVariant}
                                      className="cursor-pointer text-green-500 hover:text-green-700 p-1 rounded disabled:opacity-50"
                                      title="Save changes"
                                    >
                                      <Save className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={handleCancelVariantEdit}
                                      disabled={savingVariant}
                                      className="cursor-pointer text-gray-500 hover:text-gray-700 p-1 rounded disabled:opacity-50"
                                      title="Cancel edit"
                                    >
                                      <X className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => handleEditVariant(variant)}
                                      className="cursor-pointer text-primary-500 hover:text-primary-700 p-1 rounded"
                                      title="Edit variant"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteVariant(variant)
                                      }
                                      className="cursor-pointer text-red-500 hover:text-red-700 p-1 rounded"
                                      title="Delete variant"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                        {/* totals */}
                        <tr className="bg-gray-100 border border-gray-200">
                          <td className="px-4 py-2 text-sm text-gray-800 font-bold">
                            Total
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800 font-bold">
                            {productData?.variants?.reduce(
                              (acc, variant) => acc + (variant?.totalPcs || 0),
                              0
                            ) || 0}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-800 font-bold">
                            {productData?.variants?.reduce(
                              (acc, variant) =>
                                acc + (variant?.totalCaratWeight || 0),
                              0
                            ) || 0}
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    {editingProduct && (
                      <div className="mt-3">
                        <button
                          onClick={handleAddVariant}
                          className="cursor-pointer px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded"
                        >
                          + Add Variant
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Media Section */}
              <MediaSection
                images={productData?.images || []}
                videos={productData?.video || []}
                editingEnabled={editingProduct}
                onDeleteMedia={handleDeleteMedia}
                onAddImages={(files) => handleAddImages(files)}
                onAddVideos={(files) => handleAddVideos(files)}
                newImageFiles={newImageFiles}
                newVideoFiles={newVideoFiles}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Simple Variant Delete Popup */}
      <VariantDeletePopup
        open={showVariantDeletePopup}
        productType={productData?.productType}
        variant={variantToDelete}
        deleting={deletingVariant}
        onCancel={() => {
          setShowVariantDeletePopup(false);
          setVariantToDelete(null);
        }}
        onConfirm={handleConfirmVariantDelete}
      />

      {/* Product Delete Popup with SKU Confirmation */}
      <ProductDeletePopup
        open={showProductDeletePopup}
        productType={productData?.productType}
        product={productData}
        confirmationText={deleteConfirmationText}
        setConfirmationText={(text) => setDeleteConfirmationText(text)}
        deleting={deletingProduct}
        onCancel={() => {
          setShowProductDeletePopup(false);
          setDeleteConfirmationText("");
        }}
        onConfirm={handleConfirmProductDelete}
      />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AdminRoute>
  );
}
