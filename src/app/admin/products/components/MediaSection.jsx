"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import MediaPopup from "./MediaPopup";

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
  const [popupState, setPopupState] = useState({
    isOpen: false,
    mediaType: null,
    mediaUrl: null,
    mediaName: null,
    isNewFile: false,
  });

  const openPopup = (mediaType, mediaUrl, mediaName, isNewFile = false) => {
    setPopupState({
      isOpen: true,
      mediaType,
      mediaUrl,
      mediaName,
      isNewFile,
    });
  };

  const closePopup = () => {
    setPopupState({
      isOpen: false,
      mediaType: null,
      mediaUrl: null,
      mediaName: null,
      isNewFile: false,
    });
  };

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      newImageFiles.forEach(file => {
        if (file && typeof file === 'object' && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      newVideoFiles.forEach(file => {
        if (file && typeof file === 'object' && file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [newImageFiles, newVideoFiles]);

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
                <div 
                  className="relative overflow-hidden rounded-lg border border-gray-200 cursor-pointer"
                  onClick={() => openPopup("image", image, `Image ${index + 1}`, false)}
                >
                  <Image
                    src={image}
                    alt={image}
                    width={200}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  {editingEnabled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMedia?.(image, "image");
                      }}
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
                        <div
                          className="cursor-pointer"
                          onClick={() => openPopup("image", file.preview || URL.createObjectURL(file), file.name, true)}
                        >
                          <Image
                            src={file.preview || URL.createObjectURL(file)}
                            alt={file.name}
                            width={200}
                            height={200}
                            className="w-full h-32 object-cover rounded border"
                          />
                        </div>
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
                <div 
                  className="relative overflow-hidden rounded-lg border border-gray-200 cursor-pointer"
                  onClick={() => openPopup("video", video, `Video ${index + 1}`, false)}
                >
                  <video
                    className="w-full h-48 object-cover"
                    controls
                    preload="metadata"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <source src={video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {editingEnabled && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteMedia?.(video, "video");
                      }}
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
                        <div
                          className="cursor-pointer"
                          onClick={() => openPopup("video", file.preview || URL.createObjectURL(file), file.name, true)}
                        >
                          <video
                            className="w-full h-32 object-cover rounded border"
                            controls
                            onClick={(e) => e.stopPropagation()}
                          >
                            <source src={file.preview || URL.createObjectURL(file)} />
                          </video>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {(!images || images.length === 0) && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">No images available</p>
          {editingEnabled && (
            <div>
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
            </div>
          )}
        </div>
      )}

      {/* Show new image previews when there are no existing images */}
      {(!images || images.length === 0) &&
        newImageFiles &&
        newImageFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              The following image(s) will be added:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {newImageFiles.map((file, idx) => (
              <div key={idx} className="relative">
                <div
                  className="cursor-pointer"
                  onClick={() => openPopup("image", file.preview || URL.createObjectURL(file), file.name, true)}
                >
                  <Image
                    src={file.preview || URL.createObjectURL(file)}
                    alt={file.name}
                    width={200}
                    height={200}
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

      {(!videos || videos.length === 0) && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">No videos available</p>
          {editingEnabled && (
            <div>
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
            </div>
          )}
        </div>
      )}

      {/* Show new video previews when there are no existing videos */}
      {(!videos || videos.length === 0) &&
        newVideoFiles &&
        newVideoFiles.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              The following video(s) will be added:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {newVideoFiles.map((file, idx) => (
              <div key={idx} className="relative">
                <div
                  className="cursor-pointer"
                  onClick={() => openPopup("video", file.preview || URL.createObjectURL(file), file.name, true)}
                >
                  <video
                    className="w-full h-32 object-cover rounded border"
                    controls
                    onClick={(e) => e.stopPropagation()}
                  >
                    <source src={file.preview || URL.createObjectURL(file)} />
                  </video>
                </div>
              </div>
            ))}
            </div>
          </div>
        )}

      {/* Media Popup */}
      <MediaPopup
        isOpen={popupState.isOpen}
        onClose={closePopup}
        mediaType={popupState.mediaType}
        mediaUrl={popupState.mediaUrl}
        mediaName={popupState.mediaName}
        isNewFile={popupState.isNewFile}
      />
    </div>
  );
}
