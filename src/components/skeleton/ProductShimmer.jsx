import React from "react";
import { Box, Container, Grid, Skeleton } from "@mui/material";

const ProductShimmer = () => {
  return (
    <div className="my-1">
      <Container maxWidth="lg" sx={{ px: 0 }}>
        <Box
          flexDirection={"row"}
          display={"flex"}
          justifyContent={"end"}
          sx={{ height: "60px" }}
        >
          <Skeleton
            variant="rectangular"
            className="text-2xl font-bold mb-5"
            width={"7%"}
            height={50}
            animation="wave"
            sx={{ background: "#EEF0F1" }}
          />
          <Skeleton
            variant="rectangular"
            className="text-2xl font-bold mb-5"
            width={"7%"}
            height={50}
            animation="wave"
            sx={{ background: "#EEF0F1", mx: 2 }}
          />
          <Skeleton
            variant="rectangular"
            className="font-bold"
            width={"15%"}
            height={50}
            animation="wave"
            sx={{ background: "#EEF0F1" }}
          />
        </Box>
        <Skeleton
          variant="text"
          className="text-2xl font-bold mb-5"
          width={"20%"}
          height={30}
          animation="wave"
          sx={{ background: "#EEF0F1" }}
        />
        <Grid container spacing={{ xs: 0, sm: 2 }}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid
              sx={{ pb: 2 }}
              key={index}
              size={{
                xs: 6,
                sm: 4,
                md: 4,
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  overflow: "hidden",
                  borderTopLeftRadius: "8px",
                  borderTopRightRadius: "8px",
                  borderBottomLeftRadius: "0px",
                  borderBottomRightRadius: "0px",
                  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
                  margin: { xs: 1, sm: "5px" },
                }}
              >
                <Skeleton
                  variant="rectangular"
                  sx={{
                    minHeight: { sm: "276.37px", xs: "175px" },
                    maxHeight: { sm: "400px", xs: "175px" },
                    width: "100%",
                    borderRadius: "8px 8px 0 0",
                    background: "#EEF0F1",
                  }}
                />
                <Box sx={{ p: { xs: "8px", sm: "16px" } }}>
                  <Skeleton variant="text" height={25} width="80%" />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="20%" />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                    <Skeleton variant="circular" width={24} height={24} />
                    <Skeleton variant="text" width="20%" sx={{ ml: 1 }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ProductShimmer;
