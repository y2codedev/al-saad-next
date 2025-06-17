import React from "react";
import {
  CardContent,
  Box,
  Grid,
  Skeleton,
  Container,
  Typography,
} from "@mui/material";

const HomeBlogShimmer = () => {
  return (
    <div className="my-5">
      <Container sx={{ px: 1 }} maxWidth="lg">
        <Typography variant="h5" sx={{ mb: 2 }}>
          <Skeleton width={120} height={30} />
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto",
            textAlign: "center",
            mb: 4,
          }}
        >
          <Typography variant="body1">
            <Skeleton width={200} height={20} />
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
          {[1, 2, 3].map((index) => (
            <Box
              key={index}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
                width: "100%",
              }}
            >
              <Skeleton variant="rectangular" width="100%" height={233} />
              <CardContent>
                <Typography variant="h5">
                  <Skeleton width="80%" height={28} />
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}
                >
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton width={80} height={18} />
                  <Skeleton variant="circular" width={20} height={20} />
                  <Skeleton width={30} height={18} />
                </Box>
                <Typography variant="body2">
                  <Skeleton width="100%" height={50} />
                </Typography>
              </CardContent>
            </Box>
          ))}
        </Box>
      </Container>
    </div>
  );
};

export default HomeBlogShimmer;
