import express from "express";
import upload from "../configs/multer.config.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory,
} from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.get("/all", getAllCategories);

categoryRouter.post(
  "/create",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  createCategory,
);

categoryRouter.put(
  "/update/:id",
  isAuthenticated,
  isAdmin,
  upload.single("image"),
  updateCategory,
);

categoryRouter.delete("/delete/:id", isAuthenticated, isAdmin, deleteCategory);

export default categoryRouter;
