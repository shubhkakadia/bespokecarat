"use client";
import { AdminRoute } from "@/components/ProtectedRoute";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImagePlus, Plus, Trash2, Video } from "lucide-react";
import { getAuthToken } from "@/contexts/auth";
import {
  shapeOptions,
  colorOptions,
  clarityOptions,
  colorRanges,
  clarityRanges,
  layoutTypeOptions,
  cutTypeOptions,
  sieveSizeOptions,
} from "@/components/constants/order";

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    shape: "",
    color: "",
    description: "",
    sku: "",
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

  const [cutVariants, setCutVariants] = useState([
    {
      id: 1,
      color: "",
      clarity: "",
      caratWeight: "",
      dimension: "",
      price: "",
    },
  ]);

  const [layoutVariants, setLayoutVariants] = useState([
    {
      id: 1,
      shape: "",
      totalPcs: "",
      totalCaratWeight: "",
      dimensions: "",
      colorRange: "",
      clarityRange: "",
    },
  ]);

  const [layoutPrice, setLayoutPrice] = useState("");
  const [layoutType, setLayoutType] = useState("");
  const [cutType, setCutType] = useState("");

  const [alphabetVariants, setAlphabetVariants] = useState([
    {
      id: 1,
      caratWeight: "",
      price: "",
    },
  ]);

  const [character, setCharacter] = useState("");

  const [activeProductTab, setActiveProductTab] = useState("diamond");
  const [isLoading, setIsLoading] = useState(false);

  const resetFormData = () => {
    setFormData({
      name: "",
      shape: "",
      color: "",
      description: "",
      sku: "",
      certification: "",
      availability: true,
      dimension: "",
    });
    setImages([]);
    setVideo(null);
    setLayoutPrice("");
    setLayoutType("");
    setCutType("");
    setCharacter("");
  };

  const handleTabChange = (tab) => {
    if (tab !== activeProductTab) {
      resetFormData();
      setActiveProductTab(tab);
    }
  };

  // Price formatting helpers (UI only)
  const formatPrice = (value) => {
    if (value === undefined || value === null || value === "") return "";
    const num = Number(value.toString().replace(/,/g, ""));
    if (Number.isNaN(num)) return value;
    return num.toLocaleString("en-US", { maximumFractionDigits: 2 });
  };

  const stripPriceFormatting = (value) => {
    if (value === undefined || value === null) return "";
    return value.toString().replace(/,/g, "");
  };

  const validateDiamondForm = () => {
    const errors = [];

    if (!formData.name?.trim()) {
      errors.push("Diamond name is required");
    }
    if (!formData.shape?.trim()) {
      errors.push("Shape is required");
    }
    if (!formData.sku?.trim()) {
      errors.push("SKU is required");
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

    if (!formData.name?.trim()) {
      errors.push("Melee name is required");
    }
    if (!formData.shape?.trim()) {
      errors.push("Shape is required");
    }
    if (!formData.sku?.trim()) {
      errors.push("SKU is required");
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

    if (!formData.name?.trim()) {
      errors.push("Color stone name is required");
    }
    if (!formData.color?.trim()) {
      errors.push("Color is required");
    }
    if (!formData.sku?.trim()) {
      errors.push("SKU is required");
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

  const validateCutForm = () => {
    const errors = [];

    if (!formData.name?.trim()) {
      errors.push("By cut name is required");
    }
    if (!formData.shape?.trim()) {
      errors.push("Shape is required");
    }
    if (!cutType?.trim()) {
      errors.push("Cut type is required");
    }
    if (!formData.sku?.trim()) {
      errors.push("SKU is required");
    }

    const validVariants = cutVariants.filter(
      (variant) => variant.caratWeight && variant.dimension && variant.price
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete by cut variant is required (color, clarity, carat weight, dimension, and price)"
      );
    }

    return errors;
  };

  const validateLayoutForm = () => {
    const errors = [];

    if (!formData.name?.trim()) {
      errors.push("Layout name is required");
    }
    if (!layoutType?.trim()) {
      errors.push("Layout type is required");
    }
    if (!formData.sku?.trim()) {
      errors.push("SKU is required");
    }
    if (!layoutPrice?.trim()) {
      errors.push("Price is required");
    }

    const validVariants = layoutVariants.filter(
      (variant) =>
        variant.shape &&
        variant.totalPcs &&
        variant.totalCaratWeight &&
        variant.dimensions &&
        variant.colorRange &&
        variant.clarityRange
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete layout variant is required (shape, total pcs, total carat weight, dimensions, color range, and clarity range)"
      );
    }

    return errors;
  };

  const validateAlphabetForm = () => {
    const errors = [];

    if (!formData.name?.trim()) {
      errors.push("Alphabet name is required");
    }
    if (!formData.sku?.trim()) {
      errors.push("SKU is required");
    }
    if (!character?.trim()) {
      errors.push("Character is required");
    } else if (character.length !== 1) {
      errors.push(
        "Character must be exactly 1 character (e.g., 'A' is correct, 'AB' is wrong)"
      );
    }

    const validVariants = alphabetVariants.filter(
      (variant) => variant.caratWeight && variant.price
    );

    if (validVariants.length === 0) {
      errors.push(
        "At least one complete alphabet variant is required (carat weight and price)"
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

  const handleCutVariantChange = (id, field, value) => {
    setCutVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addCutVariant = () => {
    const newId = Math.max(...cutVariants.map((d) => d.id)) + 1;
    setCutVariants((prev) => [
      ...prev,
      {
        id: newId,
        color: "",
        clarity: "",
        caratWeight: "",
        dimension: "",
        price: "",
      },
    ]);
  };

  const removeCutVariant = (id) => {
    if (cutVariants.length > 1) {
      setCutVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleLayoutVariantChange = (id, field, value) => {
    setLayoutVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addLayoutVariant = () => {
    const newId = Math.max(...layoutVariants.map((d) => d.id)) + 1;
    setLayoutVariants((prev) => [
      ...prev,
      {
        id: newId,
        shape: "",
        totalPcs: "",
        totalCaratWeight: "",
        dimensions: "",
        colorRange: "",
        clarityRange: "",
      },
    ]);
  };

  const removeLayoutVariant = (id) => {
    if (layoutVariants.length > 1) {
      setLayoutVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Calculate totals for layout variants
  const calculateLayoutTotals = () => {
    const totalPcs = layoutVariants.reduce(
      (sum, variant) => sum + (parseFloat(variant.totalPcs) || 0),
      0
    );
    const totalCaratWeight = layoutVariants.reduce(
      (sum, variant) => sum + (parseFloat(variant.totalCaratWeight) || 0),
      0
    );
    return { totalPcs, totalCaratWeight };
  };

  const handleAlphabetVariantChange = (id, field, value) => {
    setAlphabetVariants((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addAlphabetVariant = () => {
    const newId = Math.max(...alphabetVariants.map((d) => d.id)) + 1;
    setAlphabetVariants((prev) => [
      ...prev,
      {
        id: newId,
        caratWeight: "",
        price: "",
      },
    ]);
  };

  const removeAlphabetVariant = (id) => {
    if (alphabetVariants.length > 1) {
      setAlphabetVariants((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const saveDiamond = async () => {
    setIsLoading(true);

    try {
      const authToken = getAuthToken();
      console.log(authToken);
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return;
      }

      // Prepare FormData for the request
      const formDataAPI = new FormData();

      // Add basic form fields
      formDataAPI.append("name", formData.name);
      formDataAPI.append("shape", formData.shape);
      formDataAPI.append("sku", formData.sku);
      formDataAPI.append("certification", formData.certification || "");
      formDataAPI.append("description", formData.description || "");
      formDataAPI.append("is_available", formData.availability.toString());

      // Prepare diamond variants
      const validVariants = diamondVariants.filter(
        (variant) =>
          variant.color &&
          variant.clarity &&
          variant.caratWeight &&
          variant.price
      );

      formDataAPI.append(
        "diamond_variants",
        JSON.stringify(
          validVariants.map((variant) => ({
            color: variant.color,
            clarity: variant.clarity,
            carat_weight: parseFloat(variant.caratWeight),
            price: parseFloat(variant.price),
          }))
        )
      );

      // Add images
      images.forEach((image) => {
        formDataAPI.append("images", image.file);
      });

      // Add video
      if (video) {
        formDataAPI.append("videos", video.file);
      }

      // Make API request
      const response = await fetch("/api/admin/product/diamond/add-diamond", {
        method: "POST",
        headers: {
          Authorization: authToken,
        },
        body: formDataAPI,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(formData.sku + " - Diamond saved successfully!");
        // Reset form after successful save
        resetFormData();
        setDiamondVariants([
          {
            id: 1,
            color: "",
            clarity: "",
            caratWeight: "",
            price: "",
          },
        ]);
      } else {
        toast.error(result.message || "Failed to save diamond");
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => toast.error(error));
        }
      }
    } catch (error) {
      console.error("Error saving diamond:", error);
      toast.error("An error occurred while saving the diamond");
    } finally {
      setIsLoading(false);
    }
  };

  const saveMelee = async () => {
    setIsLoading(true);

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return;
      }

      const formDataAPI = new FormData();

      // Basic fields
      formDataAPI.append("name", formData.name);
      formDataAPI.append("shape", formData.shape);
      formDataAPI.append("sku", formData.sku);
      formDataAPI.append("description", formData.description || "");
      formDataAPI.append("is_available", formData.availability.toString());

      // Map sieve sizes
      const validSieveSizes = meleeVariants.filter(
        (variant) => variant.sieveSize && variant.pricePerCarat
      );

      formDataAPI.append(
        "sieve_sizes",
        JSON.stringify(
          validSieveSizes.map((variant) => ({
            size: variant.sieveSize,
            color_range: variant.colorRange || "",
            clarity_range: variant.clarityRange || "",
            price_per_carat: variant.pricePerCarat,
          }))
        )
      );

      // Files
      images.forEach((image) => {
        formDataAPI.append("images", image.file);
      });
      if (video) {
        formDataAPI.append("videos", video.file);
      }

      // API request
      const response = await fetch("/api/admin/product/melee/add-melee", {
        method: "POST",
        headers: { Authorization: authToken },
        body: formDataAPI,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(formData.sku + " - Melee saved successfully!");
        resetFormData();
        setMeleeVariants([
          {
            id: 1,
            sieveSize: "",
            pricePerCarat: "",
            colorRange: "",
            clarityRange: "",
          },
        ]);
      } else {
        toast.error(result.message || "Failed to save melee");
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => toast.error(error));
        }
      }
    } catch (error) {
      console.error("Error saving melee:", error);
      toast.error("An error occurred while saving the melee");
    } finally {
      setIsLoading(false);
    }
  };

  const saveColorStone = async () => {
    setIsLoading(true);

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return;
      }

      const formDataAPI = new FormData();

      // Basic fields
      formDataAPI.append("name", formData.name);
      formDataAPI.append("color", formData.color);
      formDataAPI.append("sku", formData.sku);
      formDataAPI.append("certification", formData.certification || "");
      formDataAPI.append("description", formData.description || "");
      formDataAPI.append("is_available", formData.availability.toString());

      // Variants
      const validVariants = colorStoneVariants.filter(
        (variant) =>
          variant.shape &&
          variant.caratWeight &&
          variant.dimension &&
          variant.price
      );

      formDataAPI.append(
        "color_stone_variants",
        JSON.stringify(
          validVariants.map((variant) => ({
            shape: variant.shape,
            dimension: variant.dimension,
            carat_weight: parseFloat(variant.caratWeight),
            price: parseFloat(variant.price),
          }))
        )
      );

      // Files
      images.forEach((image) => {
        formDataAPI.append("images", image.file);
      });
      if (video) {
        formDataAPI.append("videos", video.file);
      }

      // API request
      const response = await fetch(
        "/api/admin/product/color-stone/add-color-stone",
        {
          method: "POST",
          headers: { Authorization: authToken },
          body: formDataAPI,
        }
      );

      const result = await response.json();

      if (result.status) {
        toast.success(formData.sku + " - Color Stone saved successfully!");
        resetFormData();
        setColorStoneVariants([
          { id: 1, shape: "", caratWeight: "", dimension: "", price: "" },
        ]);
      } else {
        toast.error(result.message || "Failed to save color stone");
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => toast.error(error));
        }
      }
    } catch (error) {
      console.error("Error saving color stone:", error);
      toast.error("An error occurred while saving the color stone");
    } finally {
      setIsLoading(false);
    }
  };

  const saveCut = async () => {
    setIsLoading(true);

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return;
      }

      const formDataAPI = new FormData();

      // Basic fields
      formDataAPI.append("name", formData.name);
      formDataAPI.append("shape", formData.shape);
      formDataAPI.append("sku", formData.sku);
      formDataAPI.append("cut_type", cutType || "");
      formDataAPI.append("color_range", formData.color || "");
      formDataAPI.append("clarity_range", formData.dimension || "");
      formDataAPI.append("description", formData.description || "");
      formDataAPI.append("is_available", formData.availability.toString());

      // Variants (dimension, carat_weight, price)
      const validVariants = cutVariants.filter(
        (variant) => variant.caratWeight && variant.dimension && variant.price
      );

      formDataAPI.append(
        "cut_variants",
        JSON.stringify(
          validVariants.map((variant) => ({
            dimension: variant.dimension,
            carat_weight: parseFloat(variant.caratWeight),
            price: parseFloat(variant.price),
          }))
        )
      );

      // Files
      images.forEach((image) => {
        formDataAPI.append("images", image.file);
      });
      if (video) {
        formDataAPI.append("videos", video.file);
      }

      // API request
      const response = await fetch("/api/admin/product/cut/add-cut", {
        method: "POST",
        headers: { Authorization: authToken },
        body: formDataAPI,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(formData.sku + " - By Cut saved successfully!");
        resetFormData();
        setCutVariants([
          {
            id: 1,
            color: "",
            clarity: "",
            caratWeight: "",
            dimension: "",
            price: "",
          },
        ]);
      } else {
        toast.error(result.message || "Failed to save by cut");
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => toast.error(error));
        }
      }
    } catch (error) {
      console.error("Error saving by cut:", error);
      toast.error("An error occurred while saving the by cut product");
    } finally {
      setIsLoading(false);
    }
  };

  const saveLayout = async () => {
    setIsLoading(true);

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return;
      }

      const formDataAPI = new FormData();

      // Basic fields
      formDataAPI.append("name", formData.name);
      formDataAPI.append("sku", formData.sku);
      formDataAPI.append("layout_type", layoutType || "");
      formDataAPI.append("description", formData.description || "");
      formDataAPI.append("is_available", formData.availability.toString());
      formDataAPI.append("price", parseFloat(layoutPrice || 0));

      // Diamond details
      const validDetails = layoutVariants.filter(
        (variant) =>
          variant.shape &&
          variant.totalPcs &&
          variant.totalCaratWeight &&
          variant.dimensions &&
          variant.colorRange &&
          variant.clarityRange
      );

      formDataAPI.append(
        "diamond_details",
        JSON.stringify(
          validDetails.map((variant) => ({
            shape: variant.shape,
            pcs: parseInt(variant.totalPcs, 10),
            carat_weight: parseFloat(variant.totalCaratWeight),
            dimension: variant.dimensions,
            color_range: variant.colorRange,
            clarity_range: variant.clarityRange,
          }))
        )
      );

      // Files
      images.forEach((image) => {
        formDataAPI.append("images", image.file);
      });
      if (video) {
        formDataAPI.append("videos", video.file);
      }

      // API request
      const response = await fetch("/api/admin/product/layout/add-layout", {
        method: "POST",
        headers: { Authorization: authToken },
        body: formDataAPI,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(formData.sku + " - Layout saved successfully!");
        resetFormData();
        setLayoutVariants([
          {
            id: 1,
            shape: "",
            totalPcs: "",
            totalCaratWeight: "",
            dimensions: "",
            colorRange: "",
            clarityRange: "",
          },
        ]);
        setLayoutPrice("");
        setLayoutType("");
      } else {
        toast.error(result.message || "Failed to save layout");
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => toast.error(error));
        }
      }
    } catch (error) {
      console.error("Error saving layout:", error);
      toast.error("An error occurred while saving the layout");
    } finally {
      setIsLoading(false);
    }
  };

  const saveAlphabet = async () => {
    setIsLoading(true);

    try {
      const authToken = getAuthToken();
      if (!authToken) {
        toast.error("Authorization failed. Please login again.");
        return;
      }

      const formDataAPI = new FormData();

      // Basic fields
      formDataAPI.append("name", formData.name);
      formDataAPI.append("sku", formData.sku);
      formDataAPI.append("character", character || "");
      formDataAPI.append("color_range", formData.color || "");
      formDataAPI.append("clarity_range", formData.dimension || "");
      formDataAPI.append("description", formData.description || "");
      formDataAPI.append("is_available", formData.availability.toString());

      // Variants
      const validVariants = alphabetVariants.filter(
        (variant) => variant.caratWeight && variant.price
      );

      formDataAPI.append(
        "alphabet_variants",
        JSON.stringify(
          validVariants.map((variant) => ({
            carat_weight: parseFloat(variant.caratWeight),
            price: parseFloat(variant.price),
          }))
        )
      );

      // Files
      images.forEach((image) => {
        formDataAPI.append("images", image.file);
      });
      if (video) {
        formDataAPI.append("videos", video.file);
      }

      // API request
      const response = await fetch("/api/admin/product/alphabet/add-alphabet", {
        method: "POST",
        headers: { Authorization: authToken },
        body: formDataAPI,
      });

      const result = await response.json();

      if (result.status) {
        toast.success(formData.sku + " - Alphabet saved successfully!");
        resetFormData();
        setAlphabetVariants([
          {
            id: 1,
            caratWeight: "",
            price: "",
          },
        ]);
      } else {
        toast.error(result.message || "Failed to save alphabet");
        if (result.errors && Array.isArray(result.errors)) {
          result.errors.forEach((error) => toast.error(error));
        }
      }
    } catch (error) {
      console.error("Error saving alphabet:", error);
      toast.error("An error occurred while saving the alphabet");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = () => {
    console.log("handleSave");
    let errors = [];

    switch (activeProductTab) {
      case "diamond":
        errors = validateDiamondForm();
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error);
          });
          return;
        }
        // Call the actual diamond save function
        saveDiamond();
        return;
      case "melee":
        errors = validateMeleeForm();
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error);
          });
          return;
        }
        saveMelee();
        return;
      case "colorstone":
        errors = validateColorStoneForm();
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error);
          });
          return;
        }
        saveColorStone();
        return;
      case "cut":
        errors = validateCutForm();
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error);
          });
          return;
        }
        saveCut();
        return;
      case "layout":
        errors = validateLayoutForm();
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error);
          });
          return;
        }
        saveLayout();
        return;
      case "alphabet":
        errors = validateAlphabetForm();
        if (errors.length > 0) {
          errors.forEach((error) => {
            toast.error(error);
          });
          return;
        }
        saveAlphabet();
        return;
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
      case "cut":
        completeData.cutVariants = cutVariants;
        completeData.cutType = cutType;
        break;
      case "layout":
        completeData.layoutVariants = layoutVariants;
        completeData.layoutType = layoutType;
        completeData.layoutPrice = layoutPrice;
        break;
      case "alphabet":
        completeData.alphabetVariants = alphabetVariants;
        completeData.character = character;
        break;
    }

    console.log("Product Data:", completeData);

    const productNames = {
      diamond: "Diamond",
      melee: "Melee",
      colorstone: "Color Stone",
      antiquecut: "By Cut",
      layout: "Layout",
      alphabet: "Alphabet",
    };

    // toast.success(
    //   `${productNames[activeProductTab]} product saved successfully!`
    // );
  };

  const renderProductDetailsForm = () => (
    <div className="space-y-8">
      {/* Product Details Section */}
      <div>
        <h2 className="text-lg font-medium mb-4">
          {activeProductTab === "diamond" && "Diamond Details"}
          {activeProductTab === "melee" && "Melee Details"}
          {activeProductTab === "colorstone" && "Color Stone Details"}
          {activeProductTab === "cut" &&
            "By Cut Details (Antique Cut, Portuguese Cut, Rose Cut, Old Mine Cut, Step Cut)"}
          {activeProductTab === "layout" && "Layout Details"}
          {activeProductTab === "alphabet" && "Alphabet Details"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {activeProductTab === "diamond" && "Diamond Name"}
              {activeProductTab === "melee" && "Melee Name"}
              {activeProductTab === "colorstone" && "Color Stone Name"}
              {activeProductTab === "cut" && "By Cut Name"}
              {activeProductTab === "layout" && "Layout Name"}
              {activeProductTab === "alphabet" && "Alphabet Name"}
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
                  : activeProductTab === "cut"
                  ? "By Cut Diamond"
                  : activeProductTab === "layout"
                  ? "Tennis Bracelet Layout"
                  : "Alphabet Letter A"
              }
              required
            />
          </div>

          {(activeProductTab === "diamond" ||
            activeProductTab === "melee" ||
            activeProductTab === "cut") && (
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
                  : activeProductTab === "cut"
                  ? "AC001"
                  : activeProductTab === "layout"
                  ? "LAY001"
                  : "ALF001"
              }
              required
            />
          </div>

          {activeProductTab === "layout" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Layout Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={layoutType}
                onChange={(e) => setLayoutType(e.target.value)}
                list="layoutTypeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select layout type"
                required
              />
              <datalist id="layoutTypeOptions">
                {layoutTypeOptions.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </div>
          )}

          {activeProductTab === "cut" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cut Type <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cutType}
                onChange={(e) => setCutType(e.target.value)}
                list="cutTypeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select cut type"
                required
              />
              <datalist id="cutTypeOptions">
                {cutTypeOptions.map((type) => (
                  <option key={type} value={type} />
                ))}
              </datalist>
            </div>
          )}

          {activeProductTab === "cut" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Range
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                list="colorRangeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select color range"
              />
              <datalist id="colorRangeOptions">
                {colorRanges.map((range) => (
                  <option key={range} value={range} />
                ))}
              </datalist>
            </div>
          )}

          {activeProductTab === "cut" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clarity Range
              </label>
              <input
                type="text"
                name="dimension"
                value={formData.dimension}
                onChange={handleInputChange}
                list="clarityRangeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select clarity range"
              />
              <datalist id="clarityRangeOptions">
                {clarityRanges.map((range) => (
                  <option key={range} value={range} />
                ))}
              </datalist>
            </div>
          )}

          {activeProductTab === "alphabet" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Character <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={character}
                onChange={(e) => {
                  // Limit to 1 character
                  const value = e.target.value.slice(0, 1);
                  setCharacter(value.toUpperCase());
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="A"
                maxLength="1"
                required
              />
            </div>
          )}

          {activeProductTab === "alphabet" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Range
              </label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                list="colorRangeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select color range"
              />
              <datalist id="colorRangeOptions">
                {colorRanges.map((range) => (
                  <option key={range} value={range} />
                ))}
              </datalist>
            </div>
          )}

          {activeProductTab === "alphabet" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clarity Range
              </label>
              <input
                type="text"
                name="dimension"
                value={formData.dimension}
                onChange={handleInputChange}
                list="clarityRangeOptions"
                className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Type or select clarity range"
              />
              <datalist id="clarityRangeOptions">
                {clarityRanges.map((range) => (
                  <option key={range} value={range} />
                ))}
              </datalist>
            </div>
          )}

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
                placeholder="IGI"
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
                        type="text"
                        value={formatPrice(variant.price)}
                        onChange={(e) =>
                          handleDiamondVariantChange(
                            variant.id,
                            "price",
                            stripPriceFormatting(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1,000"
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
            Add
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
                        type="text"
                        value={formatPrice(variant.pricePerCarat)}
                        onChange={(e) =>
                          handleMeleeVariantChange(
                            variant.id,
                            "pricePerCarat",
                            stripPriceFormatting(e.target.value)
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
            Add
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
                        type="text"
                        value={formatPrice(variant.price)}
                        onChange={(e) =>
                          handleColorStoneVariantChange(
                            variant.id,
                            "price",
                            stripPriceFormatting(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1,000"
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
            Add
          </button>
        </div>
      )}

      {activeProductTab === "cut" && (
        // By Cut Variants Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            By Cut Variants <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
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
                {cutVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.caratWeight}
                        onChange={(e) =>
                          handleCutVariantChange(
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
                          handleCutVariantChange(
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
                        type="text"
                        value={formatPrice(variant.price)}
                        onChange={(e) =>
                          handleCutVariantChange(
                            variant.id,
                            "price",
                            stripPriceFormatting(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1,000"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {cutVariants.length > 1 && (
                        <button
                          onClick={() => removeCutVariant(variant.id)}
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
            onClick={addCutVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add
          </button>
        </div>
      )}

      {activeProductTab === "layout" && (
        // Layout Variants Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            Diamond Details <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Shape
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Total Pcs
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Total Carat Weight
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Dimensions
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Color Range
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Clarity Range
                  </th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {layoutVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.shape}
                        onChange={(e) =>
                          handleLayoutVariantChange(
                            variant.id,
                            "shape",
                            e.target.value
                          )
                        }
                        list={`shapeOptions-layout-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select shape"
                      />
                      <datalist id={`shapeOptions-layout-${variant.id}`}>
                        {shapeOptions.map((shape) => (
                          <option key={shape} value={shape} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        value={variant.totalPcs}
                        onChange={(e) =>
                          handleLayoutVariantChange(
                            variant.id,
                            "totalPcs",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="50"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.totalCaratWeight}
                        onChange={(e) =>
                          handleLayoutVariantChange(
                            variant.id,
                            "totalCaratWeight",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="5.50"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.dimensions}
                        onChange={(e) =>
                          handleLayoutVariantChange(
                            variant.id,
                            "dimensions",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="2.5x2.5x1.5 mm"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="text"
                        value={variant.colorRange}
                        onChange={(e) =>
                          handleLayoutVariantChange(
                            variant.id,
                            "colorRange",
                            e.target.value
                          )
                        }
                        list={`colorRangeOptions-layout-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select color range"
                      />
                      <datalist id={`colorRangeOptions-layout-${variant.id}`}>
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
                          handleLayoutVariantChange(
                            variant.id,
                            "clarityRange",
                            e.target.value
                          )
                        }
                        list={`clarityRangeOptions-layout-${variant.id}`}
                        className="cursor-pointer w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="Type or select clarity range"
                      />
                      <datalist id={`clarityRangeOptions-layout-${variant.id}`}>
                        {clarityRanges.map((range) => (
                          <option key={range} value={range} />
                        ))}
                      </datalist>
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {layoutVariants.length > 1 && (
                        <button
                          onClick={() => removeLayoutVariant(variant.id)}
                          className="cursor-pointer text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 stroke-2" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Total Row */}
                {layoutVariants.length > 0 && (
                  <tr className="bg-gray-100 font-medium">
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      Total
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {calculateLayoutTotals().totalPcs}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center">
                      {calculateLayoutTotals().totalCaratWeight.toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-2 py-2"></td>
                    <td className="border border-gray-300 px-2 py-2"></td>
                    <td className="border border-gray-300 px-2 py-2"></td>
                    <td className="border border-gray-300 px-2 py-2"></td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <button
            onClick={addLayoutVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Diamond Detail
          </button>

          {/* Layout Price */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none z-10 text-gray-500">
                USD
              </div>
              <input
                type="text"
                value={formatPrice(layoutPrice)}
                onChange={(e) =>
                  setLayoutPrice(stripPriceFormatting(e.target.value))
                }
                className="pl-16 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Enter layout price"
                required
              />
            </div>
          </div>
        </div>
      )}

      {activeProductTab === "alphabet" && (
        // Alphabet Variants Section
        <div>
          <h3 className="text-lg font-medium mb-4">
            Alphabet Variants <span className="text-red-500">*</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
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
                {alphabetVariants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="border border-gray-300 px-2 py-2">
                      <input
                        type="number"
                        step="0.01"
                        value={variant.caratWeight}
                        onChange={(e) =>
                          handleAlphabetVariantChange(
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
                        value={formatPrice(variant.price)}
                        onChange={(e) =>
                          handleAlphabetVariantChange(
                            variant.id,
                            "price",
                            stripPriceFormatting(e.target.value)
                          )
                        }
                        className="w-full px-2 py-1 text-sm border-0 focus:outline-none"
                        placeholder="1,000"
                      />
                    </td>
                    <td className="border border-gray-300 px-2 py-2">
                      {alphabetVariants.length > 1 && (
                        <button
                          onClick={() => removeAlphabetVariant(variant.id)}
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
            onClick={addAlphabetVariant}
            className="cursor-pointer mt-4 flex items-center text-primary-600 hover:text-primary-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
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

      <div className="flex h-screen">
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
              <h1 className="text-xl font-semibold text-gray-800">
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
                    onClick={() => handleTabChange("cut")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "cut"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add By Cut
                  </button>
                  <button
                    onClick={() => handleTabChange("layout")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "layout"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add Layout
                  </button>
                  <button
                    onClick={() => handleTabChange("alphabet")}
                    className={`cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${
                      activeProductTab === "alphabet"
                        ? "border-primary-500 text-primary-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Add Alphabets
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
                    disabled={isLoading}
                    className={`px-4 py-2 gap-2 text-white rounded-lg flex items-center transition-colors ${
                      isLoading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary-600 hover:bg-primary-700 cursor-pointer"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      <>
                        Save{" "}
                        {activeProductTab === "diamond"
                          ? "Diamond"
                          : activeProductTab === "melee"
                          ? "Melee"
                          : activeProductTab === "colorstone"
                          ? "Color Stone"
                          : activeProductTab === "cut"
                          ? "By Cut"
                          : activeProductTab === "layout"
                          ? "Layout"
                          : "Alphabet"}
                      </>
                    )}
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
