import React from "react";
import {
  Box,
  Skeleton,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";

const BannerSectionShimmer = () => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <div className="w-full my-4">
      <Container maxWidth="lg" sx={{ padding: 0 }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            my: 3,
          }}
        >
          {Array(2)
            .fill()
            .map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={matchesSM ? 200 : 300}
                sx={{
                  borderRadius: 2,
                  background: "#EEF0F1",
                }}
              />
            ))}
        </Box>
      </Container>
    </div>
  );
};

export default BannerSectionShimmer;
