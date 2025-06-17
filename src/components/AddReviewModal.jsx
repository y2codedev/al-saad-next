"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Modal,
  CircularProgress,
  Container,
} from "@mui/material";
import Rating from "react-rating";
import CloseIcon from "@mui/icons-material/Close";
import { MdCloudUpload } from "react-icons/md";
import { useFormik } from "formik";
import * as Yup from "yup";
import ratingApi from "@/utils/services/ratingServices";
import { showToast } from "@/utils/helper";
import { useTranslations } from "next-intl";
import { Star, StarBorder } from "@mui/icons-material";
import { useParams } from "next/navigation";
import COLORS from "@/utils/colors";

const AddReviewModal = ({ open, setOpen, orderId, ratingId, onAdd, index }) => {
  const fileInputRef = useRef(null);
  const t = useTranslations();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const createFormData = (values, ratingId = null) => {
    const formData = new FormData();
    formData.append("rating", values.rating);
    formData.append("headline", values.headline);
    formData.append("review", values.review);
    formData.append("order_item_id", orderId);
    formData.append("item_type", "normal");
    if (ratingId?.product_variant_id) {
      formData.append("product_variant_id", ratingId.product_variant_id);
    }
    if (ratingId?.rating_id) {
      formData.append("rating_review_id", ratingId.rating_id);
    }
    values.images.forEach((file, index) =>
      formData.append(`images[${index}]`, file),
    );
    return formData;
  };

  const formik = useFormik({
    initialValues: {
      rating: 0,
      headline: "",
      review: "",
      images: [],
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Please select a rating")
        .required("Rating is required"),
      headline: Yup.string()
        .max(25, "Maximum 25 characters")
        .required("Headline is required"),
      review: Yup.string()
        .max(250, "Maximum 250 characters")
        .required("Review is required"),
      images: Yup.array().max(5, "You can only upload up to 5 images"),
    }),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        let response;
        if (ratingId?.rating_id) {
          response = await editRatingReviewDetails(values);
        } else {
          const formData = createFormData(values);
          response = await ratingApi.addRating(formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          onAdd && onAdd(index, response?.data?.rating_id);
        }
        if (response?.status === 200) {
          formik.resetForm();
          if (response?.message) {
            showToast("success", response?.message);
          }
          setOpen();
        } else {
          showToast(
            "error",
            response?.data?.message || "Failed to submit review.",
          );
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        showToast("error", "Something went wrong while submitting the review.");
      } finally {
        setLoading(false);
      }
    },
  });

  const handleRatingClick = (value) => {
    formik.setFieldValue("rating", formik.values.rating === value ? 0 : value);
  };

  const handleFileChange = (e) => {
    let allFiles = [...formik.values.images];
    const selectedFiles = Array.from(e.target.files);

    if (allFiles.length + selectedFiles.length > 5) {
      showToast("error", "You can only select up to 5 images!");
      allFiles = [...allFiles, ...selectedFiles].slice(0, 5);
    } else {
      allFiles = [...allFiles, ...selectedFiles];
    }

    formik.setFieldValue("images", allFiles);
  };

  const handleRemoveImage = (imageURL, id) => {
    if (id) {
      deleteUploadedPhoto(id);
    } else {
      formik.setFieldValue(
        "images",
        formik.values.images.filter((image) => image !== imageURL),
      );
    }
  };

  useEffect(() => {
    getRatingReviewDetails();
    return () => {};
  }, [ratingId]);

  const getRatingReviewDetails = async () => {
    if (!ratingId?.rating_id && !open) return;
    try {
      const reqBody = {
        rating_id: ratingId.rating_id,
      };
      const res = await ratingApi.getRatingReviewDetails(reqBody);
      if (res && res.status === 200) {
        formik.setFieldValue("rating", res.data.rating);
        formik.setFieldValue("headline", res.data.headline);
        formik.setFieldValue("review", res.data.review);
        formik.setFieldValue("images", res.data.image || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUploadedPhoto = async (id) => {
    if (!id) return;
    try {
      let formData = new FormData();
      formData.append("rating_review_photo_id[]", id);
      const res = await ratingApi.deletePhoto(formData);
      if (res && res.status === 200) {
        showToast(
          "success",
          res?.data?.message || "Photo deleted successfully!",
        );
        formik.setFieldValue(
          "images",
          formik.values.images.filter((image) => image.id !== id),
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(formik.errors);

  const editRatingReviewDetails = async () => {
    if (!ratingId?.rating_id && !open) return;
    try {
      let { values } = formik;
      const formdata = new FormData();
      formdata.append("rating", values.rating);
      formdata.append("headline", values.headline);
      formdata.append("review", values.review);
      formdata.append("order_item_id", orderId);
      formdata.append("item_type", "normal");
      formdata.append("product_variant_id", ratingId?.product_variant_id);
      formdata.append("rating_review_id", ratingId?.rating_id);
      values.images
        .filter((file) => !file?.id)
        .forEach((file, index) => {
          formdata.append(`images[${index}]`, file);
        });
      const res = await ratingApi.editRatingReviews(formdata);
      if (res && res.status === 200) {
        return res;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal open={open} onClose={() => setOpen()} disableScrollLock>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "rgba(0, 0, 0, 0.5)",
          px: 2,
        }}
      >
        <Container
          maxWidth="xs"
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 2,
            borderRadius: 1,
            maxWidth: "400px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "600" }}>
              {t("add_a_review")}
            </Typography>
            <IconButton onClick={() => setOpen()}>
              <CloseIcon />
            </IconButton>
          </Box>

          <form onSubmit={formik.handleSubmit}>
            <Rating
              direction={params.locale === "ar" ? "rtl" : "ltr"}
              initialRating={formik.values.rating}
              onChange={(value) => handleRatingClick(value)}
              emptySymbol={
                <StarBorder style={{ color: "#687188", fontSize: "28px" }} />
              }
              fullSymbol={
                <Star style={{ color: COLORS.primary, fontSize: "28px" }} />
              }
              style={{}}
            />
            <Box sx={{ display: "flex", mb: 1 }}></Box>
            <TextField
              placeholder="Headline"
              name="headline"
              fullWidth
              variant="outlined"
              value={formik.values.headline}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 25 }}
              sx={{ mb: 4 }}
              error={formik.touched.headline && Boolean(formik.errors.headline)}
              helperText={formik.touched.headline && formik.errors.headline}
            />

            <TextField
              placeholder="Your review"
              name="review"
              fullWidth
              rows={4}
              variant="outlined"
              value={formik.values.review}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              inputProps={{ maxLength: 250 }}
              error={formik.touched.review && Boolean(formik.errors.review)}
              helperText={formik.touched.review && formik.errors.review}
              multiline
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  height: "unset !important",
                },
              }}
            />

            <Typography variant="body1" mb={1}>
              {t("upload_image")}
            </Typography>
            <Box
              sx={{
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                minHeight: "125px",
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (formik.values.images.length < 5) {
                  fileInputRef.current.click();
                }
              }}
            >
              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                maxLength={5}
              />
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                {formik.values.images.map((image, index) => {
                  const imageUrl = image?.id
                    ? image.link
                    : URL.createObjectURL(image);
                  return (
                    <Box key={index} sx={{ position: "relative" }}>
                      <img
                        src={imageUrl}
                        alt="Selected"
                        style={{ width: 50, height: 50, objectFit: "cover" }}
                      />
                      <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(image, image?.id);
                        }}
                        sx={{
                          position: "absolute",
                          top: "-18px",
                          right: "-4px",
                          borderRadius: "50%",
                          border: "1px solid #ddd",
                          p: 0,
                        }}
                      >
                        <CloseIcon sx={{ color: "#777", fontSize: "15px" }} />
                      </IconButton>
                    </Box>
                  );
                })}
              </Box>
              <Box
                fullWidth
                sx={{
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#777",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <MdCloudUpload color="#777" size={24} />{" "}
                <span>{t("upload_image")}</span>
              </Box>
            </Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2, backgroundColor: "#bb1f2a" }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="#bb1f2a" size={24} />
              ) : (
                t("submit_review")
              )}
            </Button>
          </form>
        </Container>
      </Box>
    </Modal>
  );
};

export default AddReviewModal;
