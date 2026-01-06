import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Tooltip from "@mui/material/Tooltip";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { FaSearch, FaShoppingBag, FaUserCircle } from "react-icons/fa";
import { GiTireIronCross } from "react-icons/gi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import CartSidebar from "./sidebar/CartSidebar";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const VITE_DEFAULT_PROFILE_PIC = import.meta.env.VITE_DEFAULT_PROFILE_PIC;

export default function Navbar() {
  const [mobile, setMobile] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const dispatch = useDispatch();

  /* 🔍 SEARCH STATES */
  const [query, setQuery] = useState("");
  const [openSearch, setOpenSearch] = useState(false);
  const [results, setResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const debounceRef = useRef(null);

  /* ✅ USER STATE */
  const { user, loading } = useSelector((state) => state.user);
  const cartItems = useSelector((state) => state.cart.items || []);

  const cartCount = useSelector((state) => state.cart.count);

  const navItem = "px-4 py-2 font-medium tracking-wide";

  /* 🔍 SEARCH HANDLER */
  const handleSearch = (value) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 1) {
      setOpenSearch(false);
      setResults([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setOpenSearch(true);

        const res = await axios.post(`${BASE_URL}/product/search`, {
          query: value,
        });
        setResults(res.data?.products || []);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  };

  return (
    <nav className="w-full sticky top-0 z-40 bg-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 lg:px-8 pt-3 md:py-3 relative">
        {/* MOBILE MENU */}
        <button
          onClick={() => setMobile(!mobile)}
          className="lg:hidden text-2xl"
        >
          {!mobile ? <RxHamburgerMenu /> : <GiTireIronCross />}
        </button>

        {/* LOGO */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Pluto Intero" className="h-10 w-auto" />
        </NavLink>

        {/* CART (MOBILE) */}
        <div className="relative md:hidden">
          <Tooltip title="Cart">
            <IconButton onClick={() => setCartOpen(true)}>
              <FaShoppingBag color="black" />
            </IconButton>
          </Tooltip>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </div>

        <CartSidebar
          open={cartOpen}
          onClose={() => setCartOpen(false)}
          cartItems={cartItems}
        />

        {/* DESKTOP RIGHT */}
        <div className="hidden lg:flex items-center gap-3">
          {/* SEARCH */}
          <div className="flex items-center flex-1 mx-6 border border-black rounded-xl overflow-hidden">
            <input
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search ayurvedic products..."
              className="flex-1 px-3 py-2 outline-none"
            />
            <button className="px-4">
              <FaSearch />
            </button>
          </div>

          <NavLink to="/products" className={navItem}>
            Products
          </NavLink>
          <NavLink to="/about" className={navItem}>
            About us
          </NavLink>
          <NavLink to="/terms-condition" className={navItem}>
            T&C
          </NavLink>
          <NavLink to="/contact" className={navItem}>
            Contact us
          </NavLink>

          {/* CART */}
          <div className="relative">
            <Tooltip title="Cart">
              <IconButton onClick={() => setCartOpen(true)}>
                <FaShoppingBag color="black" />
              </IconButton>
            </Tooltip>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </div>
        </div>

        {/* PROFILE */}
        <div className="md:ml-4 min-w-[32px]">
          {loading ? (
            <Skeleton variant="circular" width={28} height={28} />
          ) : (
            <NavLink
              to={user ? "/profile" : "/auth"}
              className="flex items-center gap-2 px-3 py-1 
                 text-black md:text-white 
                 md:bg-black rounded-md"
            >
              {user ? (
                <>
                  <img
                    src={
                      user.profilePic ||
                      import.meta.env.VITE_DEFAULT_PROFILE_PIC
                    }
                    alt={user.name}
                    className="w-10 h-10 md:w-7 md:h-7 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        import.meta.env.VITE_DEFAULT_PROFILE_PIC;
                    }}
                  />

                  <span className="hidden md:block">{user.name}</span>
                </>
              ) : (
                <>
                  <FaUserCircle size={26} />
                  <span className="hidden md:block">Login | Register</span>
                </>
              )}
            </NavLink>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH */}
      <div className="lg:hidden px-4 pb-3">
        <input
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-black rounded-xl px-3 py-2"
        />
      </div>

      {/* MOBILE MENU */}
      {mobile && (
        <motion.ul
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          className="lg:hidden bg-white shadow-md px-6 py-4 flex flex-col gap-3"
        >
          <NavLink to="/">Home</NavLink>
          <NavLink to="/terms-condition">Terms & Condition</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/about">About us</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </motion.ul>
      )}

      {/* 🔍 AUTOSUGGESTION MODAL */}
      <Modal
        open={openSearch}
        onClose={() => setOpenSearch(false)}
        hideBackdrop
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <Box
          sx={{
            position: "absolute",
            top: 140,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: 600,
            bgcolor: "white",
            borderRadius: 2,
            boxShadow: 8,

            maxHeight: 400,
            overflowY: "auto",
            outline: "none",
          }}
        >
          {/* ❌ CLOSE ICON */}
          <div className="flex justify-between mb-1 text-md bg-[#F6EEDB] px-2 py-2 border border-zinc-300">
            <p>Suggested Products</p>
            <IconButton
              size="small"
              onClick={() => setOpenSearch(false)}
              className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          {/* 🔄 LOADING STATE */}
          {searchLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} height={60} />)
          ) : results.length > 0 ? (
            results.map((p) => (
              <NavLink
                key={p._id}
                to={`/product/${p._id}`}
                onClick={() => setOpenSearch(false)}
                className="flex items-center gap-4 p-2 hover:bg-gray-100 rounded-md"
              >
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-14 h-14 rounded-md object-cover"
                />
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-gray-500">₹{p.price}</p>
                </div>
              </NavLink>
            ))
          ) : (
            <p className="text-center py-6 text-gray-500">No product found</p>
          )}
        </Box>
      </Modal>
    </nav>
  );
}
