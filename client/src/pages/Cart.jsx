import { Button } from "@mui/material";
import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { toggleCart } from "../api/api.js";
import Footer from "../components/Footer";
import FreeShippingBanner from "../components/Landing/FreeShippingBanner";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import { setCartCount, setCartItems } from "../redux/slices/cart.slice.js";

function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get cart items and count from Redux store
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = useSelector((state) => state.cart.count || 0);

  // Handler to remove item from cart
  const handleRemove = async (productId) => {
    try {
      const res = await toggleCart({ productId, quantity: 1 }); // quantity is irrelevant for removal if same as existing
      // Update store with returned cart
      dispatch(setCartItems(res.cartItems || []));
      dispatch(setCartCount(res.cartCount || 0));
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + (item.product.offerPrice || item.product.price) * item.quantity,
    0,
  );

  return (
    <section className="bg-white text-black min-h-screen">
      <Navbar />
      <Navigation />

      <div className="py-6 px-4 md:px-44 flex flex-col md:flex-row gap-6">
        {/* LEFT PART */}
        <div className="w-full md:w-[70%]">
          <h2 className="text-2xl font-semibold mb-1">Your Cart</h2>
          <p className="mb-4 text-gray-600">
            There are{" "}
            <span className="text-xl font-bold text-orange-600">
              {cartCount}
            </span>{" "}
            products in your cart
          </p>

          <div className="bg-white">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item._id}
                  className="mt-2 border rounded-sm p-3 flex gap-4 items-center"
                >
                  {/* Image */}
                  <div
                    className="w-[12%] min-w-[90px] cursor-pointer"
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    <img
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="w-full rounded-md transition-all hover:scale-105"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">
                      {item.product.brand}
                    </p>

                    <h4
                      onClick={() => navigate(`/product/${item.product._id}`)}
                      className="font-medium leading-snug cursor-pointer hover:underline"
                    >
                      {item.product.name}
                    </h4>

                    {item.product.rating > 0 && (
                      <p className="text-sm text-yellow-500 mt-1">
                        ⭐ {item.product.rating} / 5
                      </p>
                    )}

                    <p className="text-sm mt-1 text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Price + Delete */}
                  <div className="text-right">
                    {item.product.oldPrice && (
                      <p className="text-sm line-through text-gray-400">
                        ₹{item.product.oldPrice}
                      </p>
                    )}

                    <p className="text-lg font-semibold">
                      ₹
                      {(item.product.offerPrice || item.product.price) *
                        item.quantity}
                    </p>

                    <button
                      onClick={() => handleRemove(item.product._id)}
                      className="text-red-600 mt-2 hover:scale-110 transition cursor-pointer"
                    >
                      <MdDeleteForever size={28} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="w-full md:sticky md:top-24 md:w-[30%] h-fit border rounded-md p-5 md:mt-20">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

          <div className="flex justify-between mb-2 text-sm">
            <span>Subtotal</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between mb-2 text-sm">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="border-t pt-3 flex justify-between font-semibold">
            <span>Total</span>
            <span>₹ {subtotal.toFixed(2)}</span>
          </div>

          <Button
            onClick={() =>
              navigate("/checkout", {
                state: { type: "CART" },
              })
            }
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "black",
              mt: "24px",
              color: "white",
              "&:hover": { bgcolor: "#111" },
              py: 1.5,
            }}
            disabled={cartItems.length === 0}
          >
            <IoBagCheckOutline size={25} className="mr-3 mb-1" />
            Checkout
          </Button>
        </div>
      </div>

      <FreeShippingBanner />
      <Footer />
    </section>
  );
}

export default Cart;
