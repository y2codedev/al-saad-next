"use client";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  StyledHeading,
} from "@/components/styles";
import useGlobalStore from "@/store/useGlobalStore";
import { Typography } from "@mui/material";
import { Box, Container } from "@mui/system";
import React, { useEffect } from "react";
import { useTranslations } from "use-intl";
import parse from "html-react-parser";
const page = () => {
  const { globalData, getGlobalData } = useGlobalStore();

  const t = useTranslations();

  useEffect(() => {
    getGlobalData();
  }, []);

  return (
    <>
      <Box>
        <BreadCumContainer>
          <Container maxWidth="lg">
            <BreadCumHeader>
              <StyledHeading>{globalData?.privacy_title}</StyledHeading>
              <BreadcrumbsComponent
                pathSegments={[
                  { link: "/", text: t("home") },
                  { text: globalData?.privacy_title, link: "category" },
                ]}
              />
            </BreadCumHeader>
          </Container>
        </BreadCumContainer>
      </Box>
      <Container>
        {globalData?.privacy_title && (
          <Typography
            component="p"
            sx={{ fontSize: "14px", lineHeight: 1.7, color: "#444", my: 5 }}
          >
            {globalData?.privacy_title}
          </Typography>
        )}

        {globalData?.term_conditions_description && (
          <Typography
            component="p"
            sx={{ fontSize: "14px", lineHeight: 1.7, color: "#444", my: 5 }}
          >
            {parse(globalData.term_conditions_description)}
          </Typography>
        )}
      </Container>
    </>
  );
};

export default page;
