import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "History of Lab Grown Diamonds | Bespoke Carat",
  description:
    "Explore the fascinating history of lab-grown diamonds from early 20th-century experiments to mainstream adoption in the jewelry industry.",
  openGraph: {
    title: "History of Lab Grown Diamonds | Bespoke Carat",
    description:
      "Explore the fascinating history of lab-grown diamonds from early 20th-century experiments to mainstream adoption in the jewelry industry.",
    url: "/diamondjournal/History of lab grown diamonds",
    type: "article",
    images: [
      {
        url: "/History of lab grown diamonds/History.png",
        width: 1200,
        height: 630,
        alt: "History of Lab Grown Diamonds",
      },
    ],
  },
  alternates: { canonical: "/diamondjournal/History of lab grown diamonds" },
  robots: { index: true, follow: true },
};

export default function HistoryOfLabGrownDiamondsPage() {
  return (
    <>
      <Navbar />
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href="/diamondjournal"
              className="hover:text-primary-600 transition-colors"
            >
              Diamond Journal
            </Link>
            <span>/</span>
            <span className="truncate">History of Lab Grown Diamonds</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            History of Lab Grown Diamonds
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-600">
            <span>Published on December 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>6 min read</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-800 text-xs font-medium">
              Education
            </span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-gray-100">
          <Image
            src="/History of lab grown diamonds/History.png"
            alt="History of Lab Grown Diamonds"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-10 leading-relaxed font-medium">
            The history of lab-grown diamonds began with early 20th-century
            research culminating in General Electric's 1954 creation of the
            first synthetic diamond via the High Pressure High Temperature
            (HPHT) method. These initial diamonds were for industrial use, but
            advancements led to the Chemical Vapor Deposition (CVD) technique in
            the 1980s and the eventual emergence of gem-quality lab-grown
            diamonds in the jewelry market by the 1990s and 2010s.
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Early Experiments & Discovery
            <span className="block text-lg sm:text-xl font-normal text-gray-600 mt-2">
              Late 18th Century - 1940s
            </span>
          </h2>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Carbon Identification
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                In 1772, Antoine Lavoisier discovered that diamonds are made of
                pure carbon, sparking interest in creating them artificially.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Unconfirmed Claims
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Throughout the late 19th and early 20th centuries, various
                scientists made claims about creating diamonds under high heat,
                but these were not consistently replicable or proven.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                General Electric's Research
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                In the 1940s, General Electric (GE) began R&D to create man-made
                diamonds but paused due to World War II.
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            The Birth of Synthetic Diamonds
            <span className="block text-lg sm:text-xl font-normal text-gray-600 mt-2">
              1950s
            </span>
          </h2>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                GE's HPHT Process
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                In 1954, GE scientists Howard Tracy Hall and Herbert Strong
                successfully produced the first gem-quality synthetic diamonds
                using the High Pressure High Temperature (HPHT) method, which
                mimics the extreme conditions found deep within the Earth.
              </p>
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  Key Details:
                </h4>
                <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>
                      <strong>Scientists:</strong> Howard Tracy Hall and Herbert
                      Strong
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>
                      <strong>Method:</strong> High Pressure High Temperature
                      (HPHT)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>
                      <strong>Achievement:</strong> First gem-quality synthetic
                      diamonds
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-semibold">•</span>
                    <span>
                      <strong>Process:</strong> Mimics Earth's deep mantle
                      conditions
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Industrial Applications
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                These early lab-grown diamonds were too small and impure for
                jewelry and were primarily used for industrial purposes, such as
                abrasives and cutting tools.
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            Technological Advancements
            <span className="block text-lg sm:text-xl font-normal text-gray-600 mt-2">
              1980s - 2000s
            </span>
          </h2>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                CVD Emergence
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-sm sm:text-base">
                The 1980s saw the development of a new method, Chemical Vapor
                Deposition (CVD), which allowed for more controlled growth from
                carbon-rich gases.
              </p>
              <div className="bg-white rounded-lg p-4 sm:p-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">
                  CVD Advantages:
                </h4>
                <ul className="space-y-2 text-gray-700 text-xs sm:text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">•</span>
                    <span>More controlled growth process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">•</span>
                    <span>Uses carbon-rich gases</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">•</span>
                    <span>Lower pressure requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-semibold">•</span>
                    <span>Better quality control</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                Improved Quality
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                Both HPHT and CVD technologies were refined throughout the late
                20th century, leading to higher-quality diamonds with better
                color and purity.
              </p>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            The Rise of Gem-Quality & Mainstream Market
            <span className="block text-lg sm:text-xl font-normal text-gray-600 mt-2">
              1990s - Present
            </span>
          </h2>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                First Gem-Quality Diamonds
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                The 1990s saw the first significant wave of gem-quality
                lab-grown diamonds enter the jewelry market, offering an
                affordable and ethical alternative to mined stones.
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                Mainstream Adoption
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                By the 2010s, advances in technology, particularly with the
                large-scale production via CVD reactors, made it possible to
                mass-produce multi-carat lab-grown diamonds, leading to their
                mainstream adoption in the jewelry industry.
              </p>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 mb-8 sm:mb-10">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              Key Milestones Timeline
            </h3>
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                  1772
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Carbon Discovery
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    Antoine Lavoisier discovers diamonds are pure carbon
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                  1940s
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    GE Research Begins
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    General Electric starts R&D for synthetic diamonds
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                  1954
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    First Success
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    GE creates first gem-quality synthetic diamonds via HPHT
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                  1980s
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    CVD Development
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    Chemical Vapor Deposition method emerges
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                  1990s
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Jewelry Market Entry
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    First gem-quality diamonds enter jewelry market
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="bg-primary-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-xs sm:text-sm font-semibold flex-shrink-0">
                  2010s
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">
                    Mainstream Adoption
                  </h4>
                  <p className="text-gray-700 text-xs sm:text-sm mt-1">
                    Mass production leads to mainstream jewelry industry
                    adoption
                  </p>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
            The Bespoke Carat Advantage
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">
            At Bespoke Carat, we're proud to be part of this exciting evolution
            in diamond technology. We work with the world's most advanced
            lab-grown diamond facilities to bring you exceptional stones that
            combine the beauty of natural diamonds with the benefits of modern
            technology.
          </p>

          <div className="bg-primary-50 rounded-2xl p-6 sm:p-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">
              Why Choose Lab-Grown Diamonds from Bespoke Carat?
            </h3>
            <ul className="space-y-3 sm:space-y-4 text-gray-700 mb-6 sm:mb-8">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold text-sm sm:text-base">
                  ✓
                </span>
                <span className="text-sm sm:text-base">
                  Cutting-edge technology for superior quality
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold text-sm sm:text-base">
                  ✓
                </span>
                <span className="text-sm sm:text-base">
                  Ethical and environmentally responsible sourcing
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold text-sm sm:text-base">
                  ✓
                </span>
                <span className="text-sm sm:text-base">
                  Competitive pricing without quality compromise
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold text-sm sm:text-base">
                  ✓
                </span>
                <span className="text-sm sm:text-base">
                  Custom options for unique pieces
                </span>
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Explore Our Lab-Grown Collection
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-3 border border-gray-300 text-sm sm:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Learn More About Our Process
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <Link
              href="/diamondjournal/CelebrityInspiredEngagementRing"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
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
              <span className="hidden sm:inline">
                Celebrity Inspired Engagement Ring
              </span>
              <span className="sm:hidden">Previous Article</span>
            </Link>
            <Link
              href="/diamondjournal/HowCutaffectsPerosnality&Energy"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors text-sm sm:text-base"
            >
              <span className="hidden sm:inline">
                How Cut Affects Personality & Energy
              </span>
              <span className="sm:hidden">Next Article</span>
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </nav>
      </article>
      <Footer />
    </>
  );
}
