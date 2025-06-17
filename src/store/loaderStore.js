import { create } from "zustand";

const useLoaderStore = create((set) => ({
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export default useLoaderStore;
