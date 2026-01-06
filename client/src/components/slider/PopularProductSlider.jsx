import "swiper/css";
import "swiper/css/navigation";

import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useMemo, useState } from "react";
import { CiCircleChevLeft, CiCircleChevRight } from "react-icons/ci";
import { NavLink } from "react-router-dom";
import { Mousewheel, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { getAllProducts } from "../../api/api";
import ProductCard from "../product/ProductCard";

export default function PopularProductSlider() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data || []);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ================= FEATURED PRODUCTS ONLY ================= */
  const featuredProducts = useMemo(
    () => products.filter((p) => p.isFeatured === true),
    [products],
  );

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <CircularProgress />
      </div>
    );
  }

  if (!featuredProducts.length) return null;

  return (
    <div className="w-full py-10">
      <h2 className="text-2xl font-semibold mb-6 ml-6">Popular Products</h2>

      <div className="px-6 md:px-16 lg:px-28 relative">
        <Swiper
          modules={[Navigation, Mousewheel]}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          mousewheel={{ forceToAxis: true }}
          spaceBetween={0}
          slidesPerView={1.2}
          breakpoints={{
            480: { slidesPerView: 1.6 },
            640: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.2 },
          }}
          className="pb-14"
        >
          {featuredProducts.map((p, i) => (
            <SwiperSlide key={p._id || i}>
              <ProductCard p={p} index={i} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <div className="flex justify-center gap-6 mt-4">
          <button className="custom-prev px-4 py-1 cursor-pointer">
            <CiCircleChevLeft size={36} className="hover:text-red-500" />
          </button>
          <button className="custom-next px-4 py-1 cursor-pointer">
            <CiCircleChevRight size={36} className="hover:text-red-500" />
          </button>
        </div>
      </div>

      <Tooltip title="Browse all products" arrow placement="top">
        <NavLink
          to="/products"
          className="
            flex items-center justify-center
            w-fit mx-auto mt-14
            px-6 py-2
            rounded-md
            bg-black text-white
            hover:text-black hover:bg-white hover:border
            transition-all duration-300
            shadow-sm hover:shadow-md
          "
        >
          View All Products
        </NavLink>
      </Tooltip>
    </div>
  );
}
