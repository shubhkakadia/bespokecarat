"use client";

import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2,
  Leaf,
  BadgeCheck,
  CircleDollarSign,
  Globe2,
  Gem,
  Heart,
  Users,
  Award,
  Star,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Enhanced Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br  text-white">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full" style={{}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            {/* Enhanced Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/10 ring-1 ring-white/30 shadow-xl mb-8 group">
              <Gem className="w-10 h-10 text-accent group-hover:scale-110 transition-transform duration-300" />
            </div>

            {/* Enhanced Title */}
            <div className="mb-6">
              <h1 className="text-primary text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text ">
                About Bespoke Carat
              </h1>
            </div>

            {/* Enhanced Description */}
            <p className="text-xl md:text-2xl text-primary/95 leading-relaxed max-w-4xl mx-auto font-light">
              Every piece of jewelry should be as{" "}
              <span className="text-accent font-medium">unique</span> as the
              person wearing it. We specialize in custom lab-grown diamonds that
              combine{" "}
              <span className="text-accent-cool font-medium">beauty</span>,
              <span className="text-accent-warm font-medium"> brilliance</span>,
              and{" "}
              <span className="text-accent font-medium">sustainability</span>
              —crafted to reflect your story.
            </p>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 mt-12 text-white/80">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  IGI Certified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Global Reach
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Sustainable
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story - Enhanced */}
      <section className="py-20 bg-background-secondary relative overflow-hidden">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 50%, rgba(0,0,128,0.1) 0, transparent 70%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-7">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                  Crafting Stories,{" "}
                  <span className="text-primary-700">Creating Legacies</span>
                </h2>
              </div>

              {/* Enhanced Content */}
              <div className="space-y-6 text-text-dark leading-relaxed">
                <p className="text-lg">
                  Founded with a passion for{" "}
                  <span className="font-semibold text-primary-700">
                    excellence and innovation
                  </span>
                  , Bespoke Carat is your trusted partner in designing diamonds
                  that are ethically sourced, environmentally conscious, and
                  tailored to perfection.
                </p>
                <p className="text-lg">
                  Whether you're selecting the ideal shape, size, or setting—or
                  designing a completely unique piece from scratch—our{" "}
                  <span className="font-semibold text-accent-700">
                    expert team
                  </span>{" "}
                  is here to guide you through every step of the process.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              {/* Enhanced Stats Cards */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="group rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200 p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary-600 text-white mb-3 group-hover:scale-110 transition-transform">
                      <Gem className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-bold text-primary-900">
                      Custom
                    </div>
                    <div className="text-sm text-primary-700 mt-1">
                      Made-to-order
                    </div>
                  </div>

                  <div className="group rounded-2xl bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-600 text-white mb-3 group-hover:scale-110 transition-transform">
                      <BadgeCheck className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-bold text-accent-900">
                      Certified
                    </div>
                    <div className="text-sm text-accent-700 mt-1">
                      IGI Standard
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="group rounded-2xl bg-gradient-to-br from-accent-cool-50 to-accent-cool-100 border border-accent-cool-200 p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-cool-600 text-white mb-3 group-hover:scale-110 transition-transform">
                      <Leaf className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-bold text-accent-cool-900">
                      Sustainable
                    </div>
                    <div className="text-sm text-accent-cool-700 mt-1">
                      Eco-Conscious
                    </div>
                  </div>

                  <div className="group rounded-2xl bg-gradient-to-br from-accent-warm-50 to-accent-warm-100 border border-accent-warm-200 p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-warm-600 text-white mb-3 group-hover:scale-110 transition-transform">
                      <CircleDollarSign className="w-6 h-6" />
                    </div>
                    <div className="text-xl font-bold text-accent-warm-900">
                      Direct
                    </div>
                    <div className="text-sm text-accent-warm-700 mt-1">
                      Factory Pricing
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose - Redesigned */}
      <section className="py-24 bg-gradient-to-br from-surface to-surface-200 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Enhanced Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-primary-600 to-accent bg-clip-text text-transparent">
                Bespoke Carat?
              </span>
            </h2>
            <p className="text-xl text-secondary max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of craftsmanship, innovation, and
              personalized service that sets us apart.
            </p>
          </div>

          {/* Enhanced Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative">
              <div className="h-full rounded-3xl bg-background-secondary border border-neutral-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-primary-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <CheckCircle2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-primary-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4 group-hover:text-primary-700 transition-colors">
                    Personalized Experience
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    We work closely with you to bring your design ideas to life,
                    ensuring that every detail aligns with your vision.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group relative">
              <div className="h-full rounded-3xl bg-background-secondary border border-neutral-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-accent-cool-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-cool-500 to-accent-cool-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-accent-cool-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4 group-hover:text-accent-cool-700 transition-colors">
                    Sustainable Luxury
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    Our lab-grown diamonds are created with minimal
                    environmental impact, offering an ethical alternative
                    without compromising on beauty or quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group relative">
              <div className="h-full rounded-3xl bg-background-secondary border border-neutral-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-accent-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-600 to-accent-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <BadgeCheck className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-accent-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4 group-hover:text-accent-700 transition-colors">
                    Certified Excellence
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    Every diamond is IGI or equivalent certified, ensuring
                    authenticity, quality, and trust.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="group relative">
              <div className="h-full rounded-3xl bg-background-secondary border border-neutral-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-accent-warm-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-warm-500 to-accent-warm-700 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <CircleDollarSign className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-accent-warm-400 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4 group-hover:text-accent-warm-700 transition-colors">
                    Transparent Pricing & Direct Benefits
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    As a manufacturer, we cut out unnecessary markups and offer
                    you direct pricing advantages, ensuring you receive the best
                    value without compromising on quality.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="group relative md:col-start-2 lg:col-start-auto">
              <div className="h-full rounded-3xl bg-background-secondary border border-neutral-200 p-8 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-primary-300">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                      <Globe2 className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute inset-0 rounded-2xl bg-primary-500 blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  </div>
                  <h3 className="text-xl font-bold text-text-dark mb-4 group-hover:text-primary-700 transition-colors">
                    Global Reach, Local Care
                  </h3>
                  <p className="text-secondary leading-relaxed">
                    While we serve customers worldwide, we focus on personalized
                    customer care, ensuring every experience is seamless and
                    enjoyable.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-text-dark mb-4">
            Our Mission
          </h2>
          <p className="text-base md:text-lg text-secondary max-w-3xl mx-auto">
            Our mission is to make bespoke luxury accessible to
            everyone—allowing you to create pieces that celebrate individuality
            while making responsible choices for the planet.
          </p>
        </div>
      </section>

      {/* CTA - Enhanced */}
      <section className="py-24 bg-gradient-to-br from-surface via-background-secondary to-surface-200 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="h-full w-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 25% 25%, rgba(0,0,128,0.15) 0, transparent 50%), radial-gradient(circle at 75% 75%, rgba(212,175,55,0.1) 0, transparent 40%)",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-4xl bg-gradient-to-br from-background-secondary via-white to-surface-50 border border-neutral-200/50 p-12 md:p-16 text-center shadow-2xl overflow-hidden">
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-5">
              <div
                className="h-full w-full"
                style={{
                  backgroundImage: `
                  radial-gradient(circle at 20% 80%, rgba(212,175,55,0.3) 0, transparent 40%),
                  radial-gradient(circle at 80% 20%, rgba(169,195,217,0.25) 0, transparent 35%),
                  radial-gradient(circle at 40% 40%, rgba(183,110,121,0.2) 0, transparent 30%)
                `,
                }}
              />
            </div>

            <div className="relative z-10">
              {/* CTA Header */}
              <div className="mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 mb-8 group">
                  <Gem className="w-10 h-10 text-primary-700 group-hover:scale-110 transition-transform" />
                </div>

                <h3 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
                  Let's Create Something{" "}
                  <span className="bg-gradient-to-r from-primary-600 via-accent to-accent-cool bg-clip-text text-transparent">
                    Extraordinary
                  </span>
                </h3>
              </div>

              {/* CTA Content */}
              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-xl md:text-2xl text-secondary leading-relaxed mb-8">
                  At Bespoke Carat,{" "}
                  <span className="text-primary-700 font-medium">
                    your story is our inspiration
                  </span>
                  . Whether you're designing an engagement ring, gifting a
                  timeless piece, or investing in a family heirloom, we're
                  committed to helping you craft a diamond that's as enduring as
                  your memories.
                </p>

                {/* Use Cases */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                  <div className="group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-warm-100 to-accent-warm-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6 text-accent-warm-700" />
                    </div>
                    <h4 className="font-semibold text-text-dark mb-1">
                      Engagement Rings
                    </h4>
                    <p className="text-sm text-secondary">
                      Mark your love story
                    </p>
                  </div>

                  <div className="group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Gem className="w-6 h-6 text-accent-700" />
                    </div>
                    <h4 className="font-semibold text-text-dark mb-1">
                      Timeless Gifts
                    </h4>
                    <p className="text-sm text-secondary">
                      Celebrate special moments
                    </p>
                  </div>

                  <div className="group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cool-100 to-accent-cool-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6 text-accent-cool-700" />
                    </div>
                    <h4 className="font-semibold text-text-dark mb-1">
                      Family Heirlooms
                    </h4>
                    <p className="text-sm text-secondary">
                      Pass down your legacy
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
                <Link
                  href="/collections/round"
                  className="group inline-flex items-center justify-center bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <Gem className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Explore Collections
                </Link>

                <Link
                  href="/contactus"
                  className="group inline-flex items-center justify-center border-2 border-primary-600 text-primary-700 hover:bg-primary-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Your Design
                </Link>
              </div>

              {/* Final Message */}
              <p className="text-sm text-secondary max-w-xl mx-auto">
                Ready to begin your journey?{" "}
                <span className="text-primary-700 font-medium">
                  Explore our collections
                </span>{" "}
                or{" "}
                <span className="text-accent-700 font-medium">reach out</span>{" "}
                to start designing your dream piece today.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
