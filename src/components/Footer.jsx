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
      timestamp: new Date().toISOString()
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
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Bespoke Carat</h3>
            <p className="text-gray-400 mb-6">
              Premium lab-grown diamonds with uncompromising quality and
              transparency.
            </p>
            
            {/* Newsletter Signup */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Join Our Newsletter</h4>
              <p className="text-gray-400 text-sm mb-4">
                Stay updated with our latest collections and exclusive offers.
              </p>
              
              <form onSubmit={handleNewsletterSubmit} className="flex flex-row gap-2">
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleEmailChange}
                    className={`w-[300px] px-4 py-2 bg-gray-800 border rounded-md focus:outline-none focus:ring-2 transition duration-200 text-white placeholder-gray-400 ${
                      emailError 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-gray-700 focus:ring-primary-500 focus:border-primary-500'
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
                      ? 'bg-gray-600 cursor-not-allowed' 
                      : 'bg-primary-500 hover:bg-primary-600'
                  }`}
                >
                  {isSubmitting ? 'Joining...' : submitMessage ? 'Joined!' : 'Join'}
                </button>
              </form>
            </div>
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
  );
}
