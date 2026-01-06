import fs from "node:fs";
import mongoose from "mongoose";
import Category from "../models/category.model.js";
import {
  uploadFileToCloudinary,
  isFileTypeSupported,
} from "../utils/helper.utils.js";
import { CLOUDINARY_FOLDER_NAME } from "../configs/server.config.js";
import { StatusCodes } from "http-status-codes";
import chalk from "chalk";
import { STATUS_CODES } from "node:http";
import uploadBufferToCloudinary from "../utils/uploadBufferToCloudinary.js";

/**
 * @desc    Create category with image upload
 * @route   POST /api/categories/create
 * @access  Admin
 */
export const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Category name is required",
      });
    }

    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Category image is required",
      });
    }

    // Check duplicate category
    const existingCategory = await Category.findOne({
      name: { $regex: `^${name}$`, $options: "i" },
    });

    if (existingCategory) {
      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        message: "Category already exists",
      });
    }

    // Validate image type
    const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!isFileTypeSupported(req.file.mimetype, supportedTypes)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Only JPEG, PNG, WEBP images are allowed",
      });
    }

    /* ---------- CLOUDINARY BUFFER UPLOAD ---------- */
    const cloudinaryResult = await uploadBufferToCloudinary(
      req.file.buffer,
      `${CLOUDINARY_FOLDER_NAME}/category`,
      "image",
    );

    const category = await Category.create({
      name,
      image: cloudinaryResult.secure_url,
    });

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in createCategory --->> "), error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};

/**
 * @desc    Get all categories
 * @route   GET /api/categories/all
 * @access  Public
 */
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in getAllCategory --->> ", error));
    return res
      .status(StatusCodes.INTERNAL_SERVER)
      .json({ success: False, message: "Internal Server Error" });
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/category/delete/:id
 * @access  Admin
 */
export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in deleteCategory --->> ", error));
    return res
      .status(StatusCodes.INTERNAL_SERVER)
      .json({ success: False, message: "Internal Server Error" });
  }
};

/**
 * @desc    Update category
 * @route   UPDATE /api/category/update/:id
 * @access  Admin
 */

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body || {};

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update name if provided
    if (name) {
      category.name = name;
    }

    // Update image if provided
    if (req.file) {
      const supportedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!isFileTypeSupported(req.file.mimetype, supportedTypes)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: "Only JPEG, PNG, WEBP images are allowed",
        });
      }

      /* ---------- CLOUDINARY BUFFER UPLOAD ---------- */
      const uploadResult = await uploadBufferToCloudinary(
        req.file.buffer,
        `${CLOUDINARY_FOLDER_NAME}/category`,
        "image",
      );

      category.image = uploadResult.secure_url;
    }

    await category.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    console.log(chalk.bgRed("Error in Category Updation "), error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: "Internal Server Error" });
  }
};
