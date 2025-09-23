"use client";
import { AdminRoute } from "@/components/ProtectedRoute";
import React, { useState } from "react";
import Sidebar from "../../components/sidebar";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImagePlus, Plus, Trash2, Video } from "lucide-react";
import AddDiamond from "../components/AddDiamond";
import AddMelee from "../components/AddMelee";
import AddColorStone from "../components/AddColorStone";
import AddCut from "../components/AddCut";
import AddLayout from "../components/AddLayout";
import AddAlphabets from "../components/AddAlphabets";
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
    clarity: "",
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
      clarity: "",
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
      formDataAPI.append("clarity_range", formData.clarity || "");
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
      formDataAPI.append("clarity_range", formData.clarity || "");
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
  };

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
            <div className="p-2 bg-white rounded-xl flex flex-col gap-4">
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
              <div className="space-y-8 p-6">
                {/* Product Details Section */}
                <div>
                  {activeProductTab === "diamond" && (
                    <AddDiamond
                      formData={formData}
                      handleInputChange={handleInputChange}
                      shapeOptions={shapeOptions}
                      colorOptions={colorOptions}
                      clarityOptions={clarityOptions}
                      formatPrice={formatPrice}
                      stripPriceFormatting={stripPriceFormatting}
                      diamondVariants={diamondVariants}
                      handleDiamondVariantChange={handleDiamondVariantChange}
                      addDiamondVariant={addDiamondVariant}
                      removeDiamondVariant={removeDiamondVariant}
                    />
                  )}
                  {activeProductTab === "melee" && (
                    <AddMelee
                      formData={formData}
                      handleInputChange={handleInputChange}
                      shapeOptions={shapeOptions}
                      colorRanges={colorRanges}
                      clarityRanges={clarityRanges}
                      sieveSizeOptions={sieveSizeOptions}
                      formatPrice={formatPrice}
                      stripPriceFormatting={stripPriceFormatting}
                      meleeVariants={meleeVariants}
                      handleMeleeVariantChange={handleMeleeVariantChange}
                      addMeleeVariant={addMeleeVariant}
                      removeMeleeVariant={removeMeleeVariant}
                    />
                  )}
                  {activeProductTab === "colorstone" && (
                    <AddColorStone
                      formData={formData}
                      handleInputChange={handleInputChange}
                      shapeOptions={shapeOptions}
                      formatPrice={formatPrice}
                      stripPriceFormatting={stripPriceFormatting}
                      colorStoneVariants={colorStoneVariants}
                      handleColorStoneVariantChange={
                        handleColorStoneVariantChange
                      }
                      addColorStoneVariant={addColorStoneVariant}
                      removeColorStoneVariant={removeColorStoneVariant}
                    />
                  )}
                  {activeProductTab === "cut" && (
                    <AddCut
                      formData={formData}
                      handleInputChange={handleInputChange}
                      shapeOptions={shapeOptions}
                      colorRanges={colorRanges}
                      clarityRanges={clarityRanges}
                      cutType={cutType}
                      setCutType={setCutType}
                      cutTypeOptions={cutTypeOptions}
                      formatPrice={formatPrice}
                      stripPriceFormatting={stripPriceFormatting}
                      cutVariants={cutVariants}
                      handleCutVariantChange={handleCutVariantChange}
                      addCutVariant={addCutVariant}
                      removeCutVariant={removeCutVariant}
                    />
                  )}
                  {activeProductTab === "layout" && (
                    <AddLayout
                      formData={formData}
                      handleInputChange={handleInputChange}
                      shapeOptions={shapeOptions}
                      layoutType={layoutType}
                      setLayoutType={setLayoutType}
                      layoutPrice={layoutPrice}
                      setLayoutPrice={setLayoutPrice}
                      layoutTypeOptions={layoutTypeOptions}
                      formatPrice={formatPrice}
                      stripPriceFormatting={stripPriceFormatting}
                      layoutVariants={layoutVariants}
                      handleLayoutVariantChange={handleLayoutVariantChange}
                      addLayoutVariant={addLayoutVariant}
                      removeLayoutVariant={removeLayoutVariant}
                      colorRanges={colorRanges}
                      clarityRanges={clarityRanges}
                    />
                  )}
                  {activeProductTab === "alphabet" && (
                    <AddAlphabets
                      formData={formData}
                      handleInputChange={handleInputChange}
                      colorRanges={colorRanges}
                      clarityRanges={clarityRanges}
                      character={character}
                      setCharacter={setCharacter}
                      alphabetVariants={alphabetVariants}
                      handleAlphabetVariantChange={handleAlphabetVariantChange}
                      addAlphabetVariant={addAlphabetVariant}
                      removeAlphabetVariant={removeAlphabetVariant}
                      formatPrice={formatPrice}
                      stripPriceFormatting={stripPriceFormatting}
                    />
                  )}
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
              </div>

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
