"use client";

import { AdminRoute } from "@/components/ProtectedRoute";
import React, { useState, useMemo, useEffect, use } from "react";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Edit, Trash2, X, Save, AlertTriangle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import productsDataArray from "../../../../../products_dummy2.json";


export default function page({params}) {
  // Unwrap params Promise using React.use()
  const unwrappedParams = use(params);
  const colorOptions = [
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  const clarityOptions = [
    "FL",
    "IF",
    "VVS1",
    "VVS2",
    "VS1",
    "VS2",
    "SI1",
    "SI2",
    "I1",
    "I2",
    "I3",
  ];

  const colorRanges = [
    "D-F",
    "G-H",
    "I-J",
    "K-L",
    "M-N",
    "O-P",
    "Q-R",
    "S-T",
    "U-V",
    "W-X",
    "Y-Z",
  ];

  const clarityRanges = ["FL-IF", "VVS1-VVS2", "VS1-VS2", "SI1-SI2", "I1-I3"];

  const layoutTypeOptions = [
    "Bracelet",
    "Necklace",
    "Anklet",
    "Brooch",
    "Choker",
    "Tennis Bracelet",
  ];

  const cutTypeOptions = [
    "Cut",
    "Portuguese Cut",
    "Rose Cut",
    "Old Mine Cut",
    "Step Cut",
  ];

  // Sieve size options in mm
  const sieveSizeOptions = [
    "0.5mm - 0.7mm",
    "0.7mm - 0.9mm",
    "0.9mm - 1.1mm",
    "1.1mm - 1.3mm",
    "1.3mm - 1.5mm",
    "1.5mm - 1.7mm",
    "1.7mm - 1.9mm",
    "1.9mm - 2.1mm",
    "2.1mm - 2.3mm",
    "2.3mm - 2.5mm",
    "2.5mm - 2.7mm",
    "2.7mm - 2.9mm",
    "2.9mm - 3.1mm",
    "3.1mm - 3.3mm",
    "3.3mm - 3.5mm",
  ];

  const shapeOptions = [
    "Round",
    "Oval",
    "Emerald",
    "Princess",
    "Asscher",
    "Cushion",
    "Radiant",
    "Pear",
    "Marquise",
    "Heart",
    "Baguette",
    "Trillion",
  ];

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

  // Delete functionality state for variants (simple popup)
  const [showVariantDeletePopup, setShowVariantDeletePopup] = useState(false);
  const [variantToDelete, setVariantToDelete] = useState(null);
  const [deletingVariant, setDeletingVariant] = useState(false);

  // Delete functionality state for whole product (complex popup with SKU)
  const [showProductDeletePopup, setShowProductDeletePopup] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState("");
  const [deletingProduct, setDeletingProduct] = useState(false);
     const productId = unwrappedParams.id;
  const [productData, setProductData] = useState(null);


  // const productData = {
  //   productId: "683d90f2-a18f-4ea5-9724-6a2dfc832ca3",
  //   name: "Pear Diamond",
  //   shape: "Pear",
  //   sku: "DIA-PEA-002",
  //   certification: "GIA",
  //   description:
  //     "A premium quality pear brilliant diamond certified by GIA. Perfect for fine jewelry.",
  //   availability: true,
  //   images: [""],
  //   video: [""],
  //   variants: [
  //     {
  //       id: 1,
  //       color: "Q",
  //       clarity: "SI1",
  //       caratWeight: 1.42,
  //       price: 7562,
  //     },
  //     {
  //       id: 2,
  //       color: "E",
  //       clarity: "I3",
  //       caratWeight: 1.09,
  //       price: 6296,
  //     },
  //     {
  //       id: 3,
  //       color: "G",
  //       clarity: "FL",
  //       caratWeight: 1.41,
  //       price: 7811,
  //     },
  //     {
  //       id: 4,
  //       color: "G",
  //       clarity: "VVS2",
  //       caratWeight: 0.98,
  //       price: 5347,
  //     },
  //     {
  //       id: 5,
  //       color: "R",
  //       clarity: "VVS1",
  //       caratWeight: 0.63,
  //       price: 3799,
  //     },
  //   ],
  //   productType: "diamond",
  // };

  // Sort diamond variants
  
  const sortedVariants = useMemo(() => {
    if (!productData || !productData.variants) {
      return [];
    }
    
    const variants = [...productData.variants];

    variants.sort((a, b) => {
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

    return variants;
  }, [productData, sortBy, sortOrder]);

  // find the product data from the productsDataArray
  const findProductById = (id) => {
    for (const productType in productsDataArray.productTypes) {
      const products = productsDataArray.productTypes[productType];
      const product = products.find(p => p.productId === id);
      if (product) {
        return product;
      }
    }
    return null;
  };

  // Get product data from API
  useEffect(() => {
    const product = findProductById(productId);
    if (product) {
      setProductData(product);
    } else {
      // Product not found - you could redirect or show error
      console.error(`Product with ID ${productId} not found`);
      setProductData(null);
    }
  }, [productId]);

  // Handle sorting
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  // Handle media delete
  const handleDeleteMedia = (mediaId, mediaType) => {
    console.log(`Delete ${mediaType} with ID: ${mediaId}`);
    // In a real implementation, this would make an API call to delete the media
    toast.success(`${mediaType} deleted successfully!`);
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
        pricePerCarat: variant.pricePerCarat,
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
      // API call to update the variant
      const response = await fetch(
        `/api/products/${productData.productId}/variants/${variantId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedVariantData),
        }
      );

      if (response.ok) {
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
        toast.success(`${productTypeLabel} variant updated successfully!`);
        setEditingVariant(null);
        setEditedVariantData({});
      } else {
        throw new Error("Failed to update variant");
      }
    } catch (error) {
      console.error("Error updating variant:", error);
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

  // Handle confirm variant delete
  const handleConfirmVariantDelete = async () => {
    setDeletingVariant(true);
    try {
      const response = await fetch(
        `/api/products/${productData.productId}/variants/${variantToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
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
      } else {
        throw new Error("Failed to delete variant");
      }
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
      const response = await fetch(`/api/products/${productData.productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedProductData),
      });

      if (response.ok) {
        toast.success("Product updated successfully!");
        setEditingProduct(false);
        setEditedProductData({});
      } else {
        throw new Error("Failed to update product");
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
      const response = await fetch(`/api/products/${productData.productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
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
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product. Please try again.");
    } finally {
      setDeletingProduct(false);
    }
  };

  // Handle input change for variant editing
  const handleVariantInputChange = (field, value) => {
    setEditedVariantData((prev) => ({
      ...prev,
      [field]:
        field === "caratWeight" ||
        field === "price" ||
        field === "pricePerCarat"
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

  // Loading state
  if (!productData) {
    return (
      <div>
        <AdminRoute>
          <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-4 overflow-auto bg-whitesmoke">
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
                  <p className="mt-4 text-lg text-gray-600">Loading product...</p>
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
    <div>
      <AdminRoute>
        <div className="flex h-screen">
          <Sidebar />
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
                        <Image
                          src={productData.images[0]}
                          alt="Product Image"
                          width={75}
                          height={75}
                          className="border border-gray-200 rounded-lg"
                        />

                        <h1 className="text-2xl font-semibold text-gray-800">
                          {productData.name}
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
                              <input
                                type="text"
                                value={editedProductData.shape || ""}
                                onChange={(e) =>
                                  handleProductInputChange(
                                    "shape",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Shape"
                              />
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
                              <input
                                type="text"
                                value={
                                  editedProductData.cutType ||
                                  productData.cutType
                                }
                                onChange={(e) =>
                                  handleProductInputChange(
                                    "cutType",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Cut Type"
                              />
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
                              <input
                                type="text"
                                value={
                                  editedProductData.colorRange ||
                                  productData.colorRange
                                }
                                onChange={(e) =>
                                  handleProductInputChange(
                                    "colorRange",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Color Range"
                              />
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
                              <input
                                type="text"
                                value={
                                  editedProductData.clarityRange ||
                                  productData.clarityRange
                                }
                                onChange={(e) =>
                                  handleProductInputChange(
                                    "clarityRange",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Clarity Range"
                              />
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
                              <input
                                type="text"
                                value={
                                  editedProductData.layoutType ||
                                  productData.layoutType
                                }
                                onChange={(e) =>
                                  handleProductInputChange(
                                    "layoutType",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Layout Type"
                              />
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
                                ${productData.layoutPrice.toLocaleString()}
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
                                  editedProductData.availability !== undefined
                                    ? editedProductData.availability
                                    : productData.availability
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
                              <input
                                type="text"
                                value={editedProductData.certification || ""}
                                onChange={(e) =>
                                  handleProductInputChange(
                                    "certification",
                                    e.target.value
                                  )
                                }
                                className="text-sm text-gray-800 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder="Certification"
                              />
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
                      : "Alphabet"}{" "}
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
                                  <input
                                    type="text"
                                    value={editedVariantData.color || ""}
                                    onChange={(e) =>
                                      handleVariantInputChange(
                                        "color",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Color"
                                  />
                                ) : (
                                  variant.color
                                )}
                              </td>
                              <td className="px-4 py-2 text-sm text-gray-800">
                                {editingVariant === variant.id ? (
                                  <input
                                    type="text"
                                    value={editedVariantData.clarity || ""}
                                    onChange={(e) =>
                                      handleVariantInputChange(
                                        "clarity",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Clarity"
                                  />
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
                                        onClick={() =>
                                          handleEditVariant(variant)
                                        }
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
                              onClick={() => handleSort("pricePerCarat")}
                            >
                              Price Per Carat{" "}
                              {sortBy === "pricePerCarat" &&
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
                                    <option value="">
                                      Select Clarity Range
                                    </option>
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
                                    value={
                                      editedVariantData.pricePerCarat || ""
                                    }
                                    onChange={(e) =>
                                      handleVariantInputChange(
                                        "pricePerCarat",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    placeholder="Price Per Carat"
                                  />
                                ) : (
                                  `$${variant.pricePerCarat.toLocaleString()}`
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
                                        onClick={() =>
                                          handleEditVariant(variant)
                                        }
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
                                        onClick={() =>
                                          handleEditVariant(variant)
                                        }
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
                                        onClick={() =>
                                          handleEditVariant(variant)
                                        }
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
                                        onClick={() =>
                                          handleEditVariant(variant)
                                        }
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
                          {productData.variants.map((variant) => (
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
                                    <option value="">
                                      Select Clarity Range
                                    </option>
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
                                        onClick={() =>
                                          handleEditVariant(variant)
                                        }
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
                              {productData.variants.reduce(
                                (acc, variant) => acc + variant.totalPcs,
                                0
                              )}
                            </td>
                            <td className="px-4 py-2 text-sm text-gray-800 font-bold">
                              {productData.variants.reduce(
                                (acc, variant) =>
                                  acc + variant.totalCaratWeight,
                                0
                              )}
                            </td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Media Section */}
                <div className="border border-gray-200 rounded-xl m-2 p-4">
                  <h1 className="text-lg font-semibold text-gray-800 mb-4">
                    Media Gallery
                  </h1>

                  {/* Images Section */}
                  {productData.images.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-md font-medium text-gray-700 mb-3">
                        Images
                      </h2>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productData.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <div className="relative overflow-hidden rounded-lg border border-gray-200">
                              <Image
                                src={image}
                                alt={image}
                                width={200}
                                height={200}
                                className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                              />
                              <button
                                onClick={() =>
                                  handleDeleteMedia(image, "image")
                                }
                                className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                                title="Delete image"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos Section */}
                  {productData.video.length > 0 && (
                    <div>
                      <h2 className="text-md font-medium text-gray-700 mb-3">
                        Videos
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {productData.video.map((video, index) => (
                          <div key={index} className="relative group">
                            <div className="relative overflow-hidden rounded-lg border border-gray-200">
                              <video
                                className="w-full h-48 object-cover"
                                controls
                                preload="metadata"
                              >
                                <source src={video} type="video/mp4" />
                                Your browser does not support the video tag.
                              </video>
                              <button
                                onClick={() =>
                                  handleDeleteMedia(video, "video")
                                }
                                className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                                title="Delete video"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {productData.images.length === 0 &&
                    productData.video.length === 0 && (
                      <div className="text-center py-8">
                        <div className="text-gray-400 mb-2">
                          <svg
                            className="mx-auto h-12 w-12"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500">
                          No media files available
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Variant Delete Popup */}
        {showVariantDeletePopup && variantToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Delete{" "}
                  {productData.productType === "diamond"
                    ? "Diamond"
                    : productData.productType === "melee"
                    ? "Melee"
                    : productData.productType === "colorstone"
                    ? "Colorstone"
                    : productData.productType === "cuts"
                    ? "Cuts"
                    : "Alphabet"}{" "}
                  Variant
                </h2>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete this{" "}
                  {productData.productType === "diamond"
                    ? "diamond"
                    : productData.productType === "melee"
                    ? "melee"
                    : productData.productType === "colorstone"
                    ? "colorstone"
                    : productData.productType === "cuts"
                    ? "cuts"
                    : "alphabet"}{" "}
                  variant?
                </p>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm">
                    <strong>ID:</strong> {variantToDelete.id}
                  </p>
                  {productData.productType === "diamond" ? (
                    <>
                      <p className="text-sm">
                        <strong>Color:</strong> {variantToDelete.color}
                      </p>
                      <p className="text-sm">
                        <strong>Clarity:</strong> {variantToDelete.clarity}
                      </p>
                      <p className="text-sm">
                        <strong>Carat Weight:</strong>{" "}
                        {variantToDelete.caratWeight}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> $
                        {variantToDelete.price?.toLocaleString()}
                      </p>
                    </>
                  ) : productData.productType === "melee" ? (
                    <>
                      <p className="text-sm">
                        <strong>Sieve Size:</strong> {variantToDelete.sieveSize}
                      </p>
                      <p className="text-sm">
                        <strong>Color Range:</strong>{" "}
                        {variantToDelete.colorRange}
                      </p>
                      <p className="text-sm">
                        <strong>Clarity Range:</strong>{" "}
                        {variantToDelete.clarityRange}
                      </p>
                      <p className="text-sm">
                        <strong>Price Per Carat:</strong> $
                        {variantToDelete.pricePerCarat?.toLocaleString()}
                      </p>
                    </>
                  ) : productData.productType === "colorstone" ? (
                    <>
                      <p className="text-sm">
                        <strong>Dimension:</strong> {variantToDelete.dimension}
                      </p>
                      <p className="text-sm">
                        <strong>Shape:</strong> {variantToDelete.shape}
                      </p>
                      <p className="text-sm">
                        <strong>Carat Weight:</strong>{" "}
                        {variantToDelete.caratWeight}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> $
                        {variantToDelete.price?.toLocaleString()}
                      </p>
                    </>
                  ) : productData.productType === "cuts" ? (
                    <>
                      <p className="text-sm">
                        <strong>Carat Weight:</strong>{" "}
                        {variantToDelete.caratWeight}
                      </p>
                      <p className="text-sm">
                        <strong>Dimension:</strong> {variantToDelete.dimension}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> $
                        {variantToDelete.price?.toLocaleString()}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm">
                        <strong>Carat Weight:</strong>{" "}
                        {variantToDelete.caratWeight}
                      </p>
                      <p className="text-sm">
                        <strong>Price:</strong> $
                        {variantToDelete.price?.toLocaleString()}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowVariantDeletePopup(false);
                    setVariantToDelete(null);
                  }}
                  disabled={deletingVariant}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmVariantDelete}
                  disabled={deletingVariant}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded disabled:opacity-50"
                >
                  {deletingVariant ? "Deleting..." : "Delete Variant"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Delete Popup with SKU Confirmation */}
        {showProductDeletePopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 shadow-lg">
              <div className="flex items-center mb-4">
                <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Delete{" "}
                  {productData.productType === "diamond"
                    ? "Diamond"
                    : productData.productType === "melee"
                    ? "Melee"
                    : productData.productType === "colorstone"
                    ? "Colorstone"
                    : productData.productType === "cuts"
                    ? "Cuts"
                    : "Alphabet"}{" "}
                  Product
                </h2>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to delete this entire{" "}
                  {productData.productType === "diamond"
                    ? "diamond"
                    : productData.productType === "melee"
                    ? "melee"
                    : productData.productType === "colorstone"
                    ? "colorstone"
                    : productData.productType === "cuts"
                    ? "cuts"
                    : "alphabet"}{" "}
                  product?
                </p>
                <div className="bg-gray-50 p-3 rounded border">
                  <p className="text-sm">
                    <strong>Product:</strong> {productData.name}
                  </p>
                  <p className="text-sm">
                    <strong>SKU:</strong> {productData.sku}
                  </p>
                  <p className="text-sm">
                    <strong>Shape:</strong> {productData.shape}
                  </p>
                  <p className="text-sm">
                    <strong>Variants:</strong> {productData.variants.length}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-red-600 font-medium mb-2">
                  Type "{productData.sku}" below to confirm deletion:
                </p>
                <input
                  type="text"
                  value={deleteConfirmationText}
                  onChange={(e) => setDeleteConfirmationText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder={`Enter ${productData.sku} to confirm`}
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowProductDeletePopup(false);
                    setDeleteConfirmationText("");
                  }}
                  disabled={deletingProduct}
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmProductDelete}
                  disabled={
                    deletingProduct ||
                    deleteConfirmationText !== productData.sku
                  }
                  className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingProduct ? "Deleting..." : "Delete Product"}
                </button>
              </div>
            </div>
          </div>
        )}

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
    </div>
  );
}
