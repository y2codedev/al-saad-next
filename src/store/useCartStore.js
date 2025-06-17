import { create } from "zustand";
import { cardApi } from "../utils/services/cartSevices";
import { getSessionId, showToast } from "../utils/helper";
import useUserStore from "./user";

const useCartStore = create((set, get) => ({
  cartItems: null,
  cartIds: [],
  cartId:
    typeof window !== "undefined" ? localStorage.getItem("cart_id") : null,
  item_count: 0,
  loadingVariants: {},
  setCartItems: (items) => set({ cartItems: items }),
  setCartIds: (ids) => set({ cartIds: ids }),
  createToCart: async () => {
    const params = {
      sessionID: getSessionId(),
      customer_id: useUserStore.getState()?.userInfo?.id ?? "",
      cart_type: "customer",
    };

    try {
      const res = await cardApi.creteCart(params);
      if (res?.status === 200) {
        const cartId = res?.data?.cart_id;
        set({ cartId: cartId });
        localStorage?.setItem("cart_id", cartId);
        return cartId;
      }
    } catch (e) {
      showToast(
        "warning",
        e.response?.data?.message || "An error occurred",
        "danger",
      );
    }
  },
  fetchCartProductIds: async () => {
    const { cartId } = get();
    try {
      const response = await cardApi.getCartProductIds({
        cart_id: cartId,
        branch_id: 1,
        type: "online",
      });

      if (response?.status === 200) {
        const ids = response.data.map((item) => item.id);
        set({ cartIds: ids, item_count: response.item_count });
      }
    } catch (error) {
      console.log(error);
    }
  },
  addToCart: async (id, qty = 1) => {
    const { cartId, createToCart } = get();
    console.log(cartId, "cartId");
    let activeCartId = cartId;
    if (!activeCartId) {
      activeCartId = await createToCart();
      if (!activeCartId) return;
    }
    const params = {
      customer_id: useUserStore.getState()?.userInfo?.id ?? "",
      cart_id: activeCartId,
      product_variant_id: id,
      qty: qty.toString(),
      type: "online",
      branch_id: "",
    };

    set((state) => ({
      loadingVariants: { ...state.loadingVariants, [id]: true },
    }));

    try {
      const res = await cardApi.addToCart(params, false);
      console.log(res?.message, "res?.message");
      if (res?.status === 200) {
        set((state) => ({
          cartIds: [...state.cartIds, id],
        }));
        await get().getCart();
        showToast("success", res.message, "success");
      } else {
        if (res?.status === 400 && res?.message == "Invalid Cart ID") {
          localStorage?.removeItem("cart_id");
          set({ cartId: "" });
          await get().addToCart(id, qty);
        } else {
          showToast("error", res?.message || "An error occurred");
        }
      }
    } catch (e) {
      if (e?.status === 400 && e?.message == "Invalid Cart ID") {
        localStorage?.removeItem("cart_id");
        set({ cartId: "" });
        await get().addToCart(id, qty);
      } else {
        showToast("error", e?.message || "An error occurred");
      }
    } finally {
      set((state) => ({
        loadingVariants: { ...state.loadingVariants, [id]: false },
      }));
    }
  },

  deleteCartItem: async (cartItemId, vId) => {
    const { cartItems } = get();
    const params = {
      cart_id: localStorage?.getItem("cart_id"),
      cart_item_id: cartItemId,
    };
    if (vId) {
      set((state) => ({
        loadingVariants: { ...state.loadingVariants, [vId]: true },
        cartIds: state.cartIds.filter((id) => id != vId),
      }));
    }

    try {
      const response = await cardApi.removeCartItem(params, false);
      if (response?.status === 200) {
        showToast("success", response?.message, "success");
        await get().getCart();
      }
    } catch (error) {
      showToast(
        "warning",
        error.response?.data?.message || "An error occurred",
        "danger",
      );
    } finally {
      set((state) => ({
        loadingVariants: { ...state.loadingVariants, [vId]: false },
      }));
    }
  },

  toggleAddToCart: async (product_variant_id) => {
    const { cartItems, addToCart, deleteCartItem, isItemInCart } = get();
    const isItemCart = await isItemInCart(product_variant_id);
    if (isItemCart) {
      const cartItemId = cartItems?.branch
        ?.flatMap((branch) => branch.item)
        ?.find(
          (item) => item.product_variant_id == product_variant_id,
        )?.cart_item_id;
      if (cartItemId) {
        await deleteCartItem(cartItemId, product_variant_id);
      }
    } else {
      await addToCart(product_variant_id);
    }
  },

  getCart: async (id) => {
    if (!localStorage.getItem("cart_id")) return;

    try {
      const data = {
        customer_id: id || useUserStore.getState()?.userInfo?.id,
        cart_id: localStorage.getItem("cart_id"),
      };
      const res = await cardApi.getCart(data);
      if (res?.status === 200) {
        set({ cartItems: res.data, item_count: res.data.item_count });
      }
    } catch (error) {
      console.log("error", error);
    }
  },

  incrementQuantity: async (product_variant_id, quantity) => {
    const params = {
      customer_id: "",
      cart_id: localStorage.getItem("cart_id"),
      product_variant_id: product_variant_id,
      qty: quantity.toString(),
      type: "online",
      branch_id: "",
    };

    try {
      const response = await cardApi.addToCart(params, true);
      if (response?.status === 200) {
        showToast("success", response.message, "success");
        get().getCart("");
      }
    } catch (e) {
      showToast(
        "warning",
        e.response?.data?.message || "An error occurred",
        "danger",
      );
    }
  },

  decrementQuantity: async (id, quantity) => {
    const params = {
      customer_id: "",
      cart_id: localStorage.getItem("cart_id"),
      product_variant_id: id,
      qty: quantity.toString(),
      type: "online",
      branch_id: "",
    };

    try {
      const response = await cardApi.addToCart(params);
      if (response?.status === 200) {
        showToast("success", response.message, "success");
        get().getCart("");
      }
    } catch (e) {
      showToast(
        "warning",
        e.response?.data?.message || "An error occurred",
        "danger",
      );
    }
  },

  isItemInCart: (product_variant_id) => {
    const { cartIds } = get();
    return cartIds.includes(product_variant_id);
  },
}));

export default useCartStore;
