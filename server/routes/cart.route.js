import express from "express";
import {
  toggleCart,
  getMyCart,
  getCartCount,
} from "../controllers/cart.controller.js";

import { isAuthenticated } from "../middlewares/auth.middleware.js";

const cartRouter = express.Router();

/**
 * @route   POST /api/cart/toggle
 * @desc    Add or remove product from cart
 * @access  Private
 */
cartRouter.post("/toggle", isAuthenticated, toggleCart);

/**
 * @route   GET /api/cart/my
 * @desc    Get logged in user's cart
 * @access  Private
 */
cartRouter.get("/mycart", isAuthenticated, getMyCart);

// cart.routes.js

/**
 * @route   GET /api/cart/count
 * @desc    Get cart item count for navbar
 * @access  Private
 */
cartRouter.get("/count", isAuthenticated, getCartCount);

export default cartRouter;
