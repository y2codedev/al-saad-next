import axiosInstance from "./Client";
import API from "./Endpoints";

export const homeApi = {
  fetchHomeData: (showLoader = false) =>
    axiosInstance.get(API.HOME, { showLoader }),
  getRecommendedProducts: (showLoader = false) =>
    axiosInstance.get(API.GETRECOMMENDEDPRODUCTS, { showLoader }),
  getCategory: () => axiosInstance.get(API.CATEGORY, { showLoader: false }),
  getHomeBlogData: () =>
    axiosInstance.get(API.BLOG_HOME, { showLoader: false }),
  getSubCategory: (data) =>
    axiosInstance.post(API.SUB_CATEGORY, data, { showLoader: false }),
  getProduct: (data, showLoader = false) =>
    axiosInstance.post(API.PRODUCTS, data, { showLoader }),
  getFilter: (data, showLoader = false) =>
    axiosInstance.post(API.FILTER, data, { showLoader }),
  getProductDetails: (params, showLoader = false) =>
    axiosInstance.get(API.PRODUCT_DETAILS, {
      params: params,
      showLoader: false,
    }),
  getNewProductsApi: (showLoader = false) =>
    axiosInstance.get(API.NEW_PRODUCTS, { showLoader }),
  getBundleProductItemApi: (data, showLoader = false) =>
    axiosInstance.post(API.GET_BUNDLE_PRODUCTS_ITEM, data, {
      showLoader: false,
    }),
  getBundleProductApi: (data, showLoader = true) =>
    axiosInstance.post(API.GET_BUNDLE_PRODUCTS, data, {
      showLoader: showLoader,
    }),
  getSimilarProductApi: (data, showLoader = false) =>
    axiosInstance.get(API.GET_SIMILAR_PRODUCT, {
      params: data,
      showLoader: showLoader,
    }),
  getGridProductsApi: () =>
    axiosInstance.get(API.GRID_PRODUCTS, {
      showLoader: false,
    }),
};
