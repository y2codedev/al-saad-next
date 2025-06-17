import React from "react";
import { Typography } from "@mui/material";

const DeliveryText = ({ deliveryText }) => (
  <Typography variant="body2" color="#687188">
    {deliveryText}{" "}
    <Typography variant="body2" color="#bb1f2a" component="span">
      Select Area
    </Typography>
  </Typography>
);

export default DeliveryText;
