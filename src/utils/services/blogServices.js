import axiosInstance from "./Client";
import API from "./Endpoints";

export const blogApi = {
  getBlog: async (data) => {
    return await axiosInstance.post(API.BLOG_SEARCH, data, {
      showLoader: false,
    });
  },

  getBlogDetails: async (data) => {
    return await axiosInstance.post(API.BLOG_DETAILS, data, {
      showLoader: false,
    });
  },

  addBlogCommentApi: async (data) => {
    return await axiosInstance.post(API.ADD_BLOG_COMMENT, data);
  },
};
