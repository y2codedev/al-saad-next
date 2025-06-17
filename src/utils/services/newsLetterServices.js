import axiosInstance from "./Client";
import API from "./Endpoints";

export const newsLetterApi = {
  newsLetter: (data, showLoader = false) => {
    return axiosInstance.post(API.SUBSCRIBE_NEWSLETTER, data, { showLoader });
  },
};
