import {
  Box,
  Card,
  Typography,
  CardMedia,
  Button,
  CardContent,
} from "@mui/material";
import React from "react";
import Carousel from "react-multi-carousel";
import { useSettingsStore } from "../../store/useSettingsStore";
import { Link, useRouter } from "@/i18n/navigation";
import useCartStore from "@/store/useCartStore";
import Image from "next/image";
const BundleCard = ({ bundleCard, matchesSM }) => {
  const { selectedCountry } = useSettingsStore();
  const navigate = useRouter();
  const {
    isItemInCart,
    addToCart,
    loadingVariants: loadingState,
  } = useCartStore();

  return (
    <>
      {bundleCard?.length > 0 && (
        <>
          <Box sx={{ pt: 4, pb: 4, width: "100%" }}>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h5"
                sx={{
                  color: "#292b2c",
                  textTransform: "capitalize",
                  fontWeight: "700",
                  fontSize: { sm: "24px", xs: "16px" },
                }}
              >
                Full Set / Package
              </Typography>
            </Box>
            <Box
              sx={{
                boxShadow: "0 0 7px rgb(0 0 0 / 10%)",
                borderRadius: "8px",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Carousel
                rtl={true}
                additionalTransfrom={0}
                autoPlaySpeed={3000}
                renderButtonGroupOutside
                arrows={!matchesSM ? true : false}
                draggable
                infinite={true}
                responsive={{
                  desktop: {
                    breakpoint: { max: 3000, min: 1024 },
                    items: 1,
                  },
                  laptop: {
                    breakpoint: { max: 1024, min: 768 },
                    items: 1,
                  },
                  tablet: {
                    breakpoint: { max: 768, min: 464 },
                    items: 1,
                  },
                  mobile: {
                    breakpoint: { max: 464, min: 0 },
                    items: 1,
                  },
                }}
                showDots={false}
                slidesToSlide={1}
                swipeable
              >
                {bundleCard?.length > 0 &&
                  bundleCard?.map((product, index) => (
                    <Box key={index} sx={{ px: 1 }}>
                      <Card
                        sx={{
                          width: "100%",
                          boxShadow: "none",
                          alignItems: "center",
                          padding: { xs: "0px", sm: "12px" },
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div className=" w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]">
                            <Image
                              className=" object-cover rounded-md mr-2"
                              fill={true}
                              sizes="(max-width: 640px) 100vw, 50vw"
                              quality={80}
                              src={product?.image}
                              alt={"bundel item"}
                            />
                          </div>
                          <CardContent
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              flexGrow: 1,
                              p: { xs: 1, sm: 2 },
                            }}
                          >
                            <Link
                              href={`products/${product.title}?product_id=${product.product_id}&variant_id=${product.product_variant_id}`}
                              className="link-none"
                            >
                              <Typography
                                variant="h6"
                                sx={{
                                  textTransform: "capitalize",
                                  mt: 1,
                                  fontWeight: 600,
                                  fontSize: {
                                    sm: "16px",
                                    xs: "14px",
                                  },
                                  "&:hover": { color: "#bb1f2a" },
                                  cursor: "pointer",
                                }}
                              >
                                {product?.title}
                              </Typography>
                            </Link>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "20px",
                                  fontWeight: "600",
                                  color: "#bb1f2a",
                                }}
                              >
                                {product?.sale_price > 0
                                  ? product?.sale_price
                                  : product?.list_price}
                                {selectedCountry?.currency_code}
                              </Typography>
                              {product?.sale_price > 0 && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "#687188",
                                    textDecoration: "line-through",
                                  }}
                                >
                                  {product?.list_price}{" "}
                                  {selectedCountry?.currency_code}
                                </Typography>
                              )}
                              {product?.discount_label && (
                                <Typography
                                  sx={{
                                    fontSize: "14px",
                                    color: "green",
                                  }}
                                >
                                  {product?.discount_label}
                                </Typography>
                              )}
                            </Box>
                          </CardContent>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "flex-end",
                            }}
                          >
                            <Button
                              disabled={product && product?.qty === 0}
                              sx={{
                                py: 1,
                                px: 1,
                                mr: 2,
                                gap: 2,
                                fontSize: "15px",
                                borderRadius: "5px",
                                background: "#bb1f2a",
                                color: "#fff",
                                "&:hover": { background: "#a61c25" },
                              }}
                              onClick={() => {
                                if (product?.product_variant_id) {
                                  if (
                                    !isItemInCart(product?.product_variant_id)
                                  ) {
                                    addToCart(product?.product_variant_id);
                                  } else {
                                    navigate.push("cart");
                                  }
                                }
                              }}
                              aria-label="add to cart"
                            >
                              <svg
                                className="cart-svg-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 1024 1024"
                              >
                                <path
                                  fill="#fff"
                                  d="M1015.66 284a31.82 31.82 0 0 0-25.999-13.502h-99.744L684.78 95.666c-24.976-24.976-65.52-25.008-90.495 0L392.638 270.498h-82.096l-51.408-177.28c-20.16-69.808-68.065-77.344-87.713-77.344H34.333c-17.568 0-31.776 14.224-31.776 31.776S16.78 79.425 34.332 79.425h137.056c4.336 0 17.568 0 26.593 31.184l176.848 649.936c3.84 13.712 16.336 23.183 30.592 23.183h431.968c13.408 0 25.376-8.4 29.904-21.024l152.256-449.68c3.504-9.744 2.048-20.592-3.888-29.024zM639.537 140.93l152.032 129.584H487.457zm175.488 579.263H429.538L328.386 334.065h616.096zm-63.023 127.936c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80m-288 0c-44.192 0-80 35.808-80 80s35.808 80 80 80s80-35.808 80-80s-35.808-80-80-80"
                                />
                              </svg>

                              {isItemInCart(product?.product_variant_id)
                                ? "Go to Cart"
                                : "Add to Cart"}
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Box>
                  ))}
              </Carousel>
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default BundleCard;
