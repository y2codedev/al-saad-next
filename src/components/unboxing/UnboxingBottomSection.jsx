"use client";

import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import {
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Dialog,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import YouTube from "react-youtube";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import parse from "html-react-parser";
import { useLanguageStore } from "@/store/useLanguageStore";
import CustomButtonGroup from "@/components/CustomButtonGroup";
import Image from "next/image";

const UnboxingBottomSection = ({ data }) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  const [isOpen, setOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const isRTL = useLanguageStore.getState().language === "ar";

  const handleOpen = (youtubeId) => {
    if (youtubeId) {
      setSelectedVideo(youtubeId);
      setOpen(true);
    }
  };

  const carouselResponsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
    laptop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 3 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
  };

  const renderCarousel = (item) => (
    <Box sx={{ width: "100%", position: "relative", my: 3 }} key={item?.id}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, px: "10px" }}>
        {item?.video_title}
      </Typography>
      <Typography
        variant="body2"
        sx={{ lineHeight: "24px", color: "#687188", mb: 1, px: "10px" }}
      >
        {item?.video_sub_title}
      </Typography>
      <Box sx={{ py: 0 }}>
        <Carousel
          additionalTransfrom={0}
          autoPlaySpeed={3000}
          renderButtonGroupOutside
          arrows={false}
          draggable
          infinite
          responsive={carouselResponsive}
          showDots={false}
          slidesToSlide={1}
          swipeable
          customButtonGroup={
            item?.video_image?.length > 4 && !matchesSM ? (
              <CustomButtonGroup top="48%" left="-45px" />
            ) : null
          }
          rtl={isRTL}
        >
          {item?.video_image?.map(
            (image, index) => (
              console.log(image, "image"),
              (
                <Box
                  key={index}
                  onClick={() => handleOpen(image?.video_id)}
                  sx={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: image?.video_id ? "pointer" : "default",
                    width: matchesSM ? "90%" : "100%",
                    height: { xs: "110px", sm: "220px" },
                    padding: "10px",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <Image
                      src={image?.url}
                      fill={true}
                      alt="Video/Image Thumbnail"
                      className="object-cover w-full h-full"
                      loading="lazy"
                      sizes="100vw"
                    />
                  </div>

                  {image?.video_id && (
                    <PlayCircleOutlineIcon
                      sx={{
                        position: "absolute",
                        fontSize: "50px",
                        color: "white",
                        opacity: 0.8,
                        zIndex: 2,
                      }}
                    />
                  )}
                </Box>
              )
            ),
          )}
        </Carousel>
      </Box>
      <Typography
        sx={{ lineHeight: "24px", color: "#687188", pb: 5, fontSize: "16px" }}
      >
        {parse(item?.video_description)}
      </Typography>
    </Box>
  );

  return (
    <div>
      {data?.video_image_data?.map((item) => renderCarousel(item))}
      <Dialog
        disableScrollLock
        open={isOpen}
        onClose={() => setOpen(false)}
        maxWidth="md"
      >
        <IconButton
          onClick={() => setOpen(false)}
          sx={{ position: "absolute", top: 10, right: 10, zIndex: 9999 }}
        >
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "black",
          }}
        >
          {selectedVideo && (
            <YouTube
              videoId={selectedVideo}
              opts={{
                height: "400px",
                width: "640px",
                playerVars: { autoplay: 0, mute: 0 },
              }}
            />
          )}
        </Box>
      </Dialog>
    </div>
  );
};

export default UnboxingBottomSection;
