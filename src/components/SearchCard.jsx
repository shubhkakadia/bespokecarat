import Image from "next/image";
import React, { useState } from "react";
import { ShoppingCartIcon, HeartIcon } from "lucide-react";

export default function SearchCard({
  image,
  title,
  subtitle,
  badge,
  price,
  onClick,
  onAddToCart,
  onToggleLike,
  isLiked = false,
}) {
  const [liked, setLiked] = useState(isLiked);
  const [cartAdded, setCartAdded] = useState(false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    onToggleLike?.(liked);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2000);
    onAddToCart?.();
  };
  return (
    <div className="relative group">
      <button 
        type="button" 
        onClick={onClick} 
        className="w-full text-left bg-white hover:bg-gray-100 transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-300 rounded-xl p-3 group-hover:scale-[0.99] transform"
      >
        <div className="flex gap-4 items-center">
          {/* Enhanced Image Container */}
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 ring-1 ring-gray-200/50">
            {image ? (
              <Image
                src={image}
                alt={title || "Diamond"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-gray-300 text-xl">
                💎
              </div>
            )}
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Content */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {title}
              </h3>
              {badge && (
                <span className="inline-flex items-center rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700 ring-1 ring-primary-200">
                  {badge}
                </span>
              )}
            </div>
            {subtitle && (
              <p className="truncate text-xs text-gray-500 font-medium">{subtitle}</p>
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {badge?.toLowerCase() === "melees" ? (
                  price !== undefined && price !== null && (
                    <p className="text-sm font-bold text-primary-600">$ {price}/ct</p>
                  )
                ) : (
                  price && (
                    <p className="text-sm font-bold text-primary-600">$ {price?.toLocaleString()}</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </button>
      
      {/* Action buttons overlay */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
        {/* Like Button */}
        <button
          onClick={handleLike}
          className={`cursor-pointer p-1.5 rounded-full shadow-sm border transition-all duration-200 hover:scale-110 ${
            liked 
              ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100' 
              : 'bg-white/90 border-gray-200 text-gray-400 hover:text-red-400 hover:bg-red-50'
          }`}
          title={liked ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <HeartIcon className={`h-3.5 w-3.5 transition-all ${liked ? 'fill-current' : ''}`} />
        </button>
        
        {/* Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`cursor-pointer p-1.5 rounded-full shadow-sm border transition-all duration-200 hover:scale-110 ${
            cartAdded
              ? 'bg-green-50 border-green-200 text-green-600'
              : 'bg-white/90 border-gray-200 text-gray-600 hover:text-primary-600 hover:bg-primary-50 hover:border-primary-200'
          }`}
          title={cartAdded ? 'Added to cart!' : 'Add to cart'}
        >
          {cartAdded ? (
            <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <ShoppingCartIcon className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
