import axiosInstance from "./Client";
import API from "./Endpoints";

export const userService = {
  signIn: (data) => {
    return axiosInstance.post(API.LOGIN, data, { showLoader: false });
  },

  logout: () => {
    return axiosInstance.post(API.LOGOUT, { showLoader: false });
  },

  forgotPassword: (data) => {
    return axiosInstance.post(API.FORGOTPASSWORD, data, { showLoader: false });
  },

  // resetPassword: (params) => {
  //   return axiosInstance.post(API.CHANGE_PASSWORD, params);
  // },

  home: (params, config = { showLoader: true }) => {
    return axiosInstance.post(API.HOME, params, config);
  },

  profile: (data, config = { showLoader: true }) => {
    return axiosInstance.post(API.PROFILE, data, config);
  },

  editProfile: (data) => {
    return axiosInstance.post(API.UPDATE_PROFILE, data, { showLoader: false });
  },

  changePassword: (data) => {
    return axiosInstance.post(API.CHANGE_PASSWORD, data, { showLoader: false });
  },

  signUp: (data) => {
    return axiosInstance.post(API.REGISTER, data, { showLoader: false });
  },
  socialLogin: (data) => {
    return axiosInstance.post(API.SOCIAL_LOGIN, data);
  },
  sendOtp: (data) => {
    return axiosInstance.post(API.SendOtp, data, { showLoader: false });
  },
  verifyOtp: (data) => {
    return axiosInstance.post(API.OTP_VERIFY, data, { showLoader: false });
  },
  verifyMobile: (data) => {
    return axiosInstance.post(API.MOBILE_VERIFY, data, { showLoader: false });
  },
  updateUserProfile: (data) => {
    return axiosInstance.post(API.UPDATE_PROFILE, data, { showLoader: false });
  },
  updateProfileImage: (data) => {
    return axiosInstance.post(API.UPDATE_PROFILE_PHOTO, data, {
      showLoader: false,
    });
  },
  getUserById: async (data) => {
    return await axiosInstance.post(API.GET_USER_BY_ID, data);
  },
  resetPassword: (params) => {
    return axiosInstance.post(API.RESET_PASSWORD, params, {
      showLoader: false,
    });
  },
  checkUser: async (data) => {
    return await axiosInstance.post(API.IS_REGISTERED_USER, data, {
      showLoader: false,
    });
  },
};
