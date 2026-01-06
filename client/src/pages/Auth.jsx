import { motion } from "framer-motion";
import React from "react";
import { NavLink } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Navigation from "../components/navigation/Navigation";
import GoogleLoginComponent from "../utils/GoogleLoginComponent";

export default function Auth() {
  return (
    <>
      <Navbar />
      <Navigation />

      <div className="py-28 flex items-center justify-center bg-gray-50 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-semibold text-center mb-2">
            Welcome to Pluto Intero
          </h1>

          <p className="text-center text-gray-500 mb-8">
            Sign in to continue to your account
          </p>

          {/* ✅ Google Login (NO WRAPPING BUTTON) */}
          <GoogleLoginComponent />

          {/* Privacy Info */}
          <div className="mt-8 text-sm text-gray-500 text-center leading-relaxed">
            <p>
              We do not store your password or access your private Google data.
            </p>
            <p className="mt-2">
              By continuing, you agree to our{" "}
              <NavLink to="/terms-condition" className="text-black font-medium">
                Privacy Policy
              </NavLink>
              .
            </p>
          </div>
        </motion.div>
      </div>

      <Footer />
    </>
  );
}
