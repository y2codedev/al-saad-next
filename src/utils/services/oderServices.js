import axiosInstance from "./Client";
import API from "./Endpoints";

const orderServiceApi = {
  getOrders: (showLoader = false) => {
    return axiosInstance.get(API.ORDERS, {
      showLoader: showLoader,
    });
  },

  getOrderDetails: (data, showLoader = false) => {
    return axiosInstance.post(API.ORDER_DETAILS, data, {
      showLoader: showLoader,
    });
  },
};

export default orderServiceApi;
