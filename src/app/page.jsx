"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

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
      }, 300); // Half second for smooth transition
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, [animatedWords.length]);
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span
                className={`inline-block transition-all duration-300 ease-in-out ${
                  isVisible
                    ? "opacity-100 transform translate-y-0"
                    : "opacity-0 transform -translate-y-2"
                }`}
              >
                {animatedWords[currentWordIndex]}
              </span>{" "}
              Lab-Grown
              <span className="text-primary-600 block">Diamonds</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover our exquisite collection of lab-grown diamonds. From
              precision star melee to stunning colored stones, we offer the
              finest quality diamonds with complete transparency and
              certification.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition duration-200">
                Explore Collection
              </button>
              <button className="cursor-pointer border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-medium transition duration-200">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Diamond Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully curated selection of lab-grown diamonds,
              each certified for quality and brilliance.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Star Melee */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Star Melee Diamonds
              </h3>
              <p className="text-gray-600 mb-6">
                Precision-cut small diamonds available in various sieve sizes.
                Choose by clarity and color to match your exact specifications.
              </p>
              <button className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium">
                Explore Melee →
              </button>
            </div>

            {/* Colored Diamonds */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-300">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Colored Diamonds
              </h3>
              <p className="text-gray-600 mb-6">
                Vibrant colored lab-grown diamonds available in 0.25, 0.5, 0.75,
                and 1 carat sizes. Perfect for unique jewelry pieces.
              </p>
              <button className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium">
                View Colors →
              </button>
            </div>

            {/* Antique Shapes - Coming Soon */}
            <div className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition duration-300 opacity-75">
              <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mb-6">
                <svg
                  className="w-8 h-8 text-amber-600"
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
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Antique Shaped
              </h3>
              <p className="text-gray-600 mb-6">
                Classic and vintage-inspired diamond cuts with timeless appeal.
                Perfect for traditional and heritage jewelry designs.
              </p>
              <button className="cursor-pointer text-amber-600 hover:text-amber-700 font-medium">
                Coming Soon →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Bespoke Carat?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Certified Quality
              </h3>
              <p className="text-gray-600">
                Every diamond comes with detailed certification and quality
                assurance.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-blue-600"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Lab-Grown Excellence
              </h3>
              <p className="text-gray-600">
                Environmentally conscious diamonds with identical properties to
                natural stones.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-600"
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Competitive Pricing
              </h3>
              <p className="text-gray-600">
                Direct sourcing ensures the best prices without compromising on
                quality.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 3v18m9-9H3"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Custom Solutions
              </h3>
              <p className="text-gray-600">
                Tailored diamond selection to meet your specific requirements
                and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Star Melee</h3>
              <p className="text-gray-400">
                Premium lab-grown diamonds with uncompromising quality and
                transparency.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/products/melee" className="hover:text-white">
                    Star Melee
                  </Link>
                </li>
                <li>
                  <Link href="/products/colored" className="hover:text-white">
                    Colored Diamonds
                  </Link>
                </li>
                <li>
                  <Link href="/products/antique" className="hover:text-white">
                    Antique Shapes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/certifications" className="hover:text-white">
                    Certifications
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/support" className="hover:text-white">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link href="/shipping" className="hover:text-white">
                    Shipping Info
                  </Link>
                </li>
                <li>
                  <Link href="/returns" className="hover:text-white">
                    Returns
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Bespoke Carat. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
