"use client";

import React from "react";
import { AdminRoute } from "../../../components/ProtectedRoute";
import Sidebar from "@/app/admin/components/sidebar";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <AdminRoute>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 p-4 overflow-auto bg-whitesmoke">
          <div className="flex flex-col ">
            <div className="flex items-center justify-between mb-4 ">
              <h1 className="text-2xl font-semibold">Products Management</h1>

              <Link
                href="/admin/products/addproduct"
                className="cursor-pointer px-4 py-2 gap-2 bg-primary-600 text-white rounded-lg flex items-center hover:bg-primary-700 transition-colors"
              >
                <Plus />
                Add Product
              </Link>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p>No products found.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
