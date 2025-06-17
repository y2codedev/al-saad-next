"use client";

import React, { useEffect, useState } from "react";
import { Box, Container, Typography, Grid } from "@mui/material";
import { smartShoppingApi } from "@/utils/services/smartShopping";
import {
  BreadCumContainer,
  BreadCumHeader,
  CategoryContainer,
  CategoryTextOverlay,
  StyledHeading,
  ViewTitle,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import SmartShoppingShimmer from "@/components/skeleton/SmartShoppingShimmer";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import AppSlider from "@/components/AppSlider";

const SmartShoppingBedroom = ({ params }) => {
  const [subCategories, setSubCategories] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const { slug, id } = params;
  const [Loading, setLoading] = useState(false);
  const t = useTranslations();

  const smartShoppingSubCategories = async () => {
    try {
      setLoading(true);
      const requestBody = {
        category_id: id,
      };
      const response =
        await smartShoppingApi.smartShoppinSubcategory(requestBody);
      if (response && response.status === 200) {
        setSubCategories(response.data?.subcategory);
        setRecommendedProducts(response?.data?.recommended_product);
      }
    } catch (error) {
      console.log(error, "error in smart shopping sub categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    smartShoppingSubCategories();
  }, []);

  return (
    <>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("smart_shopping")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("category"), link: "/smart-shopping" },
                { text: `${slug}`, link: "" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      {Loading ? (
        <SmartShoppingShimmer />
      ) : (
        <Container
          maxWidth="lg"
          sx={{ px: 1, overflow: "hidden", mb: { sm: 0, xs: 5 } }}
        >
          <Box sx={{ my: 5, overflow: "hidden" }}>
            <Grid container spacing={2} sx={{ pb: 4, overflow: "hidden" }}>
              {subCategories &&
                subCategories?.map((cat) => (
                  <Grid key={cat?.id} size={12}>
                    <Box sx={{ display: "inline-block", mb: 1 }}>
                      <ViewTitle>{cat?.name}</ViewTitle>
                    </Box>
                    <Grid container spacing={2}>
                      {cat?.engagement_list?.map((engagement) => (
                        <Grid
                          key={engagement?.id}
                          size={{
                            xs: 12,
                            sm: 4,
                          }}
                        >
                          <Link
                            href={`/smart-shoppings/details/${engagement?.id}`}
                          >
                            <CategoryContainer>
                              <div className="relative w-[400px] h-[200px] overflow-hidden rounded-md">
                                <Image
                                  src={engagement?.main_image}
                                  alt={engagement?.title || "Engagement image"}
                                  fill={true}
                                  className="object-cover select-none"
                                  blurDataURL={engagement?.main_image}
                                  sizes="(max-width: 768px) 100vw, 400px"
                                />
                              </div>
                              <CategoryTextOverlay>
                                <Typography variant="h6">
                                  {engagement?.title}
                                </Typography>
                              </CategoryTextOverlay>
                            </CategoryContainer>
                          </Link>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Container>
      )}

      {recommendedProducts && recommendedProducts.length > 0 && (
        <AppSlider
          productsCard={recommendedProducts || []}
          isLoading={Loading}
          title={"recommended"}
          viewHref={`/search/recommended_product`}
        />
      )}
    </>
  );
};

export default SmartShoppingBedroom;