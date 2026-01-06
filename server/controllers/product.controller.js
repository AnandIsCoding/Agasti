import fs from "node:fs";
import mongoose from "mongoose";
import chalk from "chalk";
import { StatusCodes } from "http-status-codes";

import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

import {
  uploadFileToCloudinary,
  isFileTypeSupported,
} from "../utils/helper.utils.js";

import { CLOUDINARY_FOLDER_NAME } from "../configs/server.config.js";
import uploadBufferToCloudinary from "../utils/uploadBufferToCloudinary.js";

/**
 * @desc    Create product
 * @route   POST /api/products/create
 * @access  Admin
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      categoryId,
      price,
      offerPrice,
      rating,
      inStock,
      isFeatured,
      longDescription,
      dimension,
      weight,
      sustainability,
      installation,
      details,
      shippingReturns,
    } = req.body;

    if (!name || !categoryId || !price) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Name, category and price are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "At least one product image is required",
      });
    }

    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
    const uploadedImages = [];

    for (const file of req.files) {
      if (!isFileTypeSupported(file.mimetype, supportedTypes)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Only JPEG, PNG, WEBP images are allowed",
        });
      }

      /* 🔥 BUFFER → CLOUDINARY (NO DISK) */
      const uploadResult = await uploadBufferToCloudinary(
        file.buffer,
        `${CLOUDINARY_FOLDER_NAME}/products`,
        file.mimetype,
      );

      uploadedImages.push(uploadResult.secure_url);
    }

    const product = await Product.create({
      name,
      category: categoryId,
      price,
      offerPrice,
      rating,
      inStock,
      isFeatured,
      images: uploadedImages,
      longDescription,
      dimension,
      weight,
      sustainability,
      installation,
      details,
      shippingReturns,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in createProduct --->> "), error);

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * @desc    Get all products
 * @route   GET /api/products/all
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in getAllProducts --->> "), error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * @desc    Update product
 * @route   PUT /api/products/update/:id
 * @access  Admin
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    /* ---------- VALIDATE PRODUCT ID ---------- */
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    /* ---------- UPDATE BASIC FIELDS ---------- */
    Object.assign(product, req.body);

    /* ---------- UPDATE IMAGES (BUFFER → CLOUDINARY) ---------- */
    if (req.files?.length) {
      const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
      const uploadedImages = [];

      for (const file of req.files) {
        if (!isFileTypeSupported(file.mimetype, supportedTypes)) {
          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            message: "Only JPEG, PNG, WEBP images are allowed",
          });
        }

        const uploadResult = await uploadBufferToCloudinary(
          file.buffer,
          `${CLOUDINARY_FOLDER_NAME}/products`,
          "image",
        );

        uploadedImages.push(uploadResult.secure_url);
      }

      product.images = uploadedImages;
    }

    await product.save();

    console.log(
      chalk.green("✅ Product updated successfully →"),
      product._id.toString(),
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    console.error(
      chalk.bgRed("❌ Error in updateProduct ---->>"),
      error.message,
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * @desc    Delete product (soft delete)
 * @route   DELETE /api/products/delete/:id
 * @access  Admin
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in deleteProduct --->> "), error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// search product
export const searchProducts = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(StatusCodes.OK).json({
        success: true,
        products: [],
      });
    }

    const keyword = query.trim();

    const products = await Product.find(
      {
        isActive: true,
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { longDescription: { $regex: keyword, $options: "i" } },
        ],
      },
      {
        name: 1,
        price: 1,
        offerPrice: 1,
        images: { $slice: 1 },
        rating: 1,
        slug: 1,
      },
    )
      .limit(10)
      .lean();

    return res.status(StatusCodes.OK).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("❌ searchProducts error:", error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Search failed",
    });
  }
};

//  get product by id controller

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findOne({
      _id: id,
      isActive: true,
    }).populate("category", "name");

    if (!product) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.log(chalk.bgRed("❌ Error in getProductById ---> "), error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
