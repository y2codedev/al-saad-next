"use client";

import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import { Link, useRouter } from "@/i18n/navigation";
import React, { useState, useEffect, useRef } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { Add, Remove } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import { RiDeleteBin5Line } from "react-icons/ri";
import useCartStore from "@/store/useCartStore";
import { showToast } from "@/utils/helper";
import useLoaderStore from "@/store/loaderStore";
//   import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import {
  BreadCumContainer,
  BreadCumHeader,
  ProductTitle,
  StyledHeading,
} from "@/components/styles";
import { useSettingsStore } from "@/store/useSettingsStore";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import Image from "next/image";
import ConfirmationPopup from "@/components/ConfirmationPopup";
import flashSaleImg from "../../../../../public/asstes/flash-sale-en.png";

const Cart = ({
  image,
  title,
  colors,
  sizes,
  pattern_image,
  deleteCartItem,
  cartItemId,
  product_id,
  variant_id,
  quantity,
  incrementQuantity,
  decrementQuantity,
  cartItemQuantity,
  index,
  branchIndex,
  sale_price,
  list_price,
  discount_label,
  setQuantities,
  quantities,
  slug,
  flashSale,
}) => {
  const { selectedCountry } = useSettingsStore();
  const { isLoading } = useLoaderStore?.getState();

  return (
    <Card
      sx={{ display: "flex", mb: 2, boxShadow: "0 0 7px rgb(0 0 0 / 10%)" }}
    >
      <div className="relative aspect-[5/2] sm:w-[300px] w-[200px]">
        <Image
          src={image}
          alt={title}
          fill
          quality={80}
          priority={true}
          className="object-cover w-full h-full"
        />
        {flashSale && (
          <div className="absolute top-4 left-4 w-[65px] h-[50px]">
            <Image
              src={flashSaleImg}
              alt={title}
              fill
              className="object-contain"
              loading="lazy"
            />
          </div>
        )}
      </div>
      <Box sx={{ width: "100%" }}>
        <CardContent sx={{ p: { xs: "10px", sm: "16px" } }}>
          <Link
            className="link-none"
            href={`/products/${slug}?product_id=${product_id}&variant_id=${variant_id}`}
          >
            <ProductTitle WebkitLineClamp={1}>{title}</ProductTitle>
          </Link>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              gap: 1,
              fontSize: { sm: "1rem", xs: "13px" },
            }}
          >
            Price:
            <Typography
              sx={{
                fontWeight: "600",
                color: "#bb1f2a",
                fontSize: { sm: "1rem", xs: "13px" },
              }}
            >
              {sale_price > 0 ? sale_price : list_price}{" "}
              {selectedCountry?.currency_code}
            </Typography>
            {sale_price > 0 && (
              <Typography
                sx={{
                  fontSize: { sm: "1rem", xs: "13px" },
                  color: "gray",
                  textDecoration: "line-through",
                }}
              >
                {list_price} {selectedCountry?.currency_code}
              </Typography>
            )}
            {discount_label && (
              <Typography sx={{ color: "green" }}>{discount_label}</Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {colors && colors.length > 0 ? (
              <>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: "500",
                    fontSize: { sm: "1rem", xs: "13px" },
                    lineHeight: "2",
                    marginRight: "8px",
                  }}
                >
                  Color:
                </Typography>
                <div
                  style={{
                    width: "22px", // Adjust the size of the circle
                    height: "22px",
                    borderRadius: "50%",
                    background: `conic-gradient(${colors
                      .map(
                        (color, i) =>
                          `${color} ${i * (100 / colors.length)}% ${(i + 1) * (100 / colors.length)}%`,
                      )
                      .join(", ")})`,
                  }}
                  title={colors.join(", ")}
                  className="cursor-pointer transition-all duration-200 scale-100 shadow-[0_2px_4px_rgba(0,0,0,0.5)] mix-blend-multiply"
                />
              </>
            ) : (
              pattern_image && (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontWeight: "500",
                      fontSize: { sm: "1rem", xs: "13px" },
                      lineHeight: "2",
                    }}
                  >
                    Pattern:
                  </Typography>
                  <img
                    src={pattern_image}
                    alt="pattern"
                    loading="lazy"
                    style={{
                      width: "20px",
                      height: "20px",
                      marginLeft: "10px",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              )
            )}
          </Box>
          <Typography
            sx={{
              fontWeight: "500",
              mb: 1,
              fontSize: { sm: "1rem", xs: "13px" },
            }}
          >
            {sizes && "Size:"} {sizes}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <IconButton
                size="small"
                sx={{
                  backgroundColor: "#eee",

                  cursor: "pointer",
                }}
                onClick={() => {
                  if (isLoading) {
                    return;
                  }
                  decrementQuantity(variant_id, branchIndex, index);
                }}
              >
                <Remove fontSize="small" />
              </IconButton>

              <input
                className="no-spin"
                type="text"
                pattern="\d*"
                min={1}
                value={quantities?.[branchIndex]?.[index] || 1}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const newQuantity = Math.min(
                    Math.max(1, parseInt(rawValue) || 1),
                    quantity,
                  );

                  const updatedQuantities = [...quantities];
                  updatedQuantities[branchIndex] = [
                    ...updatedQuantities[branchIndex],
                  ];
                  updatedQuantities[branchIndex][index] = newQuantity;
                  setQuantities(updatedQuantities);
                }}
                onBlur={(e) => {
                  const qty = quantities?.[branchIndex]?.[index];
                  if (qty == cartItemQuantity) return;
                  incrementQuantity(
                    variant_id,
                    quantity,
                    branchIndex,
                    index,
                    qty,
                  );
                }}
                style={{
                  width: "50px",
                  height: "100%",
                  textAlign: "center",
                  fontSize: "12px",
                  fontWeight: "400",
                  border: "1px solid #ddd",
                  background: "transparent",
                  outline: "none",
                  appearance: "none",
                  MozAppearance: "none",
                  WebkitAppearance: "none",
                  padding: 8,
                  margin: '0px 5px'
                }}
              />
              <IconButton
                size="small"
                sx={{
                  backgroundColor: "#eee",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (isLoading) return;
                  incrementQuantity(variant_id, quantity, branchIndex, index);
                }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Box>

            <Box
              component="div"
              sx={{
                backgroundColor: "#bb1f2a",
                cursor: "pointer",
                color: "#fff",
                borderRadius: "4px",
                ":hover": { bgcolor: "red" },
                height: "30px",
                width: "28px",
                alignItems: "center",
                justifyContent: "center",
                display: "flex",
              }}
            >
              <RiDeleteBin5Line
                onClick={() => deleteCartItem(cartItemId, variant_id)}
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
                size={15}
              />
            </Box>
          </Box>
        </CardContent>
      </Box>
    </Card>
  );
};

const CartPage = ({ params }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setdeleteId] = useState({ cartItemId: "", variant_id: "" });
  const { selectedCountry } = useSettingsStore();
  const debounceRef = useRef(null);
  const {
    cartItems,
    getCart,
    deleteCartItem,
    incrementQuantity,
    decrementQuantity,
  } = useCartStore();

  useEffect(() => {
    getCart();
  }, []);

  useEffect(() => {
    if (cartItems?.branch) {
      const initialQuantities = cartItems.branch.map((branch) =>
        branch?.item?.map((item) => parseInt(item?.cart_quantity, 10)),
      );
      setQuantity(initialQuantities);
    }
  }, [cartItems]);

  const handleIncrement = (
    product_variant_id,
    maxQuantity,
    branch,
    index,
    qty,
  ) => {
    if (branch != null && index !== -1) {
      const currentQuantity = quantity[branch]?.[index] || 0;
      const maxItemQuantity =
        cartItems?.branch?.[branch]?.item?.[index]?.quantity || maxQuantity;
      if (
        currentQuantity < maxItemQuantity ||
        (qty && currentQuantity <= qty)
      ) {
        const updatedQuantities = [...quantity];
        updatedQuantities[branch] = [...updatedQuantities[branch]];
        updatedQuantities[branch][index] = qty ?? currentQuantity + 1;
        setQuantity(updatedQuantities);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          incrementQuantity(
            product_variant_id,
            updatedQuantities[branch][index],
          );
        }, 500);
      } else {
        showToast("warning", "Maximum quantity reached!", "danger");
      }
    } else {
      console.warn("Invalid branch or index provided.");
    }
  };

  const handleDecrement = (product_variant_id, branch, index) => {
    if (branch != null && index !== -1) {
      const currentQuantity = quantity[branch]?.[index] || 0;
      if (currentQuantity > 1) {
        const updatedQuantities = [...quantity];
        updatedQuantities[branch][index] = currentQuantity - 1;
        setQuantity(updatedQuantities);
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }
        debounceRef.current = setTimeout(() => {
          decrementQuantity(
            product_variant_id,
            updatedQuantities[branch][index],
          );
        }, 500);
      } else {
        showToast("warning", "Minimum quantity is 1!", "danger");
      }
    } else {
      console.log("Invalid branch or index provided.");
    }
  };

  return (
    <>
      <div>
        <BreadCumContainer>
          <Container>
            <BreadCumHeader>
              <StyledHeading>Shopping Cart</StyledHeading>
              <BreadcrumbsComponent
                pathSegments={[
                  { text: "Home", link: "" },
                  { text: "Cart", link: "" },
                ]}
              />
            </BreadCumHeader>
          </Container>
        </BreadCumContainer>
        <Container maxWidth="lg" sx={{ py: 5, pb: 14 }}>
          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                md: 8,
              }}
            >
              {cartItems?.branch && cartItems?.branch?.length > 0 ? (
                cartItems?.branch?.map(
                  (item, branchIndex) =>
                    item?.item &&
                    item?.item?.map((item, index) => {
                      return (
                        <Cart
                          key={index}
                          {...item}
                          sale_price={item?.sale_price}
                          list_price={item?.list_price}
                          discount_label={item?.discount_label}
                          cartItemId={item?.cart_item_id}
                          itmeslug={item?.slug}
                          product_id={item?.product_id}
                          variant_id={item?.product_variant_id}
                          deleteCartItem={() => {
                            setdeleteId({
                              cartItemId: item?.cart_item_id,
                              variant_id: item?.product_variant_id,
                            });
                            setOpenDelete(true);
                          }}
                          incrementQuantity={handleIncrement}
                          decrementQuantity={handleDecrement}
                          cartItemQuantity={item?.cart_quantity}
                          quantities={quantity}
                          setQuantities={setQuantity}
                          index={index}
                          branchIndex={branchIndex}
                          flashSale={item?.is_flash_sale}
                          slug={item.slug}
                        />
                      );
                    }),
                )
              ) : (
                <Typography sx={{ fontWeight: "500", color: "#687188", my: 2, display: 'flex', justifyContent: 'center' }}>
                  No products added to the cart
                </Typography>
              )}
            </Grid>

            <Grid
              size={{
                xs: 12,
                md: 4,
              }}
            >
              {cartItems?.free_delivery_title ? (
                <Box
                  sx={{ p: 2, boxShadow: "0 0 7px rgb(0 0 0 / 10%)", mb: 1 }}
                >
                  <Typography
                    sx={{
                      mb: 1,
                      color: "#687188",
                      textTransform: "capitalize",
                      fontSize: { sm: "14px", xs: "12px" },
                      textAlign: "center",
                    }}
                  >
                    {cartItems?.free_delivery_title}
                  </Typography>
                  <LinearProgress
                    color="error"
                    variant="determinate"
                    sx={{ height: "6px", borderRadius: "4px" }}
                    value={cartItems?.progress}
                  />
                </Box>
              ) : null}

              {cartItems?.branch && cartItems?.branch?.length > 0 ? (
                <Box sx={{ p: 2, boxShadow: "0 0 7px rgb(0 0 0 / 10%)" }} className="hidden sm:block">
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-around",
                      my: 2,
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#292b2c",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        fontSize: { sm: "18px", xs: "16px" },
                      }}
                    >
                      Sub Total
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        color: "#292b2c",
                        textTransform: "capitalize",
                        fontWeight: "600",
                        fontSize: { sm: "18px", xs: "16px" },
                      }}
                    >
                      {cartItems?.total_amount} {selectedCountry?.currency_code}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => router.push("/checkout")}
                    variant="contained"
                    sx={{
                      backgroundColor: "#bb1f2a",
                      padding: "10px",
                      mt: 1,
                      boxShadow: "none",
                    }}
                    fullWidth
                  >
                    Proceed To Checkout
                  </Button>
                </Box>
              ) : null}

            </Grid>
          </Grid>
          {cartItems?.branch && cartItems?.branch?.length > 0 && (

            <Box
              className="fixed bottom-14 left-0 w-full bg-white z-50 p-4 sm:hidden flex items-center justify-between"
              sx={{
                boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)", // top shadow
                borderTopLeftRadius: "12px",
                borderTopRightRadius: "12px",
              }}>
              <Box className="mb-2">
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 600, fontSize: "16px", color: "#292b2c" }}
                >
                  {cartItems?.total_amount} {selectedCountry?.currency_code}
                </Typography>
              </Box>
              <Button
                onClick={() => router.push("/checkout")}
                variant="contained"
                sx={{
                  backgroundColor: "#bb1f2a",
                  padding: "10px",
                  boxShadow: "none",
                  px: 4,
                  borderRadius: '4px',
                  height: '40px',
                  fontSize: '14px'
                }}

              >
                Checkout
              </Button>
            </Box>
          )}

          <Box className="hidden sm:flex items-center justify-between my-4 px-2">
            <span className="w-2/5 h-1 bg-gray-300"></span>
            <FaShoppingCart size={30} className="text-gray-300" />
            <span className="w-2/5 h-1 bg-gray-300"></span>
          </Box>
        </Container>
      </div >
      <ConfirmationPopup
        open={openDelete}
        handleClose={() => setOpenDelete(false)}
        handleConfirm={() => {
          setOpenDelete(false);
          if (deleteId.cartItemId) {
            deleteCartItem(deleteId.cartItemId, deleteId.variant_id);
          }
          setdeleteId({
            cartItemId: "",
            variant_id: "",
          });
        }}
        title="Are you sure?"
        subtitle="You Want to delete this item"
        confirmText="Remove"
        isIcon={false}
      />
    </>
  );
};

export default CartPage;
