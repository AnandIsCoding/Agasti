import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      index: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    offerPrice: {
      type: Number,
      min: 0,
      validate: {
        validator: function (value) {
          return value <= this.price;
        },
        message: "Offer price cannot be greater than price",
      },
    },

    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    inStock: {
      type: Boolean,
      default: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [String], // Cloudinary URLs
      validate: {
        validator: (arr) => arr.length <= 4,
        message: "Maximum 4 images allowed",
      },
    },

    longDescription: String,
    dimension: String,
    weight: String,
    sustainability: String,
    installation: String,
    details: String,
    shippingReturns: String,

    isActive: {
      type: Boolean,
      default: true,
    },

    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

/* Auto-generate slug */
productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
});

export default mongoose.model("Product", productSchema);
