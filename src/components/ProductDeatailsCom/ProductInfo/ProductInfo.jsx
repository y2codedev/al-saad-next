import React from "react";
import { Box, Typography, List, ListItem } from "@mui/material";

const ProductInfo = ({ tags }) => {
  return (
    <Box>
      <List>
        <ListItem>
          <Typography variant="body1">
            <strong>Model :</strong> {tags?.group}
          </Typography>
        </ListItem>
        <ListItem>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <strong>Brand :</strong>
            <Typography sx={{ color: "#292b2c" }}> {tags?.brand} </Typography>
          </Typography>
        </ListItem>
        <ListItem>
          <Typography
            variant="body1"
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography sx={{ color: "#292b2c" }}>
              {" "}
              <strong>Tags :</strong> {tags?.tags}{" "}
            </Typography>
          </Typography>
        </ListItem>
      </List>
    </Box>
  );
};

export default ProductInfo;
