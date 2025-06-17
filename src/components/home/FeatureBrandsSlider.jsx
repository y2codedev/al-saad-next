import React from "react";
import Slider from "react-multi-carousel";
import { useMediaQuery, useTheme, Container ,Box } from "@mui/material";
import { Link } from "@/i18n/navigation";
import CustomButtonGroup from "../CustomButtonGroup";
import { CarouselWrapper, StyledContainer, StyledHeading } from "../styles";
import { useLocale, useTranslations } from "next-intl";
import TopSliderShimmer from "../skeleton/TopSliderShimmer";
import Image from "next/image";
import { useParams } from "next/navigation";

const FeatureBrandsSlider = ({ FeaturedBrands, isLoading }) => {
  const t = useTranslations();
  const params = useParams();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));

  if (isLoading) {
    return <TopSliderShimmer isCat={false} />;
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 1 }}>
      <StyledContainer>
        <StyledHeading
          variant="h5"
          sx={{ px: 0, my: { xs: 0, sm: 2 }, textAlign: "center" }}
        >
          {t("feature_brand")}
        </StyledHeading>

        <CarouselWrapper marginTop={2}>
          {!matchesSM ? (<Slider
            additionalTransfrom={0}
            autoPlaySpeed={3000}
            renderButtonGroupOutside
            removeArrowOnDeviceType={["mobile"]}
            arrows={false}
            draggable
            infinite
            responsive={{
              desktop: { breakpoint: { max: 3000, min: 1024 }, items: 8 },
              laptop: { breakpoint: { max: 1024, min: 768 }, items: 6 },
              tablet: { breakpoint: { max: 768, min: 464 }, items: 5 },
              mobile: { breakpoint: { max: 464, min: 0 }, items: 4 },
            }}
            showDots={false}
            slidesToSlide={3}
            swipeable
            customButtonGroup={
              FeaturedBrands?.length > 10 && !matchesSM ? (
                <CustomButtonGroup top="46%" />
              ) : null
            }
            rtl={params.locale === "ar"}
          >
            {FeaturedBrands?.map((item) => (
              <Link
                key={item?.id}
                locale={params.locale}
                className="link-none"
                href={`/brand/${item?.slug}`}
                draggable={false}
              >
                <div
                  className="relative overflow-hidden shrink-0 rounded-full mx-auto"
                  style={{
                    width: "clamp(80px, 12vw, 120px)",
                    height: "clamp(80px, 12vw, 120px)",
                  }}
                >
                  <Image
                    src={item?.image}
                    alt={item?.name}
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                </div>
              </Link>
            ))}
          </Slider>
          ) : (
            <Box className="flex overflow-x-auto space-x-2 pb-2">
              {FeaturedBrands?.map((item, index) => {
                return (
                  <Box
                    key={index}
                    className="shrink-0"
                    sx={{ width: { xs: '23%', } }}
                  >
                    <Link
                      draggable={false}
                      key={item?.id}
                      locale={params.locale}
                      href={`/brand/${item?.slug}`}
                      sx={{ textDecoration: "none", color: "#292b2c" }}
                    >
                      <div className="flex justify-center gap-1 px-1 overflow-hidden">
                        <Image
                          className="w-full object-contain"
                          style={{ height: "90px", maxHeight: "276.37px" }}
                          src={item?.image}
                          alt={item?.name}
                          width={90}
                          height={60}
                          quality={80}
                          draggable={false}
                        />
                      </div>
                    </Link>
                  </Box>
                );
              })}
            </Box>
          )}
        </CarouselWrapper>
      </StyledContainer>
    </Container>
  );
};

export default FeatureBrandsSlider;
