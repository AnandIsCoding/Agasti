/* -------- UI -------- */
import { CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { getAllCategory, getCartCount, getCartItems } from "./api/api.js";
/* -------- Layouts -------- */
import AdminLayout from "./components/Layout/AdminLayout.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import AdminAllCategories from "./pages/Admin/AdminAllCategories.jsx";
import AdminAllProducts from "./pages/Admin/AdminAllProducts.jsx";
import AdminCreateCategory from "./pages/Admin/AdminCreateCategory.jsx";
import AdminCreateProduct from "./pages/Admin/AdminCreateProduct.jsx";
/* -------- Admin Pages -------- */
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminOrders from "./pages/Admin/AdminOrders.jsx";
import Auth from "./pages/Auth.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import ContactUs from "./pages/ContactUs.jsx";
/* -------- Pages -------- */
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import ProductListing from "./pages/ProductListing.jsx";
import Profile from "./pages/Profile.jsx";
import TC from "./pages/TC.jsx";
import { setLoading, setUser } from "./redux/slices/auth.slice.js";
import {
  clearCart,
  setCartCount,
  setCartItems,
} from "./redux/slices/cart.slice.js";
import AdminRoute from "./routes/AdminRoute.jsx";
/* -------- Guards -------- */
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import PageTitleUpdater from "./utils/PageTitleUpdater.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";

const BASE_URL = import.meta.env.VITE_BASE_URL;

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  /* ---------------- FETCH PROFILE ---------------- */
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      console.error("Auth hydration failed:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchProfile();
    getAllCategory(dispatch);
  }, []);

  /* ---------------- CART HYDRATION ---------------- */
  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await getCartItems();

        dispatch(setCartItems(res.cartItems || []));
        dispatch(setCartCount(res.cartCount || 0));
      } catch (err) {
        console.error("Failed to hydrate cart", err);
        dispatch(clearCart());
      }
    };

    loadCart();
  }, [user, dispatch]);

  /* ---------------- GLOBAL LOADING STATE ---------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <CircularProgress />
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <PageTitleUpdater />

      <Routes>
        {/* ---------------- PUBLIC ROUTES ---------------- */}
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/terms-condition" element={<TC />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/products" element={<ProductListing />} />
        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ---------------- USER PROTECTED ---------------- */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          {/* 🔥 PhonePe Redirect Routes */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
        </Route>

        {/* ---------------- ADMIN PROTECTED ---------------- */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminAllProducts />} />
            <Route path="products/create" element={<AdminCreateProduct />} />
            <Route path="categories" element={<AdminAllCategories />} />
            <Route path="categories/create" element={<AdminCreateCategory />} />
          </Route>
        </Route>

        {/* Not Found 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
