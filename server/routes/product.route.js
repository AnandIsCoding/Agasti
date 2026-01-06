import express from "express";
import multer from "multer";

import {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductById,
} from "../controllers/product.controller.js";

import { isAuthenticated, isAdmin } from "../middlewares/auth.middleware.js";

const productRouter = express.Router();

/* ---------------- MULTER CONFIG ---------------- */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
});

/* ---------------- ROUTES ---------------- */

/**
 * @route   POST /api/products/create
 * @access  Admin
 */
productRouter.post(
  "/create",
  isAuthenticated,
  isAdmin,
  upload.array("images", 4),
  createProduct,
);

/**
 * @route   GET /api/products/all
 * @access  Public
 */
productRouter.get("/all", getAllProducts);

/**
 * @route   PUT /api/products/update/:id
 * @access  Admin
 */
productRouter.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  upload.array("images", 4),
  updateProduct,
);

/**
 * @route   DELETE /api/products/delete/:id
 * @access  Admin (Soft delete)
 */
productRouter.delete("/delete/:id", isAuthenticated, isAdmin, deleteProduct);

/**
 * @route   POST /api/products/search
 * @access  Public
 */
productRouter.post("/search", searchProducts);

/* GET PRODUCT BY ID (PUBLIC) */

productRouter.get("/:id", getProductById);

export default productRouter;
