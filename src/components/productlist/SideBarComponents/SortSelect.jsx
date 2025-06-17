"use client";

import React from "react";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";

const SortSelect = ({ sortOptions, sortOrder, handleChangeSort }) => {
  const t = useTranslations();
  return (
    <Box sx={{ width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          my: 1,
          color: "#292b2c",
          fontWeight: "600",
          fontSize: "1.2rem",
          fontFamily: "Roboto, sans-serif",
        }}
      >
        {t("sort")}
      </Typography>
      <FormControl
        sx={{ width: "100%" }}
        fullWidth
        size="small"
        variant="outlined"
      >
        <Select
          defaultValue={sortOrder || "dd"}
          labelId="sort-order-label"
          inputProps={{ MenuProps: { disableScrollLock: true } }}
          sx={{
            // padding: "3px",
            "&:focus-visible": {
              outline: "none",
              boxShadow: "none",
            },
          }}
          value={sortOrder || "dd"}
          onChange={handleChangeSort}
        >
          <MenuItem value="dd" key={"dd"} sx={{ display: "none" }} disabled>
            {t("sort")}
          </MenuItem>
          <MenuItem disabled> {t("price")}</MenuItem>
          {Object.entries(sortOptions.price)?.map(([key, label]) => (
            <MenuItem sx={{ marginLeft: "30px" }} key={key} value={key}>
              {label}
            </MenuItem>
          ))}

          <MenuItem disabled>{t("age")}</MenuItem>
          {Object.entries(sortOptions.age)?.map(([key, label]) => (
            <MenuItem sx={{ marginLeft: "30px" }} key={key} value={key}>
              {label}
            </MenuItem>
          ))}

          <MenuItem disabled>{t("quantity")}</MenuItem>
          {Object.entries(sortOptions.quantity)?.map(([key, label]) => (
            <MenuItem sx={{ marginLeft: "30px" }} key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SortSelect;
