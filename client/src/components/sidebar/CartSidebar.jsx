import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { IoBagCheckOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CartSidebar({ open, onClose }) {
  const navigate = useNavigate();

  /* ✅ GET CART FROM REDUX */
  const cartItems = useSelector((state) => state.cart.items || []);

  /* ✅ TOTALS */
  const subtotal = cartItems.reduce((acc, item) => {
    const price = item.product?.offerPrice ?? item.product?.price ?? 0;

    return acc + price * item.quantity;
  }, 0);

  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 360 } }}
    >
      <Box className="flex flex-col h-full">
        {/* HEADER */}
        <Box className="flex items-center justify-between px-4 py-3 border-b">
          <Typography variant="h6" fontWeight={600}>
            Shopping Cart ({cartItems.length})
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* CART ITEMS */}
        <Box className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {cartItems.length === 0 ? (
            <Typography className="text-gray-500">
              Your cart is empty.
            </Typography>
          ) : (
            cartItems.map((item) => (
              <Box
                key={item._id}
                onClick={() => navigate(`/product/${item.product?._id}`)}
                className="flex gap-3 border-b pb-3 cursor-pointer hover:bg-gray-50"
              >
                <img
                  src={item.product?.images?.[0] || "/NoImageAvailable.jpeg"}
                  alt={item.product?.name}
                  className="w-16 h-16 rounded object-cover"
                />

                <Box className="flex-1">
                  <Typography fontSize={14} fontWeight={500}>
                    {item.product?.name}
                  </Typography>

                  <Typography fontSize={13} color="text.secondary">
                    Qty: {item.quantity}
                  </Typography>

                  <Typography fontSize={14} fontWeight={600}>
                    ₹
                    {(item.product?.offerPrice || item.product?.price || 0) *
                      item.quantity}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        {/* FOOTER */}
        {cartItems.length > 0 && (
          <Box className="p-4 border-t flex flex-col gap-3">
            <Box className="flex justify-between">
              <Typography fontWeight={500}>Subtotal</Typography>
              <Typography fontWeight={500}>₹{subtotal}</Typography>
            </Box>

            <Box className="flex justify-between">
              <Typography fontWeight={500}>Shipping</Typography>
              <Typography fontWeight={500}>₹{shipping}</Typography>
            </Box>

            <Divider />

            <Box className="flex justify-between mb-2">
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={700}>₹{total}</Typography>
            </Box>

            {/* ✅ FIXED */}
            <Button
              fullWidth
              onClick={() =>
                navigate("/checkout", {
                  state: { type: "CART" },
                })
              }
              variant="contained"
              sx={{
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "#111" },
                py: 1.5,
              }}
            >
              <IoBagCheckOutline size={22} className="mr-2" />
              Checkout
            </Button>

            <Button
              onClick={() => navigate("/cart")}
              fullWidth
              variant="outlined"
              sx={{
                color: "black",
                borderColor: "black",
                "&:hover": { bgcolor: "#f5f5f5" },
                py: 1.5,
              }}
            >
              View Cart
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}
