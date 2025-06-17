import { create } from "zustand";
import { checkOutServices } from "../utils/services/checkOutServices";

export const useCheckOutStore = create((set, get) => ({
  checkOut: [],
  loading: false,
  error: null,

  fetchCheckOut: async () => {
    set({ loading: true });
    let cart_id = localStorage.getItem("cart_id");
    try {
      let checkoutData = {
        address: "Sha Uae",
        device_type: "web",
        whatsapp_number: "+968 89550945",
        city_id: "10",
        area_id: "2648",
        country_code: "+971",
        token: "",
        is_coupon_applied: "ma",
        email: "kumharprahlad90@gmail.com",
        customer_id: "",
        applied_coupon: "ma",
        cart_id: cart_id,
        version: "36",
        userName: "Prahlad Parasara",
        currency: "AED",
        country_id: "2",
        mobile_number: "89550956",
        is_wallet: "0",
        area_name: "2",
        appartment: "2",
        building: "2",
        order_shipping_type: "standard",
        note: "2",
      };
      const response = await checkOutServices.checkOut(checkoutData);
      if (response && response.status === 200) {
        console.log(response.data, "response");

        set({ checkOut: response.data, loading: false });
      } else {
        set({ error: response?.message, loading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch data", loading: false });
    }
  },
}));
