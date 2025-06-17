import React from "react";
import Carousel from "react-multi-carousel";
import { useLanguageStore } from "../../store/useLanguageStore";
import CustomButtonGroup from "../CustomButtonGroup";
import { useTranslations } from "next-intl";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { StyledHeading } from "../styles";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import DealsSliderShimmer from "../skeleton/DealsSliderShimmer";
import { useParams } from "next/navigation";
const DealsSlider = ({ DealsSlider, isLoading }) => {
  const t = useTranslations();
  const isRTL = useLanguageStore.getState().language === "ar";
  const params = useParams();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  if (isLoading) {
    return <DealsSliderShimmer />;
  }

  if (!DealsSlider?.length) {
    return console.log("no data found");
  }

  return (
    <Container maxWidth="lg" sx={{ padding: 1 }}>
      <div className="">
        <StyledHeading variant="h5" sx={{ px: 0.5, my: { xs: 1, sm: 2 } }}>
          {t("deals")}
        </StyledHeading>
        <div className="relative">
          {!matchesSM ? (
            <Carousel
              additionalTransfrom={0}
              autoPlaySpeed={3000}
              renderButtonGroupOutside
              arrows={false}
              draggable
              infinite
              responsive={{
                desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
                laptop: { breakpoint: { max: 1024, min: 768 }, items: 4 },
                tablet: { breakpoint: { max: 768, min: 464 }, items: 3 },
                mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
              }}
              showDots={false}
              slidesToSlide={1}
              swipeable
              customButtonGroup={
                DealsSlider?.length > 4 ? <CustomButtonGroup top="45%" /> : null
              }
              rtl={isRTL}
            >
              {DealsSlider?.map((item) => (
                <Link
                  locale={params.locale}
                  href={`/search/display_banners/${item?.id}`}
                  sx={{ textDecoration: "none", color: "#292b2c" }}
                >
                  <div className="flex justify-center gap-2 px-1 overflow-hidden">
                    <Image
                      className="w-full object-cover"
                      style={{ height: "220px", maxHeight: "276.37px" }}
                      src={item?.image}
                      alt={item?.banner_name}
                      width={300}
                      height={220}
                      quality={80}
                    />
                  </div>
                </Link>
              ))}
            </Carousel>
          ) : (<Box className="flex overflow-x-auto space-x-2 pb-2">
            {DealsSlider.map((item, index) => {
              return (
                <Box
                  key={index}
                  className="shrink-0"
                  sx={{ width: { xs: '49%', } }}
                >
                  <Link
                    draggable={false}
                    key={item?.id}
                    locale={params.locale}
                    href={`/search/display_banners/${item?.id}`}
                    sx={{ textDecoration: "none", color: "#292b2c" }}
                  >
                    <div className="flex justify-center gap-2 px-1 overflow-hidden">
                      <Image
                        className="w-full object-cover"
                        style={{ height: "220px", maxHeight: "276.37px" }}
                        src={item?.image}
                        alt={item?.banner_name}
                        width={300}
                        height={220}
                        quality={80}
                        draggable={false}
                      />
                    </div>
                  </Link>
                </Box>
              );
            })}
          </Box>)}
        </div>
      </div>
    </Container>
  );
};

export default DealsSlider;
