"use client";

import React, { useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Dashboard from "@/components/dashboard/Dashboard";
import { RiDeleteBin5Line } from "react-icons/ri";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import {
  StyledCard,
  StyledCardContent,
  StyledButton,
  DeleteIconWrapper,
} from "@/components/WishListStyles";
import {
  BreadCumContainer,
  BreadCumHeader,
  ProductTitle,
  StyledHeading,
} from "@/components/styles";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import { useTranslations } from "next-intl";
import { useRouter, Link } from "@/i18n/navigation";
import Image from "next/image";

const WishList = () => {
  const t = useTranslations();
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const router = useRouter();
  const { wishList, getWishList, removeWishList, loading } = useWishListStore();
  const { isItemInCart, addToCart, loadingVariants } = useCartStore();

  // Define all styles at the top
  const styles = {
    rootBox: {
      minHeight: "100vh",
    },
    container: {
      padding: 1,
      overflow: "hidden",
      my: 2,
    },
    dashboardBox: {
      bgcolor: theme.palette.background.paper,
      boxShadow: "0 0 7px rgb(0 0 0 / 20%)",
    },
    emptyText: {
      width: "100%",
      textAlign: "center",
      mt: 4,
      flex: 1,
    },
    card: {
      flex: "1 1 calc(50% - 16px)",
      maxWidth: "233.33px",
    },
    productTitle: {
      fontSize: { xs: "14px !important", sm: "16px !important" },
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      minHeight: "3rem",
      lineHeight: "1rem",
    },
    actionBox: {
      display: "flex",
      justifyContent: "flex-end",
      mt: 2,
    },
    outOfStockButton: {
      fontSize: { xs: "12px !important", sm: "13px !important" },
      color: "#fff",
      fontWeight: 400,
      backgroundColor: "#fff",
      cursor: "not-allowed",
      border: "1px solid #eee",
    },
    inStockButton: {
      fontSize: { xs: "12px !important", sm: "13px !important" },
      color: "#fff",
      fontWeight: 400,
      borderRadius: "4px",
    },
    imageWrapper: (matchesSM) => ({
      position: "relative",
      width: "100%",
      height: matchesSM ? "120px" : "200px",
    }),
    loader: {
      color: theme.palette.common.white,
      marginRight: "8px",
    },
  };

  const navigateToCart = () => router.push("/cart");

  useEffect(() => {
    getWishList();
  }, []);

  return (
    <Box sx={styles.rootBox}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("wishlist")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("wishlist"), link: "wishList" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>

      <Container maxWidth="lg" sx={styles.container}>
        <Grid container spacing={2}>
          <Grid
            item
            size={{
              xs: 12,
              sm: 3,
            }}
          >
            <Box sx={styles.dashboardBox}>
              <Dashboard selectItem={5} />
            </Box>
          </Grid>

          <Grid
            item
            size={{
              xs: 12,
              sm: 9,
            }}
            sx={{ mb: { sm: 0, xs: 5 }, display: "flex", flexWrap: "wrap" }}
          >
            {wishList?.length === 0 && !loading ? (
              <Typography variant="h6" sx={styles.emptyText}>
                {t("wishlist_empty")}
              </Typography>
            ) : (
              wishList?.map((item, index) => (
                <StyledCard key={index} sx={styles.card}>
                  <div
                    style={styles.imageWrapper(matchesSM)}
                    className="relative"
                  >
                    <Image
                      src={item?.image}
                      alt={item?.title}
                      fill
                      className="object-cover rounded"
                      loading="lazy"
                      blurDataURL={item?.image}
                    />
                    <DeleteIconWrapper
                      onClick={() =>
                        item?.wishlist_id &&
                        removeWishList(item?.wishlist_id.toString())
                      }
                    >
                      <RiDeleteBin5Line size={16} />
                    </DeleteIconWrapper>
                  </div>

                  <StyledCardContent>
                    <Link
                      className="link-none"
                      href={`/products/${item?.slug}?product_id=${item?.product_id}&variant_id=${item?.product_variant_id}`}
                    >
                      <ProductTitle sx={styles.productTitle}>
                        {item?.title || "Untitled"}
                      </ProductTitle>
                    </Link>
                    <Box sx={styles.actionBox}>
                      {item?.quantity < 1 ? (
                        <StyledButton sx={styles.outOfStockButton} disabled>
                          {t("out_of_stock")}
                        </StyledButton>
                      ) : (
                        <StyledButton
                          variant="contained"
                          sx={styles.inStockButton}
                          disabled={loadingVariants?.[item?.product_variant_id]}
                          onClick={() => {
                            isItemInCart(item?.product_variant_id)
                              ? navigateToCart()
                              : addToCart(item?.product_variant_id);
                          }}
                        >
                          {loadingVariants?.[item?.product_variant_id] && (
                            <CircularProgress size={16} sx={styles.loader} />
                          )}
                          {isItemInCart(item?.product_variant_id)
                            ? t("go_to_cart")
                            : t("move_to_cart")}
                        </StyledButton>
                      )}
                    </Box>
                  </StyledCardContent>
                </StyledCard>
              ))
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default WishList;
