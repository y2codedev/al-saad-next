import { create } from "zustand";
import { homeApi } from "../utils/services/homeServices";

const useHomeStore = create((set, get) => ({
  data: null,
  getRec: null,
  getNewPro: null,
  getGrid: null,
  isLoading: true,

  fetchHomeData: async () => {
    try {
      const response = await homeApi.fetchHomeData();
      if (response?.status === 200) {
        set({ data: response.data });
      }
    } catch (error) {
      console.log("Error fetching home data:", error);
    }
  },

  getRecommendedProducts: async () => {
    try {
      const response = await homeApi.getRecommendedProducts();
      if (response?.status === 200) {
        set({ getRec: response.data });
      }
    } catch (error) {
      console.log("Error fetching recommended products:", error);
    }
  },

  getNewProducts: async () => {
    try {
      const response = await homeApi.getNewProductsApi();
      if (response?.status === 200) {
        set({ getNewPro: response.data });
      }
    } catch (error) {
      console.log("Error fetching new products:", error);
    }
  },

  getGridProducts: async () => {
    try {
      const response = await homeApi.getGridProductsApi();
      if (response?.status === 200) {
        set({ getGrid: response.data });
      }
    } catch (error) {
      console.log("Error fetching new products:", error);
    }
  },

  fetchAllData: async () => {
    const { data, getRec, getNewPro, fetchHomeData, getRecommendedProducts, getNewProducts, getGridProducts } = get();

    try {
      if (!data || !getRec || !getNewPro) {
        set({ isLoading: true });
      }

      await Promise.all([
        fetchHomeData(),
        getRecommendedProducts(),
        getNewProducts(), 
        getGridProducts(),
      ]);
    } catch (error) {
      console.error("Error fetching all data:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useHomeStore;
