import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSettingsStore = create(
  persist(
    (set) => ({
      selectedCountry: null,
      code: "+971",
      setSelectedCountry: (country) => set({ selectedCountry: country }),

      resetSettings: () => set({ selectedCountry: null }),
    }),
    {
      name: "settings-storage",
      getStorage: () => localStorage,
    },
  ),
);
