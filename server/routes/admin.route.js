import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const adminRouter = express.Router();

adminRouter.get("/dashboard/stats", isAuthenticated, isAdmin, getAdminStats);

export default adminRouter;
