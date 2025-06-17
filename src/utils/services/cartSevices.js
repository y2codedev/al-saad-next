import axiosInstance from "./Client";
import API from "./Endpoints";

export const cardApi = {
  creteCart: (data, showLoader = false) => {
    return axiosInstance.post(API.CREATE_CART, data, { showLoader });
  },
  addToCart: (data, showLoader = true) => {
    return axiosInstance.post(API.ADD_TO_CART, data, { showLoader });
  },
  removeCartItem: (data, showLoader = true) => {
    return axiosInstance.post(API.REMOVE_CART_ITEM, data, {
      showLoader: showLoader,
    });
  },
  getCart: (data, showLoader = false) => {
    return axiosInstance.post(API.GET_CART, data, {
      showLoader: showLoader,
    });
  },
  getCartProductIds: (data, showLoader = false) => {
    return axiosInstance.post(API.CART_PRODUCT_IDS, data, {
      showLoader: false,
    });
  },
  mergeCart: (data, showLoader = false) => {
    return axiosInstance.post(API.Merge_Cart, data, { showLoader });
  },
};
