"use client";

import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  useTheme,
  Rating,
  IconButton,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import Carousel from "react-multi-carousel";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { homeApi } from "@/utils/services/homeServices";
import parse from "html-react-parser";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import {
  Add,
  ArrowBack,
  FavoriteBorder,
  Remove,
  ZoomInOutlined,
} from "@mui/icons-material";
import { showToast } from "@/utils/helper";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import useUserStore from "@/store/user";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import { useSettingsStore } from "@/store/useSettingsStore";
import { shippingApi } from "@/utils/services/shippingApi";
import ProductDetailShimmer from "@/components/skeleton/ProductDetailShimmer";
import ratingApi from "@/utils/services/ratingServices";
import flashSaleImg from "../../../../../../public/asstes/flash-sale-en.png";
import { useLanguageStore } from "@/store/useLanguageStore";
import {
  BreadCumContainer,
  BreadCumHeader,
  StyledHeading,
} from "@/components/styles";
import COLORS from "@/utils/colors";
import useShippingStore from "@/store/useShippingStore";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import ReviewSection from "@/components/ProductDeatailsCom/ReviewSection";
import BundleCard from "@/components/ProductDeatailsCom/BundleCard";
import FullScreenImageModal from "@/components/home/FullScreenImageModal";
import CheckDelivery from "@/components/CheckDelivery";
import BundleProductsModal from "@/components/skeleton/BundleProductsModal";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import Image from "next/image";
import AppSlider from "@/components/AppSlider";
import MobileAddCartBox from "@/components/MobileQuantityBox";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import WishlistButton from "@/components/WishlistButton";
import TabbyTamaraWidget from "@/components/ProductPage";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 640 },
    items: 2,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 640, min: 0 },
    items: 2,
    slidesToSlide: 1,
  },
};

const ProductDetails = ({ }) => {
  const params = useParams();
  const { locale } = params;
  const {
    isItemInCart,
    incrementQuantity,
    decrementQuantity,
    cartItems,
    addToCart,
    loadingVariants,
  } = useCartStore();
  const {
    message: shippingMessage,
    selectedCity,
    selectedArea,
    setShippingData,
  } = useShippingStore();
  const { toggleWishlist, isItemInWishlist } = useWishListStore();
  const { isLoggedIn } = useUserStore();
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [productData, setProductData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sizes, setSizes] = useState([]);
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
  const isRTL = useLanguageStore.getState().language === "ar";
  const pathname = usePathname();
  let storedUserInfo = {};

  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    storedUserInfo = JSON.parse(localStorage.getItem("USER") || "{}");
  }

  const searchParams = useSearchParams();
  const productId = searchParams.get("product_id");
  const variantId = searchParams.get("variant_id");
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const router = useRouter();

  const handleSelectImage = (src) => {
    setSelectedImage(src);
  };

  const t = useTranslations();
  const [selectedColorIndex, setSelectedColorIndex] = useState("");
  const [selectedProductInfo, setSelectedProductInfo] = useState(null);
  const [details, setDetails] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [allVariants, setAllVariants] = useState([]);
  const [bundleDetails, setBundleDetails] = useState([]);
  const [getDetails, setGetDetails] = useState(null);
  const [getSimilar, setGetSimilar] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userData, setUserData] = useState(null);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [openChekDelivery, setOpenChekDelivery] = useState(false);
  const [ratingData, setRatingData] = useState([]);
  const [city, setCity] = useState(selectedCity);
  const [area, setArea] = useState(selectedArea);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [message, setMessage] = useState(shippingMessage);
  const [timers, setTimers] = useState([]);
  const { selectedCountry } = useSettingsStore();
  const handleOpenChekDelivery = () => {
    setOpenChekDelivery(true);
  };
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const toggleAccordion = () => setIsOpenAccordion(!isOpenAccordion);

  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };
  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  useEffect(() => {
    if (selectedCity) {
      setCity(selectedCity);
    }
    if (selectedArea) {
      setArea(selectedArea);
    }
  }, [selectedCity, selectedArea]);

  useEffect(() => {
    if (selectedProductInfo?.photo?.length > 0) {
      const firstImage = selectedProductInfo?.photo?.map((item) => item?.src);
      if (firstImage) {
        setSelectedImage(firstImage[0]);
      }
    }
  }, [allVariants]);

  function findVariantByVid(variantId, productData) {
    if (productData && productData?.length > 0) {
      const flattenedItems = productData.flatMap(
        (variant) =>  variant?.items || [],
      );
      const selectedProductInfo = flattenedItems.find(
        (info) => info?.variant_id?.toString() === variantId,
      );

      if (selectedProductInfo) {
        const selectedVariantIndex = productData?.findIndex((variant) =>
          variant.items.some(
            (item) => item?.variant_id === selectedProductInfo?.variant_id,
          ),
        );
        const selectedSizes = productData[selectedVariantIndex]?.sizes || [];
        if (selectedSizes) {
          setSizes(selectedSizes);
        }

        setSelectedColorIndex(selectedProductInfo?.variant_id);

        if (selectedProductInfo) {
          setSelectedProductInfo(selectedProductInfo);
          if (selectedProductInfo?.photo?.length > 0) {
            setSelectedImage(selectedProductInfo?.photo[0]?.src);
          }
        }
      } else {
        console.error("Selected variant not found");
      }
    } else {
      console.error("No variants found");
    }
  }

  const handleIncrement = (product_variant_id, maxQuantity, qty) => {
    let inCart = isItemInCart(product_variant_id);
    if (maxQuantity > qty) {
      if (inCart) {
        setSelectedQuantity(selectedQuantity + 1);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          debouncedIncrement(product_variant_id, qty + 1);
        }, 500);
      } else {
        setSelectedQuantity(selectedQuantity + 1);
      }
    } else {
      showToast("error", "You have booked all the products");
    }
  };

  const debouncedIncrement = useCallback((productI, qty) => {
    incrementQuantity(productI, qty);
  }, []);

  const handleDecrement = (variant_id, maxQuantity, qty) => {
    if (qty > 1) {
      let inCart = isItemInCart(variant_id);
      if (inCart) {
        setSelectedQuantity(selectedQuantity - 1);
        debouncedDecrement(variant_id, qty - 1);
      } else {
        setSelectedQuantity(selectedQuantity - 1);
      }
    } else {
      showToast("error", "Minimum quantity is 1");
    }
  };

  const debouncedDecrement = useCallback((productI, qty) => {
    decrementQuantity(productI, qty);
  }, []);

  const getCartQuantityByVariantId = (variantId) => {
    if (cartItems && cartItems?.branch) {
      for (let branch of cartItems?.branch) {
        const foundItem = branch?.item.find(
          (item) => item?.product_variant_id == variantId,
        );
        if (foundItem) {
          return foundItem?.cart_quantity;
        }
      }
    }
    return 1;
  };

  useEffect(() => {
    if (cartItems && selectedProductInfo) {
      let qty = getCartQuantityByVariantId(
        Number(selectedProductInfo?.variant_id),
      );
      setSelectedQuantity(qty || 1);
    }
  }, [selectedProductInfo, cartItems]);

  const handleColorChange = (variantId, productId, slug) => {
    const newUrl = `/${params.locale}/${params.currency}/products/${slug}?product_id=${productId}&variant_id=${variantId}`;
    window.history.replaceState(null, "", newUrl);
  };

  const fetchProductDetails = useCallback(
    async (variantId, pid) => {
      setLoading(true);
      if (!productId || !variantId) {
        return;
      }
      let product_Id = pid ?? productId;
      try {
        const res = await homeApi.getProductDetails(
          {
            customer_id: storedUserInfo.id,
            product_id: product_Id,
            variant_id: variantId,
          },
          false,
        );
        if (res && res.status === 200) {


          setLoading(false);
          const variants = res?.data?.variants || [];
          console.log(variants, "res of product dtails variants");
          setAllVariants(variants);
          setProductData(variants);
          setDetails(res.data?.product_details);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    },
    [productId],
  );

  useEffect(() => {
    if (productData && productData.length > 0) {
      findVariantByVid(variantId, productData);
    }
    return () => { };
  }, [productData, pathname, variantId]);

  useEffect(() => {
    if (variantId) {
      fetchProductDetails(variantId);
    }
  }, [locale, productId]);

  const fetchBundleDetails = async () => {
    if (!selectedProductInfo?.variant_id) {
      return;
    }
    let reqBody = {
      product_id: productId,
      product_variant_id: selectedProductInfo?.variant_id,
    };

    try {
      const res = await homeApi.getBundleProductApi(reqBody, false);
      if (res && res.status === 200) {
        setBundleDetails(res?.data);
      }
    } catch (error) {
      console.error("Error fetching bundle details:", error);
    }
  };

  const [totalPages, setTotalPages] = useState(1);

  function onPageChange(page) {
    getReviewList(page);
  }

  async function getReviewList(page) {
    if (!selectedProductInfo?.variant_id) {
      return;
    }
    if (selectedProductInfo?.total_rating == 0) {
      return;
    }
    try {
      let reqBody = {
        page: page ?? currentPage,
        product_id: productId,
        customer_id: useUserStore.getState().userInfo?.id || "",
        product_variant_id: selectedProductInfo?.variant_id,
      };
      const res = await ratingApi.getRatingReview(reqBody);
      if (res && res.status === 200) {
        setRatingData(res.data);
        setTotalPages(res?.totalReviews);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getBunddel = async (vid) => {
    if (!variantId) {
      return;
    }

    let reqBody = {
      bundle_product_variant_id: vid ?? variantId,
    };

    try {
      const res = await homeApi.getBundleProductItemApi(reqBody, false);
      if (res && res.status === 200) {
        setGetDetails(res?.data);
      }
    } catch (error) {
      console.error("Error fetching bundle details:", error);
    }
  };

  const getSimilarProduct = async () => {
    setLoading(true);
    let reqBody = {
      customer_id: storedUserInfo.id,
      product_id: productId,
      product_varaint_id: variantId,
    };

    try {
      const res = await homeApi.getSimilarProductApi(reqBody, false);
      if (res && res.status === 200) {
        setLoading(false);
        setGetSimilar(res?.data);
      }
    } catch (error) {
      console.error("Error fetching bundle details:", error);
    }
  };

  useEffect(() => {
    if (selectedProductInfo?.variant_id) {
      Promise.all([fetchBundleDetails(), getReviewList()]).catch((error) => {
        console.error("Error executing promises:", error);
      });
    }
  }, [selectedProductInfo, locale]);

  useEffect(() => {
    getSimilarProduct();
  }, [locale, productId]);

  useEffect(() => {
    if (selectedCountry?.code) {
      getCities(Number(selectedCountry?.id));
    }
  }, [selectedCountry?.code, locale]);

  useEffect(() => {
    if (!selectedCity && selectedCountry?.id) {
      return;
    }
    getAreas(selectedCity, selectedCountry?.id);
  }, [selectedCountry?.id]);

  const getCities = async (countryId) => {
    try {
      const res = await shippingApi.getCity({ country_id: countryId });
      setCities(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTimeLeft = () => {
    const now = new Date();
    const endTime = new Date(selectedProductInfo?.flash_end_date);
    const diff = endTime - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  useEffect(() => {
    if (selectedProductInfo && !selectedProductInfo?.is_flash_sale) {
      return;
    }
    const timer = setInterval(() => {
      setTimers(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedProductInfo]);

  const getAreas = async (cityId, countryId) => {
    try {
      const res = await shippingApi.getArea({
        country_id: countryId,
        city_id: cityId,
      });
      setAreas(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCityChange = (event) => {
    const selectedCityId = event.target.value;
    setCity(selectedCityId);
    setArea("");
    getAreas(selectedCityId, selectedCountry?.id);
  };

  const handleAreaChange = (event) => {
    setArea(event.target.value);
  };
  const areaName = useMemo(() => {
    return areas.find((a) => a.id == selectedArea)?.area_name || "";
  }, [areas, selectedArea]);

  const CheckDeliveryAvailable = async () => {
    let areaId = area || selectedArea;
    let cityId = city || selectedArea;
    if (!areaId || selectedProductInfo?.quantity == 0) {
      return;
    }
    try {
      const req = {
        product_variant_id: selectedProductInfo?.variant_id,
        qty: selectedProductInfo?.quantity,
        area_id: areaId,
      };

      const res = await shippingApi.checkDeliveryAddress(req);
      if (res && res.status === 200) {
        setMessage(res.data);
        setShippingData(res.data, cityId, areaId);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (selectedProductInfo?.variant_id) {
      CheckDeliveryAvailable();
    }
  }, [selectedProductInfo, locale]);

  const handleLike = async (reviewId, index) => {
    if (!useUserStore.getState().userInfo) {
      return handleOpenLogin();
    }
    try {
      const res = await ratingApi.likeRating({ rating_id: reviewId });
      if (res && res.status === 200) {
        const updatedLikes = [...ratingData];
        updatedLikes[index].is_like = !updatedLikes[index].is_like;
        updatedLikes[index].total_likes = res.data.total_likes;
        setRatingData(updatedLikes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!selectedProductInfo) {
    return;
  }

  const isLoading = loadingVariants?.[selectedProductInfo?.variant_id];
  const isOutOfStock = selectedProductInfo?.quantity === 0;
  const inCart = isItemInCart(selectedProductInfo?.variant_id);

  const isLightBox = () => {
    setLightboxOpen(!lightboxOpen);
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          margin: "0px",
          padding: "0px",
          overflow: "hidden",
        }}
      >
        {selectedProductInfo?.category && (
          <BreadCumContainer>
            <Container>
              <BreadCumHeader>
                <StyledHeading>{t("product_detail")}</StyledHeading>
                <BreadcrumbsComponent
                  pathSegments={[
                    { link: "/", text: t("home") },
                    { text: selectedProductInfo?.category, link: "category" },
                    {
                      text: selectedProductInfo?.sub_category,
                      link: `category/${selectedProductInfo?.category_sung}`,
                    },
                    { text: selectedProductInfo?.title, link: "" },
                  ]}
                />
              </BreadCumHeader>
            </Container>
          </BreadCumContainer>
        )}
        {loading ? (
          <ProductDetailShimmer />
        ) : (
          <>
            <Container maxWidth="lg" sx={{ my: 5, px: 1, overflow: "hidden" }}>
              <Grid container spacing={2}>
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      className="magnify-image"
                      sx={{
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                      }}
                    >
                      <div className="image-magnifier-container relative">
                        <IconButton
                          size="medium"
                          onClick={() => router.back()}
                          className="sm:hidden"
                          sx={{
                            position: "fixed",
                            // top: 0,
                            left: 15,
                            zIndex: 1000,
                            backgroundColor: "transparent",
                            display: { xs: "block", sm: "none" },
                            padding: 0,
                          }}
                        >
                          <ArrowBack sx={{ color: "#fff", backgroundColor: "rgba(0,0,0,0.6)", borderRadius: "2px", }} fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          className="zoom-button"
                          onClick={isLightBox}
                          sx={{
                            position: "absolute",
                            zIndex: 1000,
                            alignSelf: "flex-end",
                            display: "flex",
                            background: "white",
                            cursor: "pointer",
                            right: 10,
                            top: 10,
                          }}
                        >
                          <ZoomInOutlined
                            className="zoom-icon"
                            fontSize="medium"
                            sx={{ color: COLORS.textColor }}
                          />
                        </IconButton>

                        <div className="relative">
                          <img
                            src={selectedImage}
                            alt="test"
                            width={600}
                            height={500}
                            loading="eager"
                            decoding="sync"
                            className="object-cover rounded-sm border border-gray-300"
                          />

                          {selectedProductInfo?.online_exclusive ? (
                            <div className="absolute bottom-2 right-0 p-2 z-10 h-[60px] w-[150px]">
                              <Image
                                src="https://d1tv1hwh9wfb3x.cloudfront.net/assets/front/images/online-exclusive-en.jpeg"
                                alt={
                                  selectedProductInfo?.title || "Product Image"
                                }
                                className="object-contain  w-auto"
                                loading="lazy"
                                fill
                                draggable={false}
                              />
                            </div>
                          ) : null}
                        </div>
                        {/* </TransformComponent>
                          </TransformWrapper> */}
                        {/* )} */}
                      </div>
                    </Box>

                    <Box sx={{ width: "100%", mt: 4 }}>
                      <Carousel
                        responsive={responsive}
                        infinite={false}
                        arrows
                        keyBoardControl
                        draggable={false}
                        showDots={false}
                        slidesToSlide={1}
                        containerClass="carousel-container"
                      >
                        {selectedProductInfo?.photo?.length > 0 &&
                          selectedProductInfo.photo.map((p) => (
                            <Box key={p?.id}>
                              <div
                                draggable={false}
                                onClick={() => handleSelectImage(p?.src)}
                                className={`relative rounded-sm overflow-hidden cursor-pointer border-1 ${selectedImage === p?.src
                                  ? "border-[#bb1f2a]"
                                  : "border-[#4433]"
                                  } h-[110px] w-[96%] scale-0.9`}
                              >
                                <Image
                                  src={p?.src}
                                  alt="Product Image"
                                  fill
                                  className="object-cover"
                                  loading="lazy"
                                />
                              </div>
                            </Box>
                          ))}
                      </Carousel>
                    </Box>
                    <BundleCard
                      bundleCard={selectedProductInfo}
                      isRTL={isRTL}
                      matchesSM={matchesSM}
                    />
                  </Box>
                </Grid>

                {/* Product Details */}
                <Grid
                  size={{
                    xs: 12,
                    md: 6,
                  }}
                >
                  <Box sx={{}}>
                    <Box>
                      {/* Product Title */}
                      <Typography
                        sx={{
                          fontSize: { xs: "16px", sm: "24px" },
                          fontWeight: "600",
                        }}
                      >
                        {selectedProductInfo?.title}
                      </Typography>

                      {/* Pricing and Rating Section */}
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: {
                            xs: "flex-start",
                            sm: "space-between",
                          },
                          flexDirection: { xs: "column", sm: "row" },
                          mb: 1,
                        }}
                      >
                        <Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 1,
                              alignItems: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: { xs: "17px", sm: "22px" },
                                fontWeight: "600",
                                color: "#bb1f2a",
                              }}
                            >
                              {selectedProductInfo?.sale_price > 0
                                ? selectedProductInfo?.sale_price
                                : selectedProductInfo?.list_price}
                              {selectedCountry?.currency_code}
                            </Typography>

                            {selectedProductInfo?.sale_price > 0 && (
                              <Typography
                                sx={{
                                  fontSize: { xs: "12px", sm: "14px" },
                                  color: "#687188",
                                  textDecoration: "line-through",
                                }}
                              >
                                {selectedProductInfo?.list_price}{" "}
                                {selectedCountry?.currency_code}
                              </Typography>
                            )}

                            {selectedProductInfo?.discount_label && (
                              <Typography
                                sx={{ fontSize: "14px", color: "green" }}
                              >
                                {selectedProductInfo?.discount_label}
                              </Typography>
                            )}
                          </Box>
                          <Typography
                            sx={{
                              fontSize: { xs: "10px", sm: "12px" },
                              color: "#687188",
                            }}
                          >
                            ({t("price_include")})
                          </Typography>
                        </Box>

                        {/* Ratings Section */}

                        <div className="hidden sm:block">
                          <Rating
                            emptyIcon={
                              <StarBorderIcon
                                style={{ opacity: 1, color: "#687188" }}
                                className="muiRatingIcon"
                                fontSize="inherit"
                              />
                            }
                            icon={
                              <StarIcon
                                style={{ color: "#bb1f2a" }}
                                fontSize="inherit"
                              />
                            }
                            value={
                              Number(selectedProductInfo?.average_rating) || 0
                            }
                            readOnly
                            sx={{ opacity: 1 }}
                          />
                          <div className="text-[#687188] text-[11px] sm:text-[13px]">
                            ({selectedProductInfo?.total_rating}) {t("rating")}
                          </div>
                        </div>
                      </Box>
                      <div className="flex  justify-between items-center  w-full mt-1">
                        {/* Rating Section */}
                        <div className="block sm:hidden ">
                          <Rating
                            emptyIcon={
                              <StarBorderIcon
                                style={{ opacity: 1, color: "#687188" }}
                                className="muiRatingIcon"
                                fontSize="inherit"
                              />
                            }
                            icon={
                              <StarIcon
                                style={{ color: "#bb1f2a" }}
                                fontSize="inherit"
                              />
                            }
                            value={
                              Number(selectedProductInfo?.average_rating) || 0
                            }
                            readOnly
                            sx={{ opacity: 1 }}
                          />
                          <div className="text-[#687188] text-[11px] sm:text-[13px]">
                            ({selectedProductInfo?.total_rating}) {t("rating")}
                          </div>
                        </div>

                        {/* Quantity Controls (Cart) */}
                        {selectedProductInfo?.quantity ? (
                          <div className="flex sm:hidden items-center gap-2 mx-2 bg-[white] border border-gray-200 rounded-[19px] overflow-hidden ">
                            <button
                              className="bg-gray-100 px-1 py-1 rounded cursor-pointer"
                              onClick={() =>
                                handleDecrement(
                                  selectedProductInfo?.variant_id,
                                  selectedProductInfo?.quantity,
                                  selectedQuantity,
                                )
                              }
                            >
                              <Remove className="text-xs" />
                            </button>

                            <div className="min-w-[15px] text-sm flex items-center justify-center">
                              {selectedQuantity}
                            </div>

                            {productData && (
                              <button
                                className="bg-gray-100 px-1 py-1 rounded cursor-pointer"
                                onClick={() =>
                                  handleIncrement(
                                    selectedProductInfo?.variant_id,
                                    selectedProductInfo?.quantity,
                                    selectedQuantity,
                                  )
                                }
                              >
                                <Add className="text-sm" />
                              </button>
                            )}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {selectedProductInfo &&
                      selectedProductInfo?.is_flash_sale === true ? (
                      <div className="relative w-[65px] h-[50px]">
                        <Image
                          src={flashSaleImg}
                          alt={selectedProductInfo?.title || "Product Image"}
                          fill
                          className="object-contain"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                    ) : null}
                    {selectedProductInfo?.is_flash_sale === true && (
                      <Box
                        sx={{
                          display: "flex",
                          gap: { xs: 0.5, sm: 1 },
                        }}
                      >
                        {["days", "hours", "minutes", "seconds"].map((unit) => {
                          const value = timers?.[unit];
                          if (typeof value === "number" && !isNaN(value)) {
                            return (
                              <Typography
                                key={unit}
                                variant="body2"
                                sx={{
                                  fontWeight: 600,
                                  backgroundColor: "#bb1f2a",
                                  px: { xs: "4px", sm: "6px", md: "8px" },
                                  py: 0.5,
                                  fontSize: { xs: "12px", sm: "14px" },
                                  color: "#fff",
                                  borderRadius: "4px",
                                }}
                              >
                                {String(value).padStart(2, "0")}{" "}
                                {unit.charAt(0).toUpperCase()}
                              </Typography>
                            );
                          }
                          return null;
                        })}
                      </Box>
                    )}
                  </Box>
                  <div className="flex gap-2 items-start">
                    <span className="font-medium text-[#687188]">
                      {productData?.some((item) => item?.pattern?.variant_id)
                        ? t("pattern")
                        : t("color")}
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {productData?.map((variantItemInfo, index) => {
                        const { pattern, colors, sizes, items } = variantItemInfo;
                        const variantIds = [
                          pattern?.variant_id,
                          colors?.variant_id,
                          ...(sizes?.map((size) => size?.variant_id) || []),
                        ];
                        const isActive = variantIds.includes(
                          selectedProductInfo?.variant_id?.toString(),
                        );
                        const handleClick = (variantId) => {
                          if (variantId) {
                            const variant = items.find(
                              (v) => v?.variant_id == variantId,
                            );
                            handleColorChange(
                              variantId,
                              productId,
                              variant?.slug,
                            );
                          }
                        };

                        if (pattern?.variant_id) {
                          return (
                            <div
                              key={index}
                              onClick={() => handleClick(pattern?.variant_id)}
                              className={`w-[25px] h-[25px] rounded-full border border-gray-300 cursor-pointer flex-shrink-0 overflow-hidden p-0 ${isActive ? "ring-2 ring-[#bb1f2a]" : ""}`}
                            >
                              <Image
                                src={pattern?.image}
                                alt={`Pattern ${index}`}
                                width={30}
                                height={30}
                                className="rounded-full object-cover"
                                draggable={false}
                              />
                            </div>
                          );
                        }
                        if (variantItemInfo.colors?.all_colors?.length > 0) {
                          const colorsData = variantItemInfo.colors.all_colors;
                          const slice = 100 / colorsData.length;
                          const background = `conic-gradient(${colorsData
                            .map(
                              (color, i) =>
                                `${color} ${i * slice}% ${(i + 1) * slice}%`,
                            )
                            .join(", ")})`;

                          return (
                            <div
                              key={variantItemInfo.variant_id}
                              onClick={() => handleClick(colors?.variant_id)}
                              className={`w-6 h-6 rounded-full border border-gray-300 mx-0.5 cursor-pointer flex-shrink-0 ${isActive ? "ring-2 ring-[#bb1f2a]" : ""}`}
                              style={{ background }}
                            />
                          );
                        }
                      })}
                    </div>
                  </div>
                  {sizes && sizes.length > 0 && (
                    <div className="flex gap-2 mt-3 mb-1">
                      <p className="font-medium text-[#687188]">{t("size")}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {sizes.map((item, index) => {
                          const isActive =
                            selectedProductInfo?.variant_id?.toString() ===
                            item?.variant_id?.toString();

                          const handlePress = (variantId) => {
                            const selectedProductInfoSize = productData
                              ?.flatMap((infoD) => infoD?.items)
                              .find(
                                (info) =>
                                  info?.variant_id?.toString() ===
                                  variantId?.toString(),
                              );

                            const newUrl = `/${params.locale}/${params.currency}/products/${selectedProductInfoSize?.slug}?product_id=${productId}&variant_id=${variantId}`;
                            window.history.replaceState(null, "", newUrl);
                          };

                          return (
                            <div
                              key={index}
                              className={`uppercase px-2 rounded cursor-pointer 
                              shadow-[0_0_3px_rgba(0,0,0,0.5)] whitespace-nowrap font-medium h-[23px] 
                              ${isActive ? "bg-[#bb1f2a] text-white" : "bg-white text-black"}`}
                              onClick={() => handlePress(item?.variant_id)}
                            >
                              <p style={{ fontSize: "14px", direction: "ltr" }}>
                                {`${item?.size_name}`}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Typography
                    sx={{
                      color: selectedProductInfo?.quantity
                        ? "green"
                        : "#bb1b2a",
                      fontSize: "16px",
                      fontWeight: "bold",
                      marginTop: "5px",
                    }}
                  >
                    {selectedProductInfo?.quantity > 0
                      ? `${selectedProductInfo?.quantity} ${t("in_stock")}`
                      : `${t("out_of_stock")}`}
                  </Typography>

                  <Box>
                    {selectedProductInfo?.quantity > 0 ? (
                      <>
                        <Typography
                          sx={{
                            color: "gray",
                            fontSize: "15px",
                            mt: 1,
                            fontWeight: "600",
                          }}
                        >
                          {t("same_day_check")}.&nbsp;
                          <span
                            onClick={handleOpenChekDelivery}
                            style={{ color: "#bb1b2a", cursor: "pointer" }}
                          >
                            {areaName ? areaName : t("select_area")}
                          </span>
                        </Typography>
                        <Typography
                          sx={{
                            color: "green",
                            fontSize: "13px",
                            fontWeight: "bold",
                          }}
                        >
                          {message?.message}
                        </Typography>
                      </>
                    ) : null}
                    {selectedProductInfo?.is_bundle_product == true && (
                      <Box
                        onClick={() => {
                          setOpen(true);
                          getBunddel();
                        }}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <div className="w-full h-[100px] relative">
                          <Image
                            src={selectedProductInfo?.bundle_image}
                            alt="bundle_image"
                            fill
                            className="object-cover"
                            sizes="100vw"
                            draggable={false}
                          />
                        </div>
                        <ErrorOutlineIcon />
                      </Box>
                    )}
                  </Box>

                  <TabbyTamaraWidget
                    finalAmount={selectedProductInfo?.sale_price > 0
                      ? selectedProductInfo?.sale_price
                      : selectedProductInfo?.list_price}
                    currencyCode={selectedCountry?.currency_code}
                    locale={params.locale || 'en'}
                  />

                  <div style={{ display: "flex" }}>
                    <div className="fixed sm:static bottom-14 left-0  z-50 bg-white bg-opacity-70 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2 sm:p-0">
                      {/* Desktop Quantity Box */}
                      {selectedProductInfo?.quantity ? (
                        <>
                          <div className="hidden sm:flex gap-2 items-center my-2">
                            <button
                              className="bg-gray-200 p-1 rounded-full cursor-pointer"
                              onClick={() =>
                                handleDecrement(
                                  selectedProductInfo?.variant_id,
                                  selectedProductInfo?.quantity,
                                  selectedQuantity,
                                )
                              }
                            >
                              <Remove className="text-sm" />
                            </button>
                            <div className="min-w-[20px] flex items-center justify-center">
                              {selectedQuantity}
                            </div>
                            {productData && (
                              <button
                                className="bg-gray-200 p-1 rounded-full cursor-pointer"
                                onClick={() =>
                                  handleIncrement(
                                    selectedProductInfo?.variant_id,
                                    selectedProductInfo?.quantity,
                                    selectedQuantity,
                                  )
                                }
                              >
                                <Add className="text-sm" />
                              </button>
                            )}
                          </div>

                          {/* Add to Cart Button */}
                          <div className=" justify-center hidden sm:flex ">
                            <button
                              disabled={isOutOfStock || isLoading}
                              onClick={() =>
                                inCart
                                  ? router.push("/cart")
                                  : addToCart(
                                    selectedProductInfo?.variant_id,
                                    selectedQuantity,
                                  )
                              }
                              className={`w-full sm:w-auto py-2 px-6 text-xs rounded text-white flex items-center justify-center shadow-none ${isOutOfStock || isLoading
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-[#bb1f2a]"
                                }`}
                            >
                              {isLoading ? (
                                <CircularProgress
                                  size={16}
                                  sx={{ color: "#fff", mr: 1 }}
                                />
                              ) : (
                                <svg
                                  className="cart-svg-icon mx-2"
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
                              )}
                              {inCart ? t("go_to_cart") : t("add_to_cart")}
                            </button>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}

                      {/* Wishlist Button */}
                    </div>
                    <WishlistButton
                      isLoggedIn={isLoggedIn}
                      productId={productId}
                      variantId={variantId}
                      isItemInWishlist={isItemInWishlist}
                      toggleWishlist={toggleWishlist}
                      handleOpenLogin={handleOpenLogin}
                      sx={{ margin: "10px" }}
                    />
                  </div>
                  {/* Mobile Quantity Box */}
                  {selectedProductInfo && (
                    <MobileAddCartBox
                      selectedProductInfo={selectedProductInfo}
                      selectedCountry={selectedCountry}
                      selectedQuantity={selectedQuantity}
                      isOutOfStock={isOutOfStock}
                      isLoading={isLoading}
                      inCart={inCart}
                      addToCart={() => {
                        inCart
                          ? router.push("/cart")
                          : addToCart(
                            selectedProductInfo?.variant_id,
                            selectedQuantity,
                          );
                      }}
                      t={t}
                    />
                  )}
                  <div></div>

                  <hr />
                  <Box sx={{ mb: 4 }}>
                    <Box sx={{ color: "#687188" }}>
                      <Typography sx={{ my: 1 }}>
                        <strong>{t("model")}:</strong> {details?.group}
                      </Typography>
                      <Typography sx={{ my: 1 }}>
                        <strong>{t("brand")}:</strong>
                        <Link
                          href={`/brand/${details?.brand_slug}`}
                          sx={{ textDecoration: "none", color: "#292b2c" }}
                          color="primary"
                        >
                          {` ${details?.brand}`}
                        </Link>
                      </Typography>
                      <Typography
                        sx={{
                          my: 1,
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 2,
                          wordBreak: "break-all",
                          whiteSpace: "normal",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <strong>{t("tags")}: </strong>
                        {details?.tags}
                      </Typography>

                      {/* Share Section */}
                      <Box mt={3} display="flex" gap={2} alignItems="center">
                        <Typography sx={{ my: 1 }} color="#687188">
                          <strong>{t("share")}:</strong>
                        </Typography>
                        <FacebookShareButton url={pathname}>
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>

                        <WhatsappShareButton url={pathname} separator=":: ">
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
                <div className="w-full block sm:hidden">
                  <Grid className="w-full ">
                    <div className="flex justify-between items-center cursor-pointer bg-gray-100  sm:p-6  px-2 py-2">
                      <div className="text-[14px] font-semibold text-gray-700">
                        Product Description
                      </div>
                      <button
                        onClick={toggleAccordion}
                        className="text-gray-500 focus:outline-none"
                      >
                        {isOpenAccordion ? (
                          <TiArrowSortedUp size={20} />
                        ) : (
                          <TiArrowSortedDown size={20} />
                        )}
                      </button>
                    </div>
                    {isOpenAccordion && (
                      <Box className="mt-2 bg-gray-100">
                        {selectedProductInfo?.description && (
                          <Typography className="text-gray-700 p-4 text-sm sm:text-base">
                            {parse(selectedProductInfo?.description)}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Grid>
                </div>
                <div className="w-full hidden sm:block">
                  <Grid size={12}>
                    {selectedProductInfo?.description && (
                      <Box sx={{ color: "#687188" }}>
                        <Typography>
                          {parse(selectedProductInfo?.description)}
                        </Typography>
                      </Box>
                    )}
                  </Grid>
                </div>
              </Grid>
              <BundleProductsModal
                bundleProduct={getDetails}
                open={open}
                handleClose={handleClose}
              />
              <ReviewSection
                reviews={ratingData}
                handleLike={handleLike}
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                onPageChange={onPageChange}
              />
            </Container>
            <div className="mb-[80px] sm:mb-0">
              {getSimilar?.length > 0 && (
                <AppSlider
                  productsCard={getSimilar || []}
                  isLoading={isLoading}
                  title={"Realted Produts"}
                  viewHref={`/search/recommended_product`}
                />
              )}
            </div>
          </>
        )}
      </div>
      <Login
        open={openLogin}
        handleOpenRegister={handleOpenRegister}
        setOpenMobileOtp={handleOpenLogin}
        setOpenForgotPassword={setOpenForgotPassword}
        handleClose={handleCloseLogin}
        handleCloseRegister={handleCloseRegister}
        loading={loading}
        switchToRegister={switchToRegister}
      />
      <Register
        open={openRegister}
        switchToLogin={switchToLogin}
        handleClose={handleCloseRegister}
        loading={loading}
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
      <CheckDelivery
        open={openChekDelivery}
        handleClose={() => setOpenChekDelivery(false)}
        handleCityChange={handleCityChange}
        handleAreaChange={handleAreaChange}
        Check={CheckDeliveryAvailable}
        cities={cities}
        areas={areas}
        city={city}
        area={area}
      />
      <FullScreenImageModal
        imageUrl={selectedImage || selectedProductInfo?.photo?.[0]?.src || ""}
        isVisible={lightboxOpen}
        onClose={isLightBox}
      />
    </>
  );
};

export default ProductDetails;
