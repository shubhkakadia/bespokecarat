"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-surface py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
            BESPOKE CARAT
          </h1>
          <h2 className="text-xl md:text-2xl text-text-dark mb-8">
            CUSTOM LAB GROWN DIAMONDS
          </h2>
          <p className="text-base md:text-lg text-secondary mb-8 max-w-3xl mx-auto">
            Designed for visionaries. Delivered with precision.
          </p>
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">
              SHOP BY CATEGORY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Small Loose Diamonds */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://i.etsystatic.com/8335775/r/il/80d1e8/849619294/il_1588xN.849619294_5y77.jpg"
                  alt="Small Loose Diamonds"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Small Loose Diamonds
                </h3>
              </div>
            </div>

            {/* Brilliant Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://cdn.shopify.com/s/files/1/0536/3086/1474/files/BRC_cut_636x358_59b1bd6e-f14a-42c5-81e6-ecc2cd209418.jpg?v=1626433488"
                  alt="Brilliant Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Brilliant Cut
                </h3>
              </div>
            </div>

            {/* Antique Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/LG5466_1_00b63814-b0e1-45b7-975e-ebf3abaf0eea_1400x1400.webp?v=1749276960"
                  alt="Antique Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Antique Cut
                </h3>
              </div>
            </div>

            {/* Colored Diamonds */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/GEM2238-OJ5377-EWI_1_d4e842cd-9aad-4988-b27c-78dc90cbe2a1_1400x1400.webp?v=1749274849"
                  alt="Colored Diamonds"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Colored Diamonds
                </h3>
              </div>
            </div>

            {/* Portuguese Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/OA1557_1_9b9800d5-5fdd-48df-af28-d7520e91a074_1400x1400.webp?v=1749280901"
                  alt="Portuguese Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Portuguese Cut
                </h3>
              </div>
            </div>

            {/* Baguette, Tapered & Step Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://i.etsystatic.com/13062514/r/il/8314b6/2580085146/il_570xN.2580085146_946u.jpg"
                  alt="Baguette Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Baguette, Tapered & Step Cut
                </h3>
              </div>
            </div>

            {/* Rose Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/Antique-Shape-Lab-Diamond-Loose_5ef91f99-2d59-49e7-9ae5-23161764a111_1400x1400.webp?v=1749279653"
                  alt="Rose Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Rose Cut
                </h3>
              </div>
            </div>

            {/* Old Mine Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/OA5973-EWI_6_2a6226d3-0a2e-4feb-9fe5-b662c1afab19_1400x1400.webp?v=1749287781"
                  alt="Old Mine Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Old Mine Cut
                </h3>
              </div>
            </div>

            {/* Alphabet Cut */}
            <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                <img
                  src="https://ourosjewels.com/cdn/shop/files/01_49748425-a83f-4c22-be84-c955ba6530cb_1400x1400.webp?v=1750941829"
                  alt="Alphabet Cut"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-text-dark">
                  Alphabet Cut
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="text-center bg-background-secondary">
            <Link
              href="/login"
              className="inline-block bg-primary text-surface px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary-800 transition duration-300"
            >
              Login to view full inventory & pricing
            </Link>
          </div>

      {/* Why Shop With Us */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-8">
              WHY SHOP WITH US
            </h2>
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
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-8">
              HOW MAKE TO ORDERS WORK
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                Share Your Vision
              </h3>
              <p className="text-secondary text-sm">
                Send us your idea, sketch, or desired diamond specification.
                Whether it's a custom size, shape, or special request, we're
                ready.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                We Review & Respond
              </h3>
              <p className="text-secondary text-sm">
                Our team will assess the design, confirm feasibility, and share
                all details including estimating production time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                Approved & Proceed
              </h3>
              <p className="text-secondary text-sm">
                Once you approve the design, payment is processed and we begin
                cultivated and moved into production with precision standards.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">4</span>
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">
                Delivered to Your Doorstep
              </h3>
              <p className="text-secondary text-sm">
                Your Diamonds is shipped securely to your location. You will be
                tracked, and ready to set.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-8">
              OUR VISION
            </h2>
            <div className="max-w-4xl mx-auto">
              <div className="bg-surface rounded-2xl px-8 md:px-12 py-6 md:py-8 border-2 border-neutral-400">
                <p className="text-lg md:text-xl text-text-dark leading-relaxed">
                  To inspire a new era of brilliance where every diamond tells a
                  story of innovation, ethics, and infinite possibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
