"use client";

import React from "react";
import { AdminRoute } from "../../components/ProtectedRoute";
import Sidebar from "@/app/admin/components/sidebar";

export default function Page() {
  return (
    <AdminRoute>
      <div className="flex h-screen">
        <Sidebar />

        <div className="flex-1 p-8 overflow-auto bg-whitesmoke">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p>
            Welcome to the admin dashboard. Here you can manage your application.
          </p>
        </div>
      </div>
    </AdminRoute>
  );
}
