"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Box, Grid, Typography, IconButton, Container } from "@mui/material";
import styled from "styled-components";
import {
  FaFacebook,
  FaInstagram,
  FaSnapchat,
  FaTiktok,
  FaYoutube,
  FaPhone,
} from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { CiLocationOn } from "react-icons/ci";
import useUserStore from "../store/user";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import logo from "@/assets/logo-footer.png";

const Login = dynamic(() => import("../auth/Login/Login"), { ssr: false });
const Register = dynamic(() => import("../auth/Register/Register"), {
  ssr: false,
});
const ForgotPasswordModal = dynamic(
  () => import("../auth/Login/ForgotPasswordModal"),
  { ssr: false },
);
const OtpDialog = dynamic(() => import("../auth/Login/OtpDialog"), {
  ssr: false,
});

const SectionTitle = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const SocialMediaIcons = styled(Box)`
  display: flex;
  gap: 1rem;
`;

const FooterBottom = styled(Box)`
  border-top: 1px solid #444;
  font-size: 14px;
`;

const Footer = () => {
  const t = useTranslations();
  const { isLoggedIn } = useUserStore();
  const [userData, setUserData] = useState(null);
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const handleForgotPassword = () => setOpenForgotPassword(true);
  const params = useParams();

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  return (
    <div className="hidden sm:block w-full">
      <Box
        sx={{
          backgroundColor: "#202325",
          color: "white",
          py: { xs: 4, sm: '100px 0px 70px 0px' }
        }}
      >
        <Container maxWidth="lg">
          <Grid
            container
            mb={4}
            justifyContent="space-between"
            direction={{ xs: "column", sm: "row" }}
          >
            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <div className="text-left mt-3">
                <Image
                  src={logo}
                  alt="Al Saad Home Logo"
                  width={200}
                  height={50}
                />
              </div>
              <Typography fontSize={14}>{t("your_dream")}</Typography>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <SectionTitle variant="h6">{t("my_account")}</SectionTitle>
              <Box sx={{ lineHeight: 2.5 }}>
                {[
                  {
                    to: "my-account",
                    label: t("my_account"),
                    isProtected: true,
                  },
                  {
                    to: "order-history",
                    label: t("order_history"),
                    isProtected: true,
                  },
                  { to: "wishlist", label: t("wishlist"), isProtected: true },
                  {
                    to: "privacy-policy",
                    label: t("privacy_policy"),
                    isProtected: false,
                  },
                  {
                    to: "terms-of-use",
                    label: t("trems_conditions"),
                    isProtected: false,
                  },
                  { to: "category", label: t("category"), isProtected: false },
                ]?.map((link, id) =>
                  link?.isProtected && !isLoggedIn ? (
                    <Typography
                      key={id}
                      fontSize={14}
                      mt={1.5}
                      onClick={handleOpenLogin}
                      sx={{
                        cursor: "pointer",
                        color: "#fff",
                        ":hover": { color: "#bb1f2a" },
                      }}
                    >
                      {link?.label}
                    </Typography>
                  ) : (
                    <Link
                      locale={params.locale}
                      className=" text-white"
                      key={id}
                      href={link?.to}
                    >
                      <Typography
                        fontSize={14}
                        mt={1.5}
                        sx={{
                          cursor: "pointer",
                          color: "#fff",
                          ":hover": { color: "#bb1f2a" },
                        }}
                      >
                        {link?.label}
                      </Typography>
                    </Link>
                  ),
                )}
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <SectionTitle variant="h6">{t("find_our_branches")}</SectionTitle>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <CiLocationOn />
                <Link
                  locale={params.locale}
                  className=" text-white"
                  href="/contact-us"
                >
                  <Typography
                    fontSize={14}
                    sx={{
                      cursor: "pointer",
                      color: "#fff",
                      ":hover": { color: "#bb1f2a" },
                    }}
                  >
                    UAE - Sharjah - Industrial Area 18
                  </Typography>
                </Link>
              </Box>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
              >
                <IoMdMail />
                <Typography fontSize={14}>contact@alsaadhome.com</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <FaPhone />
                <Typography fontSize={14}>600 575 525</Typography>
              </Box>
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 3,
              }}
            >
              <SectionTitle variant="h6">{t("socila_media")}</SectionTitle>
              <SocialMediaIcons>
                {[
                  { icon: FaTiktok, label: "TikTok" },
                  { icon: FaFacebook, label: "Facebook" },
                  { icon: FaInstagram, label: "Instagram" },
                  { icon: FaSnapchat, label: "Snapchat" },
                  { icon: FaYoutube, label: "YouTube" },
                ]?.map(({ icon: Icon, label }, index) => (
                  <IconButton
                    key={index}
                    sx={{ color: "white", ":hover": { color: "#bb1f2a" } }}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </IconButton>
                ))}
              </SocialMediaIcons>
            </Grid>
          </Grid>
        </Container>
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
        <FooterBottom>
          <Container>
            <Typography
              variant="body2"
              sx={{
                mt: { xs: 1, sm: 3 },
                mb: { xs: 5, sm: 1 },
                textAlign: "left",
              }}
            >
              © 2020-2024 {t("all_rights_reserved")}{" "}
              <strong>AL SAAD FURNITURE EST</strong>
            </Typography>
          </Container>
        </FooterBottom>
      </Box>
    </div>
  );
};

export default Footer;
