import React from "react";
import { Box, Skeleton, styled } from "@mui/material";

const StyledSkeleton = styled(Skeleton)({
  borderRadius: "8px",
});

const BlogDetailsShimmer = () => {
  return (
    <Box>
      <StyledSkeleton variant="text" width="80%" height={40} />

      <Box sx={{ display: "flex", gap: 3, my: 2 }}>
        <StyledSkeleton variant="text" width={120} height={25} />
        <StyledSkeleton variant="text" width={80} height={25} />
      </Box>

      <StyledSkeleton variant="rectangular" width="100%" height={400} />

      <Box sx={{ mt: 3 }}>
        <StyledSkeleton variant="text" width="100%" height={20} />
        <StyledSkeleton variant="text" width="90%" height={20} />
        <StyledSkeleton variant="text" width="85%" height={20} />
        <StyledSkeleton variant="text" width="95%" height={20} />
        <StyledSkeleton variant="text" width="80%" height={20} />
      </Box>
    </Box>
  );
};

export default BlogDetailsShimmer;
