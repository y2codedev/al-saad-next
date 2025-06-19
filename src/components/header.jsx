"use client";

import { useState, useEffect } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  Box,
  Grid,
  Container,
} from "@mui/material";
import Login from "@/auth/Login/Login.jsx";
import Register from "@/auth/Register/Register.jsx";
import { useCountryStore } from "@/store/useCountryStore.js";
import { useSettingsStore } from "@/store/useSettingsStore.js";
import useUserStore from "@/store/user.js";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal.jsx";
import useCartStore from "@/store/useCartStore.js";
import OtpDialog from "@/auth/Login/OtpDialog.jsx";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLanguageStore } from "@/store/useLanguageStore";
import { supportedLng } from "@/utils/firebase";
import { supportedCurrency } from "@/constants/appConstant";
import MobileInstallBanner from "./MobileInstallBanner";
const header = () => {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { currency, locale } = useParams();
  const { selectedCountry, setSelectedCountry } = useSettingsStore();
  const country = selectedCountry?.currency_code?.toLowerCase() || "aed";

  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const { countries, fetchCountries } = useCountryStore();
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const { fetchCartProductIds, createToCart } = useCartStore();
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [userData, setUserData] = useState(null);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const { userInfo } = useUserStore();
  const t = useTranslations();
  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  useEffect(() => {
    const fetchCartId = async () => {
      try {
        const cartId = localStorage.getItem("cart_id");
        if (!cartId) {
          await createToCart();
        } else {
          await fetchCartProductIds();
        }
      } catch (error) {
        console.error("Error retrieving cart_id:", error);
      }
    };

    fetchCartId();
  }, [fetchCartProductIds, createToCart, userInfo, locale, country]);

  const handleCountryChange = (event) => {
    const selectedCurrencyCode = event.target.value.toLowerCase();
    if (supportedCurrency.includes(selectedCurrencyCode?.toString())) {
      const newPath = `/${params?.locale}/${selectedCurrencyCode}`;
      let selectedCountry = countries.find(
        (country) =>
          country?.currency_code?.toLowerCase() === selectedCurrencyCode,
      );
      if (selectedCountry) {
        setSelectedCountry(selectedCountry);
      }
      window.location.href = newPath;
    }
  };

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  function updateLanguage(languageToUse) {
    useLanguageStore.getState().setLanguage(languageToUse);
    document.documentElement.dir = languageToUse === "ar" ? "rtl" : "ltr";
    document.body.setAttribute("dir", languageToUse === "ar" ? "rtl" : "ltr");
  }

  function updateCurrency(cur) {
    if (cur) {
      let selectedCountry = countries?.find(
        (country) =>
          country?.currency_code?.toLowerCase() === cur?.toLowerCase(),
      );
      if (selectedCountry) {
        setSelectedCountry(selectedCountry);
      }
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const pathSegments = pathname.split("/").filter(Boolean);
      const currentLang = pathSegments[0];
      const currentCurr = pathSegments[1];

      const languageFromUrl = supportedLng.includes(currentLang)
        ? currentLang
        : null;
      const curFromUrl = supportedCurrency.includes(currentCurr)
        ? currentCurr
        : null;

      const languageToUse = languageFromUrl || "en";
      const currencyToUse = curFromUrl || "aed";

      updateLanguage(languageToUse);
      updateCurrency(currencyToUse);
    }
  }, [countries, pathname]);

  return (
    <>
      <MobileInstallBanner />
      <div className="border-b border-[#eee] w-full pb-[5px] hidden lg:block">
        <Container maxWidth="lg" sx={{ padding: 0 }}>
          <Box sx={{ width: "100%" }}>
            <Grid
              container
              alignItems="center"
              justifyContent={"space-between"}
              display={"flex"}
            >
              <Grid
                sx={{
                  display: "flex",
                }}
                size={9}
              >
                <LocaleSwitcherSelect
                  defaultValue={locale}
                  label="Change Language"
                >
                  {routing.locales.map((cur) => (
                    <MenuItem key={cur} value={cur}>
                      {cur?.toUpperCase()}
                    </MenuItem>
                  ))}
                </LocaleSwitcherSelect>
                <FormControl>
                  <Select
                    MenuProps={{ disableScrollLock: true }}
                    value={
                      currency?.toLowerCase() ||
                      selectedCountry?.currency_code ||
                      ""
                    }
                    onChange={handleCountryChange}
                    displayEmpty={false}
                    sx={{
                      border: "none",
                      textOverflow: "inherit",
                      overflow: "hidden",
                      minWidth: 170,
                      ".MuiOutlinedInput-notchedOutline": { border: "none" },
                      ".MuiSelect-select": {
                        padding: "0",
                        color: "#333",
                        fontSize: 14,
                      },
                    }}
                  >
                    {countries?.map((country) => (
                      <MenuItem
                        key={country?.id}
                        value={country?.currency_code?.toLowerCase()}
                        sx={{
                          fontSize: 14,
                          ":hover": {
                            backgroundColor: "#bb1f2a",
                            color: "#fff",
                          },
                        }}
                      >
                        {country?.country_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid
                sx={{
                  display: "contents",
                }}
                size={3}
              >
                <div className="hidden sm:block">
                  {userInfo ? (
                    <div
                      className=" mr-3 text-gray-600 cursor-pointer capitalize text-sm"
                      onClick={() => router.push("/my-account")}
                    >
                      <span className="hidden text-gray-600 font-semibold sm:inline">{userInfo?.name}</span>
                    </div>
                  ) : (
                    <button
                      onClick={handleOpenLogin}
                      className="text-gray-600 font-medium mr-3  cursor-pointer hover:text[#bb1f2a] capitalize text-sm"
                    >
                      Login
                    </button>
                  )}
                </div>

                <Login
                  open={openLogin}
                  handleOpenRegister={handleOpenRegister}
                  setOpenMobileOtp={handleOpenLogin}
                  setOpenForgotPassword={setOpenForgotPassword}
                  handleClose={handleCloseLogin}
                  handleCloseRegister={handleCloseRegister}
                  switchToRegister={switchToRegister}
                  setUserData={setUserData}
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
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default header;
