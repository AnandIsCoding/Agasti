import express from "express";
import {
  createReview,
  checkPurchasedProduct,
  getProductReviews,
} from "../controllers/review.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js"; // your auth middleware

const reviewRouter = express.Router();

// Check if user purchased the product

// PUBLIC – get reviews of a product
reviewRouter.get("/product/:productId", getProductReviews);

// Create review
reviewRouter.post("/", isAuthenticated, createReview);

reviewRouter.get("/check/:productId", isAuthenticated, checkPurchasedProduct);

export default reviewRouter;
