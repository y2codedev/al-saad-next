import axiosInstance from "./Client";
import API from "./Endpoints";

export const shippingApi = {
  addShippingAddress: (data) => {
    return axiosInstance.post(API.ADD_SHIPPING_ADDRESS, data, {
      showLoader: false,
    });
  },
  getCountry: () => {
    return axiosInstance.get(API.COUNTRY, { showLoader: false });
  },
  getCity: (data) => {
    return axiosInstance.post(API.CITY, data, { showLoader: false });
  },
  getArea: (data, showLoader = false) => {
    return axiosInstance.post(API.AREA, data, {
      showLoader: showLoader,
    });
  },
  getShippingAddress: (data) => {
    return axiosInstance.get(API.SHIPPING_ADDRESS, { showLoader: false, data });
  },
  getShippingAddressById: (data) => {
    return axiosInstance.post(API.SHIPPING_ADDRESS_BY_ID, data, {
      showLoader: false,
    });
  },
  deleteShippingAddress: (data) => {
    return axiosInstance.post(API.DELETE_SHIPPING_ADDRESS, data);
  },
  updateShippingAddress: (data) => {
    return axiosInstance.post(API.UPDATE_SHIPPING_ADDRESS, data, {
      showLoader: false,
    });
  },
  getCountryCode: () => {
    return axiosInstance.get(API.COUNTRY, { showLoader: false });
  },
  checkDeliveryAddress: (data) => {
    return axiosInstance.post(API.CHECK_SHIPPING_APPLICALE, data, {
      showLoader: false,
    });
  },
  placeOrderTemp: (data) => {
    return axiosInstance.post(API.PLACE_ORDER_TEMP, data, {
      showLoader: false,
    });
  },
  payByCard: (url, data) => {
    return axiosInstance.post(url, data, { showLoader: false });
  },
  successPayment: (url = API.PAYMENT_VALIDATE, data) => {
    return axiosInstance.post(url, {}, { params: data });
  },

  getStoreLoactions: () => {
    return axiosInstance.get(API.STORE_LOACTION, { showLoader: false });
  },
};
