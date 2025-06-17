import axiosInstance from "./Client";
import API from "./Endpoints";

export const engagementApi = {
  getCategory: () => axiosInstance.get(API.GET_ENG_CATEGORY),

  getSubCategory: (data) => axiosInstance.post(API.GET_ENG_SUB_CATEGORY, data),

  getProducts: (params) => axiosInstance.post(API.GET_ENG_PRODUCTS, params),

  getEngagementList: (params) =>
    axiosInstance.post(API.ENG_LIST, { params }, { showLoader: false }),

  getEngagementDetails: (params) =>
    axiosInstance.post(API.ENG_DETAILS, params, { showLoader: false }),

  getTaggedProducts: (params) =>
    axiosInstance.post(API.ENG_TAG_PRODUCTS, params, { showLoader: false }),

  getProductsByTag: (params) =>
    axiosInstance.get(API.ENG_PRODUCTS_BY_TAG, params, { showLoader: false }),

  addToCart: (params) => axiosInstance.post(API.ENG_ADD_TO_CART, params),
};
