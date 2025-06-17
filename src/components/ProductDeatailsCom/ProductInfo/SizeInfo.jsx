import React from "react";
import { Box, Typography } from "@mui/material";

const SizeInfo = ({ size }) => (
  <Box mt={2} display="flex" alignItems="center" gap={2}>
    <Typography variant="body1" color="#687188">
      Size
    </Typography>
    <Typography
      sx={{
        backgroundColor: "#bb1f2a",
        color: "#fff",
        padding: "3px 10px",
        borderRadius: "4px",
      }}
    >
      {size}
    </Typography>
  </Box>
);

export default SizeInfo;
