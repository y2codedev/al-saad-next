import { Box, useTheme } from "@mui/material";
import React from "react";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { useLanguageStore } from "../../store/useLanguageStore";
const CustomButtonGroup = ({ next, previous }) => {
  const theme = useTheme();
  const isRTL = useLanguageStore.getState().language === "ar";

  return (
    <>
      <Box
        onClick={isRTL ? next : previous}
        sx={{
          position: "absolute",
          top: "48%",
          left: "0px",
          display: "flex",
          justifyContent: "space-between",
          transform: "translateY(-50%)",
          direction: isRTL ? "rtl" : "ltr",
          cursor: "pointer",
        }}
      >
        <MdOutlineArrowBackIos fontSize={"20px"} color="#222" />
      </Box>
      <Box
        onClick={isRTL ? previous : next}
        sx={{
          position: "absolute",
          top: "48%",
          right: "0px",
          display: "flex",
          justifyContent: "space-between",
          transform: "translateY(-50%)",
          direction: isRTL ? "rtl" : "ltr",
          cursor: "pointer",
        }}
      >
        <MdOutlineArrowForwardIos fontSize={"20px"} color="#222" />
      </Box>
    </>
  );
};

export default CustomButtonGroup;
