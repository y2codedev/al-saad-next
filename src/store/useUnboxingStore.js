import { create } from "zustand";
import { unboxingData } from "../utils/services/unboxingChallenge";

const useUnboxingStore = create((set, get) => ({
  data: null,
  loading: true,
  error: null,

  fetchData: async () => {
    if (!get().data) {
      set({ loading: true });
    }
    try {
      const response = await unboxingData.unboxingChanllege();
      if (response?.status === 200) {
        set({ data: response.data, loading: false });
      }
    } catch (error) {
      console.log("Error fetching unboxing data:", error);
      set({ error, loading: false });
    } finally {
      set({ loading: false });
    }
  },
}));

export default useUnboxingStore;
