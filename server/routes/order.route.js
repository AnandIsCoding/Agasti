import express from "express";
import {
  createCODOrder,
  createPhonePePayment,
  getAllOrdersAdmin,
  getMyOrders,
  updateDeliveryStatusAdmin,
  verifyPhonePePayment,
} from "../controllers/order.controller.js";
import { isAdmin, isAuthenticated } from "../middlewares/auth.middleware.js";

const orderRouter = express.Router();

orderRouter.post("/phonepe/initiate", isAuthenticated, createPhonePePayment);

/**
 * PhonePe SERVER → SERVER callback
 * DO NOT protect with auth middleware
 */
orderRouter.post("/phonepe/verify", verifyPhonePePayment);

orderRouter.get("/my-orders", isAuthenticated, getMyOrders);

orderRouter.post("/cod/create", isAuthenticated, createCODOrder);

orderRouter.get(
  "/admin/all-orders",
  isAuthenticated,
  isAdmin,
  getAllOrdersAdmin,
);
orderRouter.patch(
  "/admin/orders/:orderId/delivery",
  isAuthenticated,
  isAdmin,
  updateDeliveryStatusAdmin,
);
export default orderRouter;
