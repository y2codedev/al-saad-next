"use client";

import BoltIcon from "@mui/icons-material/Bolt";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import {
  Box,
  useMediaQuery,
  useTheme,
  Typography,
  Container,
  Rating,
} from "@mui/material";
import CustomButtonGroup from "./CustomButtonGroup";
import useCartStore from "../store/useCartStore";
import { useWishListStore } from "../store/useWishListStore";
import useUserStore from "../store/user";
import Login from "../auth/Login/Login";
import Register from "../auth/Register/Register";
import ForgotPasswordModal from "../auth/Login/ForgotPasswordModal";
import CartButton from "@/components/CartButton";
import {
  CardWrapper,
  CarouselWrapper,
  ContainerBox,
  FlashSaleImg,
  HeaderContainer,
  NewChipStyle,
  PriceContainer,
  ProductTitle,
  StyledCardContent,
  ViewText,
  ViewTitle,
} from "./styles";
import { useLanguageStore } from "../store/useLanguageStore";
import OtpDialog from "../auth/Login/OtpDialog";
import { useSettingsStore } from "../store/useSettingsStore";
import { useTranslations } from "next-intl";
import NewArrivalsShimmer from "./skeleton/NewArrivalsShimmer";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useParams } from "next/navigation";
import WishlistButton from "./WishlistButton";

const RecommendedProducts = ({ productsCard, isLoading }) => {
  const theme = useTheme();
  const t = useTranslations();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const isRTL = useLanguageStore.getState().language === "ar";
  const {
    isItemInCart,
    toggleAddToCart,
    loadingVariants: loadingState,
  } = useCartStore();
  const { toggleWishlist, isItemInWishlist } = useWishListStore();
  const { selectedCountry } = useSettingsStore();
  const { isLoggedIn } = useUserStore();
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const handleForgotPassword = () => setOpenForgotPassword(true);
  const [userData, setUserData] = useState(null);
  const params = useParams();

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  if (isLoading) {
    return <NewArrivalsShimmer />;
  }

  return (
    <div>
      <Container maxWidth="lg" sx={{ padding: 1 }}>
        <HeaderContainer>
          <ViewTitle>{t("recommended")}</ViewTitle>
          <Link
            locale={params.locale}
            href={`/search/recommended_product`}
            className="link-none"
          >
            <ViewText>
              <BoltIcon />
              {t("view_all")}
            </ViewText>
          </Link>
        </HeaderContainer>

        <CarouselWrapper marginTop={"0px" || 0}>
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
              productsCard?.length > 4 && !matchesSM ? (
                <CustomButtonGroup top="48%" left="-45px" />
              ) : null
            }
          >
            {productsCard &&
              productsCard?.map((item, index) => {
                return (
                  <CardWrapper key={index}>
                    <Box position="relative">
                      {item?.is_new === true && <NewChipStyle label="New" />}
                      <Link
                        locale={params.locale}
                        href={`/products/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`}
                        className="link-none"
                      >
                        {item?.photos?.length > 0 && (
                          <ContainerBox>
                            <div
                              className={`relative w-full overflow-hidden ${matchesSM ? "min-h-[150px] max-h-[175px]" : "min-h-[200.37px] max-h-[276.37px]"}`}
                            >
                              <Image
                                src={item?.photos[0] || item?.image}
                                fill={true}
                                className="object-cover w-full h-full transition-all duration-300 ease-out"
                                alt="recommended product"
                                onMouseOver={(e) => {
                                  if (item?.photos?.length > 1) {
                                    e.currentTarget.src = item?.photos[1];
                                  }
                                  e.currentTarget.style.transition =
                                    "all .3s ease-out 0s !important";
                                }}
                                onMouseOut={(e) => {
                                  e.currentTarget.src = item?.photos[0];
                                }}
                              />
                            </div>
                          </ContainerBox>
                        )}
                      </Link>

                      {item?.is_flash_sale ? (
                        <FlashSaleImg
                          component="img"
                          src={"/flash_sale.png"}
                          alt={item?.title}
                          loading="lazy"
                        />
                      ) : item?.online_exclusive ? (
                        <FlashSaleImg
                          component="img"
                          src="https://staging-alsaadhome.s3.us-east-2.amazonaws.com/assets/front/images/online-exclusive-en.jpeg"
                          alt={item?.title}
                          loading="lazy"
                        />
                      ) : null}
                    </Box>
                    <StyledCardContent>
                      <ProductTitle
                        sx={{ fontSize: { xs: "14px", sm: "1rem" } }}
                        variant="h6"
                      >
                        {item?.title}
                      </ProductTitle>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: {
                            xs: item?.sale_price > 0 ? "column" : "row",
                            sm: "row",
                          },
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          // mt: item?.sale_price > 0 ? 1 : 0,
                          textAlign: "left",
                        }}
                      >
                        <PriceContainer>
                          {item?.sale_price > 0 &&
                            item?.sale_price !== item?.list_price && (
                              <Typography
                                noWrap
                                sx={{
                                  color: "#bb1f2a",
                                  fontWeight: 600,
                                  fontSize: { xs: "14px", sm: "1rem" },
                                  mt: "8px",
                                }}
                              >
                                {item?.sale_price}{" "}
                                {selectedCountry?.currency_code}
                              </Typography>
                            )}
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            <Typography
                              noWrap
                              sx={{
                                fontWeight:
                                  item?.sale_price > 0 &&
                                  item?.sale_price !== item?.list_price
                                    ? "0"
                                    : "600",
                                color:
                                  item?.sale_price > 0 &&
                                  item?.sale_price !== item?.list_price
                                    ? "#687188"
                                    : "#bb1f2a",
                                textDecoration:
                                  item?.sale_price > 0 &&
                                  item?.sale_price !== item?.list_price
                                    ? "line-through"
                                    : "none",
                                fontSize: { xs: "14px", sm: "1rem" },
                              }}
                            >
                              {item?.list_price}{" "}
                              {selectedCountry?.currency_code}
                            </Typography>
                            {item?.sale_price > 0 &&
                              item?.sale_price !== item?.list_price && (
                                <Typography
                                  noWrap
                                  sx={{
                                    color: "green",
                                    fontSize: { xs: "14px", sm: "1rem" },
                                  }}
                                >
                                  {item?.discount_label}
                                </Typography>
                              )}
                          </Box>
                        </PriceContainer>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mt: 1,
                          }}
                        >
                          <CartButton
                            productVariantId={item?.product_variant_id}
                            isLoading={loadingState?.[item?.product_variant_id]}
                            isItemInCart={isItemInCart}
                            onClick={toggleAddToCart}
                          />

                          <WishlistButton
                            isLoggedIn={isLoggedIn}
                            productId={item?.product_id}
                            variantId={item?.product_variant_id}
                            isItemInWishlist={isItemInWishlist}
                            toggleWishlist={toggleWishlist}
                            handleOpenLogin={handleOpenLogin}
                            sx={{ margin: "10px 0px" }}
                          />
                        </Box>
                      </Box>
                      <Box
                        sx={{ display: "flex", alignItems: "center", mt: 1 }}
                      >
                        <Rating
                          readOnly
                          name="no-value"
                          value={item?.rating || 0}
                          sx={{
                            fontSize: { xs: "1.3rem", sm: "1.5rem" },
                            color: "#687188",
                          }}
                        />
                        <Typography
                          sx={{ ml: { xs: 0.5, sm: 1 }, color: "#687188" }}
                          variant="body2"
                        >
                          {" "}
                          ({item?.rating || 0})
                        </Typography>
                      </Box>
                    </StyledCardContent>
                  </CardWrapper>
                );
              })}
          </Carousel>
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
          switchToLogin={switchToLogin}
          handleClose={handleCloseRegister}
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

export default RecommendedProducts;
