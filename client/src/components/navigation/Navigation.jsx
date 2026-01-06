import React from "react";
import { FaCaretDown } from "react-icons/fa";
import { MdMenuOpen } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { setSelectedCategory } from "../../redux/slices/categoryFilterSlice.slice";
import CategoryPanel from "./CategoryPanel";

export default function Navigation() {
  const dispatch = useDispatch();

  const { categories } = useSelector((state) => state.categories);
  const { selectedCategory } = useSelector((state) => state.categoryFilter);

  return (
    <nav className="w-full bg-[#F6EEDB] border-b border-gray-200">
      <div className="drawer">
        {/* Drawer Toggle */}
        <input id="drawer-cat" type="checkbox" className="drawer-toggle" />

        {/* Main Nav */}
        <div className="drawer-content">
          <div className="max-w-7xl mx-auto flex items-center justify-between py-3 px-1">
            {/* LEFT: CATEGORIES BUTTON */}
            <div className="w-[40%] md:w-[30%]">
              <label
                htmlFor="drawer-cat"
                className="flex items-center cursor-pointer px-4 py-2
                           text-black rounded-md hover:bg-white transition"
              >
                <MdMenuOpen size={25} className="mr-2" />
                CATEGORIES
                <FaCaretDown size={25} className="hidden md:block ml-1" />
              </label>
            </div>

            {/* RIGHT: DESKTOP CATEGORY LIST */}
            <div className="pl-5 w-[60%] md:w-[70%] hidden md:block overflow-x-auto scrollbar-hide">
              <ul className="flex items-center gap-4 md:gap-6 text-[14px] md:text-[15px] font-medium whitespace-nowrap">
                {categories.map((cat) => {
                  const isActive = selectedCategory?._id === cat._id;

                  return (
                    <li key={cat._id}>
                      <NavLink to="/products">
                        <div
                          onClick={() =>
                            dispatch(
                              setSelectedCategory({
                                _id: cat._id,
                                name: cat.name,
                              }),
                            )
                          }
                          className={`px-4 py-2 rounded-md 
                            transition duration-200
                            ${
                              isActive
                                ? "bg-black text-white"
                                : "bg-white text-black hover:bg-black hover:text-white"
                            }`}
                        >
                          {cat.name}
                        </div>
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* MOBILE NAV */}
            <div className="pl-5 w-[60%] md:w-[70%] md:hidden overflow-x-auto scrollbar-hide">
              <ul className="flex items-center gap-4 text-[14px] font-medium whitespace-nowrap">
                <NavLink to="/products">
                  <div
                    onClick={() =>
                      dispatch(
                        setSelectedCategory({
                          _id: null,
                          name: null,
                        }),
                      )
                    }
                    className={`px-4 py-2 rounded-md border
                      ${
                        !selectedCategory
                          ? "bg-black text-white"
                          : "bg-white text-black hover:bg-black hover:text-white"
                      }`}
                  >
                    All Products
                  </div>
                </NavLink>

                <NavLink to="/">
                  <div className="px-4 py-2 rounded-md border bg-white text-black hover:bg-black hover:text-white transition">
                    Home
                  </div>
                </NavLink>

                <NavLink to="/about">
                  <div className="px-4 py-2 rounded-md border bg-white text-black hover:bg-black hover:text-white transition">
                    About
                  </div>
                </NavLink>

                <NavLink to="/contact">
                  <div className="px-4 py-2 rounded-md border bg-white text-black hover:bg-black hover:text-white transition">
                    Contact
                  </div>
                </NavLink>
              </ul>
            </div>
          </div>
        </div>

        {/* Drawer Sidebar */}
        <CategoryPanel />
      </div>
    </nav>
  );
}
