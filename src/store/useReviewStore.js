import { create } from "zustand";
import ratingApi from "../utils/services/ratingServices";
import { showToast } from "../utils/helper";

const useReviewStore = create((set) => ({
  open: false,
  orderId: null,
  loading: false,
  reviewData: {
    rating: 0,
    headline: "",
    review: "",
    images: [],
  },

  setOpen: (status, orderId = null) => set({ open: status, orderId }),
  setLoading: (loading) => set({ loading }),

  setReviewData: (data) =>
    set((state) => ({
      reviewData: { ...state.reviewData, ...data },
    })),

  submitReview: async () => {
    set({ loading: true });
    try {
      const { reviewData, orderId } = useReviewStore.getState();
      const formData = new FormData();
      formData.append("rating", reviewData.rating);
      formData.append("headline", reviewData.headline);
      formData.append("review", reviewData.review);
      formData.append("order_item_id", orderId);
      formData.append("item_type", "none");

      reviewData.images.forEach((file) => formData.append("images", file));

      const response = await ratingApi.addRating(formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response?.status === 200) {
        showToast("success", "Review submitted successfully!");
        set({
          open: false,
          reviewData: { rating: 0, headline: "", review: "", images: [] },
        });
      } else {
        showToast(
          "error",
          response.data?.message || "Failed to submit review.",
        );
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("error", "Something went wrong while submitting the review.");
    } finally {
      set({ loading: false });
    }
  },
}));

export default useReviewStore;
