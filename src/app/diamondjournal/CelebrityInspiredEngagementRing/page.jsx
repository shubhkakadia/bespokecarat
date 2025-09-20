import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title:
    "Celebrity Inspired Engagement Ring - Find Your Dream Diamond at Bespoke Carat",
  description:
    "Discover celebrity-inspired engagement rings and find your dream diamond at Bespoke Carat. From Beyoncé to Blake Lively, get inspired by the most stunning celebrity engagement rings.",
  openGraph: {
    title:
      "Celebrity Inspired Engagement Ring - Find Your Dream Diamond at Bespoke Carat",
    description:
      "Discover celebrity-inspired engagement rings and find your dream diamond at Bespoke Carat. From Beyoncé to Blake Lively, get inspired by the most stunning celebrity engagement rings.",
    url: "/diamondjournal/Celebrity Inspired Engagement Ring",
    type: "article",
    images: [
      {
        url: "/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/1.jpg",
        width: 1200,
        height: 630,
        alt: "Celebrity Inspired Engagement Ring",
      },
    ],
  },
  alternates: {
    canonical: "/diamondjournal/Celebrity Inspired Engagement Ring",
  },
  robots: { index: true, follow: true },
};

export default function CelebrityInspiredEngagementRingPage() {
  return (
    <>
      <Navbar />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <Link
              href="/diamondjournal"
              className="hover:text-primary-600 transition-colors"
            >
              Diamond Journal
            </Link>
            <span>/</span>
            <span>Celebrity Inspired Engagement Ring</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Celebrity Inspired Engagement Ring - Find Your Dream Diamond at
            Bespoke Carat
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Published on December 2024</span>
            <span>•</span>
            <span>8 min read</span>
            <span>•</span>
            <span>Celebrity Style</span>
          </div>
        </header>

        {/* Hero Image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-12 bg-gray-100">
          <Image
            src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/1.jpg"
            alt="Celebrity Inspired Engagement Ring"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-xl text-gray-600 mb-8 leading-relaxed">
            Get inspired by the most stunning celebrity engagement rings and
            discover how to find your dream diamond at Bespoke Carat.
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Celebrity Inspired Engagement Rings
          </h2>

          <div className="space-y-12 mb-12">
            {/* 1. Beyoncé */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  1. Beyoncé – The Power Emerald Cut
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> 18-carat flawless emerald-cut
                    diamond
                  </p>
                  <p>
                    <strong>Metal:</strong> Platinum
                  </p>
                  <p>
                    <strong>Style:</strong> Split-shank setting
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Bold, elegant, and a true
                    show-stopper — perfect for brides who want maximum
                    brilliance with minimal detailing.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/1.jpg"
                  alt="Beyoncé Emerald Cut Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 2. Kim Kardashian */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="lg:order-2">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  2. Kim Kardashian – Modern Cushion Brilliance
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> 15-carat cushion-cut, D color,
                    flawless clarity
                  </p>
                  <p>
                    <strong>Metal:</strong> Platinum
                  </p>
                  <p>
                    <strong>Style:</strong> Solitaire with thin pavé band
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Contemporary luxury with a
                    focus on a single dazzling diamond.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/2.jpg"
                  alt="Kim Kardashian Cushion Cut Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 3. Taylor Swift */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  3. Taylor Swift - The Vintage Romantic
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> Around 8ct antique old mine
                    Cushion with half moon side stones
                  </p>
                  <p>
                    <strong>Metal:</strong> Yellow Gold
                  </p>
                  <p>
                    <strong>Style:</strong> Bezel setting with Accent
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Romantic and feminine, perfect
                    for brides who love vintage charm with a modern touch
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/3.jpg"
                  alt="Taylor Swift Vintage Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 4. Priyanka Chopra */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="lg:order-2">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  4. Priyanka Chopra – Timeless Glamour
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> ~5-carat cushion-cut diamond with
                    tapered baguette side stones
                  </p>
                  <p>
                    <strong>Metal:</strong> Platinum
                  </p>
                  <p>
                    <strong>Style:</strong> Classic Hollywood glamour
                  </p>
                  <p>
                    <strong>Inspiration:</strong> A regal design, perfect for
                    brides seeking old-world charm with modern sparkle.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/4.jpg"
                  alt="Priyanka Chopra Glamour Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 5. Blake Lively */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  5. Blake Lively – Romantic Pink Oval
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> 12-carat oval-cut pink diamond
                  </p>
                  <p>
                    <strong>Metal:</strong> Rose gold
                  </p>
                  <p>
                    <strong>Style:</strong> Solitaire with pavé band
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Feminine and romantic, ideal
                    for those who love colored diamonds.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/5.jpg"
                  alt="Blake Lively Pink Oval Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 6. Meghan Markle */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="lg:order-2">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  6. Meghan Markle – A Royal Trilogy
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> Cushion-cut center (Botswana
                    origin) + round side diamonds (from Princess Diana's
                    collection)
                  </p>
                  <p>
                    <strong>Metal:</strong> Yellow gold
                  </p>
                  <p>
                    <strong>Style:</strong> Three-stone ring
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Symbolizing past, present, and
                    future — perfect for meaningful love stories.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/6.jpg"
                  alt="Meghan Markle Royal Trilogy Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 7. Jennifer Lopez */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  7. Jennifer Lopez – Rare Green Sparkle
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> 6.1-carat natural green diamond
                  </p>
                  <p>
                    <strong>Metal:</strong> Platinum
                  </p>
                  <p>
                    <strong>Style:</strong> Solitaire with accent band
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Uniquely rare and symbolic —
                    for brides who want a one-of-a-kind stone.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/7.jpg"
                  alt="Jennifer Lopez Green Diamond Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 8. Hailey Bieber */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="lg:order-2">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  8. Hailey Bieber – Sleek Oval Modernism
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> 6–10 carat oval-cut diamond
                  </p>
                  <p>
                    <strong>Metal:</strong> Yellow gold
                  </p>
                  <p>
                    <strong>Style:</strong> Solitaire with hidden halo
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Minimalist yet chic, for
                    modern brides who love clean lines.
                  </p>
                </div>
              </div>
              <div className="lg:order-1 relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/8.jpg"
                  alt="Hailey Bieber Modern Oval Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* 9. Ariana Grande */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                  9. Ariana Grande – The Sentimental Toi et Moi
                </h3>
                <div className="space-y-3 text-gray-700">
                  <p>
                    <strong>Diamond:</strong> Oval-cut diamond paired with pearl
                    (family heirloom)
                  </p>
                  <p>
                    <strong>Metal:</strong> Yellow gold
                  </p>
                  <p>
                    <strong>Style:</strong> Toi et Moi (two-stone ring)
                  </p>
                  <p>
                    <strong>Inspiration:</strong> Personal and heartfelt —
                    blending sparkle with sentimental value.
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                <Image
                  src="/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/9.jpg"
                  alt="Ariana Grande Toi et Moi Ring"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Extra Inspiration Section */}
          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              🎁 Extra Inspiration – Celebrity Diamond Gifts
            </h3>
            <div className="space-y-4 text-gray-700">
              <p>
                <strong>Victoria Beckham:</strong> Known for owning over 15
                different rings — inspiration for stacking and collections.
              </p>
              <p>
                <strong>Katy Perry:</strong> Flower cluster with pink center
                stone — inspiration for floral motifs.
              </p>
              <p>
                <strong>Elizabeth Taylor:</strong> Iconic 33-carat Asscher-cut
                (Krupp Diamond) — inspiration for statement cocktail rings.
              </p>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              10 Frequently Asked Questions about Celebrity Inspired Rings
            </h2>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q1: What is a celebrity-inspired engagement ring?
                </h4>
                <p className="text-gray-700">
                  A: A celebrity-inspired engagement ring is a design modeled
                  after or influenced by the engagement rings of famous
                  personalities. These rings can emulate the diamond shape,
                  setting, band style, or overall aesthetic of a celebrity's
                  ring.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q2: Are these rings exact replicas?
                </h4>
                <p className="text-gray-700">
                  A: No. They are inspired by celebrity styles but are
                  customizable to fit your personal taste, budget, and preferred
                  diamond or gemstone. You can adjust carat, cut, color, and
                  metal type.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q3: Can I recreate a celebrity-inspired ring with a lab-grown
                  diamond?
                </h4>
                <p className="text-gray-700">
                  A: Absolutely! Lab-grown diamonds offer the same brilliance
                  and quality as natural diamonds but are more sustainable and
                  cost-effective. They are perfect for celebrity-inspired
                  designs.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q4: What diamond shapes are most popular in celebrity-inspired
                  rings?
                </h4>
                <p className="text-gray-700">A: Popular cuts include:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Emerald-cut (Beyoncé style)</li>
                  <li>Cushion-cut (Kim Kardashian, Priyanka Chopra style)</li>
                  <li>Oval-cut (Blake Lively, Hailey Bieber style)</li>
                  <li>Antique-cut (Taylor Swift-inspired style)</li>
                  <li>Trilogy or multi-stone settings (Meghan Markle style)</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q5: What metals are commonly used?
                </h4>
                <p className="text-gray-700">A: Celebrities often choose:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Platinum for modern, sleek looks</li>
                  <li>
                    Yellow gold for timeless elegance (e.g., Meghan Markle)
                  </li>
                  <li>
                    Rose gold for romantic, feminine styles (e.g., Blake Lively)
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q6: Can these rings be personalized?
                </h4>
                <p className="text-gray-700">A: Yes! You can customize:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Diamond/gemstone size and cut</li>
                  <li>Band design and thickness</li>
                  <li>Engravings or hidden accent stones</li>
                  <li>Metal type (gold, platinum, rose gold, etc.)</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q7: Are these rings suitable for sustainable jewelry lovers?
                </h4>
                <p className="text-gray-700">
                  A: Definitely. Using lab-grown diamonds or recycled metals
                  allows you to achieve the glamorous celebrity look ethically
                  and sustainably.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Q8: How do I choose the right celebrity-inspired ring for me?
                </h4>
                <p className="text-gray-700">
                  A: Consider your personal style, lifestyle, and preferences.
                  For example:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-gray-700">
                  <li>Minimalist and modern → Beyoncé, Hailey Bieber styles</li>
                  <li>
                    Romantic and feminine → Blake Lively, Taylor Swift-inspired
                    styles
                  </li>
                  <li>Symbolic and meaningful → Meghan Markle trilogy style</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Finding Your Dream Diamond at Bespoke Carat
          </h2>

          <p className="text-gray-700 leading-relaxed mb-6">
            While these celebrity rings are undeniably stunning, remember that
            the perfect engagement ring is one that reflects your personal style
            and love story. At Bespoke Carat, we specialize in creating custom
            engagement rings that capture the essence of these iconic designs
            while being uniquely yours.
          </p>

          <div className="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Why Choose Bespoke Carat?
            </h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">✓</span>
                <span>
                  Custom lab-grown diamonds that are ethically sourced and
                  environmentally friendly
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">✓</span>
                <span>Expert craftsmanship with attention to every detail</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">✓</span>
                <span>
                  Personalized consultation to find your perfect style
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 font-semibold">✓</span>
                <span>Competitive pricing without compromising on quality</span>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Popular Cuts Inspired by Celebrities
          </h3>
          <ul className="space-y-3 text-gray-700 mb-8">
            <li>
              <strong>Emerald Cut:</strong> Perfect for those who love clean
              lines and sophisticated elegance
            </li>
            <li>
              <strong>Oval Cut:</strong> Ideal for creating the illusion of
              longer, more graceful fingers
            </li>
            <li>
              <strong>Marquise Cut:</strong> Bold and unique, perfect for making
              a statement
            </li>
            <li>
              <strong>Cushion Cut:</strong> Classic and romantic with maximum
              sparkle
            </li>
            <li>
              <strong>Pear Cut:</strong> Elegant and distinctive, combining the
              best of multiple cuts
            </li>
          </ul>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Find Your Dream Ring?
            </h3>
            <p className="text-gray-700 mb-6">
              Let our expert team at Bespoke Carat help you create the
              engagement ring of your dreams. Whether you're inspired by these
              celebrity styles or have your own unique vision, we'll work with
              you to bring it to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Browse Our Collection
              </Link>
              <Link
                href="/contactus"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Schedule a Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <Link
              href="/diamondjournal"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <svg
                className="w-5 h-5"
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
              Back to Diamond Journal
            </Link>
            <Link
              href="/diamondjournal/Historyoflabgrowndiamonds"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
            >
              <span className="hidden sm:inline">
                History of Lab Grown Diamonds
              </span>
              <span className="sm:hidden">Next Article</span>
              <svg
                className="w-5 h-5"
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
