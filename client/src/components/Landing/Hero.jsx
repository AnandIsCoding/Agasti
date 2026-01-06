import React from "react";
import { useNavigate } from "react-router-dom";

import { companyName } from "../../utils/owner";

function Hero() {
  const navigate = useNavigate();
  return (
    <div className="w-full mx-2 md:mx-auto p-px bg-[#F6EEDB]  ">
      <div className="flex flex-col items-center justify-center text-center py-12 md:py-16  bg-[#F6EEDB]">
        {/* Badge */}
        <div className="flex items-center justify-center px-3 py-1.5 gap-1 rounded-full text-xs">
          <span className="text-black font-medium">
            Premium Quality Products
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-medium mt-2 leading-[1.2]">
          Elevate Your Lifestyle with <br />
          <span className="text-black bg-clip-text ">{companyName}</span>
        </h2>

        {/* Subtitle */}
        <p className="text-slate-600 mt-2 max-w-lg max-md:text-sm">
          Discover stylish, durable, and innovative products curated to bring
          comfort, elegance, and quality into your everyday life.
        </p>

        {/* CTA Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => navigate("/products")}
            className="cursor-pointer bg-black text-white text-sm px-6 py-2.5 rounded-xl font-medium hover:scale-105 active:scale-95 transition-all duration-300"
          >
            Shop Now
          </button>

          <button
            onClick={() => navigate("/products")}
            className="bg-white cursor-pointer text-slate-700 text-sm px-6 py-2.5 rounded-xl font-medium  hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            View Collections
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
