import React from "react";
import { Typography } from "@mui/material";

const ProductTitle = ({ title }) => (
  <Typography
    variant="h6"
    sx={{ fontSize: { sm: "1.4rem", xs: "1rem" }, fontWeight: 600 }}
  >
    {title}
  </Typography>
);

export default ProductTitle;
