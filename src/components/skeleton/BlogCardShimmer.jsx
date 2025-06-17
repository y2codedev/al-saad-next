import React from "react";
import { Card, CardContent, Skeleton, Box, styled } from "@mui/material";

const StyledCard = styled(Card)({
  borderRadius: "8px",
  marginBottom: "16px",
  cursor: "pointer",
  boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
});

const BlogCardShimmer = () => {
  return (
    <StyledCard>
      <Box position="relative">
        {/* Image Skeleton */}
        <Skeleton
          variant="rectangular"
          width="100%"
          height={233}
          sx={{ borderRadius: "8px" }}
        />
      </Box>
      <CardContent>
        {/* Title Skeleton */}
        <Skeleton variant="text" width="80%" height={25} />

        {/* Metadata (Date & Comments) Skeleton */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1 }}>
          <Skeleton variant="text" width="40px" height={20} />
          <Skeleton variant="text" width="30px" height={20} />
        </Box>

        {/* Description Skeleton */}
        <Skeleton variant="text" width="100%" height={20} />
        <Skeleton variant="text" width="90%" height={20} />
        <Skeleton variant="text" width="70%" height={20} />
      </CardContent>
    </StyledCard>
  );
};

export default BlogCardShimmer;
