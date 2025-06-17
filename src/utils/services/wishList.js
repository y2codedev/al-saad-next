import moment from "moment";
import axiosInstance from "./Client";
import API from "./Endpoints";

export const wishListApi = {
  addToWishList: (data) => {
    return axiosInstance.post(API.ADD_WISHLIST, data, { showLoader: false });
  },
  getWishlist: () => {
    return axiosInstance.get(API.Wishlist, { showLoader: false });
  },
  removeWishList: (data) => {
    return axiosInstance.post(API.REMOVE_WISHLIST, data, { showLoader: false });
  },
};
