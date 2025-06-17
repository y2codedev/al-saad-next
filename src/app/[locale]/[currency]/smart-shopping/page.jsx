"use client";

import React, { useEffect, useMemo } from "react";
import { Typography, Container, Box, Grid } from "@mui/material";
import SmartShoppingShimmer from "@/components/skeleton/SmartShoppingShimmer";
import useSmartCategoryStore from "@/store/useSmartCategoryStore";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  CategoryCard,
  CategoryTitle,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
const page = () => {
  const { data, isLoading, fetchCategory } = useSmartCategoryStore();
  const t = useTranslations();

  useEffect(() => {
    fetchCategory();
  }, []);

  const categoryList = useMemo(() => data || [], [data]);

  return (
    <Box>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("category")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("category"), link: "/" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      {isLoading ? (
        <SmartShoppingShimmer />
      ) : (
        <Container
          maxWidth="lg"
          sx={{ px: 1, overflow: "hidden", mb: { sm: 0, xs: 5 } }}
        >
          <Grid
            container
            spacing={2}
            sx={{ my: { sm: 5, xs: 2 }, pb: { sm: 5, xs: 2 } }}
          >
            {categoryList &&
              categoryList?.map((cat) => (
                <Grid
                  key={cat?.id}
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <Link
                    href={`/smart-shopping/category/${cat?.slug}/${cat?.id}`}
                  >
                    <CategoryCard>
                      <div className="relative w-full h-[200px] rounded-lg overflow-hidden">
                        <Image
                          src={cat?.image}
                          alt={cat?.name || "Category"}
                          fill={true}
                          className="object-cover"
                          blurDataURL={cat?.image}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <CategoryTitle>
                        <Typography
                          variant="h6"
                          sx={{ color: "#292b2c", fontSize: "15px" }}
                        >
                          {cat?.name}
                        </Typography>
                      </CategoryTitle>
                    </CategoryCard>
                  </Link>
                </Grid>
              ))}
          </Grid>
        </Container>
      )}
    </Box>
  );
};

export default page;
