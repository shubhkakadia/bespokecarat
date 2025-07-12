"use client";

import React from 'react'
import { AdminRoute } from '../../../components/ProtectedRoute';
import Sidebar from '@/app/admin/components/sidebar'

export default function page() {
  return (
    <AdminRoute>
        <div className="flex h-screen">
          <Sidebar />
    
          <div className="flex-1 p-8 overflow-auto bg-whitesmoke">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p>
              Welcome to the settings page. Here you can manage your application settings.
            </p>
          </div>
        </div>
    </AdminRoute>
  )
}
