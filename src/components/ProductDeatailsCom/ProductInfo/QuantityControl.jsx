import React from "react";
import { Box, Typography } from "@mui/material";
import { Remove, Add } from "@mui/icons-material";

const QuantityControl = ({ count, incrementChange, decrementChange }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: "5px",
      marginTop: "16px",
    }}
  >
    <Typography
      onClick={decrementChange}
      sx={{ backgroundColor: "#eee", cursor: "pointer", padding: "4px" }}
    >
      <Remove />
    </Typography>
    <Typography
      sx={{
        border: "solid 1px #ddd",
        padding: "4px 12px",
        textAlign: "center",
      }}
      variant="body1"
    >
      {count}
    </Typography>
    <Typography
      onClick={incrementChange}
      sx={{ backgroundColor: "#eee", cursor: "pointer", padding: "4px" }}
    >
      <Add />
    </Typography>
  </Box>
);

export default QuantityControl;
