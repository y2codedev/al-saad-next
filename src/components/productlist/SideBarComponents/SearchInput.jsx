"use client";

import React from "react";
import { Paper, InputBase, Box } from "@mui/material";
import { useTranslations } from "next-intl";

const SearchInput = ({ searchTerm, handleSearch }) => {
  const t = useTranslations();
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <Paper
          component="form"
          sx={{
            p: "6px 4px",
            display: "flex",
            alignItems: "center",
            boxShadow: "none",
            border: "1px solid #c0bdbd",
          }}
        >
          <InputBase
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
            placeholder={t("search")}
            inputProps={{ "aria-label": "search..." }}
          />
        </Paper>
      </Box>
    </>
  );
};

export default SearchInput;
