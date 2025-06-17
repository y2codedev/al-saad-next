"use client";

import { Box, Typography } from "@mui/material";

export const FilterTags = ({ main_category, selectedCatlist, onTagToggle }) => {
  return (
    <Box sx={{ display: "flex", overflowX: "auto", gap: 1, mb: 3, pb: 1 }}>
      {main_category?.map((tag) => (
        <Typography
          onClick={() => onTagToggle(tag?.id)}
          key={tag?.id}
          sx={{
            px: 2,
            py: 1,
            fontSize: "14px",
            cursor: "pointer",
            backgroundColor: selectedCatlist.includes(tag?.id)
              ? "#bb1f2a"
              : "#eee",
            color: selectedCatlist.includes(tag?.id) ? "#fff" : "#000",
            borderRadius: "4px",
            wordBreak: "none",
            flexWrap: "nowrap",
            display: "flex",
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: selectedCatlist.includes(tag?.id)
                ? "#bb1f2a"
                : "#ddd",
            },
          }}
        >
          {tag?.title}
        </Typography>
      ))}
    </Box>
  );
};
