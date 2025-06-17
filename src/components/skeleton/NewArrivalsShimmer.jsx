import React from "react";
import {
  Box,
  Card,
  CardContent,
  Skeleton,
  useTheme,
  useMediaQuery,
  Container,
} from "@mui/material";

const NewArrivalsShimmer = () => {
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const skeletonCount = matchesSM ? 2 : 4;

  return (
    <Container maxWidth="lg" sx={{ padding: 0 }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          my: 2,
          justifyContent: "space-between",
        }}
      >
        <Skeleton
          variant="rectangular"
          width="20%"
          height={20}
          sx={{ background: "#EEF0F1" }}
        />
        <Skeleton
          variant="rectangular"
          width="20%"
          height={20}
          sx={{ background: "#EEF0F1" }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, my: 4 }}>
        {[...Array(skeletonCount)].map((_, index) => (
          <Card
            key={index}
            sx={{
              boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
              minWidth: { xs: "150px", sm: "276.37px" },
              borderRadius: "8px",
            }}
          >
            <Skeleton
              variant="rectangular"
              sx={{
                height: { xs: "175px", sm: "276.37px" },
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
                background: "#EEF0F1",
              }}
            />
            <CardContent sx={{ padding: { xs: 1, sm: 2 } }}>
              <Skeleton
                variant="text"
                sx={{
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                  marginBottom: 1,
                  background: "#EEF0F1",
                }}
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Skeleton
                  variant="text"
                  width="30%"
                  sx={{
                    background: "#EEF0F1",
                  }}
                />
                <Skeleton
                  variant="text"
                  color="#EEF0F1"
                  width="20%"
                  sx={{
                    background: "#EEF0F1",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 2,
                }}
              >
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                  color="#EEF0F1"
                />
                <Skeleton
                  variant="circular"
                  width={36}
                  height={36}
                  color="#EEF0F1"
                />
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default NewArrivalsShimmer;
