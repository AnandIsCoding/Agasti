import React from "react";

export default function ProductShimmerCard() {
  return (
    <div className="relative border-y border-l border-gray-300 p-4 bg-white h-[350px] sm:h-[380px] flex flex-col animate-pulse  overflow-hidden">
      {/* Image shimmer */}
      <div className="h-40 sm:h-48 w-full mb-4 rounded-xl bg-linear-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />

      {/* Brand shimmer */}
      <div className="h-4 w-24 bg-gray-200 rounded mb-2" />

      {/* Title shimmer */}
      <div className="h-4 w-40 bg-gray-200 rounded mb-1" />
      <div className="h-4 w-32 bg-gray-200 rounded mb-3" />

      {/* Rating shimmer */}
      <div className="flex gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-4 w-4 bg-gray-200 rounded" />
        ))}
      </div>

      {/* Price shimmer */}
      <div className="mt-auto">
        <div className="h-4 w-20 bg-gray-200 rounded mb-1" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>

      {/* Button shimmer */}
      <div className="absolute right-0 bottom-4 h-8 w-8 bg-gray-200 rounded-xl" />
    </div>
  );
}
