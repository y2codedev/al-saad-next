import axiosInstance from "./Client";
import API from "./Endpoints";

const ratingApi = {
  addRating: (data) => {
    return axiosInstance.post(API.ADD_RATING, data, { showLoader: false });
  },
  getRatingReviewDetails: (data) => {
    return axiosInstance.post(API.GET_RATING_REVIEW_DETAIL, data, {
      showLoader: true,
    });
  },
  editRatingReviews: (data) => {
    return axiosInstance.post(API.UPDATE_RATING_REVIEW, data, {
      showLoader: false,
    });
  },
  deletePhoto: (data) => {
    return axiosInstance.post(API.DELETE_REVIEW_RATING_PHOTO, data, {
      showLoader: true,
    });
  },
  getRatingReview: (data) => {
    return axiosInstance.post(API.GET_REVIEW_LIST, data, { showLoader: false });
  },
  likeRating: (data) => {
    return axiosInstance.post(API.LIKE_REVIEW, data, { showLoader: false });
  },
};

export default ratingApi;
