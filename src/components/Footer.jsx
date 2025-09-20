"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }

    // Clear submit message
    if (submitMessage) {
      setSubmitMessage("");
    }
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();

    // Reset states
    setEmailError("");
    setSubmitMessage("");

    // Validate email
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Simulate form submission
    setIsSubmitting(true);

    // Console log for now (will integrate with API later)
    console.log("Newsletter signup:", {
      email: email.trim(),
      timestamp: new Date().toISOString(),
    });

    // Simulate API call delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitMessage("Thank you! You've successfully joined our newsletter.");
      setEmail(""); // Clear the input
    }, 1000);
  };

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Bespoke Carat</h3>
            <p className="text-gray-400 mb-6">
              Premium lab-grown diamonds with uncompromising quality and
              transparency.
            </p>

            {/* Newsletter Signup */}
            <div>
              <h4 className="text-lg font-semibold mb-4">
                Join Our Newsletter
              </h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with our latest collections and exclusive offers.
              </p>

              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-row gap-2"
              >
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-[300px] px-4 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 transition duration-200 text-white placeholder-gray-400 ${
                      emailError
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-700 focus:ring-primary-500 focus:border-primary-500"
                    }`}
                    disabled={isSubmitting}
                  />
                  {/* {emailError && (
                    <p className="text-red-400 text-sm mt-1">{emailError}</p>
                  )}
                  {submitMessage && (
                    <p className="text-green-400 text-sm mt-1">{submitMessage}</p>
                  )} */}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`cursor-pointer w-auto py-2 px-4 rounded-md font-medium transition duration-200 ${
                    isSubmitting
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-primary-500 hover:bg-primary-600"
                  }`}
                >
                  {isSubmitting
                    ? "Joining..."
                    : submitMessage
                    ? "Joined!"
                    : "Join"}
                </button>
              </form>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/collections/diamond" className="hover:text-white">
                  Brilliant Cut
                </Link>
              </li>
              <li>
                <Link href="/collections/melee" className="hover:text-white">
                  Star Melee
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/colorstone"
                  className="hover:text-white"
                >
                  Colore Stones
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/portuguese"
                  className="hover:text-white"
                >
                  Portuguese Cut
                </Link>
              </li>
              <li>
                <Link href="/collections/oldcut" className="hover:text-white">
                  Old Cut
                </Link>
              </li>
              <li>
                <Link href="/collections/alphabet" className="hover:text-white">
                  Alphabets
                </Link>
              </li>
              <li>
                <Link
                  href="/collections/antiquecut"
                  className="hover:text-white"
                >
                  Antique Shapes
                </Link>
              </li>
              <li>
                <Link href="/collections/layout" className="hover:text-white">
                  Layouts
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/aboutus" className="hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contactus" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {/* Certification Logos */}
        <div className="mt-6" aria-label="Trusted certifications">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-6 items-center justify-items-center w-[500px]">
            <a
              href="https://www.gia.edu/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GIA website"
              className="inline-flex items-center justify-center"
            >
              <img
                src="/media/GIA.jpg"
                alt="GIA"
                loading="lazy"
                decoding="async"
                className="h-9 sm:h-10 w-auto object-contain rounded-md"
              />
            </a>
            <a
              href="https://www.igi.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="IGI website"
              className="inline-flex items-center justify-center"
            >
              <img
                src="/media/IGI.jpg"
                alt="IGI"
                loading="lazy"
                decoding="async"
                className="h-9 sm:h-10 w-auto object-contain rounded-md"
              />
            </a>
            <a
              href="https://www.hrdantwerp.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="HRD website"
              className="inline-flex items-center justify-center"
            >
              <img
                src="/media/hrd.jpg"
                alt="HRD"
                loading="lazy"
                decoding="async"
                className="h-9 sm:h-10 w-auto object-contain rounded-md"
              />
            </a>
            <a
              href="https://www.americangemsociety.org/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AGS website"
              className="inline-flex items-center justify-center"
            >
              <img
                src="/media/AGS.png"
                alt="AGS"
                loading="lazy"
                decoding="async"
                className="h-9 sm:h-10 w-auto object-contain rounded-md"
              />
            </a>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400">
          <p>&copy; 2025 Bespoke Carat. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
