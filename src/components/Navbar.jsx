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
} from "@mui/material";
import {
  IoSearchOutline,
  IoMenuOutline,
  IoCloseOutline,
} from "react-icons/io5";
import clsx from "clsx";
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
import logo from "@/assets/logo.avif";
import {
  IoHomeOutline,
  IoAppsOutline,
  IoFlashOutline,
  IoCubeOutline,
  IoNewspaperOutline,
  IoCallOutline,
} from "react-icons/io5";

const Navbar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeLink = pathname.split("/")[2];
  const [openSearch, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { item_count, cartItems, deleteCartItem, getCart } = useCartStore();
  const { userInfo } = useUserStore();
  const { selectedCountry } = useSettingsStore();
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const t = useTranslations();
  const { wishList, getWishList } = useWishListStore();
  const wishListCount = wishList.length;

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
                  <Image
                    src={logo}
                    alt="logo"
                    width={100}
                    height={100}
                    className="object-cover"
                    loading="lazy"
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
        </Drawer>

        <SearchBar handleClose={handleClose} openSearch={openSearch} />
      </div>
    </>
  );
};

export default Navbar;
