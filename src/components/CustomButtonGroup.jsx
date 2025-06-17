"use client";
import React from "react";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import {
  MdOutlineArrowBackIos,
  MdOutlineArrowForwardIos,
} from "react-icons/md";

const CustomButtonGroup = ({ next, previous, isRTL, top, left, right }) => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <>
      {!matchesSM && (
        <Box
          className="arrow-box"
          onClick={isRTL ? next : previous}
          sx={{
            position: "absolute",
            top: top,
            left: isRTL ? "auto" : left || "-45px",
            right: isRTL ? "-45px" : "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-50%)",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          <Box className="arrow-hover" sx={{ p: 1 }}>
            <MdOutlineArrowBackIos fontSize={"20px"} />
          </Box>
        </Box>
      )}

      {!matchesSM && (
        <Box
          className="arrow-box"
          onClick={isRTL ? previous : next}
          sx={{
            position: "absolute",
            top: top,
            right: isRTL ? "auto" : right || "-45px",
            left: isRTL ? "-45px" : "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "translateY(-50%)",
            cursor: "pointer",
            zIndex: 1,
          }}
        >
          <Box className="arrow-hover" sx={{ p: 1 }}>
            <MdOutlineArrowForwardIos fontSize={"20px"} />
          </Box>
        </Box>
      )}
    </>
  );
};

export default CustomButtonGroup;
