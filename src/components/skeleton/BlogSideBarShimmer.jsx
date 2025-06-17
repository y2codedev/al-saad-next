import React from "react";
import {
  Box,
  Skeleton,
  Typography,
  Divider,
  List,
  ListItem,
} from "@mui/material";

const BlogSideBarShimmer = () => {
  return (
    <Box sx={{ width: "100%", mb: 3 }}>
      <Box mb={4}>
        <Skeleton
          variant="rectangular"
          height={40}
          sx={{ borderRadius: 1, mb: 2 }}
        />
        <Divider />
        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          <Skeleton variant="text" width={150} height={20} />
        </Typography>
        <List>
          {[...Array(4)].map((_, index) => (
            <Box
              key={index}
              sx={{ display: "flex", gap: 2, my: 2, alignItems: "center" }}
            >
              <Skeleton
                variant="rectangular"
                width={80}
                height={60}
                sx={{ borderRadius: 1 }}
              />
              <Box>
                <Skeleton variant="text" width={150} height={20} />
                <Skeleton variant="text" width={100} height={16} />
              </Box>
            </Box>
          ))}
        </List>
      </Box>
      <Divider />
      <Box my={4}>
        <Typography variant="h6" gutterBottom>
          <Skeleton variant="text" width={150} height={20} />
        </Typography>
        <List>
          {[...Array(4)].map((_, index) => (
            <ListItem
              key={index}
              sx={{ display: "flex", justifyContent: "space-between", my: 1 }}
            >
              <Skeleton variant="text" width={100} height={20} />
              <Skeleton variant="text" width={30} height={20} />
            </ListItem>
          ))}
        </List>
      </Box>
      <Divider />
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          <Skeleton variant="text" width={30} height={20} />
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {[...Array(6)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              width={60}
              height={30}
              sx={{ borderRadius: 1 }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BlogSideBarShimmer;
