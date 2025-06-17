import axiosInstance from "./Client";
import API from "./Endpoints";

const placeOrderApi = {
  placeOreder: (data) => {
    return axiosInstance.post(API.PLACE_ORDER, data, { showLoader: false });
  },
};

export default placeOrderApi;
