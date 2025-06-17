"use client";

import React from "react";
import { Box, Typography } from "@mui/material";
import FilterChip from "./FilterChip";
import { useTranslations } from "next-intl";

const FilterSection = ({
  items,
  selectedItems,
  toggleItem,
  styleShowMore,
  setStyleShowMore,
  id,
  label,
  direction,
}) => {
  const t = useTranslations();
  const tags = styleShowMore?.includes(id) ? items : items.slice(0, 5);

  return (
    <Box mt={2}>
      <Typography
        variant="h5"
        sx={{
          my: 1,
          color: "#292b2c",
          fontWeight: "600",
          fontSize: "1.25rem",
          letterSpacing: ".3px",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 1 }}>
        {tags?.map((item) => {
          const isSelected =
            selectedItems?.includes(item?.attributes_value_id) || false;
          return (
            <FilterChip
              direction={direction}
              key={item?.attributes_value_id}
              label={item?.attribute_value}
              isSelected={isSelected}
              onClick={() => toggleItem(item?.attributes_value_id)}
            />
          );
        })}
      </Box>
      {items?.length > 5 && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Typography
            onClick={() => {
              setStyleShowMore((prev) =>
                prev.includes(id)
                  ? prev.filter((id) => id !== id)
                  : [...prev, id],
              );
            }}
            sx={{
              mt: 2,
              color: "#bb1f2a",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {styleShowMore?.includes(id) ? t("show_less") : t("show_more")}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default FilterSection;
