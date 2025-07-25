"use client";
import { AdminRoute } from "@/components/ProtectedRoute";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImagePlus, Plus, Trash2, Video } from "lucide-react";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    shape: "",
    color: "",
    description: "",
    sku: "",
    hardness: "",
    diamondType: "Lab Grown",
    certification: "",
    availability: true,
    dimension: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [diamondVariants, setDiamondVariants] = useState([
    {
      id: 1,
      color: "",
      clarity: "",
      caratWeight: "",
      price: "",
    },
  ]);

  const [meleeVariants, setMeleeVariants] = useState([
    {
      id: 1,
      sieveSize: "",
      pricePerCarat: "",
      colorRange: "",
      clarityRange: "",
    },
  ]);

  const [colorStoneVariants, setColorStoneVariants] = useState([
    {
      id: 1,
      shape: "",
      caratWeight: "",
      dimension: "",
      price: "",
    },
  ]);

  const [antiqueCutVariants, setAntiqueCutVariants] = useState([
    {
      id: 1,
      color: "",
      clarity: "",
      caratWeight: "",
      colorRange: "",
      clarityRange: "",
      dimension: "",
      price: "",
    },
  ]);

  const [activeProductTab, setActiveProductTab] = useState("diamond");

  const resetFormData = () => {
    setFormData({
      name: "",
      shape: "",
      color: "",
      description: "",
      sku: "",
      hardness: "",
      diamondType: "Lab Grown",
      certification: "",
      availability: true,
      dimension: "",
    });
    setImages([]);
    setVideo(null);
  };

  const handleTabChange = (tab) => {
    if (tab !== activeProductTab) {
      resetFormData();
      setActiveProductTab(tab);
    }
  };

  const shapeOptions = [
    "Round",
    "Princess",
    "Emerald",
    "Asscher",
    "Oval",
    "Marquise",
    "Pear",
    "Heart",
    "Cushion",
    "Radiant",
  ];

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

  const validateDiamondForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Diamond name is required");
    }
    if (!formData.shape.trim()) {
      errors.push("Shape is required");
    }
    if (!formData.sku.trim()) {
      errors.push("SKU is required");
    }
    if (!formData.diamondType.trim()) {
      errors.push("Diamond type is required");
    }

    const validVariants = diamondVariants.filter(
      (variant) =>
        variant.color && variant.clarity && variant.caratWeight && variant.price
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete diamond variant is required (color, clarity, carat weight, and price)"
      );
    }

    return errors;
  };

  const validateMeleeForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Melee name is required");
    }
    if (!formData.shape.trim()) {
      errors.push("Shape is required");
    }
    if (!formData.sku.trim()) {
      errors.push("SKU is required");
    }
    if (!formData.diamondType.trim()) {
      errors.push("Diamond type is required");
    }

    const validVariants = meleeVariants.filter(
      (variant) => variant.sieveSize && variant.pricePerCarat
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete melee variant is required (sieve size and price per carat)"
      );
    }

    return errors;
  };

  const validateColorStoneForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Color stone name is required");
    }
    if (!formData.color.trim()) {
      errors.push("Color is required");
    }
    if (!formData.sku.trim()) {
      errors.push("SKU is required");
    }
    if (!formData.diamondType.trim()) {
      errors.push("Diamond type is required");
    }

    const validVariants = colorStoneVariants.filter(
      (variant) =>
        variant.shape &&
        variant.caratWeight &&
        variant.dimension &&
        variant.price
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete color stone variant is required (shape, carat weight, dimension, and price)"
      );
    }

    return errors;
  };

  const validateAntiqueCutForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push("Antique cut name is required");
    }
    if (!formData.sku.trim()) {
      errors.push("SKU is required");
    }
    if (!formData.diamondType.trim()) {
      errors.push("Diamond type is required");
    }

    const validVariants = antiqueCutVariants.filter(
      (variant) =>
        variant.color &&
        variant.clarity &&
        variant.caratWeight &&
        variant.colorRange &&
        variant.clarityRange &&
        variant.dimension &&
        variant.price
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete antique cut variant is required (color, clarity, carat weight, color range, clarity range, dimension, and price)"
      );
    }

    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setVideo({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    if (video) {
      URL.revokeObjectURL(video.preview);
      setVideo(null);
    }
  };

  const handleDiamondVariantChange = (id, field, value) => {
    setDiamondVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addDiamondVariant = () => {
    const newId = Math.max(...diamondVariants.map((d) => d.id)) + 1;
    setDiamondVariants((prev) => [
      ...prev,
      {
        id: newId,
        color: "",
        clarity: "",
        caratWeight: "",
        price: "",
      },
    ]);
  };

  const removeDiamondVariant = (id) => {
    if (diamondVariants.length > 1) {
      setDiamondVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleMeleeVariantChange = (id, field, value) => {
    setMeleeVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addMeleeVariant = () => {
    const newId = Math.max(...meleeVariants.map((d) => d.id)) + 1;
    setMeleeVariants((prev) => [
      ...prev,
      {
        id: newId,
        sieveSize: "",
        pricePerCarat: "",
        colorRange: "",
        clarityRange: "",
      },
    ]);
  };

  const removeMeleeVariant = (id) => {
    if (meleeVariants.length > 1) {
      setMeleeVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleColorStoneVariantChange = (id, field, value) => {
    setColorStoneVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addColorStoneVariant = () => {
    const newId = Math.max(...colorStoneVariants.map((d) => d.id)) + 1;
    setColorStoneVariants((prev) => [
      ...prev,
      {
        id: newId,
        shape: "",
        caratWeight: "",
        dimension: "",
        price: "",
      },
    ]);
  };

  const removeColorStoneVariant = (id) => {
    if (colorStoneVariants.length > 1) {
      setColorStoneVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleAntiqueCutVariantChange = (id, field, value) => {
    setAntiqueCutVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addAntiqueCutVariant = () => {
    const newId = Math.max(...antiqueCutVariants.map((d) => d.id)) + 1;
    setAntiqueCutVariants((prev) => [
      ...prev,
      {
        id: newId,
        color: "",
        clarity: "",
        caratWeight: "",
        colorRange: "",
        clarityRange: "",
        dimension: "",
        price: "",
      },
    ]);
  };

  const removeAntiqueCutVariant = (id) => {
    if (antiqueCutVariants.length > 1) {
      setAntiqueCutVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleSave = () => {
    let errors = [];

    switch (activeProductTab) {
      case "diamond":
        errors = validateDiamondForm();
        break;
      case "melee":
        errors = validateMeleeForm();
        break;
      case "colorstone":
        errors = validateColorStoneForm();
        break;
      case "antiquecut":
        errors = validateAntiqueCutForm();
        break;
    }

    if (errors.length > 0) {
      errors.forEach((error) => {
        toast.error(error);
      });
      return;
    }

    const completeData = {
      ...formData,
      images: images.map((img) => img.file.name),
      video: video?.file.name || null,
      productType: activeProductTab,
    };

    switch (activeProductTab) {
      case "diamond":
        completeData.diamondVariants = diamondVariants;
        break;
      case "melee":
        completeData.meleeVariants = meleeVariants;
        break;
      case "colorstone":
        completeData.colorStoneVariants = colorStoneVariants;
        break;
      case "antiquecut":
        completeData.antiqueCutVariants = antiqueCutVariants;
        break;
    }

    console.log("Product Data:", completeData);

    const productNames = {
      diamond: "Diamond",
      melee: "Melee",
      colorstone: "Color Stone",
      antiquecut: "Antique Cut",
    };

    toast.success(
      `${productNames[activeProductTab]} product saved successfully!`
    );
  };

  const renderProductDetailsForm = () => (
    <div className="space-y-8">
      {/* Product Details Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">
          {activeProductTab === "diamond" && "Diamond Details"}
          {activeProductTab === "melee" && "Melee Details"}
          {activeProductTab === "colorstone" && "Color Stone Details"}
          {activeProductTab === "antiquecut" && "Antique Cut Details"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeProductTab === "diamond" && "Diamond Name"}
              {activeProductTab === "melee" && "Melee Name"}
              {activeProductTab === "colorstone" && "Color Stone Name"}
              {activeProductTab === "antiquecut" && "Antique Cut Name"}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={
                activeProductTab === "diamond"
                  ? "Round Cut Diamond"
                  : activeProductTab === "melee"
                  ? "Round Cut Melee"
                  : activeProductTab === "colorstone"
                  ? "Ruby Round Cut"
                  : "Antique Round Cut"
              }
              required
            />
          </div>

          {(activeProductTab === "diamond" || activeProductTab === "melee") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shape <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shape"
                value={formData.shape}
                onChange={handleInputChange}
                list="shapeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select shape"
                required
              />
              <datalist id="shapeOptions">
                {shapeOptions.map((shape) => (
                  <option key={shape} value={shape} />
                ))}
              </datalist>
            </div>
          )}

          {activeProductTab === "colorstone" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Ruby, Sapphire, Emerald, etc."
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={
                activeProductTab === "diamond"
                  ? "DIA001"
                  : activeProductTab === "melee"
                  ? "MEL001"
                  : activeProductTab === "colorstone"
                  ? "CS001"
                  : "AC001"
              }
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hardness
            </label>
            <input
              type="text"
              name="hardness"
              value={formData.hardness}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diamond Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="diamondType"
              value={formData.diamondType}
              onChange={handleInputChange}
              list="diamondTypeOptions"
              className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="Type or select type"
              required
            />
            <datalist id="diamondTypeOptions">
              <option value="Natural" />
              <option value="Lab Grown" />
            </datalist>
          </div>

          {(activeProductTab === "diamond" ||
            activeProductTab === "colorstone") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Certification
              </label>
              <input
                type="text"
                name="certification"
                value={formData.certification}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="GIA"
              />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Enter product description..."
        />
      </div>

      {/* Upload Product Images */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Upload Product Images
        </label>
        <div className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 group hover:border-primary-500">
          <div className="text-center">
            <ImagePlus className="mx-auto h-12 w-12 stroke-1 text-gray-400 group-hover:text-primary-500" />
            <div className="mt-4">
              <label htmlFor="images" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drop your images here or select click to browse
                </span>
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Image Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  <Trash2 className="w-4 h-4 stroke-2" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Video */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Upload Product Video
        </label>
        <div className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-6 group hover:border-primary-500">
          <div className="text-center">
            <Video className="mx-auto h-12 w-12 stroke-1 text-gray-400 group-hover:text-primary-500" />
            <div className="mt-4">
              <label htmlFor="video" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Drop your video here or select click to browse
                </span>
                <input
                  id="video"
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Video Preview */}
        {video && (
          <div className="mt-4">
            <div className="relative inline-block">
              <video
                src={video.preview}
                controls
                className="w-64 h-48 object-cover rounded-lg"
              />
              <button
                onClick={removeVideo}
                className="cursor-pointer absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
              >
                <Trash2 className="w-4 h-4 stroke-2" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Variants Section */}
      {activeProductTab === "diamond" && (
        // Diamond Variants Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            Diamond Variants <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Color
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Clarity
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Carat Weight
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {diamondVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) =>
                          handleDiamondVariantChange(
                            variant.id,
                            "color",
                            e.target.value
                          )
                        }
                        list={`colorOptions-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select color"
                      />
                      <datalist id={`colorOptions-${variant.id}`}>
                        {colorOptions.map((color) => (
                          <option key={color} value={color} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.clarity}
                        onChange={(e) =>
                          handleDiamondVariantChange(
                            variant.id,
                            "clarity",
                            e.target.value
                          )
                        }
                        list={`clarityOptions-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select clarity"
                      />
                      <datalist id={`clarityOptions-${variant.id}`}>
                        {clarityOptions.map((clarity) => (
                          <option key={clarity} value={clarity} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.caratWeight}
                        onChange={(e) =>
                          handleDiamondVariantChange(
                            variant.id,
                            "caratWeight",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1.50"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleDiamondVariantChange(
                            variant.id,
                            "price",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1000"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {diamondVariants.length > 1 && (
                        <button
                          onClick={() => removeDiamondVariant(variant.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 stroke-2" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addDiamondVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Diamond
          </button>
        </div>
      )}

      {activeProductTab === "melee" && (
        // Melee Sieve Size Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            Sieve Size <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Size (mm - mm)
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Color Range
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Clarity Range
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Price per Carat
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {meleeVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.sieveSize}
                        onChange={(e) =>
                          handleMeleeVariantChange(
                            variant.id,
                            "sieveSize",
                            e.target.value
                          )
                        }
                        list={`sieveSizeOptions-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select size"
                      />
                      <datalist id={`sieveSizeOptions-${variant.id}`}>
                        {sieveSizeOptions.map((size) => (
                          <option key={size} value={size} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.colorRange}
                        onChange={(e) =>
                          handleMeleeVariantChange(
                            variant.id,
                            "colorRange",
                            e.target.value
                          )
                        }
                        list={`colorRangeOptions-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select color range"
                      />
                      <datalist id={`colorRangeOptions-${variant.id}`}>
                        {colorRanges.map((range) => (
                          <option key={range} value={range} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.clarityRange}
                        onChange={(e) =>
                          handleMeleeVariantChange(
                            variant.id,
                            "clarityRange",
                            e.target.value
                          )
                        }
                        list={`clarityRangeOptions-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select clarity range"
                      />
                      <datalist id={`clarityRangeOptions-${variant.id}`}>
                        {clarityRanges.map((range) => (
                          <option key={range} value={range} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.pricePerCarat}
                        onChange={(e) =>
                          handleMeleeVariantChange(
                            variant.id,
                            "pricePerCarat",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="150.00"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {meleeVariants.length > 1 && (
                        <button
                          onClick={() => removeMeleeVariant(variant.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 stroke-2" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addMeleeVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Melee Size
          </button>
        </div>
      )}

      {activeProductTab === "colorstone" && (
        // Color Stone Variants Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            Color Stone Variants <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Shape
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Dimension
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Carat Weight
                  </th>

                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {colorStoneVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.shape}
                        onChange={(e) =>
                          handleColorStoneVariantChange(
                            variant.id,
                            "shape",
                            e.target.value
                          )
                        }
                        list={`shapeOptions-colorstone-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select shape"
                      />
                      <datalist id={`shapeOptions-colorstone-${variant.id}`}>
                        {shapeOptions.map((shape) => (
                          <option key={shape} value={shape} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.dimension}
                        onChange={(e) =>
                          handleColorStoneVariantChange(
                            variant.id,
                            "dimension",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="7x5x3 mm"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.caratWeight}
                        onChange={(e) =>
                          handleColorStoneVariantChange(
                            variant.id,
                            "caratWeight",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1.50"
                      />
                    </td>

                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleColorStoneVariantChange(
                            variant.id,
                            "price",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1000"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {colorStoneVariants.length > 1 && (
                        <button
                          onClick={() => removeColorStoneVariant(variant.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 stroke-2" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addColorStoneVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Color Stone Variant
          </button>
        </div>
      )}

      {activeProductTab === "antiquecut" && (
        // Antique Cut Variants Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            Antique Cut Variants <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Color Range
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Clarity Range
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Carat Weight
                  </th>

                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Dimension
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Price
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {antiqueCutVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.colorRange}
                        onChange={(e) =>
                          handleAntiqueCutVariantChange(
                            variant.id,
                            "colorRange",
                            e.target.value
                          )
                        }
                        list={`colorRangeOptions-antique-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select color range"
                      />
                      <datalist id={`colorRangeOptions-antique-${variant.id}`}>
                        {colorRanges.map((range) => (
                          <option key={range} value={range} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.clarityRange}
                        onChange={(e) =>
                          handleAntiqueCutVariantChange(
                            variant.id,
                            "clarityRange",
                            e.target.value
                          )
                        }
                        list={`clarityRangeOptions-antique-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select clarity range"
                      />
                      <datalist
                        id={`clarityRangeOptions-antique-${variant.id}`}
                      >
                        {clarityRanges.map((range) => (
                          <option key={range} value={range} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.caratWeight}
                        onChange={(e) =>
                          handleAntiqueCutVariantChange(
                            variant.id,
                            "caratWeight",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1.50"
                      />
                    </td>

                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.dimension}
                        onChange={(e) =>
                          handleAntiqueCutVariantChange(
                            variant.id,
                            "dimension",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="7x5x3 mm"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={variant.price}
                        onChange={(e) =>
                          handleAntiqueCutVariantChange(
                            variant.id,
                            "price",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1000"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {antiqueCutVariants.length > 1 && (
                        <button
                          onClick={() => removeAntiqueCutVariant(variant.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 stroke-2" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={addAntiqueCutVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Antique Cut Variant
          </button>
        </div>
      )}

      {/* Availability */}
      <div>
        <label className="cursor-pointer flex items-center">
          <input
            type="checkbox"
            name="availability"
            checked={formData.availability}
            onChange={handleInputChange}
            className="cursor-pointer mr-2"
          />
          <span className="text-sm font-medium text-gray-700">
            Available for sale
          </span>
        </label>
      </div>
    </div>
  );

  return (
    <AdminRoute>
      {/* Toast Container */}
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
      />

      <div className="flex h-full">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto bg-whitesmoke">
          <div className="flex flex-col ">
            <div className="flex items-center mb-4">
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
              <h1 className="text-2xl font-semibold text-gray-800">
                Add Product
              </h1>
            </div>

            {/* Scrollable Content */}
            <div className="bg-white rounded-lg p-4">
              {/* Product Type Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  <button
                    onClick={() => handleTabChange("diamond")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "diamond"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add Diamond
                  </button>
                  <button
                    onClick={() => handleTabChange("melee")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "melee"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add Melee
                  </button>
                  <button
                    onClick={() => handleTabChange("colorstone")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "colorstone"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add Color Stone
                  </button>
                  <button
                    onClick={() => handleTabChange("antiquecut")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "antiquecut"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add Antique Cut
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">{renderProductDetailsForm()}</div>

              {/* Sticky Save Button */}
              <div className="p-6">
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    className="cursor-pointer px-4 py-2 gap-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700 transition-colors"
                  >
                    Save{" "}
                    {activeProductTab === "diamond"
                      ? "Diamond"
                      : activeProductTab === "melee"
                      ? "Melee"
                      : activeProductTab === "colorstone"
                      ? "Color Stone"
                      : "Antique Cut"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
