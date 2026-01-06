import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
      unique: true,
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded", "COD"],
      default: "Pending",
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ["ONLINE", "COD"],
      index: true,
    },

    deliveryStatus: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
      index: true,
    },

    subTotalAmount: {
      type: Number,
      required: true,
      immutable: true,
    },
    isCod: {
      type: Boolean,
    },

    totalAmount: {
      type: Number,
      required: true,
      immutable: true,
    },

    invoice: {
      url: String,
      cloudinaryId: String,
      generatedAt: Date,
    },
    emailSentToUser: {
      type: Boolean,
      default: false,
    },
    orderDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

/* INDEXES */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ deliveryStatus: 1, paymentStatus: 1 });

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
