import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      unique: true,
      sparse: true, // <-- allows multiple null/undefined values
    },
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    email: {
      type: String,
      required: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // If a user logs in via Google (googleId), they may not have a password. In that case false otherwise true
      },
    },
    profilePic: {
      type: String,
      default:
        "https://res.cloudinary.com/dm0rlehq8/image/upload/v1751560449/default_user_sij8ek.jpg",
    },
    phone: {
      type: Number,
      default: null,
    },
    refreshToken: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      enum: {
        values: ["Inactive", "Active", "Suspended"],
        message: "Status can be Active, Inactive or Suspended",
      },
      default: "Active",
    },
    address: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
      },
    ],
    orderHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    forgot_password_otp: {
      type: String,
      default: "",
    },
    forgot_password_expiry: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      enum: {
        values: ["USER", "ADMIN"],
        message: "Role must be either USER or ADMIN",
      },
      default: "USER",
    },
  },
  { timestamps: true },
);

userSchema.index({ googleId: 1, email: 1 }, { unique: true, sparse: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
