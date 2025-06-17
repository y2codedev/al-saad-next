import React from "react";
import {
  Box,
  Skeleton,
  useMediaQuery,
  useTheme,
  Container,
} from "@mui/material";

const DealsSliderShimmer = () => {
  const theme = useTheme();
  const matchesXS = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <div className="w-full my-4">
      <Container maxWidth="lg" sx={{ padding: 0 }}>
        <Skeleton
          variant="rectangular"
          width="20%"
          height={24}
          sx={{
            marginBottom: 2,
            mx: 2,
            background: "#EEF0F1",
          }}
        />

        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            overflow: "hidden",
            my: 3,
          }}
        >
          {Array(matchesXS ? 2 : 5)
            .fill()
            .map((_, index) => (
              <Box
                key={index}
                sx={{
                  flex: `0 0 ${matchesXS ? "48%" : "19%"}`,
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={220}
                  sx={{
                    marginBottom: 1,
                    background: "#EEF0F1",
                  }}
                />
              </Box>
            ))}
        </Box>
      </Container>
    </div>
  );
};

export default DealsSliderShimmer;
