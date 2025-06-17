import axiosInstance from "./Client";
import API from "./Endpoints";

export const smartShoppingApi = {
  smartShopping: () => {
    return axiosInstance.get(API.SMART_SHOPPING, { showLoader: false });
  },

  smartShoppinSubcategory: (data) => {
    return axiosInstance.post(API.SMART_SHOPPING_SUBCATEGORY, data, {
      showLoader: false,
    });
  },

  smartShoppingDetailsApi: (data) => {
    return axiosInstance.post(API.SMART_SHOPPING_DETAILS, data, {
      showLoader: false,
    });
  },
};
