"use client";

import { Container } from "@mui/material";
import React from "react";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";

export const ProdictListingHeader = () => {
  const t = useTranslations();
  return (
    <BreadCumContainer>
      <Container>
        <BreadCumHeader>
          <StyledHeading>{t("product_list")}</StyledHeading>
          <BreadcrumbsComponent
            pathSegments={[
              { link: "/", text: t("home") },
              { text: t("product_list"), link: "" },
            ]}
          />
        </BreadCumHeader>
      </Container>
    </BreadCumContainer>
  );
};
