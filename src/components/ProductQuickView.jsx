"use client";

import React, {
    useCallback,
    useEffect,
    useState,
    useRef,
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
    Dialog,
    DialogTitle,
    DialogContent,
    Slide,
} from "@mui/material";
import { Star as StarIcon, StarBorder as StarBorderIcon, Close } from "@mui/icons-material";
import Carousel from "react-multi-carousel";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { homeApi } from "@/utils/services/homeServices";
import useCartStore from "@/store/useCartStore";
import {
    Add,
    Remove,
    ZoomInOutlined,
} from "@mui/icons-material";
import { showToast } from "@/utils/helper";
import { WhatsappShareButton, WhatsappIcon, FacebookShareButton, FacebookIcon } from "react-share";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useLanguageStore } from "@/store/useLanguageStore";
import COLORS from "@/utils/colors";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import BundleCard from "@/components/ProductDeatailsCom/BundleCard";
import FullScreenImageModal from "@/components/home/FullScreenImageModal";
import Image from "next/image";
import ImagePath from "@/constants/imagepath";
import MobileAddCartBox from "./MobileQuantityBox";
import Loading from "./Loading";

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

const DetailsQuickView = ({ isOpen, closeModal, productVariantId: variantId, productId }) => {

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

    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [productData, setProductData] = useState([]);
    const [sizes, setSizes] = useState([]);
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down("lg"));
    const isRTL = useLanguageStore.getState().language === "ar";
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const pathname = usePathname();
    let storedUserInfo = {};
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        storedUserInfo = JSON.parse(localStorage.getItem("USER") || "{}");
    }
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
    const [selectedImage, setSelectedImage] = useState(null);
    const { selectedCountry } = useSettingsStore();

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
                (variant) => variant?.items || [],
            );
            const selectedProductInfo = flattenedItems.find(
                (info) => info?.variant_id?.toString() == variantId,
            );

            if (selectedProductInfo) {
                const selectedVariantIndex = productData?.findIndex((variant) =>
                    variant.items.some(
                        (item) => item?.variant_id == selectedProductInfo?.variant_id,
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

    const handleColorChange = (variantId) => {
        findVariantByVid(variantId, productData);
    };

    const handleGoToCart = () => {
        closeModal()
        router.push("/cart")
    }

    const fetchProductDetails = useCallback(
        async (variantId, pid) => {
            if (!productId || !variantId) {
                return;
            }
            if (!open) {
                return;
            }
            setLoading(true);
            let product_Id = pid ?? productId;
            try {
                const res = await homeApi.getProductDetails(
                    {
                        customer_id: storedUserInfo.id,
                        product_id: product_Id,
                        variant_id: variantId,
                    },
                    true,
                );
                if (res && res.status === 200) {
                    const variants = res?.data?.variants || [];
                    setAllVariants(variants);
                    setProductData(variants);
                    setDetails(res.data?.product_details);
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setLoading(false);
            } finally {
                setLoading(false);
            }
        },
        [productId, open],
    );


    useEffect(() => {
        if (productData && productData.length > 0) {
            findVariantByVid(variantId, productData);
        }
        return () => { };
    }, [productData, pathname, variantId]);

    useEffect(() => {
        if (variantId && open) {
            setTimeout(() => {
                fetchProductDetails(variantId);
            }, 0);
        }
    }, [locale, productId, open]);


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
            <Dialog
               open={isOpen} onClose={closeModal} maxWidth="lg" disableScrollLock
                fullScreen={isMobile}
                sx={{
                    "& .MuiDialog-container": {
                        width: "100%",
                    },
                }}
                PaperProps={{ sx: {} }}>
                <>
                    <DialogTitle style={{ padding: '5px' }}>
                        <div className="flex items-center justify-end" >
                            <IconButton
                                onClick={closeModal}
                                sx={{ color: 'gray', alignSelf: 'flex-end' }}
                            >
                                <Close />
                            </IconButton>
                        </div>
                    </DialogTitle>
                    {loading ? <Loading /> : (
                        <>
                            <DialogContent dividers sx={{ p: 0, position: 'relative' }}>
                                <div
                                    style={{

                                        margin: "0px",
                                        padding: "0px",

                                    }}
                                >
                                    <Container maxWidth="lg" sx={{ my: { xs: 2, sm: 5 }, pb: 5, px: 1, overflow: "hidden" }}>
                                        <Grid container spacing={2} position={'relative'}>
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
                                                        <div className="image-magnifier-container">
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

                                                        </div>
                                                    </Box>

                                                    <Box sx={{ width: "100%", mt: 2 }}>
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
                                                {/* <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                        {selectedProductInfo &&
                                            selectedProductInfo?.is_flash_sale === true ? (
                                            <div className="relative w-[65px] h-[50px]">
                                                <Image
                                                    src={ImagePath.flashSale}
                                                    alt={selectedProductInfo?.title || "Product Image"}
                                                    fill
                                                    className="object-contain"
                                                    loading="lazy"
                                                    draggable={false}
                                                />
                                            </div>
                                        ) : null}
                                    </Box> */}
                                                <div className="flex gap-2 items-start">
                                                    <span className="font-medium text-[#687188]">
                                                        {productData?.some((item) => item?.pattern?.variant_id)
                                                            ? t("pattern")
                                                            : t("color")}
                                                    </span>

                                                    <div className="flex flex-wrap gap-1.5">
                                                        {productData?.map((variantItemInfo, index) => {
                                                            const { pattern, colors, sizes, items } =
                                                                variantItemInfo;
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
                                                                        variantId
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
                                                                const background = `conic-gradient(${colorsData.map((color, i) => `${color} ${i * slice}% ${(i + 1) * slice}%`).join(", ")})`;
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
                                                    <div className="flex gap-2 mt-4 mb-2">
                                                        <p className="font-medium text-[#687188]">{t("size")}</p>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            {sizes.map((item, index) => {
                                                                const isActive =
                                                                    selectedProductInfo?.variant_id?.toString() ===
                                                                    item?.variant_id?.toString();

                                                                const handlePress = (variantId) => {
                                                                    findVariantByVid(variantId, productData)
                                                                };
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className={`uppercase px-2 rounded cursor-pointer 
                                                            shadow-[0_0_3px_rgba(0,0,0,0.5)] whitespace-nowrap font-medium h-[20px] 
                                                            ${isActive ? "bg-[#bb1f2a] text-white" : "bg-white text-black"}`}
                                                                        onClick={() => handlePress(item?.variant_id)}
                                                                    >
                                                                        <div style={{ fontSize: "14px", direction: "ltr" }}>
                                                                            {`${item?.size_name}`}
                                                                        </div>
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
                                                </Box>
                                                <div style={{ display: "flex", position: "relative" }}>
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
                                                                <div className=" justify-center hidden sm:flex mx-1">
                                                                    <button
                                                                        disabled={isOutOfStock || isLoading}
                                                                        onClick={() => {
                                                                            inCart
                                                                                ? handleGoToCart()
                                                                                : addToCart(
                                                                                    selectedProductInfo?.variant_id,
                                                                                    selectedQuantity,
                                                                                )
                                                                        }
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

                                                </div>

                                                <hr className="my-2" />
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
                                                        <Box mb={1} display="flex" gap={2} alignItems="center">
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

                                        </Grid>
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
                                    </Container>

                                </div>
                            </DialogContent>
                            <FullScreenImageModal
                                imageUrl={selectedImage || selectedProductInfo?.photo?.[0]?.src || ""}
                                isVisible={lightboxOpen}
                                onClose={isLightBox}
                            />
                        </>
                    )}

                </>
            </Dialog >
        </>
    );
};

export default DetailsQuickView;
