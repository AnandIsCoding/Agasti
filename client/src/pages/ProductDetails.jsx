import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { getProductById, toggleCart } from "../api/api";
import Footer from "../components/Footer";
import FreeShippingBanner from "../components/Landing/FreeShippingBanner";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import ProductQuantity from "../components/product/ProductQuantity";
import ProductReviews from "../components/product/ProductReviews";
import { setCartCount, setCartItems } from "../redux/slices/cart.slice";
import ScrollToTop from "../utils/ScrollToTop";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();

  const cartItems = useSelector((state) => state.cart.items || []);
  const { user} = useSelector((state) => state.user);

  const [product, setProduct] = useState(null);
  const [thumbnail, setThumbnail] = useState("/NoImageAvailable.jpeg");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* ---------------- FETCH PRODUCT ---------------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
        setThumbnail(data?.images?.[0] || "/NoImageAvailable.jpeg");
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* ---------------- CART STATE ---------------- */
  const cartItem = cartItems.find((item) => item.product?._id === product?._id);

  const isInCart = Boolean(cartItem);

  /* 🔁 Sync quantity when item exists */
  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [cartItem]);

  const getCartButtonText = () => {
    if (!isInCart) return "Add to Cart";
    if (cartItem.quantity !== quantity) return "Update Cart";
    return "Added to Cart ✓";
  };

  /* ---------------- TOGGLE CART ---------------- */
  const handleToggleCart = async () => {
    try {
      if (!user) {
        navigate("/auth");
        return;
      }

      const res = await toggleCart({
        productId: product._id,
        quantity,
      });

      // 🔥 THIS IS THE FIX
      if (res?.cartItems) {
        dispatch(setCartItems(res.cartItems));
      }
      if (res?.cartCount !== undefined) {
        dispatch(setCartCount(res.cartCount));
      }
    } catch {
      // toast already handled in api.js
    }
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="h-[60vh] flex items-center justify-center text-lg">
          Loading product...
        </div>
      </>
    );
  }

  /* ---------------- NOT FOUND ---------------- */
  if (notFound || !product) {
    return (
      <>
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-semibold">Product Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-black text-white rounded-lg"
          >
            Go Home
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ScrollToTop />
      <Navigation />

      <div className="max-w-7xl mx-auto px-3 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1"
          >
            <div className="border border-gray-200 rounded-2xl p-4 bg-white relative">
              {!product.inStock && (
                <div className="absolute w-full top-[30%] right-0 bg-red-600 text-white px-4 py-1 z-10 text-3xl font-medium">
                  Out of Stock
                </div>
              )}

              <img
                src={thumbnail}
                alt="Selected product"
                className={`w-full h-[420px] object-contain rounded-md ${
                  !product.inStock ? "opacity-60" : ""
                }`}
              />
            </div>

            <div className="flex gap-3 mt-4">
              {(product.images || []).map((img, i) => (
                <motion.img
                  key={i}
                  src={img}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border ${
                    thumbnail === img ? "border-black" : "border-gray-300"
                  }`}
                  onClick={() => setThumbnail(img)}
                />
              ))}
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full lg:w-1/2"
          >
            <h1 className="text-4xl font-semibold">{product.name}</h1>

            {/* PRICE */}
            <div className="mt-6">
              {product.offerPrice && (
                <p className="line-through text-red-400">
                  MRP: ₹ {product.price}
                </p>
              )}
              <p className="text-3xl font-semibold">
                ₹ {product.offerPrice || product.price}
              </p>
            </div>

            <p className="text-gray-700 text-md whitespace-pre-line mt-4">
              {product.longDescription}
            </p>

            {/* BUTTONS */}
            <div className="flex mt-12 gap-4">
              <ProductQuantity quantity={quantity} setQuantity={setQuantity} />

              <button
                onClick={handleToggleCart}
                className="w-full py-3.5 border rounded-xl"
              >
                {getCartButtonText()}
              </button>

              <button
                disabled={!product.inStock}
                onClick={() => {
  if (!user) {
    navigate("/auth");
  } else {
    navigate("/checkout", {
      state: {
        type: "BUY_NOW",
        product: {
          _id: product._id,
          name: product.name,
          price: product.offerPrice || product.price,
          image: thumbnail,
          quantity: quantity,
        },
      },
    });
  }
}}

                className={`w-full py-3.5 rounded-xl text-white ${
                  product.inStock ? "bg-black" : "bg-red-600 cursor-not-allowed"
                }`}
              >
                {product.inStock ? "Buy now" : "Out of stock"}
              </button>
            </div>

            {/* FAQ CONTENT (UNCHANGED) */}
            <div className="mt-14 space-y-5">
              <div className="max-w-7xl mx-auto pb-10">
                <FaqItem title="Dimension">{product.dimension}</FaqItem>
                <FaqItem title="Weight">{product.weight}</FaqItem>
                <FaqItem title="Sustainability">
                  {product.sustainability}
                </FaqItem>
                <FaqItem title="Installation">{product.installation}</FaqItem>
                <FaqItem title="Aditional Details">{product.details}</FaqItem>
                <FaqItem title="Shipping & Returns">
                  {product.shippingReturns}
                </FaqItem>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <ProductReviews productId={id} productName={product.name} />
      <FreeShippingBanner />
      <Footer />
    </>
  );
}

/* ---------- FAQ (UNCHANGED) ---------- */

const FaqItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="border-b py-4 cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg">{title}</p>
        <span className="text-2xl">{open ? "-" : "+"}</span>
      </div>
      {open && <div className="mt-3 text-gray-700">{children}</div>}
    </div>
  );
};
