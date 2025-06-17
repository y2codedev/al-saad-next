import React, { useState } from "react";
import {
  Box,
  Grid,
  Rating,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Pagination,
  styled,
  PaginationItem,
} from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import Gallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import {
  Close,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Star,
  StarBorder,
} from "@mui/icons-material";
import BoltIcon from "@mui/icons-material/Bolt";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

const ReviewItem = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  border: "1px solid #ddd",
  borderRadius: 2,
  padding: theme.spacing(2),
  height: "100%",
  boxSizing: "border-box",
  m: 2,
  minHeight: "250px",
  gap: 2,
}));

const ReviewHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(2),
}));

const ReviewDetails = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: theme.spacing(1),
  marginTop: theme.spacing(1),
}));

const ReviewSection = ({
  reviews,
  handleLike,
  totalPages,
  currentPage,
  setCurrentPage,
  onPageChange,
}) => {
  const params = useParams();
  const [open, setOpen] = useState(false);
  const t = useTranslations();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);

  const openGalleryPopup = (images) => {
    setGalleryImages(
      images?.map((image) => ({
        original: image.link,
        thumbnail: image.link,
        description: image.description || "",
      })),
    );
    setIsPopupOpen(true);
  };

  const closeGalleryPopup = () => {
    setIsPopupOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    if (onPageChange) {
      onPageChange(value);
    }
  };

  const carouselSettings = {
    responsive: {
      desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 3,
        slidesToScroll: 1,
      },
      tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2,
        slidesToScroll: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
        slidesToScroll: 1,
      },
    },
    infinite: true,
    autoPlay: false,
    autoPlaySpeed: 3000,
    keyBoardControl: true,
    customTransition: "all 0.5s",
    transitionDuration: 500,
  };

  return (
    <>
      <Box sx={{ mt: 4, width: "100%" }}>
        {reviews && reviews.length > 0 && (
          <Box
            sx={{
              px: { xs: 2, sm: 0 },
              my: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "18px", sm: "24px" },
                color: "#333",
              }}
            >
              {t("review_rating")}
            </Typography>
            {reviews.length > 5 && (
              <Typography
                onClick={handleOpen}
                variant="h6"
                sx={{
                  color: "#bb1f2a",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <BoltIcon />
                {t("view_all")}
              </Typography>
            )}
          </Box>
        )}

        <Carousel {...carouselSettings}>
          {reviews?.map((review, index) => (
            <div key={review.id} style={{ marginRight: 10 }}>
              <ReviewItem>
                <ReviewHeader>
                  <Avatar
                    src={review.customer_photo}
                    alt={review.customer_name}
                    sx={{ width: 40, height: 40, mr: 2, objectFit: "cover" }}
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
                      {review.customer_name}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: "right" }}>
                    <Rating
                      emptyIcon={
                        <StarBorder
                          style={{ opacity: 1, color: "#687188" }}
                          className="muiRatingIcon"
                          fontSize="inherit"
                        />
                      }
                      icon={
                        <Star style={{ color: "#bb1f2a" }} fontSize="inherit" />
                      }
                      value={parseFloat(review.rating)}
                      precision={0.5}
                      readOnly
                      style={{ color: "#bb1f2a" }}
                    />
                    <ReviewDetails>
                      <ThumbUpOffAltIcon
                        onClick={() => handleLike(review?.id, index)}
                        sx={{
                          textAlign: "right",
                          cursor: "pointer",
                          color: review.is_like ? "#bb1f2a" : "none",
                        }}
                      />
                      <Typography sx={{ textAlign: "right" }}>
                        {review.total_likes}
                      </Typography>
                    </ReviewDetails>
                  </Box>
                </ReviewHeader>

                <Typography
                  variant="body2"
                  sx={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    maxHeight: "calc(2 * 1.5 * 14px)",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    minHeight: "calc(2 * 1.5 * 14px)",
                  }}
                >
                  {review.headline}
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <Typography
                    variant="body2"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      maxHeight: "calc(4 * 1.5 * 14px)",
                      fontSize: "14px",
                      lineHeight: 1.5,
                      flex: 1,
                    }}
                  >
                    {review.review || ""}
                  </Typography>
                  {review?.image?.length > 0 && (
                    <div
                      key={review?.image[0]?.link}
                      onClick={() => setOpen(true)}
                    >
                      <img
                        src={review?.image[0]?.link}
                        alt={`Review Image`}
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                          margin: "5px",
                        }}
                      />
                    </div>
                  )}
                </Box>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2, textAlign: "right" }}
                >
                  {review.created_at}
                </Typography>
              </ReviewItem>
            </div>
          ))}
        </Carousel>
      </Box>
      {/* "View All" Modal */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        disableScrollLock
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>{t("review_rating")}</span>
          <IconButton
            onClick={() => {
              setOpen(false);
            }}
            edge="end"
            color="inherit"
            aria-label="close"
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box>
            {reviews.length > 0 &&
              reviews?.map((review, index) => (
                <Grid
                  key={review.id}
                  size={{
                    xs: 12,
                    sm: 6,
                    md: 4,
                  }}
                >
                  <Box>
                    <ReviewHeader>
                      <Avatar
                        src={review.customer_photo}
                        alt={review.customer_name}
                        sx={{
                          width: 40,
                          height: 40,
                          mr: 2,
                          objectFit: "cover",
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="body1"
                          sx={{ fontWeight: 600, textTransform: "capitalize" }}
                        >
                          {review.customer_name}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Rating
                          emptyIcon={
                            <StarBorder
                              style={{ opacity: 1, color: "#687188" }}
                              className="muiRatingIcon"
                              fontSize="inherit"
                            />
                          }
                          icon={
                            <Star
                              style={{ color: "#bb1f2a" }}
                              fontSize="inherit"
                            />
                          }
                          value={parseFloat(review.rating)}
                          precision={0.5}
                          readOnly
                          style={{ color: "#bb1f2a" }}
                        />
                        <ReviewDetails>
                          <ThumbUpOffAltIcon
                            onClick={() => handleLike(review.id, index)}
                            sx={{
                              textAlign: "right",
                              cursor: "pointer",
                              color: review.is_like ? "#bb1f2a" : "none",
                            }}
                          />
                          <Typography sx={{ textAlign: "right" }}>
                            {review.total_likes}
                          </Typography>
                        </ReviewDetails>
                      </Box>
                    </ReviewHeader>

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    >
                      {review.headline || ""}
                    </Typography>
                    <Box
                      sx={{ display: "flex", alignItems: "flex-start", mt: 1 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize", flex: 1 }}
                      >
                        {review.review}
                      </Typography>
                      {review?.image?.length > 0 && (
                        <div
                          key={review?.image[0].link}
                          onClick={() => {
                            openGalleryPopup(review?.image);
                          }}
                        >
                          <img
                            src={review?.image[0]?.link}
                            alt={`Review Image`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              margin: "5px",
                            }}
                          />
                        </div>
                      )}
                    </Box>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 2, textAlign: "right" }}
                    >
                      {review.created_at}
                    </Typography>
                  </Box>
                </Grid>
              ))}
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px 0",
          }}
        >
          {Math.ceil(totalPages / 20) > 1 && (
            <Pagination
              variant="outlined"
              count={Math.ceil(totalPages / 20)}
              page={currentPage}
              onChange={handlePageChange}
              color="red"
              shape="rounded"
              renderItem={(item) => (
                <PaginationItem
                  components={{
                    previous: (props) => (
                      <KeyboardArrowLeft
                        {...props}
                        sx={{
                          transform:
                            params.locale === "ar" ? "rotate(180deg)" : "none",
                        }}
                      />
                    ),
                    next: (props) => (
                      <KeyboardArrowRight
                        {...props}
                        sx={{
                          transform:
                            params.locale === "ar" ? "rotate(180deg)" : "none",
                        }}
                      />
                    ),
                  }}
                  {...item}
                />
              )}
            />
          )}
        </DialogActions>
        <Dialog
          open={isPopupOpen}
          onClose={closeGalleryPopup}
          fullWidth
          maxWidth="md"
          disableScrollLock
        >
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{t("image_gallery")}</span>
            <IconButton
              onClick={closeGalleryPopup}
              edge="end"
              color="inherit"
              aria-label="close"
            >
              <Close />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Gallery items={galleryImages} />
          </DialogContent>
        </Dialog>
      </Dialog>
    </>
  );
};

export default ReviewSection;
