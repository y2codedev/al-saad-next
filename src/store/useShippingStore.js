"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useShippingStore = create(
  persist(
    (set) => ({
      message: null,
      selectedCity: null,
      selectedArea: null,

      setShippingData: (message, city, area) =>
        set({ message, selectedCity: city, selectedArea: area }),
      clearShippingData: () =>
        set({ message: null, selectedCity: null, selectedArea: null }),
    }),
    {
      name: "shipping-storage",
    },
  ),
);

export default useShippingStore;
