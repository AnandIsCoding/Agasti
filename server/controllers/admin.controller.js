import chalk from "chalk";
import { StatusCodes } from "http-status-codes";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";

/**
 * GET /admin/dashboard/stats
 * @desc    Get all statistics for Admin Dashboard
 * @access  Admin
 */
export const getAdminStats = async (req, res) => {
  try {
    // Fetch counts from DB
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Prepare stats object
    const stats = [
      {
        label: "Total Users",
        value: totalUsers,
        icon: "People", // React icon will be added on frontend
        gradient: "from-green-400 to-green-600",
      },
      {
        label: "Total Orders",
        value: totalOrders,
        icon: "ShoppingCart",
        gradient: "from-pink-400 to-purple-500",
      },
      {
        label: "Total Products",
        value: totalProducts,
        icon: "Inventory2",
        gradient: "from-blue-400 to-blue-600",
      },
      {
        label: "Total Reviews",
        value: totalReviews,
        icon: "Star",
        gradient: "from-yellow-400 to-orange-500",
      },
    ];

    console.log(chalk.green("[ADMIN DASHBOARD] Stats fetched successfully"));

    return res.status(StatusCodes.OK).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(chalk.red("[ADMIN DASHBOARD] Error fetching stats:", error));
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};
