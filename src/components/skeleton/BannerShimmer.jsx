import React from "react";
import { Box, Skeleton, useMediaQuery, useTheme } from "@mui/material";

const BannerSliderShimmer = () => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ width: "100%", mb: { xs: 2, sm: 4 }, mt: { xs: 0, sm: 2 } }}>
      <Box sx={{ width: "100%" }}>
        <Skeleton
          variant="rectangular"
          width="100%"
          height={matchesSM ? 200 : 600}
          sx={{ borderRadius: 2, background: "#EEF0F1" }}
        />
      </Box>
    </Box>
  );
};

export default BannerSliderShimmer;
