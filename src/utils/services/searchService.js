import axiosInstance from "./Client";
import API from "./Endpoints";

export const searchApi = {
  getSearchData: (title, showLoader = false) => {
    return axiosInstance.post(API.PRODUCTS, { title }, { showLoader });
  },
  getAutoSuggetions: (data, showLoader = false) => {
    return axiosInstance.get(API.AUTOCOMPLETE, { params: data, showLoader });
  },
};
