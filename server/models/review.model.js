import mongoose from "mongoose";
import Product from "./product.model.js";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product is required"],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order reference is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

// Unique review per user per product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

/* ---------------------------------------------------
   STATIC METHOD TO CALCULATE RATINGS FOR A PRODUCT
--------------------------------------------------- */
reviewSchema.statics.calcAverageRatings = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsCount: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    // No reviews
    await Product.findByIdAndUpdate(productId, {
      ratingsCount: 0,
      ratingsAverage: 0,
    });
  }
};

/* ---------------------------------------------------
   MIDDLEWARE TO UPDATE RATINGS AFTER SAVE / Update / Delete
--------------------------------------------------- */
// After creating a review
reviewSchema.post("save", function () {
  this.constructor.calcAverageRatings(this.product);
});

// After updating/deleting a review
reviewSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

export default mongoose.model("Review", reviewSchema);
