"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ProductDeletePopup({
  open,
  productType,
  product,
  confirmationText,
  setConfirmationText,
  deleting = false,
  onCancel,
  onConfirm,
}) {
  if (!open || !product) return null;

  const typeLabel =
    productType === "diamond"
      ? "Diamond"
      : productType === "melee"
      ? "Melee"
      : productType === "colorstone"
      ? "Colorstone"
      : productType === "cuts"
      ? "Cuts"
      : "Alphabet";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xs">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 border border-gray-200 shadow-lg">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800">
            Delete {typeLabel} Product
          </h2>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Are you sure you want to delete this entire{" "}
            {typeLabel.toLowerCase()} product?
          </p>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm">
              <strong>Product:</strong> {product.name}
            </p>
            <p className="text-sm">
              <strong>SKU:</strong> {product.sku}
            </p>
            <p className="text-sm">
              <strong>Shape:</strong> {product.shape}
            </p>
            <p className="text-sm">
              <strong>Variants:</strong> {product?.variants?.length || 0}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm text-red-600 font-medium mb-2">
            Type "{product.sku}" below to confirm deletion:
          </p>
          <input
            type="text"
            value={confirmationText}
            onChange={(e) => setConfirmationText?.(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder={`Enter ${product.sku} to confirm`}
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting || confirmationText !== product.sku}
            className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Product"}
          </button>
        </div>
      </div>
    </div>
  );
}
