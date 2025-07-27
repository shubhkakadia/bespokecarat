"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from "react";
import { CustomerRoute } from "@/components/ProtectedRoute";

export default function page() {
  return (
    <CustomerRoute>
      <div className="min-h-screen bg-background-secondary">
        <Navbar />
        <h1>My Orders</h1>
        <Footer />
      </div>
    </CustomerRoute>
  );
}
