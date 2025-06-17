"use client";

import React, { useState } from "react";
import { Typography, Box, Grid, useMediaQuery } from "@mui/material";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import useUserStore from "@/store/user";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useParams } from "next/navigation";
import ProductCard from "../ProductCard";
const ProductListingMainContant = ({ productsCard = [] }) => {
  const { selectedCountry } = useSettingsStore();
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

  return (
    <>
      <Grid container sx={{ overflow: "hidden", mb: { xs: 5, sm: 0 } }}>
        {productsCard?.length > 0 ? (
          productsCard &&
          productsCard?.map((item, index) => {
            const isEven = index % 2 === 0;
            const href = isEven
              ? `/products/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`
              : `/details-page/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`;
            return (
              <Grid
                sx={{}}
                key={item.title}
                size={{
                  xs: item?.full_product_display ? 12 : 6,
                  sm: 4,
                }}
              >
                <ProductCard
                  key={item.title}
                  item={item}
                  href={href}
                  selectedCountry={selectedCountry}
                  handleOpenLogin={handleOpenLogin}
                  imageHeight={true}
                />
              </Grid>
            );
          })
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
      </Grid>
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

export default ProductListingMainContant;
