"use client";

import { Grid, Typography, Container, Box } from "@mui/material";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  CategoryContainer,
  StyledHeading,
  CategoryTextOverlay,
  StyledLink,
  BreadCumHeader,
  BreadCumContainer,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import Image from "next/image";

const CategoryList = ({ data }) => {
  const t = useTranslations();

  return (
    <Box sx={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container maxWidth="lg">
          <BreadCumHeader>
            <StyledHeading>{t("category")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("category"), link: "category" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>

      <Container maxWidth="lg" sx={{ px: 1, overflow: "hidden" }}>
        <Box sx={{ my: 6 }}>
          <Grid container spacing={2} sx={{ pb: 4, overflow: "hidden" }}>
            {data?.length > 0 &&
              data?.map((cat) => (
                <Grid
                  overflow={"hidden"}
                  key={cat.id}
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <StyledLink href={`category/${cat?.slug}`}>
                    <CategoryContainer>
                      <Image
                        className="h-[200px] w-[400px] object-cover"
                        width={400}
                        height={200}
                        src={cat?.image}
                        alt={cat?.name}
                        quality={80}
                      />
                      <CategoryTextOverlay>
                        <Typography variant="h6">{cat?.name}</Typography>
                      </CategoryTextOverlay>
                    </CategoryContainer>
                  </StyledLink>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default CategoryList;
