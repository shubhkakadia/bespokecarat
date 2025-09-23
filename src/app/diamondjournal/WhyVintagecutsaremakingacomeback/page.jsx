import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Why Vintage Cuts Are Making a Comeback | Bespoke Carat",
  description:
    "Discover why vintage diamond cuts are regaining popularity. From old mine cuts to rose cuts, explore the timeless appeal of vintage diamond styles.",
  openGraph: {
    title: "Why Vintage Cuts Are Making a Comeback | Bespoke Carat",
    description:
      "Discover why vintage diamond cuts are regaining popularity. From old mine cuts to rose cuts, explore the timeless appeal of vintage diamond styles.",
    url: "/diamondjournal/Why Vintage cuts are making a comeback",
    type: "article",
    images: [
      {
        url: "/Why Vintage cuts are making a comeback/why vintage.jpg",
        width: 1200,
        height: 630,
        alt: "Why Vintage Cuts Are Making a Comeback",
      },
    ],
  },
  alternates: {
    canonical: "/diamondjournal/Why Vintage cuts are making a comeback",
  },
  robots: { index: true, follow: true },
};

export default function WhyVintageCutsAreMakingComebackPage() {
  return (
    <>
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
            <Link
              href="/diamondjournal"
              className="hover:text-primary-600 transition-colors"
            >
              Diamond Journal
            </Link>
            <span>/</span>
            <span className="truncate">Why Vintage Cuts Are Making a Comeback</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Why Vintage Cuts Are Making a Comeback
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <span>Published on December 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>7 min read</span>
            <span className="hidden sm:inline">•</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-100 text-primary-800 text-[10px] sm:text-xs font-medium">Vintage & Heritage</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-xl sm:rounded-2xl overflow-hidden mb-8 sm:mb-12 bg-gray-100">
          <Image
            src="/Why Vintage cuts are making a comeback/why vintage.jpg"
            alt="Why Vintage Cuts Are Making a Comeback"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
            In recent years, vintage cut diamonds have been steadily regaining
            popularity, capturing the hearts of modern couples who appreciate
            the romance, history, and unique character of these timeless
            treasures.
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The Vintage Revival
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The resurgence of vintage cut diamonds reflects a broader cultural
            shift toward authenticity, sustainability, and appreciation for
            craftsmanship. As modern consumers seek jewelry with character and
            history, vintage cuts offer a compelling alternative to the
            precision-cut diamonds that have dominated the market for decades.
          </p>

          <div className="bg-gradient-to-r from-rose-50 to-amber-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Vintage Cuts Are Trending
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-rose-600 font-semibold">✓</span>
                <span>Unique character and individual personality</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-600 font-semibold">✓</span>
                <span>Romantic, nostalgic appeal</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-600 font-semibold">✓</span>
                <span>Sustainable choice for eco-conscious consumers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-rose-600 font-semibold">✓</span>
                <span>Investment value and rarity</span>
              </li>
            </ul>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Popular Vintage Cut Styles
          </h2>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Old Mine Cut
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The old mine cut, popular from the 1700s to the early 1900s,
            features a square or rectangular shape with rounded corners and a
            high crown. These diamonds were cut by hand, giving each stone a
            unique character and romantic glow that modern precision cuts cannot
            replicate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Old Mine Cut Characteristics
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Square or rectangular shape with rounded corners</li>
                <li>• High crown and small table</li>
                <li>• Hand-cut facets with slight irregularities</li>
                <li>• Warm, romantic light reflection</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Why They're Beloved
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Each stone is unique and one-of-a-kind</li>
                <li>• Rich historical significance</li>
                <li>• Romantic, candlelit glow</li>
                <li>• Connection to jewelry history</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Rose Cut
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The rose cut, dating back to the 1500s, features a flat bottom and a
            dome-shaped top covered in triangular facets. This cut creates a
            subtle, sophisticated sparkle that's perfect for those who
            appreciate understated elegance and vintage charm.
          </p>

          <div className="bg-purple-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Rose Cut Appeal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Distinctive Features
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Flat bottom with domed top</li>
                  <li>• Triangular facets in rose pattern</li>
                  <li>• Subtle, sophisticated sparkle</li>
                  <li>• Perfect for vintage-inspired designs</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Modern Applications
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Engagement rings with vintage appeal</li>
                  <li>• Statement jewelry pieces</li>
                  <li>• Bohemian and romantic styles</li>
                  <li>• Sustainable jewelry choices</li>
                </ul>
              </div>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Antique Cushion Cut
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            The antique cushion cut, popular in the Victorian and Edwardian
            eras, combines the best of old mine and modern cushion cuts. These
            diamonds feature larger facets and a more open cut that creates
            beautiful light play while maintaining vintage character.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Antique Cushion Features
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Larger, more open facets</li>
                <li>• Softer, more romantic sparkle</li>
                <li>• Vintage proportions and character</li>
                <li>• Excellent light performance</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                Perfect For
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Vintage-inspired engagement rings</li>
                <li>• Heirloom-quality jewelry</li>
                <li>• Romantic, feminine designs</li>
                <li>• Those seeking unique character</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            The Cultural Shift Driving the Comeback
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            The revival of vintage cuts reflects broader cultural trends toward
            authenticity, sustainability, and appreciation for craftsmanship.
            Modern consumers are increasingly drawn to items with history,
            character, and individual personality rather than mass-produced
            perfection.
          </p>

          <div className="space-y-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-[11px] sm:text-sm">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Sustainability Consciousness
                </h4>
                <p className="text-gray-700">
                  Vintage cuts often come from recycled or antique diamonds,
                  making them an environmentally conscious choice for eco-minded
                  consumers who want to reduce their environmental footprint.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-[11px] sm:text-sm">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Authenticity Seeking
                </h4>
                <p className="text-gray-700">
                  In an age of mass production, consumers are drawn to items
                  with authentic character and history. Vintage cuts offer the
                  unique imperfections and individual personality that modern
                  precision cuts lack.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-[11px] sm:text-sm">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Nostalgia and Romance
                </h4>
                <p className="text-gray-700">
                  Vintage cuts evoke feelings of romance, nostalgia, and
                  connection to the past. They appeal to couples who want their
                  jewelry to tell a story and carry emotional significance
                  beyond just beauty.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold text-[11px] sm:text-sm">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Investment Value
                </h4>
                <p className="text-gray-700">
                  Antique and vintage diamonds often hold their value well and
                  can appreciate over time, making them attractive to investors
                  and collectors who appreciate both beauty and financial
                  potential.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Modern Interpretations of Vintage Cuts
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Contemporary jewelers are finding innovative ways to incorporate
            vintage cuts into modern designs, creating pieces that honor
            tradition while appealing to contemporary tastes. This fusion of old
            and new has contributed significantly to the vintage cut revival.
          </p>

          <div className="bg-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Modern Vintage Fusion
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Contemporary Settings
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Vintage cuts in modern, minimalist settings</li>
                  <li>• Mixing vintage and contemporary elements</li>
                  <li>• Updated metal choices and proportions</li>
                  <li>• Innovative design combinations</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Design Innovation
                </h4>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Unexpected stone combinations</li>
                  <li>• Modern geometric arrangements</li>
                  <li>• Contemporary color palettes</li>
                  <li>• Updated proportions and scaling</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Choosing a Vintage Cut Diamond
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            When selecting a vintage cut diamond, it's important to understand
            that these stones are evaluated differently than modern cuts. Their
            beauty lies in their character, history, and unique light
            performance rather than perfect symmetry or maximum brilliance.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                What to Look For
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Character and personality</li>
                <li>• Good light performance for the cut</li>
                <li>• Appropriate proportions</li>
                <li>• Overall condition and wear</li>
              </ul>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-5 sm:p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                What to Expect
              </h4>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li>• Unique imperfections and character</li>
                <li>• Different sparkle pattern</li>
                <li>• Historical significance</li>
                <li>• One-of-a-kind appeal</li>
              </ul>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Caring for Vintage Cut Diamonds
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            Vintage cut diamonds require special care to preserve their
            historical character and beauty. Due to their age and the softer
            cutting techniques used in their creation, these stones benefit from
            gentle handling and regular professional maintenance.
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold">
                1
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Gentle Cleaning
                </h4>
                <p className="text-gray-700 text-sm">
                  Use mild soap and warm water, avoiding harsh chemicals that
                  could damage the softer facets.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold">
                2
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Professional Maintenance
                </h4>
                <p className="text-gray-700 text-sm">
                  Regular check-ups with a jeweler ensure the setting remains
                  secure and the stone is properly cared for.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold">
                3
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Proper Storage
                </h4>
                <p className="text-gray-700 text-sm">
                  Store separately from other jewelry to prevent scratches and
                  maintain the stone's character.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 bg-amber-600 text-white rounded-full flex items-center justify-center text-[10px] sm:text-xs font-semibold">
                4
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  Insurance and Documentation
                </h4>
                <p className="text-gray-700 text-sm">
                  Proper insurance and documentation help protect your
                  investment and preserve the stone's provenance.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-primary-50 rounded-xl sm:rounded-2xl p-6 sm:p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Discover Vintage Beauty at Bespoke Carat
            </h3>
            <p className="text-gray-700 mb-6">
              At Bespoke Carat, we appreciate the timeless beauty and unique
              character of vintage cut diamonds. Whether you're drawn to the
              romantic glow of an old mine cut or the sophisticated sparkle of a
              rose cut, our expert team will help you find the perfect vintage
              diamond that tells your unique story.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Explore Vintage Cut Collection
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Find Your Perfect Vintage Cut
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
            <Link
              href="/diamondjournal/WhatyouShouldknowaboutPortugueseCutDiamond"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
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
                What You Should Know About Portuguese Cut Diamond
              </span>
              <span className="sm:hidden">Previous Article</span>
            </Link>
            <Link
              href="/diamondjournal"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              Back to Diamond Journal
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
