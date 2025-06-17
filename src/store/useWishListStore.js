import { create } from "zustand";
import { wishListApi } from "../utils/services/wishList";
import { showToast } from "../utils/helper";

export const useWishListStore = create((set, get) => ({
  wishList: [],
  loading: false,
  error: null,

  getWishList: async () => {
    set({ loading: true });
    try {
      const response = await wishListApi.getWishlist();
      if (response.status === 200) {
        set({ wishList: response.data, loading: false });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      set({ error, loading: false });
    }
  },

  toggleWishlist: async (product_id, product_variant_id) => {
    const { wishList, addWishList, removeWishList } = get();
    let wishlistData = wishList.find(
      (item) =>
        item.product_variant_id?.toString() === product_variant_id?.toString(),
    );

    if (wishlistData) {
      await removeWishList(wishlistData.wishlist_id);
    } else {
      await addWishList(product_id, product_variant_id);
    }
  },

  isItemInWishlist: (product_variant_id) => {
    const { wishList } = get();
    return wishList.some(
      (item) =>
        item.product_variant_id?.toString() === product_variant_id?.toString(),
    );
  },

  addWishList: async (product_id, product_variant_id) => {
    set({ loading: true });
    try {
      const req = { product_id, product_variant_id };
      const response = await wishListApi.addToWishList(req);

      if (response.status === 200) {
        set((state) => ({
          wishList: [
            ...state.wishList,
            { ...response.data, product_variant_id },
          ],
          loading: false,
        }));
        showToast("success", response.message, "success");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      set({ error, loading: false });
    }
  },

  removeWishList: async (wishlist_id) => {
    set({ loading: true });
    try {
      set((state) => ({
        wishList: state.wishList.filter(
          (item) => item.wishlist_id !== wishlist_id,
        ),
        loading: false,
      }));
      const response = await wishListApi.removeWishList({
        wishlist_id: Number(wishlist_id),
      });
      if (response.status === 200) {
        showToast("success", response.message, "success");
      }
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      set({ error, loading: false });
    }
  },
}));
