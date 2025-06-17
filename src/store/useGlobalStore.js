import { create } from "zustand";
import { settingsApi } from "@/utils/services/settingsServices";

const useGlobalStore = create((set) => ({
  globalData: null,
  getGlobalData: async () => {
    try {
      const response = await settingsApi.getGlobalSettings();
      if (response && response.status === 200) {
        const data = response.data;
        set({ globalData: data });
      } else {
        console.error(
          "Failed to fetch global settings:",
          response?.statusText || "Unknown error",
        );
      }
    } catch (error) {
      console.error("Error while fetching global settings:", error.message);
    }
  },
}));

export default useGlobalStore;
