import React from "react";
import { CiDeliveryTruck } from "react-icons/ci";

export default function FreeShippingBanner() {
  return (
    <div className="w-full flex justify-center px-4 mt-24">
      <div
        className="
        flex flex-col sm:flex-row sm:items-center sm:justify-between 
        w-full sm:w-[80%] max-w-5xl 
        bg-[#F6EEDB] rounded-md px-4 py-6 sm:px-6 sm:py-6
        text-gray-800
      "
      >
        {/* Left Section */}
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <CiDeliveryTruck className="text-gray-700 text-3xl sm:text-4xl" />
          <span className="font-semibold tracking-wide text-lg sm:text-xl">
            FREE SHIPPING
          </span>
        </div>

        {/* Middle Text */}
        <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left mb-4 sm:mb-0">
          Free Delivery Now On Your First Order and over 3000
        </p>

        {/* Right Price */}
        <p className="font-semibold text-lg sm:text-[20px] text-center sm:text-right">
          - Only 3000*
        </p>
      </div>
    </div>
  );
}
