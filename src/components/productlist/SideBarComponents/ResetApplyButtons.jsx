"use client";

import React from "react";
import { Button, Box } from "@mui/material";
import { useTranslations } from "next-intl";

const ResetApplyButtons = ({ handleReset, applyFilters }) => {
  const t = useTranslations();
  return (
    <Box sx={{ display: "flex", gap: 2, mt: 4, mb: 5, alignItems: "center" }}>
      <Button
        onClick={applyFilters}
        variant="contained"
        sx={{
          backgroundColor: "#bb1f2a",
          color: "#fff",
          borderRadius: "0px",
          padding: "13px 30px",
        }}
      >
        {t("apply")}
      </Button>
      <Button
        onClick={handleReset}
        variant="contained"
        sx={{
          backgroundColor: "#343a40",
          color: "#fff",
          borderRadius: "0px",
          padding: "13px 30px",
        }}
      >
        {t("reset")}
      </Button>
    </Box>
  );
};

export default ResetApplyButtons;
