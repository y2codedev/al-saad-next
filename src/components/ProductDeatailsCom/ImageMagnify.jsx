import { Box } from "@mui/material";
import React from "react";
import ReactImageMagnify from "react-image-magnify";

const ImageMagnify = ({ selectedImage }) => {
  return (
    <>
      <Box sx={{ width: "100%", position: "relative" }}>
        <div
          className="image-magnifier-container"
          style={{
            width: "100%",
            height: "300px",
            maxWidth: "800px",
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: "Wristwatch by Ted Baker London",
                isFluidWidth: true,
                src:
                  selectedImage ||
                  "https://staging-alsaadhome.s3.us-east-2.amazonaws.com/uploads/products/12096/thumb/161722603193.jpg",
                srcSet: selectedImage,

                className: "magnify-image",
              },
              largeImage: {
                isFluidWidth: true,
                src:
                  selectedImage ||
                  "https://staging-alsaadhome.s3.us-east-2.amazonaws.com/uploads/products/12096/thumb/161722603193.jpg",
                width: 1200,
                height: 800,
              },
              enlargedImageContainerStyle: {
                zIndex: 10,
              },
              enlargedImagePosition: "over",
            }}
          />
        </div>
      </Box>
    </>
  );
};

export default ImageMagnify;
