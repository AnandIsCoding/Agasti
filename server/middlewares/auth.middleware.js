import chalk from "chalk";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { SECRET_KEY } from "../configs/server.config.js";
import { StatusCodes } from "http-status-codes";

dotenv.config();

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await User.findById(decoded._id).select("-password -googleId");

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(chalk.red("Auth error in isAuthenticated →"), error.message);

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Token expired or invalid",
    });
  }
};

/**
 * @description Allow only ADMIN users
 */
export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req?.user?.role !== "ADMIN") {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Authorization error",
    });
  }
};
