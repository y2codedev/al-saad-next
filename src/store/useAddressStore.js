import { create } from "zustand";
import { shippingApi } from "../utils/services/shippingApi";
import { showToast } from "../utils/helper";

export const useAddressStore = create((set) => ({
  addresses: [],
  loading: false,
  error: null,

  getShipping: async () => {
    set({ loading: true, error: null });
    try {
      const response = await shippingApi.getShippingAddress();
      if (response && response.status === 200) {
        set({ addresses: response.data });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      set({ error });
    } finally {
      set({ loading: false });
    }
  },

  deleteShippingAddress: async (id) => {
    set({ loading: true, error: null });
    try {
      const req = {
        shipping_address_id: id,
      };
      const response = await shippingApi.deleteShippingAddress(req);

      if (response && response.status === 200) {
        showToast("Success", "Address deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting address:", error);
      set({ error: error.message || "Failed to delete address." });
    } finally {
      set({ loading: false });
    }
  },
}));
