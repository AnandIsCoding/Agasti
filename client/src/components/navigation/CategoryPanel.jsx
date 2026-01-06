import { motion, useAnimation } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { setSelectedCategory } from "../../redux/slices/categoryFilterSlice.slice";

export default function CategoryPanel() {
  const controls = useAnimation();
  const drawerRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories } = useSelector((state) => state.categories);
  const { selectedCategory } = useSelector((state) => state.categoryFilter);

  // Observe checkbox toggle
  useEffect(() => {
    const checkbox = document.getElementById("drawer-cat");
    const handleChange = () => {
      if (checkbox.checked) {
        controls.start("visible");
      }
    };
    checkbox.addEventListener("change", handleChange);
    return () => checkbox.removeEventListener("change", handleChange);
  }, [controls]);

  // Close drawer function
  const closeDrawer = () => {
    const checkbox = document.getElementById("drawer-cat");
    if (checkbox.checked) checkbox.checked = false;
  };

  return (
    <div className="drawer-side fixed inset-0 z-50">
      {/* Overlay */}
      <label
        htmlFor="drawer-cat"
        className="drawer-overlay fixed inset-0 bg-black/70 cursor-pointer"
      ></label>

      {/* Sidebar */}
      <motion.ul
        ref={drawerRef}
        className="menu bg-white min-h-screen w-64 md:w-80 p-6 space-y-4 shadow-xl relative z-50 flex flex-col"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { x: "-100%" },
          visible: { x: 0, transition: { type: "tween", duration: 0.3 } },
        }}
      >
        {/* LOGO */}
        <NavLink
          to="/"
          onClick={closeDrawer}
          className="flex items-center gap-2 mb-6"
        >
          <img src="/logo.png" alt="Pluto Intero" className="h-12 w-auto" />
        </NavLink>

        {/* Categories */}
        <div className="flex-1">
          {categories.map((cat, i) => (
            <motion.li
              key={i}
              initial={{ x: -30, opacity: 0 }}
              animate={controls}
              variants={{
                hidden: { x: -30, opacity: 0 },
                visible: {
                  x: 0,
                  opacity: 1,
                  transition: {
                    delay: 0.05 * i,
                    type: "spring",
                    stiffness: 300,
                  },
                },
              }}
            >
              <NavLink
                to="/products"
                onClick={() => {
                  dispatch(
                    setSelectedCategory({
                      _id: cat._id,
                      name: cat.name,
                    }),
                  );
                  closeDrawer();
                }}
                className={`block px-4 py-3 ${selectedCategory?._id === cat._id ? "bg-black text-white" : "bg-white text-black"} border-black font-medium text-gray-900 border mt-2
             hover:bg-gray-900 hover:text-white transition`}
              >
                {cat.name}
              </NavLink>
            </motion.li>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-4 pt-4 border-t">
          <NavLink
            to="/products"
            onClick={() => {
              dispatch(
                setSelectedCategory({
                  _id: null,
                  name: null,
                }),
              );
              closeDrawer();
            }}
            className="block text-center py-3 border border-black rounded-md font-medium hover:bg-black hover:text-white transition"
          >
            View All Products
          </NavLink>
        </div>
      </motion.ul>
    </div>
  );
}
