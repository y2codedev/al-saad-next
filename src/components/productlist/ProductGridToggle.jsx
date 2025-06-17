"use client";

import { Box } from "@mui/material";
import { BsGrid } from "react-icons/bs";
import { TfiLayoutListThumb } from "react-icons/tfi";

export const ProductGridToggle = ({ gridTogal, onToggle, loading }) => {
  const iconStyle = {
    py: "13px",
    px: "15px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid #ced4da",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <Box
      sx={{
        display: { xs: "none", sm: "flex" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box
        sx={{
          ...iconStyle,
          backgroundColor: gridTogal ? "#bb1f2a" : "transparent",
          "&:hover svg": { color: "#bb1f2a" },
        }}
        onClick={() => onToggle(true)}
      >
        <BsGrid color={gridTogal ? "#fff" : "#292b2c"} />
      </Box>
      <Box
        sx={{
          ...iconStyle,
          backgroundColor: !gridTogal ? "#bb1f2a" : "transparent",
          "&:hover svg": { color: "#bb1f2a" },
        }}
        onClick={() => onToggle(false)}
      >
        <TfiLayoutListThumb color={!gridTogal ? "#fff" : "#292b2c"} />
      </Box>
    </Box>
  );
};
