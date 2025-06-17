"use client";

import { CheckCircle, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, Chip, Typography } from "@mui/material";
import React from "react";
import { useTranslations } from "next-intl";

const BrandSelector = ({
  selectedBrands,
  toggleBrand,
  brandShow,
  setBrandShow,
  tags,
}) => {
  const t = useTranslations();
  const tag = brandShow ? tags : tags.slice(0, 5);
  return (
    <>
      <Typography
        variant="h5"
        sx={{ my: 1, color: "#292b2c", fontWeight: "600", fontSize: "1.25rem" }}
      >
        {t("brand")}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {tag?.map((tag, index) => {
          const isSelected = selectedBrands.includes(tag?.attributes_value_id);
          return (
            <div
              onClick={() => toggleBrand(tag.attributes_value_id)}
              className={`inline-flex items-center px-1 py-[6px] rounded text-sm font-normal cursor-pointer transition-colors
        ${isSelected ? "bg-[#bb1f2a] text-white hover:bg-[#bb1f2a]" : "bg-[#eee] text-black hover:bg-gray-300"}`}
            >
              {/* Icon */}
              {isSelected ? (
                <CheckCircle
                  sx={{ fontSize: "15px", mx: "2px" }}
                  className="w-4 h-4 mr-1"
                />
              ) : (
                <RadioButtonUnchecked
                  sx={{ fontSize: "15px", mx: "2px" }}
                  className="w-4 h-4 mr-1"
                />
              )}

              <span className="px-1">{tag.attribute_value}</span>
            </div>
          );
        })}
      </Box>
      {tag?.length > 4 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Typography
            onClick={() => setBrandShow(!brandShow)}
            sx={{
              mt: 2,
              color: "#bb1f2a",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {brandShow ? t("show_less") : t("show_more")}
          </Typography>
        </Box>
      )}
    </>
  );
};

export default BrandSelector;
