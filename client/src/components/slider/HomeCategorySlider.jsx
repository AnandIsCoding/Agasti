import React, { useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function HomeCategorySlider() {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const scrollLeft = () => {
    sliderRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    sliderRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const { categories } = useSelector((state) => state.categories);

  return (
    <div className="relative w-full bg-[#F8F5F2] py-6">
      {/* LEFT ARROW */}
      <button
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 cursor-pointer -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-20 hover:scale-110 transition"
      >
        <MdChevronLeft size={28} />
      </button>

      {/* SCROLL CONTAINER */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto scrollbar-hide px-10 gap-5 scroll-smooth justify-center items-center"
      >
        {categories.map((cat, idx) => (
          <div
            onClick={() => navigate("/products")}
            key={idx}
            className="min-w-[180px] bg-white shadow-sm  rounded-lg flex flex-col items-center p-6 hover:shadow-md transition cursor-pointer"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-16 h-16 mb-3 rounded-md transition-transform duration-300 hover:-translate-y-2"
            />
            <p className="font-medium text-gray-800 text-[16px]">{cat.name}</p>
          </div>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        onClick={scrollRight}
        className="absolute right-0 top-1/2 cursor-pointer -translate-y-1/2 bg-white shadow-md rounded-full p-2 z-20 hover:scale-110 transition"
      >
        <MdChevronRight size={28} />
      </button>
    </div>
  );
}
