"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";

export default function page() {
  return (
    <CustomerRoute>
      <div>
        <Navbar />
        <h1>My Wishlist</h1>
        <Footer />
      </div>
    </CustomerRoute>
  );
}
