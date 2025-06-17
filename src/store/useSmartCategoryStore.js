import { create } from "zustand";
import { smartShoppingApi } from "../utils/services/smartShopping";

const useSmartCategoryStore = create((set, get) => ({
  data: null,
  isLoading: true,
  error: null,

  fetchCategory: async () => {
    try {
      const { data } = get();
      if (!data) {
        set({ isLoading: true, error: null });
      }

      const response = await smartShoppingApi.smartShopping();
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

export default useSmartCategoryStore;
