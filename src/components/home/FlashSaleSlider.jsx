"use client";

import React, { useState, useEffect } from "react";
import Carousel from "react-multi-carousel";
import { useMediaQuery, useTheme, Container, Box } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import CustomButtonGroup from "../CustomButtonGroup";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import useUserStore from "@/store/user";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import {
  CarouselWrapper,
  HeaderContainer,
  TimerBox,
  TimerItem,
  ViewText,
  ViewTitle,
} from "../styles";
import { useLanguageStore } from "@/store/useLanguageStore";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useSettingsStore } from "@/store/useSettingsStore";
// import flashImg from "/flash_sale.png";
import { useTranslations } from "next-intl";
import NewArrivalsShimmer from "@/components/skeleton/NewArrivalsShimmer";
import { Link } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import ProductCard from "../ProductCard";

const FlashSaleSlider = ({ item, isLoading }) => {
  const theme = useTheme();
  const params = useParams();
  const t = useTranslations();
  const matchesSM = useMediaQuery(theme.breakpoints.down("md"));
  const isRTL = useLanguageStore.getState().language === "ar";
  const [timers, setTimers] = useState([]);
  useWishListStore();
  const { selectedCountry } = useSettingsStore();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [userData, setUserData] = useState(null);

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const saudiTime = new Date(now.getTime() + -2 * 45 * 60 * 1000);
    const end = new Date(endDate).getTime();
    const distance = end - saudiTime;

    if (distance > 0) {
      return {
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      };
    } else {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  };

  useEffect(() => {
    if (!item?.end_date) {
      return;
    }
    const interval = setInterval(() => {
      setTimers((prevTimers) => ({
        ...prevTimers,
        [item.id]: calculateTimeLeft(item.end_date),
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [item?.end_date]);

  if (isLoading) {
    return <NewArrivalsShimmer />;
  }

  return (
    <div className="sm:my-5 my-1">
      <Container maxWidth="lg" sx={{ padding: 1 }}>
        <HeaderContainer>
          <ViewTitle variant="h5">{item?.banner_name}</ViewTitle>
          <TimerBox>
            {timers[item?.id] &&
              ["days", "hours", "minutes", "seconds"]?.map((unit, index) => (
                <TimerItem key={index} variant="body2">
                  {String(timers[item?.id]?.[unit] || 0).padStart(2, "0")}
                  {unit.charAt(0).toUpperCase()}
                </TimerItem>
              ))}
          </TimerBox>
          <Link locale={params.locale} href={`/search/flash_sale/${item?.id}`}>
            <ViewText variant="h6">
              <BoltIcon />
              {t("view_all")}
            </ViewText>
          </Link>
        </HeaderContainer>

        <CarouselWrapper marginTop={"0px" || 0}>
          {!matchesSM ? (
            <Carousel
              rtl={isRTL}
              additionalTransfrom={0}
              autoPlaySpeed={3000}
              renderButtonGroupOutside
              arrows={false}
              draggable
              infinite={true}
              responsive={{
                desktop: {
                  breakpoint: { max: 3000, min: 1024 },
                  items: 4,
                },
                laptop: {
                  breakpoint: { max: 1024, min: 768 },
                  items: 4,
                },
                tablet: {
                  breakpoint: { max: 768, min: 464 },
                  items: 2,
                },
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 2,
                },
              }}
              showDots={false}
              slidesToSlide={3}
              swipeable
              customButtonGroup={
                item?.items?.length > 4 && !matchesSM ? (
                  <CustomButtonGroup top="48%" left="-45px" />
                ) : null
              }
            >
              {item?.items &&
                item?.items?.map((item, index) => {
                  const href = `/products/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`;
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
              {item?.items?.map((item, index) => {
                const href = `/products/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`;
                return (
                  <Box
                    key={item.title}
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
  );
};

export default FlashSaleSlider;
