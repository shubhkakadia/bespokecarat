"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, Upload, X, CheckCircle } from "lucide-react";
import emailjs from "@emailjs/browser";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [openFAQ, setOpenFAQ] = useState(null);
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // null, 'success', 'error'
  const fileInputRef = useRef(null);

  const FAQData = [
    {
      question: "Can we create custom shapes or send designs for production?",
      answer:
        "Yes. We accept custom shapes, drawings, and detailed designs. Our team produces every type of lab-grown diamond—including colored and small diamonds by precise measurements—to suit your requirements.",
    },
    {
      question: "What types and sizes of diamonds do you supply?",
      answer:
        "We offer a full range of lab-grown diamonds, including white and colored stones. Certified diamonds from 1ct to 50ct are available on request, and we also supply small diamonds by measurement for custom settings.",
    },
    {
      question: "Do you provide certification?",
      answer:
        "Certification is available upon request. We supply IGI-certified diamonds from 1ct to 50ct, ensuring verified quality for wholesale and retail use.",
    },
    {
      question: "What is the lead time for made-to-order diamonds?",
      answer:
        "Standard orders are typically completed within 7-10 days, while bulk orders take 15-20 days, depending on volume and complexity.",
    },
    {
      question: "Are lab-grown diamonds cost-effective?",
      answer:
        "Yes. As direct rough growers with in-house polishing, we offer competitive pricing without middlemen—giving you better margins and consistent supply.",
    },
    {
      question: "Are lab-grown diamonds reliable and ethical?",
      answer:
        "Absolutely. Our diamonds meet the highest industry standards for durability and sustainability, with minimal environmental impact and no mining-related issues.",
    },
    {
      question: "What is your return and warranty policy?",
      answer:
        "We stand by the quality of our products. Returns are accepted only in cases of manufacturing defects, damage during transit, or incorrect orders. Custom or made-to-order diamonds are non-returnable unless there is a verified fault.",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isImage && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert(
        "Some files were skipped. Only image files under 10MB are allowed."
      );
    }

    if (uploadedPhotos.length + validFiles.length > 5) {
      alert("Maximum 5 photos allowed.");
      return;
    }

    // Create immediate preview with blob URLs
    const photosWithPreview = validFiles.map((file) => ({
      file,
      originalName: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      isUploading: true,
      url: null, // Will be set after upload
      filename: null, // Will be set after upload
    }));

    // Add photos with preview immediately
    setUploadedPhotos((prev) => [...prev, ...photosWithPreview]);

    // Upload files in the background
    setIsUploading(true);
    const uploadFormData = new FormData();
    validFiles.forEach((file) => {
      uploadFormData.append("enquiry_images", file);
    });

    try {
      const response = await fetch("/api/enquiry/upload-images", {
        method: "POST",
        body: uploadFormData,
      });

      const result = await response.json();
      if (result.success) {
        // Update the photos with server URLs
        setUploadedPhotos((prev) => {
          const newPhotos = [...prev];
          let uploadIndex = 0;

          for (
            let i = newPhotos.length - validFiles.length;
            i < newPhotos.length;
            i++
          ) {
            if (newPhotos[i].isUploading && uploadIndex < result.files.length) {
              newPhotos[i] = {
                ...newPhotos[i],
                ...result.files[uploadIndex],
                isUploading: false,
              };
              uploadIndex++;
            }
          }
          return newPhotos;
        });
      } else {
        alert("Upload failed: " + result.error);
        // Remove the failed uploads
        setUploadedPhotos((prev) => prev.filter((photo) => !photo.isUploading));
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
      // Remove the failed uploads
      setUploadedPhotos((prev) => prev.filter((photo) => !photo.isUploading));
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removePhoto = (index) => {
    setUploadedPhotos((prev) => {
      const photoToRemove = prev[index];
      // Cleanup blob URL to prevent memory leaks
      if (photoToRemove?.previewUrl) {
        URL.revokeObjectURL(photoToRemove.previewUrl);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Only include successfully uploaded photos (those with server URLs)
      const successfullyUploadedPhotos = uploadedPhotos.filter(
        (photo) => photo.url && !photo.isUploading
      );

      // Prepare email data
      const emailData = {
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone,
        enquiry_type: formData.inquiryType,
        time: new Date().toLocaleString("en-US", {
          timeZone: "Asia/Hong_Kong",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short",
        }),
        subject: formData.subject,
        message: formData.message,
        photos_urls:
          successfullyUploadedPhotos.length > 0
            ? successfullyUploadedPhotos.map((photo) => photo.url).join("\n")
            : "No photos attached",
      };

      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
        emailData,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY"
      );

      setSubmitStatus("success");
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });

      // Clean up blob URLs before clearing photos
      uploadedPhotos.forEach((photo) => {
        if (photo.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
      setUploadedPhotos([]);
    } catch (error) {
      console.error("Email send error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      uploadedPhotos.forEach((photo) => {
        if (photo.previewUrl) {
          URL.revokeObjectURL(photo.previewUrl);
        }
      });
    };
  }, [uploadedPhotos]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Get in <span className="text-primary-600">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Were here to help you find the perfect lab-grown diamonds. Contact
              our expert team for personalized assistance and answers to all
              your questions.
            </p>
            <p className="text-lg text-primary-600 font-medium mb-8 max-w-3xl mx-auto">
              Send us your photo of a shape or design and we can make it a
              diamond. Our master craftsmen can bring any vision to life!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Send us a Message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition duration-200"
                        placeholder="Your full name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition duration-200"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="inquiryType"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Inquiry Type
                      </label>
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition duration-200"
                      >
                        <option value="general">General Inquiry</option>
                        <option value="star-melee">Star Melee Diamonds</option>
                        <option value="colored">Colored Diamonds</option>
                        <option value="custom">Custom Order</option>
                        <option value="certification">Certification</option>
                        <option value="support">Customer Support</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition duration-200"
                      placeholder="Brief subject of your inquiry"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition duration-200 resize-none"
                      placeholder="Tell us more about your requirements or questions..."
                    />
                  </div>

                  {/* Photo Attachment Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attach Photos (Optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading || uploadedPhotos.length >= 5}
                      />

                      {uploadedPhotos.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          {isUploading ? "Uploading..." : "Select Photos"}
                        </button>
                      )}

                      <p className="mt-2 text-sm text-gray-500">
                        Maximum 5 photos, 10MB each. Supported formats: JPG,
                        PNG, GIF
                      </p>
                    </div>

                    {/* Display uploaded photos */}
                    {uploadedPhotos.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Attached Photos ({uploadedPhotos.length}/5)
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {uploadedPhotos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <div className="relative">
                                <img
                                  src={photo.previewUrl || photo.url}
                                  alt={photo.originalName}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                {photo.isUploading && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                    <div className="text-white text-xs">
                                      Uploading...
                                    </div>
                                  </div>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                              <div className="mt-1 text-xs text-gray-500 truncate">
                                {photo.originalName}
                                {photo.isUploading && (
                                  <span className="text-blue-500 ml-1">
                                    (uploading...)
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Success/Error Messages */}
                  {submitStatus === "success" && (
                    <div className="flex items-center p-4 bg-green-100 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-green-800 font-medium">
                          Email sent successfully!
                        </h4>
                        <p className="text-green-700 text-sm mt-1">
                          Thank you for contacting us. We will get back to you
                          as soon as possible.
                        </p>
                      </div>
                    </div>
                  )}

                  {submitStatus === "error" && (
                    <div className="flex items-center p-4 bg-red-100 border border-red-200 rounded-lg">
                      <X className="w-5 h-5 text-red-600 mr-3" />
                      <div>
                        <h4 className="text-red-800 font-medium">
                          Failed to send email
                        </h4>
                        <p className="text-red-700 text-sm mt-1">
                          Please try again or contact us directly at
                          bespokecarat@gmail.com
                        </p>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting || isUploading}
                    className="cursor-pointer w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg text-lg font-medium transition duration-200"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-primary-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Our Location
                      </h4>
                      <a
                        href="https://maps.app.goo.gl/HPmzhoztUct9oVXr6"
                        target="_blank"
                        className="text-gray-600 hover:text-primary-600"
                      >
                        4th Floor,
                        <br />
                        Heng Ngai Jewellery Centre
                        <br />
                        Hong Kong
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Phone
                      </h4>
                      <a
                        href="tel:+85267473252"
                        className="text-gray-600 hover:text-primary-600"
                      >
                        +852 6747 3252
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-purple-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Email
                      </h4>
                      <a
                        href="mailto:bespokecarat@gmail.com"
                        target="_blank"
                        className="text-gray-600 hover:text-primary-600"
                      >
                        bespokecarat@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-amber-600"
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
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">
                        Business Hours
                      </h4>
                      <p className="text-gray-600">
                        Monday - Saturday: 9:00 AM - 7:00 PM
                        <br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Quick Links
                </h3>
                <div className="space-y-3">
                  <Link
                    href="/collections/melee"
                    className="block text-primary-500 hover:text-primary-700 font-medium transition duration-200"
                  >
                    → Star Melee Collection
                  </Link>
                  <Link
                    href="/collections/colorstone"
                    className="block text-primary-500 hover:text-primary-700 font-medium transition duration-200"
                  >
                    → Colored Diamonds
                  </Link>
                  <Link
                    href="/collections/diamond"
                    className="block text-primary-500 hover:text-primary-700 font-medium transition duration-200"
                  >
                    → Diamond
                  </Link>
                  <Link
                    href="/collections/layout"
                    className="block text-primary-500 hover:text-primary-700 font-medium transition duration-200"
                  >
                    → Layout
                  </Link>
                  <Link
                    href="/collections/alphabet"
                    className="block text-primary-500 hover:text-primary-700 font-medium transition duration-200"
                  >
                    → Alphabet
                  </Link>
                  <Link
                    href="/collections/cuts"
                    className="block text-primary-500 hover:text-primary-700 font-medium transition duration-200"
                  >
                    → Antique Cuts
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about our lab-grown diamonds,
              custom orders, and services.
            </p>
          </div>

          <div className="space-y-4">
            {FAQData.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="cursor-pointer w-full px-8 py-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg
                      className={`w-6 h-6 text-primary-600 transition-transform duration-200 ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openFAQ === index
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-8 pb-6">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional CTA */}
          <div className="mt-12 text-center">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Still have questions?
              </h3>
              <p className="text-gray-600 mb-6">
                Our expert team is here to help you with any specific
                requirements or questions about our lab-grown diamonds.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:bespokecarat@gmail.com"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  <Mail size={20} />
                  &nbsp; Email Us
                </a>
                <a
                  href="tel:+85267473252"
                  className="inline-flex items-center px-6 py-3 border border-primary-600 text-primary-600 font-medium rounded-lg hover:bg-primary-50 transition-colors duration-200"
                >
                  <Phone size={20} />
                  &nbsp; Call Us
                </a>
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
