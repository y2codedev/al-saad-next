"use client";

import { Grid, Typography, Container, Box } from "@mui/material";
// import CategoryShimmer from "./shimmer/CategoryShimmer";
// import BreadcrumbsComponent from "@/components";
import {
  BreadCumContainer,
  BreadCumHeader,
  CategoryContainer,
  CategoryTextOverlay,
  StyledHeading,
} from "@/components/styles";
import { useTranslations } from "next-intl";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import { Link } from "@/i18n/navigation";
import { useParams, usePathname } from "next/navigation";
import Image from "next/image";
import Payment from "./Payment";

const SubCatLIst = ({ subCat }) => {
  const pathname = usePathname();
  const t = useTranslations();
  const params = useParams();

  return (
    <Box>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading> {t("subcategory")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("category"), link: "/category" },
                { text: "subcategory", link: "" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>

      <Container maxWidth="lg" sx={{ px: 1, overflow: "hidden" }}>
        {/* <Payment /> */}
        <Typography
          variant="body1"
          sx={{
            lineHeight: "28px",
            color: "#687188",
            mt: 3,
            fontSize: { xs: "12px", sm: "16px" },
          }}
        >
          {/* {data?.heading} */}
        </Typography>
        <Box sx={{ my: 5 }}>
          <Grid container spacing={2} sx={{ pb: 4, overflow: "hidden" }}>
            {subCat &&
              subCat?.map((item) => (
                <Grid
                  key={item?.id}
                  size={{
                    xs: 12,
                    sm: 4,
                  }}
                >
                  <Link
                    locale={params.locale}
                    className="link-none"
                    href={`${pathname}/${item?.slug}`}
                  >
                    <CategoryContainer>
                      <Image
                        className="h-[200px] w-[400px] object-cover"
                        width={400}
                        height={200}
                        src={item?.image}
                        alt={item?.name}
                        quality={80}
                      />
                      <CategoryTextOverlay>
                        <Typography variant="h6">{item?.name}</Typography>
                      </CategoryTextOverlay>
                    </CategoryContainer>
                  </Link>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default SubCatLIst;
