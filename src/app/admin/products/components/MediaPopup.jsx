"use client";
import React from "react";
import Image from "next/image";
import { X, Download } from "lucide-react";

export default function MediaPopup({
  isOpen,
  onClose,
  mediaType,
  mediaUrl,
  mediaName,
  isNewFile = false,
}) {
  if (!isOpen) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = mediaUrl;
    link.download = mediaName || "media";
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-[90vh] border border-gray-200 shadow-lg w-full bg-white rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            {mediaName || "Media Preview"}
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className=" cursor-pointer flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            <button
              onClick={onClose}
              className=" cursor-pointer p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Media Content */}
        <div className="p-4 flex items-center justify-center min-h-[400px] max-h-[80vh] overflow-hidden">
          {mediaType === "image" ? (
            <div className="relative max-w-full max-h-full">
              <Image
                src={mediaUrl}
                alt={mediaName || "Media preview"}
                width={800}
                height={800}
                className="max-w-full max-h-full object-contain"
                unoptimized={isNewFile} // For new files using object URLs
              />
            </div>
          ) : (
            <div className="w-full max-w-4xl">
              <video
                className="w-full h-auto max-h-[70vh]"
                controls
                autoPlay
                muted
              >
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
