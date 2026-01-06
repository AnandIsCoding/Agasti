import { StatusCodes } from "http-status-codes";
import chalk from "chalk";
import mongoose from "mongoose";

import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

/* =========================================
   ADD OR REMOVE CART (TOGGLE)
========================================= */
export const toggleCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID" });
    }

    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    let action = "added";
    const cartItem = await Cart.findOne({ userId, productId });

    if (cartItem) {
      if (cartItem.quantity === quantity) {
        // REMOVE
        await cartItem.deleteOne();
        await User.findByIdAndUpdate(userId, {
          $pull: { cart: cartItem._id },
        });
        action = "removed";
      } else {
        // UPDATE
        cartItem.quantity = quantity;
        await cartItem.save();
        action = "updated";
      }
    } else {
      // ADD
      const newCartItem = await Cart.create({
        userId,
        productId,
        quantity,
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { cart: newCartItem._id },
      });

      action = "added";
    }

    const cartItems = await Cart.find({ userId }).populate(
      "productId",
      "name price offerPrice images",
    );

    const formattedItems = cartItems.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      product: item.productId,
    }));

    return res.status(200).json({
      success: true,
      action,
      cartCount: formattedItems.length,
      cartItems: formattedItems,
    });
  } catch (error) {
    console.error("❌ toggleCart error", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* =========================================
   GET LOGGED IN USER CART
========================================= */

export const getMyCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await Cart.find({ userId })
      .populate({
        path: "productId",
        select: "name price offerPrice images inStock",
      })
      .sort({ createdAt: -1 });

    const formattedCart = cartItems.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      product: item.productId,
      price: item.productId.offerPrice || item.productId.price,
      total:
        (item.productId.offerPrice || item.productId.price) * item.quantity,
    }));

    const cartTotal = formattedCart.reduce((sum, item) => sum + item.total, 0);

    return res.status(StatusCodes.OK).json({
      success: true,
      count: formattedCart.length,
      cartTotal,
      data: formattedCart,
    });
  } catch (error) {
    console.log(chalk.bgRed.white("❌ Error in getMyCart ---> "), error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/* =========================================
   GET CART COUNT (NAVBAR)
========================================= */

export const getCartCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Cart.countDocuments({ userId });

    return res.status(StatusCodes.OK).json({
      success: true,
      count,
    });
  } catch (error) {
    console.log(chalk.bgRed.white("❌ Error in getCartCount ---> "), error);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
