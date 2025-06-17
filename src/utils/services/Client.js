import axios from "axios";
import useLoaderStore from "@/store/loaderStore";
import { showToast } from "@/utils/helper";
import useUserStore from "@/store/user";
import moment from "moment";
import { useLanguageStore } from "@/store/useLanguageStore";

export const checkNetworkConnectivity = async () => {
  try {
    return window.navigator.onLine;
  } catch (error) {
    console.error("Error checking network connectivity:", error);
    return false;
  }
};

const axiosInstance = axios.create({
  // baseURL: "https://api.alsaapp.com/api/v25/",
  // https://staging.alsaadhome.com/gift-maker
  // baseURL: "https://77d1-2401-4900-1c1b-2c56-3dbe-e9c6-15db-f311.ngrok-free.app/api/v25/",
  baseURL: "https://stagingapp.alsaadhome.com/api/v25/",

  headers: {
    Accept: "application/json",
    lng: "en",
    type: "online",
    "country-id": 2,
    currency: "aed",
    "retailer-id": "1",
    "ngrok-skip-browser-warning": true,
    Authorization: "gUmwgu9OVfXE9LVCaAU8xw74CownYWQ0HIfFGvWw",
    "device-type": "web",
    token:
      "KMETvUfeIgQB3m/bvmvhdkwLMrGMiBZnLUwiNMTEObuJZbiuAvro/KRRyAmFcpDEkgWlTi9jB0+lXugmGtck8mVQ8e6+qWYlQ3lInnJE2cYv1nsBm9vaf7JBQsKIjcdG7TxnM7FuPmWUTQklf0KT3cVPoSy8fNK5K1gbGpfUO91+6uqxSycc5vYU8WEl82zfZ+7/uWVPbGRqAJBiUhlm8UXOJjOPolu2WESsW/eNNGkJd/tPKNGgRyIEPWjBhXqBYuEDrlmHucQQ2AIxj4pZky8g39YC3FlcuP+apiOKFLZtjVyXQ/rZbnZA4e2bmj7BRGxNTorAM+3ejmekq6Vz7A==",
  },
});

// Fetch user info from localStorage if not in store
const getUserInfo = () => {
  if (typeof window === "undefined") return null;
  const userStore = useUserStore.getState();
  if (userStore?.userInfo) {
    return userStore.userInfo;
  }

  const userFromLocalStorage = localStorage.getItem("USER");
  return userFromLocalStorage ? JSON.parse(userFromLocalStorage) : null;
};

axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const { setIsLoading } = useLoaderStore.getState();
      if (config?.showLoader != false) setIsLoading(true);

      const userInfo = getUserInfo();
      const isAvailable = await checkNetworkConnectivity();
      if (!isAvailable) showToast("error", "No internet connection");

      if (config.method === "get") {
        config.params = { ...config.params, timeStamp: Date.now() };
      }
      
      if (userInfo?.token) {
        config.headers["Authorization"] = `Bearer ${userInfo.token}`;
      }

      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      }
      const [lng, currencyFromURL] = window.location.pathname
        .split("/")
        .filter(Boolean);

      if (lng) config.headers["lng"] = lng;

      // ✅ Priority 1: From URL
      if (currencyFromURL) {
        const currency = currencyFromURL.toLowerCase();
        config.headers["currency"] = currency.toUpperCase();

        const countryId = currency.includes("aed")
          ? 2
          : currency.includes("omr")
            ? 1
            : 5;

        config.headers["country-id"] = countryId;
      } else {
        const selectedCountry = useLanguageStore.getState().selectedCountry;

        if (selectedCountry?.id && selectedCountry?.currencyCode) {
          config.headers["country-id"] = selectedCountry.id;
          config.headers["currency"] =
            selectedCountry.currencyCode.toUpperCase();
        } else {
          config.headers["country-id"] = 2;
          config.headers["currency"] = "AED";
        }
      }
      return config;
    } catch (error) {
      console.error("Request Interceptor Error:", error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => {
    useLoaderStore.getState().setIsLoading(false);
    if (response?.data?.status === 401) {
      const userStore = useUserStore.getState();
      userStore.logout();
      // window.location.href = "/";
    }
    return response.data;
  },
  (error) => {
    useLoaderStore.getState().setIsLoading(false);
    if (error.response?.status === 401) {
      const userStore = useUserStore.getState();
      userStore.logout();
      // window.location.href = "/";
    } else {
      // showToast("error", error.response?.data?.message);
    }
    return Promise.reject(error.response?.data);
  },
);

export default axiosInstance;
