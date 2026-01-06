import chalk from "chalk";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { SECRET_KEY } from "../configs/server.config.js";
import { StatusCodes } from "http-status-codes";

/* ================= AUTH MIDDLEWARE ================= */

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      console.log(
        chalk.yellow("⚠️ Auth failed: No token found in cookies")
      );

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      console.log(
        chalk.red("❌ JWT verification failed →"),
        err.message
      );

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message:
          err.name === "TokenExpiredError"
            ? "Session expired, please login again"
            : "Invalid authentication token",
      });
    }

    const user = await User.findById(decoded._id).select(
      "-password -googleId"
    );

    if (!user) {
      console.log(
        chalk.red("❌ Auth failed: User not found for token")
      );

      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(
      chalk.bgRedBright("🔥 Auth middleware error →"),
      error
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/* ================= ADMIN GUARD ================= */

export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (req.user.role !== "ADMIN") {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next();
  } catch (error) {
    console.error(
      chalk.bgRedBright("🔥 Admin auth error →"),
      error
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
