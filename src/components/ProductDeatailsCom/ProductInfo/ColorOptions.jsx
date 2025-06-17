import React from "react";
import { Box, CardMedia, Typography } from "@mui/material";

const ColorOptions = ({ colorOptions, selectedColor, setSelectedColor }) => {
  const colors = colorOptions[0]?.colors?.all_colors;
  const patternImage = colorOptions[0]?.pattern?.image;
  const size = colorOptions[0]?.sizes;

  return (
    <Box mt={2}>
      <Typography variant="body1" fontWeight="bold">
        Color
      </Typography>
      <Box display="flex" gap={1} mt={1}>
        {colors?.length > 0 ? (
          colors.map((colorOption) => (
            <Box
              key={colorOption.color_id}
              sx={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: colorOption,
                border:
                  selectedColor === colorOption.color_id
                    ? "2px solid #bb1f2a"
                    : "2px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => setSelectedColor(colorOption.color_id)}
            />
          ))
        ) : patternImage ? (
          <CardMedia
            component="img"
            src={patternImage}
            alt="Pattern Image"
            sx={{ width: 24, height: 24, borderRadius: "50%" }}
          />
        ) : null}
      </Box>
      <Box>
        {size?.map((sizeOption) => (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
            <Typography variant="body1" fontWeight="bold">
              {sizeOption.size_group_name}
            </Typography>
            :
            <Typography
              variant="body1"
              sx={{
                px: 1,
                py: 0.5,
                ml: 1,
                backgroundColor: "#bb1f2a",
                color: "#fff",
                borderRadius: "4px",
              }}
            >
              {sizeOption.size_name}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ColorOptions;
