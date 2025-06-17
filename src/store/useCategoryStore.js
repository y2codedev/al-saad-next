import { create } from "zustand";
import { homeApi } from "../utils/services/homeServices";

const useCategoryStore = create((set, get) => ({
  data: null,
  isLoading: true,
  error: null,

  fetchCategory: async () => {
    try {
      const { data } = get();
      if (!data) {
        set({ isLoading: true, error: null });
      }

      const response = await homeApi.getCategory();
      if (response?.status === 200) {
        set({ data: response.data, error: null });
      }
    } catch (err) {
      console.error("Error fetching category data:", err);
      set({ error: "Failed to load data. Please try again." });
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useCategoryStore;
