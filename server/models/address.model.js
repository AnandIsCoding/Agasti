import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    address_line: {
      type: String,
      required: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
      trim: true,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    pincode: {
      type: String,
      required: true,
      trim: true,
    },

    country: {
      type: String,
      default: "India",
    },

    mobile: {
      type: Number,
      required: true,
    },

    status: {
      type: Boolean,
      default: false, // default address or not
    },
  },
  { timestamps: true },
);

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

export default Address;
