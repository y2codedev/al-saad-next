"use client";
import React, { useEffect, useRef, useState } from "react";
import Carousel from "react-multi-carousel";
import { useMediaQuery, useTheme, Container, Box, Grid } from "@mui/material";
import { Link } from "../i18n/navigation";
import { useParams } from "next/navigation";
import BoltIcon from "@mui/icons-material/Bolt";
import CustomButtonGroup from "./CustomButtonGroup";
import Login from "../auth/Login/Login";
import Register from "../auth/Register/Register";
import ForgotPasswordModal from "../auth/Login/ForgotPasswordModal";
import {
  CarouselWrapper,
  HeaderContainer,
  ViewText,
  ViewTitle,
} from "./styles";
import { useLanguageStore } from "../store/useLanguageStore";
import OtpDialog from "../auth/Login/OtpDialog";
import { useSettingsStore } from "../store/useSettingsStore";
import { useTranslations } from "next-intl";
import NewArrivalsShimmer from "./skeleton/NewArrivalsShimmer";
import ProductCard from "../components/ProductCard";

const AppSlider = ({ productsCard, isLoading, title, viewHref }) => {
  const theme = useTheme();
  const params = useParams();
  const t = useTranslations();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  const isRTL = useLanguageStore.getState().language === "ar";
  const { selectedCountry } = useSettingsStore();
  const [userData, setUserData] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  const scrollRef = useRef(null);

  if (isLoading) {
    return <NewArrivalsShimmer />;
  }

  return (
    <>
      {productsCard && productsCard?.length > 0 && (
        <div className="sm:my-2 my-1">
          <Container maxWidth="lg" sx={{ padding: 1 }}>
            <HeaderContainer>
              <ViewTitle>{t(title)}</ViewTitle>
              {viewHref && productsCard?.length > 5 && (
                <Link
                  locale={params.locale}
                  href={viewHref}
                  className="link-none"
                >
                  <ViewText>
                    <BoltIcon />
                    {t("view_all")}
                  </ViewText>
                </Link>
              )}
            </HeaderContainer>
            <CarouselWrapper marginTop="0px">
              {!matchesSM ? (
                <Carousel
                  rtl={isRTL}
                  additionalTransfrom={0}
                  autoPlaySpeed={500}
                  renderButtonGroupOutside
                  arrows={false}
                  draggable
                  infinite
                  responsive={{
                    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
                    laptop: { breakpoint: { max: 1024, min: 768 }, items: 4 },
                    tablet: { breakpoint: { max: 768, min: 464 }, items: 2 },
                    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
                  }}
                  showDots={false}
                  slidesToSlide={1}
                  swipeable

                  customButtonGroup={
                    productsCard?.length > 4 ? (
                      <CustomButtonGroup top="48%" left="-45px" />
                    ) : null
                  }
                >
                  {productsCard?.map((item, index) => {
                    const href = `/products/${item.slug}?product_id=${item.product_id}&variant_id=${item.product_variant_id}`;
                    return (
                      <ProductCard
                        key={item.title}
                        item={item}
                        href={href}
                        selectedCountry={selectedCountry}
                        handleOpenLogin={handleOpenLogin}
                      />
                    );
                  })}
                </Carousel>
              ) : (
                <Box className="flex overflow-x-auto space-x-2 pb-2">
                  {productsCard.map((item, index) => {
                    const href = `/products/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`;
                    return (
                      <Box
                        key={index}
                        className="shrink-0"
                        sx={{ width: { xs: '49%', } }}
                      >
                        <ProductCard
                          key={item.title}
                          item={item}
                          href={href}
                          selectedCountry={selectedCountry}
                          handleOpenLogin={handleOpenLogin}
                        />
                      </Box>
                    );
                  })}
                </Box>
              )}
            </CarouselWrapper>
            <Login
              open={openLogin}
              handleOpenRegister={handleOpenRegister}
              setOpenMobileOtp={handleOpenLogin}
              setOpenForgotPassword={setOpenForgotPassword}
              handleClose={handleCloseLogin}
              handleCloseRegister={handleCloseRegister}
              switchToRegister={switchToRegister}
            />
            <Register
              open={openRegister}
              handleOpenLogin={handleOpenLogin}
              switchToLogin={switchToLogin}
              handleClose={handleCloseRegister}
              handleCloseLogin={handleCloseLogin}
              handleOpenRegister={handleOpenRegister}
            />
            <ForgotPasswordModal
              open={openForgotPassword}
              handleClose={() => setOpenForgotPassword(false)}
              handleOpenLogin={handleOpenLogin}
              setOpenMobileOtp={setOpenMobileOtp}
              setUserData={setUserData}
            />
            <OtpDialog
              isDialogOpen={openMobileOtp}
              data={userData}
              handleCloseOtp={() => setOpenMobileOtp(false)}
            />
          </Container>
        </div>
      )}
    </>
  );
};

export default AppSlider;
