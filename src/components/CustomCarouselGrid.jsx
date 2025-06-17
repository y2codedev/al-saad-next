import React from "react";
import Slider from "react-slick";
import { Box, IconButton } from "@mui/material";
import { Close, ChevronLeft, ChevronRight } from "@mui/icons-material";
import Image from "next/image";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import COLORS from "@/utils/colors";

// Custom Arrow Component
function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      //   className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        right: "-10px", // adjust position as needed
        top: "50%",
        transform: "translateY(-50%)",
        background: COLORS.primary,
        color: "white",

        fontSize: "20px",
        borderRadius: "10%",
        zIndex: 2,
        cursor: "pointer",
      }}
    >
      <ChevronRight sx={{ fontSize: 30, color: "white" }} />
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      //   className={className}
      onClick={onClick}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        left: "-10px", // adjust position as needed
        top: "50%",
        transform: "translateY(-50%)",
        background: COLORS.primary,
        color: "white",
        fontSize: "20px",
        borderRadius: "10%",
        zIndex: 2,
        cursor: "pointer",
      }}
    >
      <ChevronLeft sx={{ fontSize: 30, color: "white" }} />
    </div>
  );
}

const TagSlider = ({
  TagData,
  selectedTags,
  selectedTag,
  setSelectedTags,
  handleMergeCancel,
  handleMergeImages,
  setSelectedProduct,
  data,
}) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 300,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      // You can unslick at a given breakpoint now by adding:
      // settings: "unslick"
      // instead of a settings object
    ],
  };

  return (
    <Box sx={{ width: "100%" }} className="slider-container">
      <Slider {...settings}>
        {TagData &&
          TagData.map((item, index) => (
            <Box
              key={index}
              width={"94% !important"}
              sx={{
                position: "relative",
                border: "1px solid rgb(71, 71, 71)",
                mt: 2,
                ml: "4px",
                borderRadius: "4px",
                // space between items
                ...(selectedTags?.[selectedTag]?.index === index && {
                  border: "1px solid #bb1f2a",
                }),
              }}
            >
              {selectedTags[selectedTag]?.index === index && (
                <IconButton
                  onClick={() =>
                    handleMergeCancel(
                      Number(selectedTag),
                      selectedTags[selectedTag]?.order,
                    )
                  }
                  sx={{
                    padding: "3px",
                    position: "absolute",
                    top: -5,
                    left: -5,
                    backgroundColor: "#bb1f2a",
                    borderRadius: "50%",

                    zIndex: 9900,
                    "&:hover": {
                      backgroundColor: "rgb(221, 7, 21)",
                    },
                  }}
                >
                  <Close sx={{ color: "white", fontSize: "16px" }} />
                </IconButton>
              )}

              <div
                className="w-[100%] cursor-pointer rounded overflow-hidden"
                onClick={() => {
                  const order =
                    selectedTags?.[selectedTag]?.order ??
                    data?.tag_list.find(
                      (i) => i.tag_id?.toString() === selectedTag,
                    )?.position_order;

                  const dataObj = {
                    ...selectedTags,
                    [selectedTag]: {
                      variantId: item.product_varaint_id?.toString(),
                      index,
                      url: item.tag_image,
                      productId: item.product_id,
                      order,
                    },
                  };

                  setSelectedTags(dataObj);
                  handleMergeImages(index, dataObj, order);
                  setSelectedProduct({
                    productId: item?.product_id?.toString(),
                    variantId: item?.product_varaint_id?.toString(),
                  });
                }}
              >
                <div
                  className={`relative rounded-sm overflow-hidden cursor-pointer  h-[100px]  `}
                >
                  {item?.image && (
                    <Image
                      src={item?.image}
                      alt={`Tag ${index}`}
                      fill
                      className="object-cover rounded"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            </Box>
          ))}
      </Slider>
    </Box>
  );
};

export default TagSlider;
