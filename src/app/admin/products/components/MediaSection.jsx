"use client";
import React from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";

export default function MediaSection({
  images = [],
  videos = [],
  editingEnabled = false,
  onDeleteMedia,
  onAddImages,
  onAddVideos,
  newImageFiles = [],
  newVideoFiles = [],
}) {
  return (
    <div className="border border-gray-200 rounded-xl m-2 p-4">
      <h1 className="text-lg font-semibold text-gray-800 mb-4">
        Media Gallery
      </h1>

      {images?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-md font-medium text-gray-700 mb-3">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={image}
                    alt={image}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {editingEnabled && (
                    <button
                      onClick={() => onDeleteMedia?.(image, "image")}
                      className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {editingEnabled && (
            <div className="mt-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onAddImages?.(e.target.files)}
                />
                + Add Images
              </label>
              {newImageFiles?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    The following image(s) will be added:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {newImageFiles.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-32 object-cover rounded border"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {videos?.length > 0 && (
        <div>
          <h2 className="text-md font-medium text-gray-700 mb-3">Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="relative group">
                <div className="relative overflow-hidden rounded-lg border border-gray-200">
                  <video
                    className="w-full h-48 object-cover"
                    controls
                    preload="metadata"
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {editingEnabled && (
                    <button
                      onClick={() => onDeleteMedia?.(video, "video")}
                      className="cursor-pointer absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                      title="Delete video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {editingEnabled && (
            <div className="mt-3">
              <label className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded cursor-pointer">
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => onAddVideos?.(e.target.files)}
                />
                + Add Videos
              </label>
              {newVideoFiles?.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    The following video(s) will be added:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {newVideoFiles.map((file, idx) => (
                      <div key={idx} className="relative">
                        <video
                          className="w-full h-32 object-cover rounded border"
                          controls
                        >
                          <source src={URL.createObjectURL(file)} />
                        </video>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {(images?.length === 0 || !images) && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">No images available</p>
          {editingEnabled && (
            <label className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded cursor-pointer">
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onAddImages?.(e.target.files)}
              />
              + Add Images
            </label>
          )}
        </div>
      )}

      {(videos?.length === 0 || !videos) && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">No videos available</p>
          {editingEnabled && (
            <label className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded cursor-pointer">
              <input
                type="file"
                accept="video/*"
                multiple
                className="hidden"
                onChange={(e) => onAddVideos?.(e.target.files)}
              />
              + Add Videos
            </label>
          )}
        </div>
      )}
    </div>
  );
}
