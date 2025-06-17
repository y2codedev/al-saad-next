"use client";

import React from "react";
import Slider from "react-slick";
import { Box, useMediaQuery, useTheme } from "@mui/material";

import {
  StyledContainer,
  CarouselWrapper,
  ImageWrapper,
  StyledTypography,
} from "../styles";
import TopSliderShimmer from "../skeleton/TopSliderShimmer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { SampleNextArrow, SamplePrevArrow } from "@/components/SliderArrows";

const TopSlider = ({ topSlider, isLoading }) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  const size = matchesSM ? 70 : 97;
  const borderRadius = matchesSM ? "8px" : "50%";
  const params = useParams();
  const isRtl = params.locale === "ar";

  if (isLoading) {
    return <TopSliderShimmer />;
  }

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: matchesSM ? 4 : 10,
    slidesToScroll: 3,
    rtl: isRtl,
    arrows: !matchesSM,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 8,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 6,
        },
      },
      {
        breakpoint: 464,
        settings: {
          slidesToShow: 4,
        },
      },
    ],
  };

  return (
    <StyledContainer>
      <CarouselWrapper marginTop="16px">
        {!matchesSM ? (
          <Slider {...settings}>
            {topSlider?.map((item) => (
              <Link
                locale={params.locale}
                href={`category/${item?.slug}`}
                key={item?.id}
                draggable={false}
                className="group"
              >
                <ImageWrapper>
                  <div
                    style={{
                      width: size,
                      height: size,
                      borderRadius,
                      overflow: "hidden",
                      position: "relative",
                      flexShrink: 0,
                    }}
                    className="border-[3px] border-[#cfe9f6] group-hover:border-[#bb1f2a] transition-colors duration-200"
                  >
                    <Image
                      src={item?.image}
                      alt={item?.name}
                      fill
                      style={{
                        objectFit: "cover",
                        borderRadius,
                      }}
                      quality={80}
                      draggable={false}
                    />
                  </div>
                  <StyledTypography
                    className="group-hover:text-[#bb1f2a] transition-colors duration-200"
                    style={{ margin: "10px" }}
                  >
                    {item?.name}
                  </StyledTypography>
                </ImageWrapper>
              </Link>
            ))}
          </Slider>
        ) :
          (<Box className="flex overflow-x-auto space-x-2">
            {topSlider.map((item, index) => {
              return (
                <Box
                  key={index}
                  className="shrink-0"
                  sx={{ width: { xs: '23%', } }}
                >
                  <Link
                    draggable={false}
                    key={item?.id}
                    locale={params.locale}
                    href={`category/${item?.slug}`}
                    sx={{ textDecoration: "none", color: "#292b2c" }}
                  >
                    <ImageWrapper>
                      <div
                        style={{
                          width: size,
                          height: size,
                          borderRadius,
                          overflow: "hidden",
                          position: "relative",
                          flexShrink: 0,
                        }}
                        className="border-[3px] border-[#cfe9f6] group-hover:border-[#bb1f2a] transition-colors duration-200"
                      >
                        <Image
                          src={item?.image}
                          alt={item?.name}
                          fill
                          style={{
                            objectFit: "cover",
                            borderRadius,
                          }}
                          quality={80}
                          draggable={false}
                        />
                      </div>
                      <StyledTypography
                        className="group-hover:text-[#bb1f2a] transition-colors duration-200"
                        style={{ margin: "10px" }}
                      >
                        {item?.name}
                      </StyledTypography>
                    </ImageWrapper>
                  </Link>
                </Box>
              );
            })}
          </Box>)}
      </CarouselWrapper>
    </StyledContainer>
  );
};

export default TopSlider;
