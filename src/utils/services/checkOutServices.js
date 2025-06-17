import axiosInstance from "./Client";
import API from "./Endpoints";

export const checkOutServices = {
  checkOut: (data) => {
    return axiosInstance.post(API.CHECKOUT, data, { showLoader: false });
  },

  addCoupon: (data) => {
    return axiosInstance.post(API.VALIDATE_COUPON, data, { showLoader: false });
  },
};
