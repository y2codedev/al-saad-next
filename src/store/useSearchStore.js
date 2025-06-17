// store/searchStore.js
import { create } from "zustand";

const useSearchStore = create((set) => ({
  searchData: [],
  loading: false,
  error: null,
  currentPage: 1,
  lastPage: null,
  setSearchData: (data) => set({ searchData: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setPagination: ({ currentPage, lastPage }) => set({ currentPage, lastPage }),
}));

export default useSearchStore;
