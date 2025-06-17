"use client";

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  List,
  ListItem,
  Rating,
  CardMedia,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { Add, ArrowBack, Remove } from "@mui/icons-material";
import { smartShoppingApi } from "@/utils/services/smartShopping";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { keyframes } from "@mui/system";
import { engagementApi } from "@/utils/services/engagementServices";
import mergeImages from "merge-images";
import { homeApi } from "@/utils/services/homeServices";
import useCartStore from "@/store/useCartStore";
import { useWishListStore } from "@/store/useWishListStore";
import { showToast } from "@/utils/helper";
import useUserStore from "@/store/user";
import {
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
} from "react-share";
import parse from "html-react-parser";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import Register from "@/auth/Register/Register";
import Login from "@/auth/Login/Login";
import { useSettingsStore } from "@/store/useSettingsStore";
import { shippingApi } from "@/utils/services/shippingApi";
import {
  BreadCumContainer,
  BreadCumHeader,
  ClickClose,
  DisplayFlex,
  ImagePikerBox,
  ImagePikerMain,
  SpinLoader,
  StyledHeading,
  VisibilityBox,
} from "@/components/styles";
import OtpDialog from "@/auth/Login/OtpDialog";
import { useTranslations } from "next-intl";
import CheckDelivery from "@/components/CheckDelivery";
import { useRouter, Link } from "@/i18n/navigation";
import BreadcrumbsComponent from "@/components/BreadcrumbsComponent";
import FullScreenImageModal from "@/components/FullScreenImageModal";
import RoomBackground from "@/components/RoomBackground";
import ProductDetailShimmer from "@/components/skeleton/ProductDetailShimmer";
import MobileAddCartBox from "@/components/MobileQuantityBox";
import WishlistButton from "@/components/WishlistButton";
import { useParams } from "next/navigation";
import TagSlider from "@/components/CustomCarouselGrid";
// import globellcss from "@/styles/globell.module
import "@/app/link.css";
import useShippingStore from "@/store/useShippingStore";
import TabbyTamaraWidget from "@/components/ProductPage";

const SmartShoppingDetails = ({ }) => {
  const params = useParams();
  const { locale } = params;
  const [tagDataStore, setTagDataStore] = useState({});
  const [isDataLoded, setIsDataLoded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionStore, setSelectionStore] = useState({});
  const [selectedTags, setSelectedTags] = useState({});
  const [selectedTag, setSelectedTag] = useState("");
  const [mergedImage, setMergedImage] = useState(null);
  const { selectedCountry } = useSettingsStore();
  const [TagData, setTagData] = useState([]);
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userData, setUserData] = useState(null);
  const [productData, setProductData] = useState("");
  const [productTags, setProductTags] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const firstKey = Object.keys(selectedTags)?.[0];
  const { productId, variantId } = selectedTags?.[firstKey] || {};
  const { id } = params;
  const { isLoggedIn } = useUserStore();
  const { toggleWishlist, isItemInWishlist } = useWishListStore();
  const t = useTranslations();
  const [isOpenAccordion, setIsOpenAccordion] = useState(false);
  const toggleAccordion = () => setIsOpenAccordion(!isOpenAccordion);

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
  const timeoutRef = useRef(null);
  const router = useRouter();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openMobileOtp, setOpenMobileOtp] = useState(false);
  const [userId, setUserId] = useState(null);
  const [openChekDelivery, setOpenChekDelivery] = useState(false);
  const [city, setCity] = useState(selectedCity);
  const [area, setArea] = useState(selectedArea);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [message, setMessage] = useState("");
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);
  const handleOpenRegister = () => setOpenRegister(true);
  const handleCloseRegister = () => setOpenRegister(false);
  const [openForgotPassword, setOpenForgotPassword] = useState(false);

  const handleOpenChekDelivery = () => {
    setOpenChekDelivery(true);
  };
  const switchToRegister = () => {
    handleCloseLogin();
    handleOpenRegister();
  };

  const switchToLogin = () => {
    handleCloseRegister();
    handleOpenLogin();
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    if (selectedCity) {
      setCity(selectedCity);
    }
    if (selectedArea) {
      setArea(selectedArea);
    }
  }, [selectedCity, selectedArea]);

  async function getTagListByTagId(id, order, background_image) {

    try {
      setSelectedTag(id.toString());
      if (tagDataStore[id]) {
        const responseData = tagDataStore[id];
        setTagData(responseData);
        const selectedTagData = selectedTags[id];
        if (selectedTagData) {
          setSelectedProduct({
            productId: selectedTagData.productId.toString(),
            variantId: selectedTagData.variantId.toString(),
          });

          let data = {
            ...selectedTags,
            [id]: {
              variantId: selectedTagData.variantId.toString(),
              index: 0,
              url: selectedTagData.url,
              productId: selectedTagData.productId.toString(),
              order: order,
            },
          };
          handleMergeImages(
            selectedTagData.index,
            data,
            order,
            background_image,
          );
        } else {
          const firstTag = responseData[0];
          let data = {
            ...selectedTags,
            [id]: {
              variantId: firstTag.product_varaint_id.toString(),
              index: 0,
              url: firstTag.tag_image,
              productId: firstTag.product_id.toString(),
              order: order,
            },
          };
          setSelectedTags(data);
          setSelectedProduct({
            productId: firstTag.product_id.toString(),
            variantId: firstTag.product_varaint_id.toString(),
          });
          handleMergeImages(0, data, order, background_image);
        }
        return;
      }

      const response = await engagementApi.getTaggedProducts({ tag_id: id });

      if (response && response.status === 200) {
        const responseData = response.data;
        setTagDataStore((prevStore) => ({
          ...prevStore,
          [id]: responseData,
        }));

        setTagData(responseData);

        const firstTag = responseData[0];
        let data = {
          ...selectedTags,
          [id]: {
            variantId: firstTag.product_varaint_id.toString(),
            index: 0,
            url: firstTag.tag_image,
            productId: firstTag.product_id.toString(),
            order: order,
          },
        };

        setSelectedTags(data);
        setSelectedProduct({
          productId: firstTag.product_id.toString(),
          variantId: firstTag.product_varaint_id.toString(),
        });

        handleMergeImages(0, data, order, background_image);

      }
    } catch (err) {
      console.error("Error fetching subcategories:", err);
    }
  }
  const fetchImageAsDataURI = async (url) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const handleMergeImages = async (
    index,
    selectedTags,
    order,
    background_image = "",
  ) => {
    setSelectedIndex(index);
    try {
      setLoading(true);
      const backgroundImage =
        mainImage !== ""
          ? mainImage
          : background_image || data?.background_image || "";
      const sortedTags = Object.values(selectedTags)
        .filter((item) => item.order >= order)
        .sort((a, b) => a.order - b.order);
      let imagesToMerge = [];
      let mergedBase64Pri = backgroundImage
        ? await fetchImageAsDataURI(backgroundImage)
        : null;

      if (mergedBase64Pri) {
        imagesToMerge.push(mergedBase64Pri);
      }

      const tagImages = await Promise.all(
        sortedTags.map((tagData) => fetchImageAsDataURI(tagData.url)),
      );

      imagesToMerge = imagesToMerge.concat(tagImages);

      const mergedBase64 = await mergeImages(imagesToMerge);
      setMainImage(mergedBase64);
      setMergedImage(mergedBase64);
      
    } catch (error) {
      console.error("Error merging images:", error);
    } finally {
      setLoading(false);
    }
  };

  const ping = keyframes`
    0% {
      transform: scale(1);
      opacity: 1;
    }
    75% {
      transform: scale(2);
      opacity: 0;
    }
    100% {
      transform: scale(2);
      opacity: 0;
    }
  `;

  const handleMergeCancel = async (removeId) => {
    try {
      setLoading(true);

      const newSelectedTags = { ...selectedTags };

      const { [removeId]: removed, ...updatedSelectedTags } = newSelectedTags;
      setSelectedTags(updatedSelectedTags);
      const dataValue = Object.values(updatedSelectedTags).sort(
        (a, b) => a.order - b.order,
      );
      const backgroundImage = data?.background_image;
      let allUris = [];
      if (backgroundImage) {
        const mergedBase64Pri = await fetchImageAsDataURI(backgroundImage);
        allUris.push(mergedBase64Pri);
      }

      if (selectionStore) {
        const imageDataURIsBackground = await Promise.all(
          Object.values(selectionStore).map((value) =>
            fetchImageAsDataURI(value),
          ),
        );
        allUris.push(...imageDataURIsBackground);
      }
      if (dataValue.length > 0) {
        const imageDataURIs = await Promise.all(
          dataValue.map(({ url }) => fetchImageAsDataURI(url)),
        );
        allUris.push(...imageDataURIs);
        const result = await mergeImages(
          allUris.map((uri) => ({ src: uri, x: 0, y: 0 })),
        );
        if (result) {
          setMergedImage(result);
          setMainImage(result);
        }
      } else if (allUris.length > 1) {
        const result = await mergeImages(
          allUris.map((uri) => ({ src: uri, x: 0, y: 0 })),
        );
        if (result) {
          setMergedImage(result);
          setMainImage(result);
        }
      } else {
        handleBackgroundChange({ 0: backgroundImage });
        setMainImage("");
        setMergedImage("");
        setSelectedTags({});
      }
    } catch (error) {
      console.error("Error processing images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundChange = async (selectionStore, selectedTags = {}) => {
    setLoading(true);

    try {
      const backgroundImage = data?.background_image;
      let allUris = [];
      if (backgroundImage) {
        const mergedBase64Pri = await fetchImageAsDataURI(backgroundImage);
        allUris.push(mergedBase64Pri);
      }

      const selectedImages = Object.values(selectionStore).filter(
        (image) => image !== null,
      );
      for (const image of selectedImages) {
        const uri = await fetchImageAsDataURI(image);
        allUris.push(uri);
      }

      if (selectedTags && Object.keys(selectedTags).length) {
        const sortedTags = Object.values(selectedTags).sort(
          (a, b) => a.order - b.order,
        );
        for (const { url } of sortedTags) {
          const uri = await fetchImageAsDataURI(url);
          allUris.push(uri);
        }
      }

      const formattedUris = allUris.map((uri) => ({ src: uri, x: 0, y: 0 }));
      const result = await mergeImages(formattedUris);

      setMergedImage(result);
      setMainImage(result);
    } catch (error) {
      console.error("Error merging images:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductDetails = async () => {
    if (!productId) {
      return;
    }

    try {
      const reqBody = {
        product_id: productId,
        variant_id: variantId,
      };
      const res = await homeApi.getProductDetails(reqBody, false);
      if (res && res.status === 200) {
        setProductTags(res?.data?.product_details);
        const variantItems =
          res?.data?.variants?.flatMap((variant) => variant?.items) || [];
        const match = variantItems.find(
          (item) => item?.variant_id == variantId,
        );
        if (match) {
          setProductData(match);
        } else {
          console.log("No match found for variantId:", variantId);
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setIsDataLoded(true);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [selectedTags]);

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

  const smartShoppingDetails = async () => {
    try {
      const requestBody = {
        engagement_id: id,
      };
      const response =
        await smartShoppingApi.smartShoppingDetailsApi(requestBody);
        if (response && response.status === 200) {
          setData(response.data);
          console.log(response.data, "response.data");
          
          if (response.data?.tag_list?.[0]?.tag_id) {
            getTagListByTagId(
              response.data?.tag_list?.[0]?.tag_id,
              response.data?.tag_list?.[0]?.position_order,
              response.data.background_image,
            );
          }
        }
    } catch (error) {
      console.log(error, "error in smart shopping smartShoppingDetails ");
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    smartShoppingDetails();
  }, [id]);

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

  const getAreas = async (cityId, countryId) => {
    try {
      const res = await shippingApi.getArea(
        { country_id: countryId, city_id: cityId },
        false,
      );
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

  const Check = async () => {
    let areaId = area || selectedArea;
    let cityId = city || selectedArea;
    if (!areaId || productData?.quantity == 0) {
      return;
    }
    try {
      const req = {
        product_variant_id: productData?.variant_id,
        qty: productData?.quantity,
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
    if (productData?.variant_id) {
      Check();
    }
  }, [productData, locale]);

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
    if (cartItems && productData) {
      let qty = getCartQuantityByVariantId(Number(productData?.variant_id));
      setSelectedQuantity(qty || 1);
    }
  }, [productData, cartItems]);

  if (!data?.main_image) {
    return;
  }

  const isLoading = loadingVariants?.[productData?.variant_id];
  const isOutOfStock = productData?.quantity === 0;
  const inCart = isItemInCart(productData?.variant_id);

  return (
    <div style={{ minHeight: "100vh" }}>
      <BreadCumContainer>
        <Container>
          <BreadCumHeader>
            <StyledHeading>{t("smart_shopping")}</StyledHeading>
            <BreadcrumbsComponent
              pathSegments={[
                { link: "/", text: t("home") },
                { text: t("smart_shopping"), link: "smart-shopping" },
              ]}
            />
          </BreadCumHeader>
        </Container>
      </BreadCumContainer>
      {!isDataLoded ? (
        <ProductDetailShimmer isEng={true} />
      ) : (
        <Container
          maxWidth="lg"
          sx={{
            my: 3,
            px: 1,
            overflow: "hidden",
            mb: { xs: "100px", sm: "0" },
          }}
        >
          <Grid container spacing={4}>
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <DisplayFlex flexDirection="column">
                <Box sx={{ width: "100%", position: "relative" }}>
                  {loading && (
                    <SpinLoader>
                      <CircularProgress sx={{ color: "#bb1f2a" }} />
                    </SpinLoader>
                  )}
                  <div className="relative w-full h-[200px] sm:h-[200px] md:h-[300px] lg:h-[400px]">
                    <img
                      src={mergedImage || data?.background_image}
                      alt={data?.title || "Image"}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <ImagePikerMain>
                    <IconButton
                      size="medium"
                      onClick={() => router.back()}
                      className="sm:hidden"
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 10,
                        zIndex: 1000,
                        backgroundColor: "transparent",
                        display: { xs: "block", sm: "none" },
                        padding: 0,
                      }}
                    >
                      <ArrowBack sx={{ color: "black" }} fontSize="medium" />
                    </IconButton>
                    <div style={{ position: "relative" }}>
                      <div
                        style={{
                          position: "absolute",
                          top: "10px",
                          right: "-2%",
                          display: "flex",
                          gap: "8px", // space between boxes
                          alignItems: "center",
                        }}
                      >
                        <ImagePikerBox
                          onClick={() => {
                            setOpen(true);
                          }}
                        >
                          <CardMedia
                            component={"img"}
                            src="https://d1tv1hwh9wfb3x.cloudfront.net/assets/front/images/color-pallete.png"
                          />
                        </ImagePikerBox>

                        <VisibilityBox onClick={handleOpenModal}>
                          <VisibilityIcon />
                        </VisibilityBox>
                      </div>
                    </div>
                    {data?.tag_list?.map((tag, index) => {
                      return (
                        <Box
                          key={index}
                          sx={{
                            position: "absolute",
                            top: `${tag.top}%`,
                            left: `${tag.left}%`,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {/* Tag Click Area */}
                          <ClickClose
                            onClick={() =>
                              getTagListByTagId(
                                tag?.tag_id,
                                tag?.position_order,
                              )
                            }
                          >
                            {selectedTag == tag?.tag_id && (
                              <Box
                                sx={{
                                  position: "relative",
                                  width: "20px",
                                  height: "20px",
                                }}
                              >
                                <Box
                                  sx={{
                                    position: "absolute",
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "50%",
                                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                                    animation: `${ping} 1.5s cubic-bezier(0, 0, 0.2, 1) infinite`,
                                  }}
                                />
                                <Box
                                  sx={{
                                    width: "10px",
                                    height: "10px",
                                    backgroundColor: "red",
                                    borderRadius: "50%",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)",
                                  }}
                                />
                              </Box>
                            )}
                          </ClickClose>

                          {/* Tag Info Section */}
                          {selectedTag == tag.tag_id && (
                            <Box sx={{ alignItems: "center", display: "flex" }}>
                              <Box
                                sx={{
                                  width: "30px",
                                  height: "1px",
                                  backgroundColor: "black",
                                }}
                              />
                              <Typography
                                variant="body2"
                                sx={{
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  color: "#000",
                                  backgroundColor: "#fff",
                                  padding: "6px 12px",
                                  borderRadius: "16px",
                                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                                }}
                              >
                                {tag?.text}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </ImagePikerMain>
                </Box>

                <TagSlider
                  TagData={TagData}
                  selectedTags={selectedTags}
                  selectedTag={selectedTag}
                  setSelectedTags={setSelectedTags}
                  handleMergeCancel={handleMergeCancel}
                  handleMergeImages={handleMergeImages}
                  setSelectedProduct={setSelectedProduct}
                  data={data}
                />
              </DisplayFlex>
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
                    {productData?.title}
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
                    }}
                  >
                    <Box>
                      <Box
                        sx={{ display: "flex", gap: 1, alignItems: "center" }}
                      >
                        <Typography
                          sx={{
                            fontSize: { xs: "16px", sm: "18px" },
                            fontWeight: "600",
                            color: "#bb1f2a",
                          }}
                        >
                          {productData?.sale_price > 0
                            ? productData?.sale_price
                            : productData?.list_price}
                          {selectedCountry?.currency_code}
                        </Typography>

                        {productData?.sale_price > 0 && (
                          <Typography
                            sx={{
                              fontSize: { xs: "12px", sm: "14px" },
                              color: "#687188",
                              textDecoration: "line-through",
                            }}
                          >
                            {productData?.list_price}{" "}
                            {selectedCountry?.currency_code}
                          </Typography>
                        )}

                        {productData?.discount_label && (
                          <Typography sx={{ fontSize: "14px", color: "green" }}>
                            {productData?.discount_label}
                          </Typography>
                        )}
                      </Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "12px", sm: "14px" },
                          color: "#687188",
                        }}
                      >
                        ({t("price_include")})
                      </Typography>
                    </Box>
                    <div className="hidden sm:block">
                      <Rating
                        color="#687188"
                        value={Number(productData?.average_rating) || 0}
                        readOnly
                      />
                      <div className="text-[#687188] text-[11px] sm:text-[13px]">
                        ({productData?.total_rating}) {t("rating")}
                      </div>
                    </div>

                    {/* Ratings Section */}
                    <div className="flex justify-between items-center  w-full mt-1">
                      {/* Rating Section */}
                      <div className="block sm:hidden ">
                        <Rating
                          color="#687188"
                          value={Number(productData?.average_rating) || 0}
                          readOnly
                        />

                        <div className="text-[#687188] text-[11px] sm:text-[13px]">
                          ({productData?.total_rating}) {t("rating")}
                        </div>
                      </div>

                      {/* Quantity Controls (Cart) */}
                      {productData?.quantity ? (
                        <div className="flex sm:hidden items-center gap-2 mx-2 bg-[white] border border-gray-200 rounded-[19px] overflow-hidden">
                          <button
                            className="bg-gray-100 px-1 py-1 rounded cursor-pointer"
                            onClick={() =>
                              handleDecrement(
                                productData?.variant_id,
                                productData?.quantity,
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
                                  productData?.variant_id,
                                  productData?.quantity,
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
              </Box>
              <Box>
                <Typography
                  sx={{
                    color: productData?.quantity ? "green" : "#bb1b2a",
                    fontSize: "16px",
                    fontWeight: "bold",
                    mt: 0,
                  }}
                >
                  {productData?.quantity > 0
                    ? `${productData?.quantity} ${t("in_stock")}`
                    : `${t("out_of_stock")}`}
                </Typography>
                {productData?.quantity > 0 ? (
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
                <TabbyTamaraWidget
                  finalAmount={productData?.sale_price > 0
                    ? productData?.sale_price
                    : productData?.list_price}
                  currencyCode={selectedCountry?.currency_code}
                  locale={params.locale || 'en'}
                />
                <div style={{ display: "flex" }}>
                  <div className="fixed sm:static bottom-14 left-0  z-50 bg-white bg-opacity-70 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2 sm:p-0">
                    {/* Desktop Quantity Box */}
                    {productData?.quantity ? (
                      <>
                        <div className="hidden sm:flex gap-2 items-center my-2">
                          <button
                            className="bg-gray-200 p-1 rounded cursor-pointer"
                            onClick={() =>
                              handleDecrement(
                                productData?.variant_id,
                                productData?.quantity,
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
                              className="bg-gray-200 p-1 rounded cursor-pointer"
                              onClick={() =>
                                handleIncrement(
                                  productData?.variant_id,
                                  productData?.quantity,
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
                                  productData?.variant_id,
                                  selectedQuantity,
                                )
                            }
                            className={`w-full cursor-pointer sm:w-auto py-2 px-6 text-xs rounded text-white flex items-center justify-center shadow-none ${isOutOfStock || isLoading
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
                {productData && (
                  <MobileAddCartBox
                    selectedProductInfo={productData}
                    selectedCountry={selectedCountry}
                    selectedQuantity={selectedQuantity}
                    isOutOfStock={isOutOfStock}
                    isLoading={isLoading}
                    inCart={inCart}
                    addToCart={() => {
                      inCart
                        ? router.push("/cart")
                        : addToCart(productData?.variant_id, selectedQuantity);
                    }}
                    t={t}
                  />
                )}
                <hr className="bg-[#687188] h-[1px] my-2 mx-0 border-0" />

                <Box sx={{}}>
                  <Box sx={{ color: "#687188" }}>
                    <List sx={{ p: 0 }}>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body1">
                          <strong>{t("modal")}:</strong> {productTags?.group}
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body1">
                          <strong>{t("brand")}:</strong>
                          <Link
                            href={`/brand/${productTags?.brand_slug}`}
                            sx={{ textDecoration: "none", color: "#292b2c" }}
                            color="primary"
                          >
                            {` ${productTags?.brand}`}
                          </Link>
                        </Typography>
                      </ListItem>
                      <ListItem sx={{ p: 0 }}>
                        <Typography variant="body1">
                          <strong>{t("tags")}: </strong>
                          {productTags?.tags}
                        </Typography>
                      </ListItem>
                    </List>
                    {/* Share Section */}
                    <Box mt={3} display="flex" gap={2} alignItems="center">
                      <Typography variant="body1" color="#687188">
                        <strong>{t("share")}:</strong>
                      </Typography>
                      <FacebookShareButton url={window.location.href}>
                        <FacebookIcon size={32} round />
                      </FacebookShareButton>
                      <WhatsappShareButton
                        url={window.location.href}
                        separator=":: "
                      >
                        <WhatsappIcon size={32} round />
                      </WhatsappShareButton>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>

            <div className="w-full block sm:hidden my-1">
              <div className="w-full ">
                <div className="flex justify-between items-center cursor-pointer bg-gray-100 p-3">
                  <p className="text-[14px] font-semibold text-gray-700 m-0 ">
                    Product Description
                  </p>
                  <button
                    onClick={toggleAccordion}
                    className="text-gray-500 focus:outline-none flex items-center"
                  >
                    {isOpenAccordion ? (
                      <TiArrowSortedUp size={20} />
                    ) : (
                      <TiArrowSortedDown size={20} />
                    )}
                  </button>
                </div>

                {isOpenAccordion && (
                  <Box className="mt-4 bg-gray-100">
                    <Typography className="text-[#687188] p-4 text-sm sm:text-base">
                      {parse(productData?.description || "")}
                    </Typography>
                  </Box>
                )}
              </div>
            </div>

            <div className="w-full hidden sm:block">
              <Grid size={12}>
                {productData?.description && (
                  <Box>
                    <span className="text-[#687188]">
                      {parse(productData?.description)}
                    </span>
                  </Box>
                )}
              </Grid>
            </div>
          </Grid>
        </Container>
      )}
      <RoomBackground
        open={open}
        data={data?.engagement_custom_background}
        selectedPhotos={selectionStore}
        onClose={() => setOpen(false)}
        onApply={(state) => {
          setSelectionStore(state);
          handleBackgroundChange(state, selectedTags);
          setOpen(false);
        }}
      />
      <FullScreenImageModal
        imageUrl={mergedImage}
        isVisible={modalVisible}
        onClose={handleCloseModal}
      />
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
        Check={Check}
        cities={cities}
        areas={areas}
        city={city}
        area={area}
      />
    </div>
  );
};

export default SmartShoppingDetails;
