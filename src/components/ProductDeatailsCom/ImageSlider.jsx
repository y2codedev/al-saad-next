import { Box, CardMedia } from "@mui/material";
import React from "react";
import Carousel from "react-multi-carousel";

const ImageSlider = ({ imageSlider, selectedImage, setSelectedImage }) => {
  return (
    <>
      <Box sx={{ width: "100%", position: "relative", mt: 2 }}>
        <Carousel
          additionalTransfrom={0}
          autoPlaySpeed={3000}
          renderButtonGroupOutside
          arrows={true}
          draggable={true}
          infinite={true}
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 3,
            },
            laptop: {
              breakpoint: { max: 1024, min: 768 },
              items: 3,
            },
            tablet: {
              breakpoint: { max: 768, min: 464 },
              items: 3,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 2,
            },
          }}
          showDots={false}
          slidesToSlide={3}
          swipeable={true}
        >
          {imageSlider &&
            imageSlider.map((img, idx) => (
              <Box sx={{ px: 1 }} key={idx}>
                <CardMedia
                  component="img"
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  onClick={() => setSelectedImage(img.src)}
                  sx={{
                    width: { sm: "170px", xs: "100%" },
                    height: { sm: "110px", xs: "80px" },
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      selectedImage === img.src
                        ? "2px solid #bb1f2a"
                        : "1px solid gray",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            ))}
        </Carousel>
      </Box>
    </>
  );
};

export default ImageSlider;
