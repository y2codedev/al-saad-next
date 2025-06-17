import React from "react";
import { Typography, Box } from "@mui/material";

const AvailabilityInfo = ({ availability }) => (
  <Box mt={2}>
    <Typography variant="body1" sx={{ color: "#687188" }} fontWeight="bold">
      Availability:{" "}
      <span style={{ color: "green" }}>
        {availability} Item{availability > 1 ? "s" : ""} in stock
      </span>
    </Typography>
  </Box>
);

export default AvailabilityInfo;
