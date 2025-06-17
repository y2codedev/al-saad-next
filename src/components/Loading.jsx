"use client";
import COLORS from "@/utils/colors";
import { Box } from "@mui/material";
import React from "react";
import { RotatingLines } from "react-loader-spinner";

const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        zIndex: 9999999,
        width: "100%",
        height: "100%",
      }}
    >
      <RotatingLines
        strokeColor={COLORS.primary}
        strokeWidth="5"
        animationDuration="0.75"
        width="96"
        visible={true}
      />
    </Box>
  );
};

export default Loading;
