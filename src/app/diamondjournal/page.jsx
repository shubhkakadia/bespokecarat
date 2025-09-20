import React from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Diamond Journal | Bespoke Carat",
  description:
    "Explore our Diamond Journal for guides on the 4Cs, vintage cuts, fancy colors, certifications and more.",
  openGraph: {
    title: "Diamond Journal | Bespoke Carat",
    description:
      "Explore our Diamond Journal for guides on the 4Cs, vintage cuts, fancy colors, certifications and more.",
    url: "/diamondjournal",
    type: "website",
    images: [
      {
        url: "/media/IGI.jpg",
        width: 1200,
        height: 630,
        alt: "Diamond Journal cover image",
      },
    ],
  },
  alternates: { canonical: "/diamondjournal" },
  robots: { index: true, follow: true },
};

const JOURNALS = [
  {
    id: "CelebrityInspiredEngagementRing",
    title: "Celebrity Inspired Engagement Ring - Find Your Dream Diamond",
    image:
      "/Celebrity Inspired Engagement Ring - find your dream diamond at Bespoke Carat/1.jpg",
    excerpt:
      "Get inspired by the most stunning celebrity engagement rings and discover how to find your dream diamond at Bespoke Carat.",
    category: "Celebrity Style",
    readTime: "8 min",
    date: "2024-12-15",
  },
  {
    id: "Historyoflabgrowndiamonds",
    title: "History of Lab Grown Diamonds",
    image: "/History of lab grown diamonds/History.png",
    excerpt:
      "Explore the fascinating history of lab-grown diamonds from early 20th-century experiments to mainstream adoption.",
    category: "Education",
    readTime: "6 min",
    date: "2024-12-14",
  },
  {
    id: "HowCutaffectsPerosnality&Energy",
    title: "How Cut Affects Personality and Energy",
    image: "/How Cut affects Perosnality & Energy/cut affects.png",
    excerpt:
      "Discover how different diamond cuts reflect personality and energy. From round cuts to emerald cuts, find your perfect match.",
    category: "Personality & Style",
    readTime: "7 min",
    date: "2024-12-13",
  },
  {
    id: "NaturalvsLabgrown",
    title: "Lab Grown vs Natural Diamonds: What Modern Couples Should Know",
    image: "/Natural vs Lab grown/Natural vs Lab grown/natural vs lab.jpg",
    excerpt:
      "Compare lab-grown vs natural diamonds. Learn about ethics, quality, pricing, and environmental impact.",
    category: "Education",
    readTime: "8 min",
    date: "2024-12-12",
  },
  {
    id: "OwnaShapenooneelsehas",
    title: "Own a Shape No One Else Has",
    image: "/Own a Shape no one else has/own a shape.png",
    excerpt:
      "Discover unique custom diamond shapes and own a one-of-a-kind piece. Create your dream diamond with custom design services.",
    category: "Custom Design",
    readTime: "6 min",
    date: "2024-12-11",
  },
  {
    id: "TheMeaningBehindMultiStoneRing",
    title: "The Meaning Behind Multi-Stone Rings",
    image: "/The Meaning Behind Multi Stone Ring/1.jpg",
    excerpt:
      "Discover the deep symbolism and meaning behind multi-stone rings. From three-stone rings to eternity bands.",
    category: "Symbolism & Meaning",
    readTime: "7 min",
    date: "2024-12-10",
  },
  {
    id: "Top10EngagementRingtrendsin2025",
    title: "Top 10 Engagement Ring Trends in 2025",
    image: "/Top 10 Engagement Ring trends in 2025/top 10 engagement rings.jpg",
    excerpt:
      "Discover the hottest engagement ring trends for 2025. From lab-grown diamonds to vintage-inspired designs.",
    category: "Trends & Style",
    readTime: "8 min",
    date: "2024-12-09",
  },
  {
    id: "UnderstandingGeometricmodernshapes",
    title: "Understanding Modern Geometric Shapes",
    image: "/Understanding Geometric modern shapes/geometric.png",
    excerpt:
      "Explore the beauty and precision of modern geometric diamond shapes. From hexagons to custom polygons.",
    category: "Design & Aesthetics",
    readTime: "6 min",
    date: "2024-12-08",
  },
  {
    id: "WhatyouShouldknowaboutPortugueseCutDiamond",
    title: "What You Should Know About Portuguese Cut Diamond",
    image: "/What you Should know about Portuguese Cut Diamond/portuguese.png",
    excerpt:
      "Discover the rare and exquisite Portuguese cut diamond. Learn about its unique characteristics and history.",
    category: "Rare Cuts",
    readTime: "7 min",
    date: "2024-12-07",
  },
  {
    id: "WhyVintagecutsaremakingacomeback",
    title: "Why Vintage Cuts Are Making a Comeback",
    image: "/Why Vintage cuts are making a comeback/why vintage.jpg",
    excerpt:
      "Discover why vintage diamond cuts are regaining popularity. From old mine cuts to rose cuts.",
    category: "Vintage & Heritage",
    readTime: "7 min",
    date: "2024-12-06",
  },
];

export default function Page() {
  return (
    <>
      <Navbar />
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900 tracking-tight">
            Diamond Journal
          </h1>
          <p className="mt-3 max-w-2xl text-gray-600">
            Expert insights to help you buy and style diamonds with confidence.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {JOURNALS.map((item) => (
            <Link
              key={item.id}
              href={`/diamondjournal/${item.id}`}
              className="group relative flex flex-col rounded-2xl overflow-hidden border border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg transition-all"
            >
              <div className="relative aspect-[4/3] bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm">
                  {item.category}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {item.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{new Date(item.date).toLocaleDateString()}</span>
                  <span className="inline-flex items-center gap-1">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path
                        d="M12 8V12L15 15"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item.readTime}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
