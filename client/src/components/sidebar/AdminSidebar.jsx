import {
  Category,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Inventory,
  Menu as MenuIcon,
  People,
  ShoppingCart,
} from "@mui/icons-material";
import { Box, Collapse, IconButton, Tooltip } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "/admin" },
  { label: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },

  {
    label: "Category",
    icon: <Category />,
    children: [
      { label: "List", path: "/admin/categories" },
      { label: "Add Category", path: "/admin/categories/create" },
    ],
  },

  {
    label: "Products",
    icon: <Inventory />,
    children: [
      { label: "All Products", path: "/admin/products" },
      { label: "Add Product", path: "/admin/products/create" },
    ],
  },

  // { label: "Users", icon: <People />, path: "/admin/users" },
];

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.innerWidth < 768) setCollapsed(true);
  }, []);

  const handleToggle = (label) => {
    setOpenMenu(openMenu === label ? null : label);
  };

  return (
    <Box
      className={`min-h-screen  bg-black text-white transition-all duration-300 
      ${collapsed ? "w-16" : "w-64"} flex flex-col`}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-800">
        {!collapsed && (
          <h2 className="text-lg font-semibold tracking-wide">Admin Panel</h2>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)}>
          <MenuIcon sx={{ color: "white" }} />
        </IconButton>
      </div>

      {/* MENU */}
      <nav className="flex-1 mt-4 space-y-1 px-2">
        {menuItems.map((item) => {
          const isOpen = openMenu === item.label;

          return (
            <div key={item.label}>
              {/* MAIN ITEM */}
              <Tooltip title={collapsed ? item.label : ""} placement="right">
                <button
                  onClick={() => {
                    if (item.children) {
                      handleToggle(item.label);
                    } else {
                      navigate(item.path);
                    }
                  }}
                  className={`w-full flex items-center rounded-md py-3 px-3
    transition-all
    ${collapsed ? "justify-center" : "justify-between"}
    hover:bg-gray-800`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl w-6 flex justify-center">
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                  </div>

                  {!collapsed &&
                    item.children &&
                    (isOpen ? <ExpandLess /> : <ExpandMore />)}
                </button>
              </Tooltip>

              {/* SUBMENU */}
              {item.children && (
                <Collapse in={isOpen && !collapsed} timeout="auto">
                  <div className="ml-10 mt-1 space-y-1">
                    {item.children.map((sub) => (
                      <NavLink
                        key={sub.label}
                        to={sub.path}
                        className={({ isActive }) =>
                          `block text-sm px-3 py-2 rounded-md
                          ${
                            isActive
                              ? "bg-white text-black"
                              : "text-gray-300 hover:bg-gray-800"
                          }`
                        }
                      >
                        {sub.label}
                      </NavLink>
                    ))}
                  </div>
                </Collapse>
              )}
            </div>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="px-4 py-4 border-t border-gray-800 text-xs text-gray-400">
        {!collapsed && "@ Pluto Intero"}
      </div>
    </Box>
  );
};

export default AdminSidebar;
