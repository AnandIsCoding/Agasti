import crypto from "crypto";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import chalk from "chalk";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";
import {
  PHONEPE_MERCHANT_ID,
  FRONTEND_URL,
  SERVER_URL,
  PHONEPE_SALT_KEY,
  PHONEPE_SALT_INDEX,
  PHONEPE_BASE_URL,
} from "../configs/server.config.js";
import User from "../models/user.model.js";
import generateInvoice from "../utils/uploadInvoiceToCloudinary.js.js";
import mailSender from "../utils/mailSender.utils.js";
import orderSuccessEmail from "../mail/templates/orderSuccessEmail.js";
import generateInvoiceBuffer from "../utils/generateInvoiceBuffer.js";
import uploadInvoiceToCloudinary from "../utils/uploadInvoiceToCloudinary.js.js";
import Product from "../models/product.model.js";
import Cart from "../models/cart.model.js";
import mongoose from "mongoose";
dotenv.config();

/* -------------------------------------------------------
   INITIATE PAYMENT
------------------------------------------------------- */
export const createPhonePePayment = async (req, res) => {
  try {
    const { userId, addressId, products, totalAmount, checkoutType } = req.body;

    if (!userId || !addressId || !products?.length || !totalAmount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid payload",
      });
    }

    const merchantTransactionId = uuidv4();

    /* ---------- FETCH PRODUCT NAMES (SERVER SIDE) ---------- */
    const productIds = products.map((p) => p.productId);

    const dbProducts = await Product.find(
      { _id: { $in: productIds } },
      { name: 1 },
    );

    const productMap = new Map(
      dbProducts.map((p) => [p._id.toString(), p.name]),
    );

    const paymentProducts = products.map((p) => ({
      productId: p.productId,
      name: productMap.get(p.productId.toString()), // ✅ ALWAYS PRESENT
      quantity: p.quantity,
      price: p.price,
    }));

    /* ---------------- PHONEPE PAYLOAD ---------------- */
    const payload = {
      merchantId: PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId.toString(),
      amount: totalAmount * 100,
      redirectUrl: `${FRONTEND_URL}/payment-success?txn=${merchantTransactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: `${SERVER_URL}/api/v1/order/phonepe/verify`,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64",
    );

    const checksum =
      crypto
        .createHash("sha256")
        .update(base64Payload + "/pg/v1/pay" + PHONEPE_SALT_KEY)
        .digest("hex") +
      "###" +
      PHONEPE_SALT_INDEX;

    /* ---------------- CALL PHONEPE ---------------- */
    const response = await axios.post(
      `${PHONEPE_BASE_URL}/pg/v1/pay`,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
        },
      },
    );

    /* ---------------- SAVE PAYMENT ---------------- */
    const payment = await Payment.create({
      user: userId,
      address: addressId,
      products: paymentProducts, // ✅ FIXED
      totalAmount,
      checkoutType,
      merchantTransactionId,
      status: "PENDING",
    });

    /* ---------- CLEAR CART IF CHECKOUT TYPE = CART ---------- */
    if (checkoutType === "CART") {
      await Cart.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
      console.log("🛒 Cart cleared for user", userId);
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.error(
      chalk.bgRed("❌ PhonePe Init Error"),
      error?.response?.data || error.message,
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "PhonePe payment initiation failed",
    });
  }
};

/* -------------------------------------------------------
   VERIFY PAYMENT (CALLBACK)
------------------------------------------------------- */
export const verifyPhonePePayment = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const merchantTransactionId = transactionId;

    if (!merchantTransactionId) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Transaction ID missing",
      });
    }

    /* ---------- PHONEPE CHECKSUM ---------- */
    const checksum =
      crypto
        .createHash("sha256")
        .update(
          `/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}` +
            PHONEPE_SALT_KEY,
        )
        .digest("hex") +
      "###" +
      PHONEPE_SALT_INDEX;

    /* ---------- PHONEPE STATUS ---------- */
    const response = await axios.get(
      `${PHONEPE_BASE_URL}/pg/v1/status/${PHONEPE_MERCHANT_ID}/${merchantTransactionId}`,
      {
        headers: {
          "X-VERIFY": checksum,
          "X-MERCHANT-ID": PHONEPE_MERCHANT_ID,
        },
      },
    );

    const phonePeData = response.data;

    /* ---------- FIND PAYMENT ---------- */
    const payment = await Payment.findOne({ merchantTransactionId });

    if (!payment) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Payment record not found",
      });
    }

    /* ---------- IDEMPOTENCY ---------- */
    if (payment.status === "SUCCESS") {
      return res.status(StatusCodes.OK).json({ success: true });
    }

    /* ---------- PAYMENT SUCCESS ---------- */
    if (
      phonePeData?.success === true &&
      phonePeData?.data?.state === "COMPLETED"
    ) {
      /* ---------- FIND / CREATE ORDER ---------- */
      let order = await Order.findOne({ payment: payment._id });

      if (!order) {
        order = await Order.create({
          user: payment.user,
          products: payment.products,
          address: payment.address, // ObjectId only ✔️
          payment: payment._id,

          paymentMethod: "ONLINE",
          paymentStatus: "Paid",
          isCOD: false,

          subTotalAmount: payment.totalAmount,
          totalAmount: payment.totalAmount,
          deliveryStatus: "Pending",
          emailSentToUser: false,
        });
      }

      /* ---------- EMAIL + INVOICE (ONCE) ---------- */
      if (!order.emailSentToUser) {
        try {
          const user = await User.findById(payment.user);

          if (user?.email) {
            const invoiceBuffer = await generateInvoiceBuffer({
              order,
              user,
              paymentMethod: "Online Payment",
              paymentStatus: "Paid",
            });

            const invoiceUpload = await uploadInvoiceToCloudinary(
              invoiceBuffer,
              order._id,
            );

            order.invoice = {
              url: invoiceUpload.url,
              cloudinaryId: invoiceUpload.publicId,
              generatedAt: new Date(),
            };

            await mailSender(
              user.email,
              "🧾 Order Confirmed | Invoice - Pluto Intero",
              orderSuccessEmail({
                name: user.name || "Customer",
                orderId: order._id,
                amount: order.totalAmount,
                invoiceUrl: invoiceUpload.url,
                paymentMethod: "Online Payment",
                paymentStatus: "Paid",
              }),
            );

            order.emailSentToUser = true;
            await order.save();

            console.log(
              chalk.green("✅ Invoice uploaded & email sent to"),
              user.email,
            );
          }
        } catch (emailError) {
          console.error(
            chalk.yellow("⚠️ Email/Invoice failed (non-blocking):"),
            emailError.message,
          );
        }
      }

      /* ---------- UPDATE PAYMENT ---------- */
      payment.status = "SUCCESS";
      payment.transactionId = phonePeData.data.transactionId;
      await payment.save();

      // dremove user's cart
      Cart.deleteMany({ userId: payment.user });

      return res.status(StatusCodes.OK).json({ success: true });
    }

    /* ---------- PAYMENT FAILED ---------- */
    payment.status = "FAILED";
    payment.failureReason = {
      code: phonePeData?.code || phonePeData?.data?.responseCode || "UNKNOWN",
      message:
        phonePeData?.message ||
        phonePeData?.data?.responseCodeDescription ||
        "Payment failed at PhonePe gateway",
    };

    await payment.save();

    console.log(
      chalk.red("❌ Payment Failed"),
      payment.failureReason.code,
      "-",
      payment.failureReason.message,
    );

    return res.status(StatusCodes.OK).json({
      success: false,
      reason: payment.failureReason.message,
    });
  } catch (error) {
    console.error(
      chalk.bgRed("❌ PhonePe Verify Error"),
      error?.response?.data || error.message,
    );

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};

/**
 * GET MY ORDERS (Logged-in user)
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("address") // populate address fields
      .lean();

    // Populate product images dynamically
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const productsWithImages = await Promise.all(
          order.products.map(async (p) => {
            const product = await Product.findById(p.productId).select(
              "images",
            );
            return {
              ...p,
              img: product?.images?.[0] || "", // Use first image from array
            };
          }),
        );

        return {
          ...order,
          products: productsWithImages,
          address: order.address,
        };
      }),
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("❌ Get My Orders Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/**
 * GET ALL ORDERS - ADMIN
 * Sorted by latest first
 */
export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email phone role") // user info
      .populate("address") // address details
      .lean();

    // Populate product images dynamically
    const ordersWithProducts = await Promise.all(
      orders.map(async (order) => {
        const productsWithImages = await Promise.all(
          order.products.map(async (p) => {
            const product = await Product.findById(p.productId).select(
              "name images",
            );
            return {
              ...p,
              name: p.name || product?.name || "Product",
              img: p.img || product?.images?.[0] || "",
            };
          }),
        );

        return {
          ...order,
          products: productsWithImages,
        };
      }),
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      orders: ordersWithProducts,
    });
  } catch (error) {
    console.error("❌ Admin Get Orders Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/**
 * UPDATE DELIVERY STATUS - ADMIN
 */
export const updateDeliveryStatusAdmin = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid order ID",
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Order not found",
      });
    }

    order.deliveryStatus = status;
    await order.save();

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Delivery status updated",
      order,
    });
  } catch (error) {
    console.error("❌ Update Delivery Status Error:", error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to update delivery status",
    });
  }
};

/* -------------------------------------------------------
   CREATE COD ORDER
------------------------------------------------------- */
export const createCODOrder = async (req, res) => {
  try {
    const { userId, addressId, products, totalAmount, checkoutType } = req.body;

    if (!userId || !addressId || !products?.length || !totalAmount) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Invalid payload",
      });
    }

    /* ---------- FETCH PRODUCT NAMES ---------- */
    const productIds = products.map((p) => p.productId);

    const dbProducts = await Product.find(
      { _id: { $in: productIds } },
      { name: 1 },
    );

    const productMap = new Map(
      dbProducts.map((p) => [p._id.toString(), p.name]),
    );

    const orderProducts = products.map((p) => ({
      productId: p.productId,
      name: productMap.get(p.productId.toString()),
      quantity: p.quantity,
      price: p.price,
    }));

    /* ---------- CREATE PAYMENT (COD) ---------- */
    const payment = await Payment.create({
      user: userId,
      address: addressId,
      products: orderProducts,
      totalAmount,
      checkoutType: checkoutType || "COD",
      merchantTransactionId: uuidv4(),
    });

    /* ---------- CREATE ORDER ---------- */
    const order = await Order.create({
      user: userId,
      products: orderProducts,
      address: addressId,
      payment: payment._id,
      paymentMethod: "COD",
      paymentStatus: "Pending", // ✅ NOT COD
      isCOD: true,
      subTotalAmount: totalAmount,
      totalAmount,
      deliveryStatus: "Pending",
      emailSentToUser: false,
    });

    /* ---------- CLEAR CART IF CHECKOUT TYPE = CART ---------- */
    if (checkoutType === "CART") {
      await Cart.deleteMany({ userId: new mongoose.Types.ObjectId(userId) });
      console.log("🛒 Cart cleared for user", userId);
    }

    /* ---------- INVOICE + EMAIL ---------- */
    try {
      const user = await User.findById(userId);

      if (user?.email) {
        const invoiceBuffer = await generateInvoiceBuffer({
          order,
          user,
          paymentMethod: "Cash on Delivery",
          paymentStatus: "Pending",
        });

        const invoiceUpload = await uploadInvoiceToCloudinary(
          invoiceBuffer,
          order._id,
        );

        order.invoice = {
          url: invoiceUpload.url,
          cloudinaryId: invoiceUpload.publicId,
          generatedAt: new Date(),
        };

        await mailSender(
          user.email,
          "🧾 Order Placed | Cash on Delivery - Pluto Intero",
          orderSuccessEmail({
            name: user.name || "Customer",
            orderId: order._id,
            amount: order.totalAmount,
            invoiceUrl: invoiceUpload.url,
            paymentMethod: "Cash on Delivery",
            paymentStatus: "Pending",
          }),
        );

        order.emailSentToUser = true;
        await order.save();

        console.log(chalk.green("✅ COD invoice & email sent to"), user.email);
      }
    } catch (err) {
      console.error(
        chalk.yellow("⚠️ COD email/invoice failed (non-blocking)"),
        err.message,
      );
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      orderId: order._id,
    });
  } catch (error) {
    console.error(chalk.bgRed("❌ COD Order Error"), error.message);

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to place COD order",
    });
  }
};
