"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslations } from "next-intl";

const ColorSelector = ({ colors, selectedColors, toggleColor }) => {
  const t = useTranslations();
  return (
    <Box mt={2}>
      <Typography
        variant="h5"
        sx={{ my: 1, color: "#292b2c", fontWeight: "600", fontSize: "1.25rem" }}
      >
        {t("color")}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {colors &&
          colors.length > 0 &&
          colors.map((color, index) => {
            const isSelected = selectedColors.includes(
              color.attributes_value_id,
            );
            return (
              <Box
                key={index}
                onClick={() => toggleColor(color?.attributes_value_id)}
                sx={{
                  width: "25px",
                  height: "25px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  backgroundColor: color?.attribute_value,
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${isSelected ? "#bb1b2a" : "#fff"}`,
                  justifyContent: "center",
                  position: "relative",
                  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
                }}
              >
                {isSelected && (
                  <CheckIcon
                    sx={{
                      color: "#fff",
                      fontSize: "20px",
                      position: "absolute",
                    }}
                  />
                )}
              </Box>
            );
          })}
      </Box>
    </Box>
  );
};

export default ColorSelector;
