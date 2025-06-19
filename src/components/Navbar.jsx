"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  Box,
  Container,
  Badge,
  Divider,
  Button,
  Typography,
  ListItemButton,
  Grid,
  MenuItem,
  FormControl,
  Select,
} from "@mui/material";
import {
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import { BsCart3 } from "react-icons/bs";
import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { Close, FavoriteBorder } from "@mui/icons-material";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import useUserStore from "@/store/user";
import COLORS from "@/utils/colors";
import { useSettingsStore } from "@/store/useSettingsStore";
import { ProductTitle } from "./styles";
import { Link } from "@/i18n/navigation";
import SearchBar from "./SearchBar";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import logo from "../../public/asstes/logo.png";
import {
  IoHomeOutline,
  IoAppsOutline,
  IoFlashOutline,
  IoCubeOutline,
  IoNewspaperOutline,
  IoCallOutline,
} from "react-icons/io5";
import OptimizedImage from "./product-details-page/OptimizedImage";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import OtpDialog from "@/auth/Login/OtpDialog";
import { FaUser } from "react-icons/fa";
import { routing } from "@/i18n/routing";
import { useCountryStore } from "@/store/useCountryStore";
import LocaleSwitcherSelect from "./LocaleSwitcherSelect";
import { supportedLng } from "@/utils/firebase";
import { supportedCurrency } from "@/constants/appConstant";
import { useLanguageStore } from "@/store/useLanguageStore";
import { MdOutlineLanguage } from "react-icons/md";

const Navbar = () => {
  const { currency, locale } = useParams();
  const { selectedCountry, setSelectedCountry } = useSettingsStore();
  const { countries, fetchCountries } = useCountryStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [openSearch, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { item_count, cartItems, deleteCartItem, getCart } = useCartStore();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const t = useTranslations();
  const { wishList, getWishList } = useWishListStore();
  const wishListCount = wishList.length;

  // user login info....
  const { userInfo } = useUserStore();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [userData, setUserData] = useState(null);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };


  useEffect(() => {
    getCart();
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      const getWishListData = async () => {
        try {
          await getWishList();
        } catch (error) {
          console.log(error);
        }
      };
      getWishListData();
    }
  }, [userInfo]);

  const navList = [
    { name: t("home"), slug: "/", icon: <IoHomeOutline size={20} /> },
    {
      name: t("category"),
      slug: "/category",
      icon: <IoAppsOutline size={20} />,
    },
    {
      name: t("smart_shopping"),
      slug: "/smart-shopping",
      icon: <IoFlashOutline size={20} />,
    },
    {
      name: t("unboxing_challange"),
      slug: "/unboxing-challenge",
      icon: <IoCubeOutline size={20} />,
    },
    { name: t("blog"), slug: "/blog", icon: <IoNewspaperOutline size={20} /> },
    {
      name: t("contect_us"),
      slug: "/contact-us",
      icon: <IoCallOutline size={20} />,
    },
  ];

  const handleClickOpen = () => {
    setSearchOpen(true);
  };

  const handleClose = () => {
    setSearchOpen(false);
  };

  const handleScroll = () => {
    if (window.scrollY > 110) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const params = useParams();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };



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
      <div style={{ borderBottom: "1px solid #eee" }} className="py-1">
        <AppBar
          sx={{
            minHeight: "65px",
            position: isScrolled ? "fixed" : "sticky",
            top: 0,
            backgroundColor: "white",
            boxShadow: isScrolled ? "0 0 7px rgb(0 0 0 / 10%)" : "none",
            transition: "all 0.3s ease-in-out",
            transform: isScrolled ? "translateY(0)" : "translateY(0)",
            px: 0,
          }}
        >
          <Container maxWidth="lg" sx={{ overflow: "hidden", padding: 1 }}>
            <Toolbar
              sx={{
                justifyContent: "space-between",
                padding: "0px !important",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Link locale={params.locale} href={`/`}>
                  <OptimizedImage
                    src={logo}
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </Link>
              </Box>
              <Box sx={{ display: "flex" }}>
                <Box
                  sx={{
                    display: { xs: "none", md: "flex" },
                    alignItems: "center",
                    color: "#000",
                    "&:hover": { color: "#bb1f2a" },
                  }}
                >
                  {navList?.map((item, index) => {
                    const isHome =
                      item.slug === "/" && pathname === `/${params.currency}`;
                    const isActive =
                      item.slug === "/"
                        ? isHome
                        : pathname.split("/").pop() ===
                        item.slug.split("/").pop();
                    const textColor = isActive
                      ? "text-red-800"
                      : "text-gray-800";
                    return (
                      <Link
                        key={index}
                        href={item?.slug}
                        locale={params.locale}
                        style={{ color: `${textColor} !important` }}
                        className={`mx-2 no-underline transition-colors text-[14px]  ${isActive ? "active" : ""} hover:text-[#bb1f2a]`}
                      >
                        <Typography
                          style={{
                            color: `${textColor} !important`,
                            fontWeight: "500",
                            fontSize: "14px",
                          }}
                          className="text-[14px] text-sm font-[Poppins] uppercase"
                        >
                          {item?.name}
                        </Typography>
                      </Link>
                    );
                  })}
                </Box>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "16px" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <IconButton
                      onClick={handleClickOpen}
                      aria-label="search_icon"
                    >
                      <IoSearchOutline
                        className="search_icon"
                        color="#292b2c"
                        size={20}
                      />
                    </IconButton>
                    {userInfo && (
                      <IconButton
                        onClick={() => router.push("/wishlist")}
                        aria-label="wishlist"
                        sx={{ mx: "3px" }}
                      >
                        <Badge badgeContent={wishListCount || 0} color="error">
                          <FavoriteBorder color="inherit" fontSize="medium" />
                        </Badge>
                      </IconButton>
                    )}
                    <IconButton
                      onMouseEnter={handleMouseEnter}
                      onMouseLeave={handleMouseLeave}
                      aria-label="inherit"
                    >
                      <Badge badgeContent={item_count || 0} color="error">
                        <BsCart3 size={20} color="#292b2c" />
                      </Badge>
                    </IconButton>

                    <IconButton
                      edge="end"
                      sx={{ display: { xs: "block", md: "none" }, ml: "3px" }}
                      onClick={() => setOpen(true)}
                    >
                      <IoMenuOutline size={28} color="#292b2c" />
                    </IconButton>
                    <div className="block sm:hidden">
                      {userInfo ? (
                        <div
                          className="text-gray-500 pl-2 pr-1  cursor-pointer hover:text-gray-600 capitalize text-sm"
                          onClick={() => router.push("/my-account")}
                        >
                          <FaUser className="text-xl" />
                          {/* <span className="hidden sm:inline">{userInfo?.name}</span> */}
                        </div>
                      ) : (
                        <button
                          onClick={handleOpenLogin}
                          className="text-gray-500 pl-2 pr-1 cursor-pointer hover:text-gray-600 capitalize text-sm"
                        >
                          <FaUser className=" text-xl" />
                        </button>
                      )}
                    </div>
                  </Box>
                </Box>
              </Box>
            </Toolbar>
          </Container>
          <Container
            maxWidth="lg"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {isHovered && (
              <Box
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{
                  position: "absolute",
                  top: { sm: "42px", xs: "70px" },

                  alignSelf: "flex-end",
                  width: { sm: "350px", xs: "91%" },

                  backgroundColor: "white",
                  boxShadow: 3,
                  // zIndex: 999,
                }}
              >
                <Box sx={{ maxHeight: "250px", overflowY: "auto", px: 2 }}>
                  {cartItems?.branch && cartItems?.branch?.length > 0 ? (
                    cartItems?.branch?.map((branch) =>
                      branch?.item && branch?.item?.length > 0
                        ? branch?.item?.map((item, index) => (
                          <Box
                            key={index}
                            sx={{
                              display: "flex",
                              gap: 1,
                              my: 1,
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                gap: 1,
                                alignItems: "center",
                              }}
                            >
                              <Image
                                src={item?.image}
                                alt={item?.title}
                                width={80}
                                height={70}
                                className="object-cover max-h-[70px] min-w-[80px] mx-3"
                              />
                              <Box onClick={handleMouseLeave}>
                                <Link
                                  locale={params.locale}
                                  className="link-none"
                                  href={`/products/${item?.title}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`}
                                >
                                  <ProductTitle
                                    sx={{
                                      fontSize: { xs: "14px", sm: "14px" },
                                    }}
                                  >
                                    {item?.title}
                                  </ProductTitle>
                                </Link>
                                <Typography
                                  sx={{
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    color: COLORS.textColor,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "4px",
                                  }}
                                >
                                  <span dir="ltr">
                                    {item?.cart_quantity} X{" "}
                                    {item?.sale_price > 0
                                      ? item?.sale_price
                                      : item?.list_price}
                                  </span>
                                  <span>
                                    {selectedCountry?.currency_code}
                                  </span>
                                </Typography>
                              </Box>
                            </div>
                            <IconButton>
                              <Close
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  deleteCartItem(
                                    item?.cart_item_id,
                                    item?.product_variant_id,
                                  );
                                }}
                                sx={{
                                  display: "flex",
                                  justifyContent: "flex-end",
                                  alignItems: "center",
                                  color: COLORS.textColor,
                                }}
                                size={20}
                              />
                            </IconButton>
                          </Box>
                        ))
                        : null,
                    )
                  ) : (
                    <Typography
                      sx={{
                        textAlign: "center",
                        fontWeight: "500",
                        color: COLORS.textColor,
                        my: 2,
                      }}
                    >
                      No products added to the cart
                    </Typography>
                  )}
                </Box>

                {cartItems?.branch && cartItems?.branch?.length > 0 && (
                  <>
                    <Divider className="bg-secondary mt-2" />
                    <Box display="flex" justifyContent="space-between" m={1.5}>
                      <Button
                        disabled={pathname === "cart"}
                        onClick={() => {
                          handleMouseLeave();
                          router.push("/cart");
                        }}
                        variant="contained"
                        sx={{
                          backgroundColor: "#000",
                          borderRadius: "0px",
                          px: "25px",
                        }}
                      >
                        {t("view_cart")}
                      </Button>

                      <Button
                        onClick={() => {
                          handleMouseLeave();
                          router.push("/checkout");
                        }}
                        variant="contained"
                        sx={{
                          backgroundColor: COLORS.primary,
                          borderRadius: "0px",
                          px: "25px",
                        }}
                      >
                        {t("checkout")}
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            )}
          </Container>
        </AppBar>

        <SearchBar handleClose={handleClose} openSearch={openSearch} />
      </div>


      {/* Mobile Drawer start here to  */}
      <div className="block sm:hidden">
        <Drawer
          open={open}
          onClose={toggleDrawer(false)}
          PaperProps={{ sx: { width: { xs: "100%", md: "40%" } } }}
        >
          <Box sx={{ width: "100%", pt: 0 }}>
            <div className="bg-white text-right shadow-md mb-3 py-2">
              <IconButton onClick={toggleDrawer(false)}>
                <IoCloseOutline color="#292b2c" size={28} />
              </IconButton>
            </div>
            {navList?.map((item, index) => {
              const isHome =
                item.slug === "/" && pathname === `/${params.currency}`;
              const isActive =
                item.slug === "/"
                  ? isHome
                  : pathname.split("/").pop() === item.slug.split("/").pop();
              return (
                <ListItemButton
                  key={index}
                  onClick={() => {
                    setOpen(false);
                    setTimeout(() => {
                      router.push(item?.slug);
                    }, 500);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.3,
                    color: isActive ? COLORS.white : COLORS.textColor,
                    background: isActive ? COLORS.primary : "white",
                    fontWeight: 500,
                    fontFamily: "Poppins",
                    fontSize: "14px",
                    textTransform: "uppercase",
                    transition: "color 0.3s",
                    "&:hover": {
                      color: COLORS.primary,
                    },
                    mx: 2,
                    borderRadius: "4px",
                  }}
                >
                  {item.icon}
                  {item.name}
                </ListItemButton>
              );
            })}
          </Box>

          <div className="flex w-full items-center ml-8">
            <MdOutlineLanguage size={25} color="#666" />

            <div className="flex w-full items-center">
              <LocaleSwitcherSelect
                defaultValue={locale}
                label="Change Language"
              >
                {routing.locales.map((cur) => (
                  <MenuItem sx={{ fontWeight: 700, color: "#000" }} key={cur} value={cur}>
                    {cur?.toUpperCase()}
                  </MenuItem>
                ))}
              </LocaleSwitcherSelect>

              <div>
                <select
                  value={currency?.toLowerCase() || selectedCountry?.currency_code || ""}
                  onChange={handleCountryChange}
                  className="border-none bg-transparent text-sm text-black focus:outline-none focus:ring-0 min-w-[170px]"
                >
                  {countries?.map((country) => (
                    <option
                      key={country?.id}
                      value={country?.currency_code?.toLowerCase()}
                      className="text-sm text-black hover:bg-red-700 font-medium hover:text-white"
                    >
                      {country?.country_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </Drawer>
      </div>
      {/* Mobile Drawer end here  */}


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
    </>
  );
};

export default Navbar;
