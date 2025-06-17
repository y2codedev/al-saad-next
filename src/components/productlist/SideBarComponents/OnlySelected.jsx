"use client";

import { Box, Switch, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import React from "react";

const OnlySelected = ({ isChecked, onSwitchChange }) => {
  const t = useTranslations();
  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            my: 1,
            color: "#687188",
            fontWeight: 600,
            fontSize: "12px",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {t("only_selected")}
        </Typography>
        <Switch
          checked={isChecked}
          onChange={(event) => onSwitchChange(event.target.checked)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#bb1f2a",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#bb1f2a",
            },
          }}
        />
        <Typography
          variant="h5"
          sx={{
            my: 2,
            color: "#687188",
            fontWeight: 600,
            fontSize: "12px",
            fontFamily: "Roboto, sans-serif",
          }}
        >
          {t("any_selected")}
        </Typography>
      </Box>
    </>
  );
};

export default OnlySelected;
