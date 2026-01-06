import Review from "../models/review.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

/* ---------------------------------------------------
   CHECK IF USER HAS PURCHASED A PRODUCT (DELIVERED)
--------------------------------------------------- */
export const checkPurchasedProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Check if user has orders containing the product with delivered status
    const order = await Order.findOne({
      user: userId,
      "products.productId": productId,
      deliveryStatus: "Delivered",
    });

    if (!order) {
      return res.status(StatusCodes.OK).json({
        success: true,
        purchased: false,
        message: "User has not purchased or delivery is not completed",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      purchased: true,
      message: "User has purchased this product",
    });
  } catch (error) {
    console.error("❌ Check Purchased Product Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to check purchase status",
    });
  }
};

/* ---------------------------------------------------
   CREATE REVIEW
   User can review only if purchased & delivered
--------------------------------------------------- */
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Comment is required",
      });
    }

    // Check if user has purchased the product & delivery completed
    const order = await Order.findOne({
      user: userId,
      "products.productId": productId,
      deliveryStatus: "Delivered",
    });

    if (!order) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message:
          "You cannot review this product before purchasing or delivery is not completed",
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });

    if (existingReview) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    // Create review
    const review = await Review.create({
      product: productId,
      user: userId,
      order: order._id,
      rating,
      comment,
    });

    // Populate product info if needed
    const populatedReview = await review.populate("product", "name");

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Review created successfully",
      review: populatedReview,
    });
  } catch (error) {
    console.error("❌ Create Review Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create review",
    });
  }
};

/**
 * GET REVIEWS OF A PARTICULAR PRODUCT (PUBLIC)
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name") // show reviewer name
      .sort({ createdAt: -1 })
      .lean();

    return res.status(StatusCodes.OK).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    console.error("❌ Get Product Reviews Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch product reviews",
      error,
    });
  }
};
