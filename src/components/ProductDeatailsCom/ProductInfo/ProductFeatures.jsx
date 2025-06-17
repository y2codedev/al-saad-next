import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";

const ProductFeatures = ({ features }) => (
  <Box>
    <Typography variant="h6" fontWeight="bold" mt={2}>
      Features
    </Typography>
    <List>
      {features.map((feature, idx) => (
        <ListItem key={idx}>
          <Typography variant="body1">{feature}</Typography>
        </ListItem>
      ))}
    </List>
  </Box>
);

export default ProductFeatures;
