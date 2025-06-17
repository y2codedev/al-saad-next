"use client";

import React, { useEffect } from "react";
import { Grid, Typography, Container, Box } from "@mui/material";
import UnboxingBottomSection from "@/components/unboxing/UnboxingBottomSection";
import parse from "html-react-parser";
import useUnboxingStore from "@/store/useUnboxingStore";
import UnboxingShimmer from "@/components/skeleton/UnboxingShimmer";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  CategoryContainer,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";
const Unboxing = () => {
  const { data, loading, fetchData } = useUnboxingStore();
  const t = useTranslations();

  useEffect(() => {
    fetchData();
  }, []);

  console.log(data, "data");

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("unboxing_challange")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("unboxing_challange"), link: "" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      {loading ? (
        <UnboxingShimmer />
      ) : (
        <Container>
          <Box sx={{ my: 5 }}>
            <Grid container spacing={2} sx={{ pb: 4 }}>
              <Grid
                size={{
                  xs: 12,
                  sm: 12,
                }}
              >
                <CategoryContainer>
                  <div className="relative w-full">
                    {data && (
                      <Image
                        src={data?.banner}
                        alt="category-image"
                        fill={true}
                        className="object-cover w-full h-[500px]"
                        loading="lazy"
                      />
                    )}
                  </div>
                </CategoryContainer>
              </Grid>
            </Grid>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                {data?.title}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "15px",
                  lineHeight: "28px",
                  color: "#687188",
                  fontWeight: "600",
                }}
              >
                {data?.description
                  ? parse(data?.description)
                  : "Description not available"}
              </Typography>
            </Box>
            <UnboxingBottomSection data={data} />
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default Unboxing;
