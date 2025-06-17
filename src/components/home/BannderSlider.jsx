import React from "react";
import Carousel from "react-multi-carousel";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "@/i18n/navigation";
import BannerSliderShimmer from "../skeleton/BannerShimmer";
import Image from "next/image";
import 'react-multi-carousel/lib/styles.css';
const BannerSlider = ({ BannderSliderData, isLoading }) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  if (isLoading) {
    return <BannerSliderShimmer />;
  }

  return (
    <Box sx={{ width: "100%", mb: { xs: 2, sm: 4 }, mt: { xs: 0, sm: 2 } }}>
      <Box sx={{ width: "100%" }}>
        <Carousel
          additionalTransfrom={0}
          autoPlaySpeed={3000}
          renderButtonGroupOutside
          // customDot={<CustomDot />}
          arrows={false}
          draggable
          infinite
          responsive={{
            desktop: {
              breakpoint: { max: 3000, min: 1024 },
              items: 1,
            },
            laptop: {
              breakpoint: { max: 1024, min: 768 },
              items: 1,
            },
            tablet: {
              breakpoint: { max: 768, min: 464 },
              items: 1,
            },
            mobile: {
              breakpoint: { max: 464, min: 0 },
              items: 1,
            },
          }}
          showDots={true}
          slidesToSlide={1}
          swipeable
        >
          {BannderSliderData?.length > 0 &&
            BannderSliderData?.map((item) => (
              <Link
                href={`search/display_banners/${item?.id}`}
                sx={{ textDecoration: "none", color: "#292b2c" }}
                color="primary"
              >
                <div className="h-[200px] sm:h-[600px] w-full object-cover">
                  <Image
                    style={{ objectFit: "cover" }}
                    src={item?.image}
                    fill={true}
                    alt={`BannerSlide-${item?.banner_name}`}
                    quality={80}
                  />
                </div>
                {/* <Box
                  component={"img"}
                  draggable="false"
                  src={item?.image}
                  loading="lazy"
                  alt={`BannerSlide-${item?.banner_name}`}
                  sx={{
                    width: "100%",
                    height: matchesSM ? "200px" : "600px",
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                /> */}
              </Link>
            ))}
        </Carousel>
      </Box>
    </Box>
  );
};

export default BannerSlider;
