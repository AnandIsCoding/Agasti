import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Rating from "@mui/material/Rating";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";

import { getAllProducts } from "../api/api";
import Footer from "../components/Footer";
import FreeShippingBanner from "../components/Landing/FreeShippingBanner";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import ProductCard from "../components/product/ProductCard";
import ScrollToTop from "../utils/ScrollToTop";

const ITEMS_PER_PAGE = 10;

function ProductListing() {
  const dropdownRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory } = useSelector((state) => state.categoryFilter);

  /* FILTER STATE (SINGLE SOURCE OF TRUTH) */
  const [filters, setFilters] = useState({
    sort: "Recommended",
    rating: 0,
    price: [0, 100000],
    inStock: false,
  });

  const [showFilter, setShowFilter] = useState(false);
  const [page, setPage] = useState(1);

  const sortLabels = {
    Recommended: "Recommended",
    "Low to High": "Price: Low to High",
    "High to Low": "Price: High to Low",
  };

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getAllProducts();
      setProducts(data || []);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  /* ================= FILTER + SORT (FRONTEND) ================= */
  const filteredProducts = useMemo(() => {
    let result = products;

    const getPrice = (p) => Number(p.offerPrice ?? p.price ?? 0);

    // Category filter
    if (selectedCategory?._id) {
      result = result.filter(
        (p) => String(p.category?._id || p.category) === selectedCategory._id,
      );
    }

    // In Stock
    if (filters.inStock) {
      result = result.filter((p) => p.inStock);
    }

    // Rating
    if (filters.rating > 0) {
      result = result.filter((p) => Number(p.rating || 0) >= filters.rating);
    }

    // Price Range
    result = result.filter((p) => {
      const price = getPrice(p);
      return price >= filters.price[0] && price <= filters.price[1];
    });

    // Sort (CRITICAL FIX)
    if (filters.sort === "Low to High") {
      result = result.toSorted((a, b) => getPrice(a) - getPrice(b));
    }

    if (filters.sort === "High to Low") {
      result = result.toSorted((a, b) => getPrice(b) - getPrice(a));
    }

    return result;
  }, [products, filters, selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowFilter(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section>
      <ScrollToTop />
      <Navbar />
      <Navigation />

      <div className="py-6 md:py-10 md:px-10">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-md bg-[#F6EEDB] w-fit px-4 py-2">
            ({filteredProducts.length}) Products
          </h2>

          {/* FILTER DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowFilter((p) => !p)}
              className="flex items-center justify-between w-48 px-4 py-2 
                         border border-gray-300 bg-white rounded-sm"
            >
              <span className="text-sm font-medium">Filter</span>
              {showFilter ? <FaAngleUp /> : <FaAngleDown />}
            </button>

            {showFilter && (
              <div className="absolute right-0 top-11 w-72 bg-white border shadow-xl rounded-md z-50 p-4 space-y-4">
                {/* SORT */}
                <div>
                  <p className="font-medium mb-2">Sort</p>
                  {Object.keys(sortLabels).map((key) => (
                    <div
                      key={key}
                      onClick={() => {
                        setFilters((f) => ({ ...f, sort: key }));
                        setPage(1);
                      }}
                      className="flex justify-between items-center px-2 py-1 cursor-pointer hover:bg-gray-100"
                    >
                      <span>{sortLabels[key]}</span>
                      {filters.sort === key && (
                        <FaCheck className="text-blue-600" />
                      )}
                    </div>
                  ))}
                </div>

                {/* RATING */}
                <div>
                  <p className="font-medium mb-1">Minimum Rating</p>
                  <Rating
                    value={filters.rating}
                    onChange={(_, value) => {
                      setFilters((f) => ({
                        ...f,
                        rating: value || 0,
                      }));
                      setPage(1);
                    }}
                  />
                </div>

                {/* PRICE */}
                <div>
                  <p className="font-medium mb-1">Price Range</p>
                  <Slider
                    value={filters.price}
                    min={0}
                    max={100000}
                    valueLabelDisplay="auto"
                    onChange={(_, value) => {
                      setFilters((f) => ({
                        ...f,
                        price: value,
                      }));
                      setPage(1);
                    }}
                  />
                </div>

                {/* STOCK */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={filters.inStock}
                      onChange={(e) => {
                        setFilters((f) => ({
                          ...f,
                          inStock: e.target.checked,
                        }));
                        setPage(1);
                      }}
                    />
                  }
                  label="In Stock Only"
                />

                {/* CLEAR */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setFilters({
                      sort: "Recommended",
                      rating: 0,
                      price: [0, 100000],
                      inStock: false,
                    });
                    setPage(1);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="flex justify-center py-20">
            <CircularProgress />
          </div>
        ) : (
          <section className="grid grid-cols-2 md:grid-cols-5 gap-y-8 md:gap-y-14">
            {paginatedProducts.map((product) => (
              <ProductCard key={product._id} p={product} />
            ))}
          </section>
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-14 mb-24">
          <Stack spacing={2}>
            <Pagination
              page={page}
              count={totalPages}
              onChange={(_, value) => setPage(value)}
              renderItem={(item) => (
                <PaginationItem
                  slots={{
                    previous: ArrowBackIcon,
                    next: ArrowForwardIcon,
                  }}
                  {...item}
                />
              )}
            />
          </Stack>
        </div>
      )}

      <FreeShippingBanner />
      <Footer />
    </section>
  );
}

export default ProductListing;
