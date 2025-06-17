import axiosInstance from "./Client";
import API from "./Endpoints";

export const giftApi = {
  getGiftList: () => {
    return axiosInstance.get(API.GET_GIFT_LIST, { showLoader: false });
  },
  getGiftMaker: (gift_receiver_name, gift_sender_name, gift_message) => {
    return axiosInstance.get("https://staging.alsaadhome.com/gift-maker", {
      params: {
        gift_receiver_name,
        gift_sender_name,
        gift_message,
      },
      headers: {
        Accept: "application/json",
      },
      showLoader: false,
    });
  },
};
