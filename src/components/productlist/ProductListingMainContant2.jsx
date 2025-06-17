"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  Rating,
  useMediaQuery,
} from "@mui/material";
import { Link, useRouter } from "@/i18n/navigation";
import { FavoriteBorder } from "@mui/icons-material";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import useUserStore from "@/store/user";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import { ContainerBox, NewChipStyle, ProductTitle } from "../styles";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useParams } from "next/navigation";
import Image from "next/image";
import ImagePath from "@/constants/imagepath";
import WishlistButton from "../WishlistButton";
const ProductListingMainContant2 = ({ productsCard }) => {
  const { isItemInCart, addToCart } = useCartStore();
  const { toggleWishlist, isItemInWishlist } = useWishListStore();
  const { selectedCountry } = useSettingsStore();
  const { isLoggedIn } = useUserStore();
  const matchesSM = useMediaQuery("(max-width:600px)");
  const [userData, setUserData] = useState(null);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };
  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };
  const navigate = useRouter();
  const params = useParams();
  return (
    <>
      {productsCard?.length > 0 ? (
        productsCard?.map((item, index) => (
          <Grid key={index} mb={4}>
            <Card
              sx={{
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
                margin: "5px",
                display: "flex",
                overflow: "hidden",
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box>
                <Link
                  locale={params.locale}
                  className="link-none"
                  href={`/products/${item?.slug}?product_id=${item?.product_id?.toString()}&variant_id=${item?.product_variant_id?.toString()}`}
                >
                  <ContainerBox>
                    <div
                      className={`relative w-[350px] ${matchesSM ? "h-[150px]" : "h-[180px]"}`}
                    >
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        objectFit="cover"
                        fill={true}
                        className="object-cover w-full h-full transition-all duration-300 ease-out"
                        loading="lazy"
                      />
                    </div>
                  </ContainerBox>
                </Link>
              </Box>
              <CardContent sx={{ p: { xs: "8px", sm: "16px" } }}>
                <ProductTitle>{item?.title}</ProductTitle>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        displayDirection: "column",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {item?.sale_price > 0 &&
                        item?.sale_price !== item?.list_price && (
                          <Typography
                            noWrap
                            sx={{
                              color: "#bb1f2a",
                              fontWeight: 600,
                              fontSize: { xs: "14px", sm: "1rem" },
                            }}
                          >
                            {item?.sale_price} {selectedCountry?.currency_code}
                          </Typography>
                        )}
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                              item.sale_price !== item?.list_price
                                ? "line-through"
                                : "none",
                            fontSize: { xs: "14px", sm: "1rem" },
                          }}
                        >
                          {item?.list_price} {selectedCountry?.currency_code}
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
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
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
                      ({item?.rating || 0})
                    </Typography>
                  </Box>
                </Box>
                <div className="flex items-center mt-2 sm:mt-9 justify-between">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >
                    <div className="flex items-center justify-end">
                      <button
                        disabled={item && item?.qty === 0}
                        onClick={() => {
                          if (item?.product_variant_id) {
                            if (!isItemInCart(item?.product_variant_id)) {
                              addToCart(item?.product_variant_id);
                            } else {
                              navigate.push("/cart");
                            }
                          }
                        }}
                        aria-label="add to cart"
                        className={`flex items-center gap-2 px-3 py-2 mr-2 text-white text-sm sm:text-base rounded
                         ${item && item?.qty === 0 ? "bg-gray-400 cursor-not-allowed" : "bg-[#bb1f2a] hover:bg-[#a61c25]"}`}
                      >
                        <svg
                          className="w-4 h-4"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 1024 1024"
                        >
                          <path
                            fill="#fff"
                            d="M1015.66 284a31.82 31.82 0 0 0-25.999-13.502h-99.744L684.78 95.666c-24.976-24.976-65.52-25.008-90.495 0L392.638 270.498h-82.096l-51.408-177.28c-20.16-69.808-68.065-77.344-87.713-77.344H34.333c-17.568 0-31.776 14.224-31.776 31.776S16.78 79.425 34.332 79.425h137.056c4.336 0 17.568 0 26.593 31.184l176.848 649.936c3.84 13.712 16.336 23.183 30.592 23.183h431.968c13.408 0 25.376-8.4 29.904-21.024l152.256-449.68c3.504-9.744 2.048-20.592-3.888-29.024zM639.537 140.93l152.032 129.584H487.457zm175.488 579.263H429.538L328.386 334.065h616.096zm-63.023 127.936c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80m-288 0c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80"
                          />
                        </svg>
                        {isItemInCart(item?.product_variant_id)
                          ? "Go to Cart"
                          : "Add to Cart"}
                      </button>
                    </div>
                    <WishlistButton
                      isLoggedIn={isLoggedIn}
                      productId={item?.product_id}
                      variantId={item?.product_variant_id}
                      isItemInWishlist={isItemInWishlist}
                      toggleWishlist={toggleWishlist}
                      handleOpenLogin={handleOpenLogin}
                    />
                  </Box>
                  <div>
                    {item?.is_new && <NewChipStyle label="New" />}
                    {item?.is_flash_sale || item?.online_exclusive ? (
                      <Image
                        src={ImagePath.flashSale}
                        alt={item?.title}
                        objectFit="cover"
                        width={60}
                        height={50}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={80}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))
      ) : (
        <Box
          sx={{
            display: { sm: "flex", xs: "none" },
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            width: "100%",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              width: "100%",
              color: "gray",
              textAlign: "center",
              position: "absolute",
              top: 100,
            }}
          >
            No Product Found
          </Typography>
        </Box>
      )}
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
    </>
  );
};
export default ProductListingMainContant2;
