"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState(false);
  const testimonialTimeoutRef = useRef(null);
  const testimonialDeadlineRef = useRef(null);
  const [testimonialRemainingMs, setTestimonialRemainingMs] = useState(6000);

  const animatedWords = [
    "Premium",
    "Elegant",
    "Exquisite",
    "Flawless",
    "Timeless",
    "Brilliant",
    "Radiant",
    "Sparkling",
    "Luxury",
  ];

  const { isAuthenticated, isAdmin, isCustomer, userData, logout, getToken } =
    useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);

      setTimeout(() => {
        setCurrentWordIndex(
          (prevIndex) => (prevIndex + 1) % animatedWords.length
        );
        setIsVisible(true);
      }, 300);
    }, 2000);

    return () => clearInterval(interval);
  }, [animatedWords.length]);

  const testimonials = [
    {
      quote:
        "Exceptional quality and service. Their custom sizes were exactly what we needed for a complex design brief.",
      initials: "AK",
      name: "Aria Kapoor",
      title: "New York, USA",
    },
    {
      quote:
        "Transparent grading and consistent timelines. We rely on them for B2B orders at scale.",
      initials: "JD",
      name: "James Dsouza",
      title: "Wholesale Jeweler, Dubai",
    },
    {
      quote:
        "From antique cuts to portraits, their precision and polish are consistently impressive.",
      initials: "SL",
      name: "Sofia L.",
      title: "Boutique Studio, London",
    },
    {
      quote:
        "I am so impressed with the quality of the diamonds they sent me. They are exactly what I was looking for and the service was excellent.",
      initials: "ML",
      name: "Manoj L.",
      title: "Melbourne, Australia",
    },
    {
      quote: "Very good service and quality of the diamonds.",
      initials: "AR",
      name: "Amit R.",
      title: "Sydney, Australia",
    },
  ];

  // Testimonial auto-advance with pause/resume preserving remaining time
  useEffect(() => {
    if (isTestimonialHovered) {
      if (testimonialTimeoutRef.current)
        clearTimeout(testimonialTimeoutRef.current);
      return;
    }

    const now = Date.now();
    const remaining = testimonialDeadlineRef.current
      ? Math.max(0, testimonialDeadlineRef.current - now)
      : testimonialRemainingMs;

    testimonialTimeoutRef.current = setTimeout(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
      testimonialDeadlineRef.current = Date.now() + 6000;
      setTestimonialRemainingMs(6000);
    }, remaining);

    testimonialDeadlineRef.current = now + remaining;

    return () => {
      if (testimonialTimeoutRef.current)
        clearTimeout(testimonialTimeoutRef.current);
    };
  }, [testimonialIndex, isTestimonialHovered, testimonials.length]);

  const handleTestimonialMouseEnter = () => {
    setIsTestimonialHovered(true);
    if (testimonialTimeoutRef.current) {
      clearTimeout(testimonialTimeoutRef.current);
      testimonialTimeoutRef.current = null;
    }
    if (testimonialDeadlineRef.current) {
      const remaining = Math.max(
        0,
        testimonialDeadlineRef.current - Date.now()
      );
      setTestimonialRemainingMs(remaining);
    }
  };

  const handleTestimonialMouseLeave = () => {
    setIsTestimonialHovered(false);
    testimonialDeadlineRef.current =
      Date.now() + (testimonialRemainingMs || 6000);
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-surface-200">
        <div
          className="absolute inset-0 pointer-events-none select-none"
          aria-hidden
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-accent-100 blur-3xl opacity-60"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-accent-cool-100 blur-3xl opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-text-dark tracking-tight mb-4">
              Bespoke brilliance,
              <span
                className={`ml-2 inline-block align-baseline transition-opacity duration-300 ${
                  isVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                {animatedWords[currentWordIndex]}
              </span>
            </h1>
            <p className="text-base md:text-lg text-secondary max-w-2xl mx-auto mb-8">
              Designed for visionaries. Delivered with precision.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/collections/all"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-medium shadow-md hover:bg-hover-brand transition"
              >
                Explore Diamond Collections
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-neutral-300 bg-white/70 hover:bg-white text-text-dark font-medium shadow-sm transition"
              >
                Talk to a Specialist Today
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-dark tracking-tight">
              Shop by Category
            </h2>
            <p className="text-secondary text-sm md:text-base mt-2">
              Curated cuts, colors, and shapes crafted to your specs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Small Loose Diamonds */}
            <Link
              href="/collections/melee"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://i.etsystatic.com/8335775/r/il/80d1e8/849619294/il_1588xN.849619294_5y77.jpg"
                  alt="Small Loose Diamonds"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Small Loose Diamonds
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Melee
                </div>
              </div>
            </Link>

            {/* Brilliant Cut */}
            <Link
              href="/collections/round"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://cdn.shopify.com/s/files/1/0536/3086/1474/files/BRC_cut_636x358_59b1bd6e-f14a-42c5-81e6-ecc2cd209418.jpg?v=1626433488"
                  alt="Brilliant Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Brilliant Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Round
                </div>
              </div>
            </Link>

            {/* Antique Cut */}
            <Link
              href="/collections/antiquecut"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/LG5466_1_00b63814-b0e1-45b7-975e-ebf3abaf0eea_1400x1400.webp?v=1749276960"
                  alt="Antique Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Antique Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Vintage
                </div>
              </div>
            </Link>

            {/* Colored Diamonds */}
            <Link
              href="/collections/colorstone"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/GEM2238-OJ5377-EWI_1_d4e842cd-9aad-4988-b27c-78dc90cbe2a1_1400x1400.webp?v=1749274849"
                  alt="Colored Diamonds"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Colored Diamonds
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Fancy
                </div>
              </div>
            </Link>

            {/* Portuguese Cut */}
            <Link
              href="/collections/portuguesecut"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/OA1557_1_9b9800d5-5fdd-48df-af28-d7520e91a074_1400x1400.webp?v=1749280901"
                  alt="Portuguese Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Portuguese Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Portuguese Cut
                </div>
              </div>
            </Link>

            {/* Baguette, Tapered & Step Cut */}
            <Link
              href="/collections/stepcut"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://i.etsystatic.com/13062514/r/il/8314b6/2580085146/il_570xN.2580085146_946u.jpg"
                  alt="Baguette, Tapered & Step Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Baguette, Tapered & Step Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Step Cut
                </div>
              </div>
            </Link>

            {/* Rose Cut */}
            <Link
              href="/collections/rosecut"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/Antique-Shape-Lab-Diamond-Loose_5ef91f99-2d59-49e7-9ae5-23161764a111_1400x1400.webp?v=1749279653"
                  alt="Rose Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Rose Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Rose Cut
                </div>
              </div>
            </Link>

            {/* Old Mine Cut */}
            <Link
              href="/collections/oldcut"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/OA5973-EWI_6_2a6226d3-0a2e-4feb-9fe5-b662c1afab19_1400x1400.webp?v=1749287781"
                  alt="Old Mine Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Old Mine Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Old Mine Cut
                </div>
              </div>
            </Link>

            {/* Alphabet Cut */}
            <Link
              href="/collections/alphabet"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/01_49748425-a83f-4c22-be84-c955ba6530cb_1400x1400.webp?v=1750941829"
                  alt="Alphabet Cut"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Alphabet Cut
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Alphabet Cut
                </div>
              </div>
            </Link>

            {/* Layout */}
            <Link
              href="/collections/layout"
              className="group block rounded-xl overflow-hidden bg-white shadow-sm ring-1 ring-neutral-300 hover:shadow-lg hover:ring-neutral-400 transition-all duration-300"
            >
              <div className="relative aspect-square">
                <img
                  src="/layout.jpg"
                  alt="Layout"
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white text-lg font-semibold drop-shadow">
                    Layout
                  </h3>
                </div>
                <div className="absolute top-3 right-3 rounded-full bg-white/85 text-text-dark px-2 py-1 text-xs font-medium shadow-sm group-hover:bg-white">
                  Layout
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {!isAuthenticated ? (
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary-900 to-primary-700 text-white p-8 md:p-10 shadow-lg">
              <div
                className="absolute inset-0 opacity-20 pointer-events-none select-none"
                aria-hidden
              >
                <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-accent-800 blur-3xl"></div>
                <div className="absolute -left-10 -top-10 w-64 h-64 rounded-full bg-accent-cool-800 blur-3xl"></div>
              </div>
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl md:text-2xl font-serif font-bold">
                    Trade access to 10,000+ diamonds
                  </h3>
                  <p className="text-white/85 text-sm md:text-base mt-1">
                    Login to view full inventory, live pricing, and availability
                  </p>
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center shrink-0 bg-white text-primary-900 px-6 py-3 rounded-lg font-semibold hover:bg-accent-50 transition shadow"
                >
                  Login now
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <></>
      )}

      {/* Why Shop With Us */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-dark tracking-tight mb-2">
              Why shop with us
            </h2>
            <p className="text-secondary text-sm md:text-base">
              Uncompromising quality, transparency, and tailored service
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-dark mb-2">
                Precision-Cut
                <br />
                Lab-Grown Diamonds
              </h3>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-dark mb-2">
                Custom Sizes
                <br />
                Shapes & Grades
              </h3>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-dark mb-2">
                Trusted by Jewelers
              </h3>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-dark mb-2">
                Transparent
                <br />
                Sourcing & Grading
              </h3>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-dark mb-2">
                Competitive Pricing
                <br />
                No Compromise on Quality
              </h3>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-accent-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-text-dark mb-2">
                Bulk Order &<br />
                B2B Support
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* How Orders Work */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-dark tracking-tight">
              How make‑to‑order works
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
              <div className="relative text-center bg-white rounded-xl p-6 border border-neutral-300 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ring-primary-200">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-text-dark mb-1">
                  Share Your Vision
                </h3>
                <p className="text-secondary text-sm">
                  Send us your idea, sketch, or desired diamond specification.
                  Custom size, shape, or special requests welcome.
                </p>
              </div>

              <div className="relative text-center bg-white rounded-xl p-6 border border-neutral-300 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ring-primary-200">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-text-dark mb-1">
                  We Review & Respond
                </h3>
                <p className="text-secondary text-sm">
                  We assess feasibility, confirm details, and share estimated
                  production timelines.
                </p>
              </div>

              <div className="relative text-center bg-white rounded-xl p-6 border border-neutral-300 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ring-primary-200">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-text-dark mb-1">
                  Approve & Proceed
                </h3>
                <p className="text-secondary text-sm">
                  After approval and payment, we begin cultivation and precision
                  production.
                </p>
              </div>

              <div className="relative text-center bg-white rounded-xl p-6 border border-neutral-300 shadow-sm hover:shadow-md transition hover:-translate-y-0.5">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3 ring-1 ring-primary-200">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
                <h3 className="text-base md:text-lg font-semibold text-text-dark mb-1">
                  Delivered to You
                </h3>
                <p className="text-secondary text-sm">
                  Your diamond ships securely to your location—tracked and ready
                  to set.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-dark tracking-tight">
              Our vision
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="relative bg-surface rounded-2xl px-8 md:px-10 py-8 md:py-10 border border-neutral-300 shadow-sm">
                <div
                  className="absolute -top-5 -left-3 text-accent-800 text-6xl leading-none select-none"
                  aria-hidden
                >
                  “
                </div>
                <p className="text-lg md:text-xl text-text-dark leading-relaxed font-serif">
                  To inspire a new era of brilliance where every diamond tells a
                  story of innovation, ethics, and infinite possibility.
                </p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="h-px w-8 bg-accent-800"></div>
                  <span className="text-sm text-secondary">Bespoke Carat</span>
                </div>
              </div>
            </div>
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-neutral-300 shadow-sm">
                <img
                  src="/layout.jpg"
                  alt="Bespoke craftsmanship"
                  className="w-full h-72 md:h-[22rem] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-text-dark tracking-tight">
              What our clients say
            </h2>
            <p className="text-secondary text-sm md:text-base mt-2">
              Trusted by jewelers, designers, and brands worldwide
            </p>
          </div>
          <div
            className="relative"
            onMouseEnter={handleTestimonialMouseEnter}
            onMouseLeave={handleTestimonialMouseLeave}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700"
                style={{ transform: `translateX(-${testimonialIndex * 100}%)` }}
              >
                {testimonials.map((t, idx) => (
                  <div key={idx} className="min-w-full px-0">
                    <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm p-6 md:p-8 max-w-4xl mx-auto">
                      <div
                        className="flex items-center gap-1 text-accent-800 mb-4"
                        aria-label="5 stars"
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <svg
                            key={i}
                            className="w-4 h-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.967 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.538 1.118l-2.802-2.036a1 1 0 00-1.176 0l-2.802 2.036c-.783.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.379-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-text-dark leading-relaxed text-base md:text-lg">
                        “{t.quote}”
                      </p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary font-semibold">
                          {t.initials}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text-dark">
                            {t.name}
                          </div>
                          <div className="text-xs text-secondary">
                            {t.title}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === testimonialIndex
                      ? "bg-primary w-4"
                      : "bg-neutral-400/70"
                  }`}
                  onClick={() => {
                    setTestimonialIndex(i);
                    testimonialDeadlineRef.current = Date.now() + 6000;
                    setTestimonialRemainingMs(6000);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
