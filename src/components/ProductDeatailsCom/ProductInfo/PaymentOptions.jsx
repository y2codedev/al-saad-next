import React from "react";
import { Box, Typography } from "@mui/material";

const PaymentOptions = ({ paymentText }) => (
  <Box
    sx={{
      padding: 2,
      mt: 2,
      border: "1px solid #e0e0e0",
      borderRadius: "8px",
    }}
  >
    <Typography variant="body2" color="textSecondary">
      {paymentText}
    </Typography>
  </Box>
);

export default PaymentOptions;
