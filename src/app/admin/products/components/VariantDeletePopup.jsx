"use client";
import React from "react";
import { AlertTriangle } from "lucide-react";

export default function VariantDeletePopup({
  open,
  productType,
  variant,
  deleting = false,
  onCancel,
  onConfirm,
}) {
  if (!open || !variant) return null;

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

  const currencyValue = (value) =>
    typeof value === "number" ? value.toLocaleString() : value;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500 mr-3" />
          <h2 className="text-lg font-semibold text-gray-800">
            Delete {typeLabel} Variant
          </h2>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete this {typeLabel.toLowerCase()}{" "}
            variant?
          </p>
          <div className="bg-gray-50 p-3 rounded border">
            <p className="text-sm">
              <strong>ID:</strong> {variant.id}
            </p>
            {productType === "diamond" ? (
              <>
                <p className="text-sm">
                  <strong>Color:</strong> {variant.color}
                </p>
                <p className="text-sm">
                  <strong>Clarity:</strong> {variant.clarity}
                </p>
                <p className="text-sm">
                  <strong>Carat Weight:</strong> {variant.caratWeight}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> ${currencyValue(variant.price)}
                </p>
              </>
            ) : productType === "melee" ? (
              <>
                <p className="text-sm">
                  <strong>Sieve Size:</strong> {variant.sieveSize}
                </p>
                <p className="text-sm">
                  <strong>Color Range:</strong> {variant.colorRange}
                </p>
                <p className="text-sm">
                  <strong>Clarity Range:</strong> {variant.clarityRange}
                </p>
                <p className="text-sm">
                  <strong>Price Per Carat:</strong> $
                  {currencyValue(variant.pricePerCarat)}
                </p>
              </>
            ) : productType === "colorstone" ? (
              <>
                <p className="text-sm">
                  <strong>Dimension:</strong> {variant.dimension}
                </p>
                <p className="text-sm">
                  <strong>Shape:</strong> {variant.shape}
                </p>
                <p className="text-sm">
                  <strong>Carat Weight:</strong> {variant.caratWeight}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> ${currencyValue(variant.price)}
                </p>
              </>
            ) : productType === "cuts" ? (
              <>
                <p className="text-sm">
                  <strong>Carat Weight:</strong> {variant.caratWeight}
                </p>
                <p className="text-sm">
                  <strong>Dimension:</strong> {variant.dimension}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> ${currencyValue(variant.price)}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm">
                  <strong>Carat Weight:</strong> {variant.caratWeight}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> ${currencyValue(variant.price)}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete Variant"}
          </button>
        </div>
      </div>
    </div>
  );
}
