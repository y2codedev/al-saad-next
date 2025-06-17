import React from "react";
import { Box, Typography, Rating } from "@mui/material";

const PriceAndRating = ({ product }) => (
  <Box
    mt={2}
    display={{ sm: "flex", xs: "block" }}
    alignItems="center"
    justifyContent="space-between"
  >
    <Box>
      <Box display="flex" alignItems="center">
        <Typography
          sx={{
            fontSize: { sm: "1.2rem", xs: "1rem" },
            fontWeight: 500,
            color: "#bb1f2a",
          }}
        >
          {product.price} AED
        </Typography>
        <Typography
          sx={{
            fontSize: { sm: "1.2rem", xs: "1rem" },
            fontWeight: 500,
            color: "green",
            textDecoration: "line-through",
            mx: 2,
          }}
        >
          {product.oldPrice} AED
        </Typography>
        <Typography
          sx={{
            fontSize: { sm: "1.2rem", xs: "1rem" },
            fontWeight: 500,
            color: "green",
          }}
        >
          {product.discount}
        </Typography>
      </Box>
      <Typography variant="body2" color="textSecondary" mt={1}>
        {product.vatIncluded ? "(Price includes VAT)" : ""}
      </Typography>
    </Box>
    <Box>
      <Rating disabled value={product.ratings} />
      <Typography component="legend">({product.ratings}) ratings</Typography>
    </Box>
  </Box>
);

export default PriceAndRating;
