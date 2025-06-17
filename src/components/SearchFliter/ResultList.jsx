"use client";

import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { useParams } from "next/navigation";
import ProductCard from "../ProductCard";
import { useCountryStore } from "@/store/useCountryStore";

const ResultList = ({ data = [], handleClose, cur }) => {
  const params = useParams();

  return (
    <Box
      sx={{
        width: "100%",
        mt: 1,
        bgcolor: "white",
        height: "calc(100vh - 300px)",
        overflowY: "auto",
        px: { xs: "4px", sm: "15px" },
        py: { xs: "8px", sm: "15px" },
      }}
    >
      <Grid container spacing={2} sx={{ height: "100%" }}>
        {data?.map((item, index) => {
          const href = `/products/${item?.slug}?product_id=${item?.product_id?.toString()}&variant_id=${item?.product_variant_id?.toString()}`;
          return (
            <Grid
              key={item?.id}
              sx={{ pb: 2 }}
              size={{
                xs: 6,
                sm: 4,
                md: 3,
              }}
            >
              <ProductCard
                key={item.title}
                item={item}
                href={href}
                handleClose={handleClose}
                selectedCountry={useCountryStore.getState()?.selectedCountry}
                search={true}
              />
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
};

export default ResultList;
