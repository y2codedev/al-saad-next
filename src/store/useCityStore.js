import { create } from "zustand";
import { shippingApi } from "../utils/services/shippingApi";

export const useCityStore = create((set) => ({
  citys: [],
  loading: false,
  error: null,
  fetchCitys: async () => {
    set({ loading: true });
    try {
      const response = await shippingApi.getCity();
      if (response && response.status === 200) {
        set({ citys: response.data, loading: false });
      } else {
        set({ error: response?.message, loading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },
}));
