import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Link from "next/link";
import {
  CardWrapper,
  ContainerBox,
  NewChipStyle,
  StyledCardContent,
  ProductTitle,
  PriceContainer,
} from "./styles";
import CartButton from "../components/CartButton";
import { useWishListStore } from "../store/useWishListStore";
import { useSettingsStore } from "../store/useSettingsStore";
import useUserStore from "../store/user";
import useCartStore from "../store/useCartStore";
import ProductImage from "./ProductImage";
import ImagePath from "../constants/imagepath";
import Image from "next/image";
import WishlistButton from "./WishlistButton";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DetailsQuickView from "./ProductQuickView";

const ProductCard = ({
  item: selectedItem,
  href,
  handleOpenLogin,
  imageHeight,
  search = false,
  handleClose,
}) => {
  if (!selectedItem) {
    return;
  }

  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const {
    isItemInCart,
    toggleAddToCart,
    loadingVariants: loadingState,
  } = useCartStore();
  const { toggleWishlist, isItemInWishlist } = useWishListStore();
  const { selectedCountry } = useSettingsStore();
  const { isLoggedIn } = useUserStore();
  const [item, setItem] = useState(selectedItem);
  const [showVariant, setShowVariant] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selectedItem) {
      return;
    }
    const defaultVariant =
      selectedItem.varaint_items?.find((vri) => vri.main_varaint) ||
      selectedItem.varaint_items?.[0] ||
      null;

    if (defaultVariant) {
      setItem({
        ...selectedItem,
        product_variant_id: defaultVariant.variant_id,
        varaint_items: selectedItem.varaint_items.map((variant) =>
          variant.variant_id === defaultVariant.variant_id
            ? { ...variant, main_varaint: true }
            : { ...variant, main_varaint: false },
        ),
      });
      setShowVariant(defaultVariant);
    }
  }, [selectedItem]);

  const handleVariantSelect = (variantId) => {
    const idx = item.varaint_items.findIndex(
      (variant) => variant.variant_id == variantId,
    );

    if (idx !== -1) {
      const updatedVariants = item.varaint_items.map((variant, index) => ({
        ...variant,
        main_varaint: index == idx,
      }));

      const selectedVariant = updatedVariants[idx];

      setItem({
        ...item,
        varaint_items: updatedVariants,
        product_variant_id: variantId,
      });
      setShowVariant(selectedVariant);
    }
  };

  const cardData = showVariant || selectedItem.varaint_items?.[0] || item;
  const isDiscounted =
    cardData?.sale_price > 0 && cardData?.sale_price !== cardData?.list_price
  return (
    <>
      <div className="mb-2" draggable={false}>
        <CardWrapper>
          <Box position="relative">
            <Link
              href={href}
              onClick={() => {
                handleClose?.();
              }}
              className="link-none"
            >
              {/* {item?.photos?.length > 0 && ( */}
              <ContainerBox>
                <ProductImage
                  item={cardData?.photo || cardData.image}
                  isSmall={matchesSM}
                  heightClass={
                    imageHeight
                      ? matchesSM
                        ? "min-h-[150px] max-h-[175px]"
                        : "min-h-[276.37px] max-h-[276.37px]"
                      : null
                  }
                  search={search}
                  rating={item?.average_rating}
                />
                {cardData?.is_new && <NewChipStyle label="New" />}
                {cardData?.is_flash_sale || cardData?.online_exclusive ? (
                  <div className="absolute w-[60px] h-[50px]  bottom-[10px] right-1.5">
                    <Image
                      src={ImagePath.flashSale}
                      alt={item?.title}
                      layout="fill"
                      objectFit="cover"
                      quality={80}
                      loading="lazy"
                    />
                  </div>
                ) : null}
              </ContainerBox>
            </Link>
          </Box>

          <StyledCardContent>
            <ProductTitle
              sx={{
                fontSize: { xs: "14px !important", sm: "16px !important" },
                minHeight: "36px !important",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
                fontFamily: "Roboto !important",
                lineHeight: "18px !important",
              }}
              variant="h6"
            >
              {item?.title}
            </ProductTitle>

            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                justifyContent: "space-between",
                alignItems: "flex-start",
                textAlign: "left",
              }}
            >
              <PriceContainer
                sx={{ mt: cardData?.sale_price > 0 ? 0 : 1, minHeight: 40 }}
              >
                {cardData?.sale_price > 0 &&
                  cardData?.sale_price !== cardData?.list_price && (
                    <Typography
                      noWrap
                      sx={{
                        color: "#bb1f2a",
                        fontWeight: 500,
                        fontSize: {
                          xs: "14px !important",
                          sm: "16px !important",
                        },
                        mt: "8px",
                      }}
                    >
                      {cardData?.sale_price} {selectedCountry?.currency_code}
                    </Typography>
                  )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontWeight: isDiscounted ? 0 : 600,
                      color: isDiscounted ? "#687188" : "#bb1f2a",
                      textDecoration: isDiscounted ? "line-through" : "none",
                      fontSize: { xs: "14px", sm: "1rem" },
                    }}
                  >
                    {cardData?.list_price} {selectedCountry?.currency_code}
                  </Typography>

                  {isDiscounted && (
                    <Typography
                      noWrap
                      sx={{
                        color: "green",
                        fontSize: { xs: "14px", sm: "1rem" },
                      }}
                    >
                      {cardData?.discount_label}
                    </Typography>
                  )}
                </Box>
              </PriceContainer>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                <CartButton
                  productVariantId={
                    cardData?.variant_id || item?.product_variant_id
                  }
                  isLoading={
                    loadingState?.[
                    cardData?.variant_id || item?.product_variant_id
                    ]
                  }
                  isItemInCart={isItemInCart}
                  onClick={(productVariantId) => { !search ? setOpen(!open) : toggleAddToCart(productVariantId) }}
                />
                {!search && (
                  <WishlistButton
                    isLoggedIn={isLoggedIn}
                    productId={item?.product_id?.toString()}
                    variantId={cardData?.variant_id || item?.product_variant_id}
                    isItemInWishlist={isItemInWishlist}
                    toggleWishlist={toggleWishlist}
                    handleOpenLogin={handleOpenLogin}
                  />
                )}
              </Box>
            </Box>

            {item.varaint_items && item.varaint_items.length > 0 && (
              <div
                tabIndex={0}
                className="group relative mt-2 p-1 scroll-on-focus h-[40px]"
              >
                <div className="flex w-max space-x-2">
                  {item.varaint_items.map((variant) => {
                    const colors = variant.all_colors;
                    const slice = 100 / colors.length;
                    const background = `conic-gradient(${colors
                      .map(
                        (color, i) =>
                          `${color} ${i * slice}% ${(i + 1) * slice}%`,
                      )
                      .join(", ")})`;

                    const isSelected = variant.main_varaint;

                    return (
                      <div
                        key={variant.variant_id}
                        title={colors.join(", ")}
                        onClick={() => handleVariantSelect(variant.variant_id)}
                        className={`w-[18px] h-[18px] rounded-full cursor-pointer transition-all duration-200 ${isSelected
                          ? "ring-2 ring-red-600 scale-110"
                          : "ring-2 ring-white"
                          } shadow-[0_2px_4px_rgba(0,0,0,0.5)] `}
                        style={{ background }}
                      />
                    );
                  })}
                </div>
              </div>
            )}
            {!search ? (
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Rating
                  readOnly
                  name="no-value"
                  value={item?.average_rating || 0}
                  sx={{
                    fontSize: { xs: "1rem", sm: "1.3rem" },
                    color: "#687188",
                    mr: 0,
                  }}
                />
                <Typography
                  sx={{ ml: { xs: 0.5, sm: "4px" }, color: "#687188" }}
                  variant="body2"
                >
                  {`(${parseFloat(item?.total_rating)})` || 0}
                </Typography>
              </Box>
            ) : null}
          </StyledCardContent>
        </CardWrapper>
      </div>
      {open && (
        <DetailsQuickView
          isOpen={open}
          closeModal={() => setOpen(false)}
          productVariantId={cardData?.variant_id || item?.product_variant_id}
          productId={item?.product_id}
        />
      )}

    </>
  );
};

export default ProductCard;
