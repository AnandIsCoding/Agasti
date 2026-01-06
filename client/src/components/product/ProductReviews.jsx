import Rating from "@mui/material/Rating";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

import {
  checkPurchasedProduct,
  createReview,
  getProductReviews,
} from "../../api/api";

function ProductReviews({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const { user, loading } = useSelector((state) => state.user);

  const [visibleCount, setVisibleCount] = useState(3);
  const [showForm, setShowForm] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [hasPurchased, setHasPurchased] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  /* --------------------------------
     FETCH REVIEWS
  -------------------------------- */
  useEffect(() => {
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await getProductReviews(productId);
        setReviews(res?.reviews || []);
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to load reviews");
      } finally {
        setLoadingReviews(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  /* --------------------------------
     CHECK PURCHASE
  -------------------------------- */
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      setLoadingPurchase(true);
      try {
        const res = await checkPurchasedProduct(productId); // ✅ API function

        setHasPurchased(Boolean(res?.purchased));
      } catch (error) {
        console.log(error);
        toast.error(error.message || "Failed to check purchase status");
      } finally {
        setLoadingPurchase(false);
      }
    };

    if (user && productId) checkPurchaseStatus();
  }, [user, productId]);

  /* --------------------------------
     SUBMIT REVIEW
  -------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      toast.error("Rating and comment are required");
      return;
    }

    setLoadingSubmit(true);
    try {
      const res = await createReview({
        productId,
        rating,
        comment,
      });

      setReviews((prev) => [res.review, ...prev]);
      toast.success("Review submitted");

      setRating(0);
      setComment("");
      setShowForm(false);
    } catch (err) {
      toast.error(err?.message || "Failed to submit review");
    } finally {
      setLoadingSubmit(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 relative">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Customer <span className="italic">Reviews</span>
      </h2>

      {/* ADD REVIEW BUTTON */}
      {user && !loadingPurchase && hasPurchased && (
        <div className="flex justify-center mb-6">
          <button
            onClick={() => setShowForm((p) => !p)}
            className="px-10 py-3 bg-black text-white rounded-md hover:bg-gray-900 transition"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </button>
        </div>
      )}

      {/* REVIEW FORM */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="relative mb-8 bg-white p-5 rounded-xl shadow-md border"
        >
          {/* FORM LOADER OVERLAY */}
          {loadingSubmit && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl z-10">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin" />
            </div>
          )}

          <h3 className="text-lg font-semibold mb-3">
            Review for “{productName}”
          </h3>

          <Rating
            value={rating}
            onChange={(e, val) => setRating(val)}
            size="large"
            disabled={loadingSubmit}
          />

          <textarea
            disabled={loadingSubmit}
            className="w-full p-3 mt-3 border rounded h-28 bg-gray-50 resize-none"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            disabled={loadingSubmit}
            className={`mt-4 px-5 py-2 text-white rounded flex items-center gap-2 justify-center transition ${
              loadingSubmit
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loadingSubmit && (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loadingSubmit ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {/* REVIEWS LIST */}
      {loadingReviews ? (
        <p className="text-center text-gray-500">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-center text-gray-500">No reviews yet</p>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.slice(0, visibleCount).map((review) => (
            <div key={review._id} className="bg-gray-100 p-4 rounded shadow-sm">
              <h3 className="font-semibold">
                {review.user?.name || "Anonymous"}
              </h3>
              <Rating value={review.rating} readOnly size="small" />
              <p className="text-gray-700 mt-1">{review.comment}</p>
            </div>
          ))}
        </div>
      )}

      {visibleCount < reviews.length && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setVisibleCount((p) => p + 3)}
            className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductReviews;
