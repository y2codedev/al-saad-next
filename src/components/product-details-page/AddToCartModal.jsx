"use client";

import React, { useCallback, useState, useEffect } from "react";
import OptimizedImage from "./OptimizedImage";
import ThumbnailSlider from "./ThumbnailSlider";
import CloseButton from "./CloseButton";
import parse from "html-react-parser";
import { useSettingsStore } from "@/store/useSettingsStore";
import { FaRegStar, FaStar } from "react-icons/fa";
import PatternSwatch from "./PatternSwatch";
import ColorSwatch from "./ColorSwatch";
import TabbyTamaraWidget from "../ProductPage";
import { AiOutlinePlus as Add, AiOutlineMinus as Remove } from "react-icons/ai";
import { ImSpinner2 } from "react-icons/im";
import { useWishListStore } from "@/store/useWishListStore";
import useUserStore from "@/store/user";
import useCartStore from "@/store/useCartStore";
import { useTranslations } from "next-intl";
import WishlistButton from "../WishlistButton";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import Link from "next/link";
import {
    WhatsappShareButton,
    WhatsappIcon,
    FacebookShareButton,
    FacebookIcon,
} from "react-share";
import { usePathname } from "@/i18n/navigation";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import Login from "@/auth/Login/Login";
import Register from "@/auth/Register/Register";
import ForgotPasswordModal from "@/auth/Login/ForgotPasswordModal";
import OtpDialog from "@/auth/Login/OtpDialog";
import { backdropClasses, dialogPanelClasses } from "@/utils/tailwindClasses";

const AddToCartModal = ({ open, onClose, selectedProductInfo, selectedImage, productData, sizes, details, loading }) => {
    const [selectImage, setSelectImage] = useState(selectedImage)
    const params = useParams();
    const t = useTranslations();
    const searchParams = useSearchParams();
    const productId = searchParams.get("product_id");
    const variantId = searchParams.get("variant_id");
    const pathname = usePathname();
    const { selectedCountry } = useSettingsStore();
    const [userData, setUserData] = useState(null);
    const [isOpenAccordion, setIsOpenAccordion] = useState(false);
    const toggleAccordion = () => setIsOpenAccordion(!isOpenAccordion);
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const handleOpenLogin = () => { setOpenLogin(true), onClose() };
    const handleCloseLogin = () => setOpenLogin(false);
    const handleOpenRegister = () => setOpenRegister(true);
    const handleCloseRegister = () => setOpenRegister(false);
    const [openMobileOtp, setOpenMobileOtp] = useState(false);
    const [openForgotPassword, setOpenForgotPassword] = useState(false);

    const switchToRegister = () => {
        handleCloseLogin();
        handleOpenRegister();
    };
    const switchToLogin = () => {
        handleCloseRegister();
        handleOpenLogin();
    };

    const router = useRouter();
    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const { toggleWishlist, isItemInWishlist } = useWishListStore();
    const { isLoggedIn } = useUserStore();
    const {
        isItemInCart,
        incrementQuantity,
        decrementQuantity,
        cartItems,
        addToCart,
        loadingVariants,
    } = useCartStore();


    if (!selectedProductInfo) {
        return null;
    }

    const { title, description, photo, list_price, sale_price, discount_label, total_rating, average_rating, quantity } = selectedProductInfo || {};

    const handleImageSelect = (img) => {
        setSelectImage(img);
    };

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

    const isLoading = loadingVariants?.[selectedProductInfo?.variant_id];
    const isOutOfStock = selectedProductInfo?.quantity === 0;
    const inCart = isItemInCart(selectedProductInfo?.variant_id);

    const handleColorChange = (variantId, productId, slug) => {
        const newUrl = `/${params.locale}/${params.currency}/products/${slug}?product_id=${productId}&variant_id=${variantId}`;
        window.history.replaceState(null, "", newUrl);
    };

    const totalStars = 5;

    return (
        <>
            <Dialog open={open} onClose={onClose} className="relative z-[9999] ">
                <DialogBackdrop transition className={backdropClasses} />
                <div className="fixed inset-0 z-[9999] w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center  text-center sm:items-center sm:p-0">
                        <DialogPanel transition className={dialogPanelClasses}>
                            <CloseButton
                                iconColor="#fff"
                                className="fixed sm:absolute top-2 right-0 z-50 bg-red-700 rounded-full hover:bg-red-800"
                                onClick={onClose}
                            />
                            <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto h-full sm:max-h-[75vh]">
                                <div className="relative flex flex-col w-full">
                                    <div className="relative w-full mt-3 h-64 sm:h-[440px] overflow-hidden">
                                        {selectImage &&
                                            <OptimizedImage
                                                src={selectImage}
                                                alt={title}
                                                fill
                                                className="object-cover rounded-sm"
                                            />
                                        }
                                    </div>
                                    {photo && photo?.length > 0 &&
                                        <ThumbnailSlider
                                            images={photo}
                                            selectImage={selectImage}
                                            onImageClick={handleImageSelect}
                                        />
                                    }
                                </div>

                                <div className="flex flex-col h-full">
                                    <div className="flex flex-col flex-grow sm:py-10 sm:pb-0 sm:h-auto">
                                        <div>
                                            <DialogTitle as="h4" className="text-base font-semibold text-gray-900">
                                                {title}
                                            </DialogTitle>

                                            <div className="flex items-center justify-between ">
                                                <div>
                                                    <div className="flex items-center gap-1 ">
                                                        <span className="text-md flex font-semibold text-red-700">
                                                            <span>  {sale_price > 0
                                                                ? selectedProductInfo?.sale_price
                                                                : selectedProductInfo?.list_price}</span>
                                                            <span>{selectedCountry?.currency_code}</span>
                                                        </span>
                                                        <span className="text-xs sm:text-sm text-[#687188] line-through">
                                                            {list_price} {selectedCountry?.currency_code}
                                                        </span>
                                                        <span className="text-sm text-green-700">
                                                            {discount_label}
                                                        </span>
                                                    </div>
                                                    <span className="text-[#687188]">({t("price_include")})</span>
                                                </div>
                                                <div className="">
                                                    <div className="flex items-center">
                                                        {[...Array(totalStars)].map((_, index) => (
                                                            <span key={index} className="text-[14px]">
                                                                {index < average_rating ? (
                                                                    <FaStar className="text-[#bb1f2a]" />
                                                                ) : (
                                                                    <FaRegStar className="text-[#687188]" />
                                                                )}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <div className="text-[#687188] text-[11px] sm:text-[13px]">
                                                        ({total_rating}) {t("rating")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex  gap-2 my-2">
                                                {productData?.some((item) => item?.pattern?.variant_id)
                                                    ? <span className="text-sm font-semibold text-[#687188]">{t("pattern")}</span>
                                                    : <span className="text-sm font-semibold text-[#687188]">{t("color")}</span>
                                                }

                                                <div className="flex flex-wrap gap-1 mb-2">
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
                                                            const variant = items?.find((v) => v?.variant_id == variantId);
                                                            if (variantId && variant) {
                                                                handleColorChange(variantId, productId, variant?.slug);
                                                            }
                                                        };

                                                        if (pattern?.variant_id) {
                                                            return (
                                                                <PatternSwatch
                                                                    key={`pattern-${index}`}
                                                                    isActive={isActive}
                                                                    image={pattern?.image}
                                                                    onClick={() => handleClick(pattern?.variant_id)}
                                                                    index={index}
                                                                />
                                                            );
                                                        }

                                                        if (colors?.all_colors?.length > 0) {
                                                            const colorsData = colors.all_colors;
                                                            const slice = 100 / colorsData.length;
                                                            const background = `conic-gradient(${colorsData
                                                                .map(
                                                                    (color, i) => `${color} ${i * slice}% ${(i + 1) * slice}%`,
                                                                )
                                                                .join(", ")})`;

                                                            return (
                                                                <ColorSwatch
                                                                    key={`color-${index}`}
                                                                    isActive={isActive}
                                                                    background={background}
                                                                    onClick={() => handleClick(colors?.variant_id)}
                                                                />
                                                            );
                                                        }

                                                        return null;
                                                    })}
                                                </div>
                                            </div>

                                            {sizes && sizes.length > 0 && (
                                                <div className="flex gap-2 ">
                                                    <p className="text-sm font-semibold text-[#687188]">{t("size")}</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {sizes?.map((item, index) => {
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

                                            <p className={`text-[16px] font-bold mt-[5px] py-2 ${quantity ? "text-green-700" : "text-[#bb1b2a]"}`}>
                                                {quantity > 0
                                                    ? `${quantity} ${t("in_stock")}`
                                                    : t("out_of_stock")}
                                            </p>

                                            <TabbyTamaraWidget
                                                finalAmount={sale_price > 0
                                                    ? sale_price
                                                    : list_price}
                                                currencyCode={selectedCountry?.currency_code}
                                            />

                                            <div className="flex items-center py-2 gap-3">
                                                <div className=" z-50 bg-white bg-opacity-70 backdrop-blur-md flex flex-col sm:flex-row items-center gap-2 sm:p-0">
                                                    {selectedProductInfo?.quantity ? (
                                                        <>
                                                            <div className="hidden sm:flex gap-2 items-center my-2">
                                                                <button
                                                                    className="bg-gray-200 p-1 rounded-full cursor-pointer"
                                                                    onClick={() =>
                                                                        handleDecrement(
                                                                            selectedProductInfo?.variant_id,
                                                                            selectedProductInfo?.quantity,
                                                                            selectedQuantity
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
                                                                                selectedQuantity
                                                                            )
                                                                        }
                                                                    >
                                                                        <Add className="text-sm" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                            <div className="justify-center flex sm:flex">
                                                                <button
                                                                    disabled={isOutOfStock || isLoading}
                                                                    onClick={() =>
                                                                        inCart
                                                                            ? router.push("/cart")
                                                                            : addToCart(
                                                                                selectedProductInfo?.variant_id,
                                                                                selectedQuantity
                                                                            )
                                                                    }
                                                                    className={`w-full sm:w-auto py-2 px-6 text-xs rounded text-white flex items-center justify-center shadow-none ${isOutOfStock || isLoading
                                                                        ? "bg-gray-300 cursor-not-allowed"
                                                                        : "bg-[#bb1f2a]"
                                                                        }`}
                                                                >
                                                                    {isLoading ? (
                                                                        <ImSpinner2 className="animate-spin text-white mr-2" size={16} />
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
                                                    ) : null}
                                                </div>

                                                <WishlistButton
                                                    isLoggedIn={isLoggedIn}
                                                    productId={productId}
                                                    variantId={variantId}
                                                    isItemInWishlist={isItemInWishlist}
                                                    toggleWishlist={toggleWishlist}
                                                    handleOpenLogin={handleOpenLogin}
                                                    className="ml-2 my-2"
                                                />
                                            </div>

                                            <div className="mb-6 text-[#687188]">
                                                <p className="my-2">
                                                    <strong>{t("model")}:</strong> {details?.group}
                                                </p>

                                                <p className="my-2">
                                                    <strong>{t("brand")}:</strong>
                                                    <Link
                                                        href={`/brand/${details?.brand_slug}`}
                                                        className="text-[#292b2c] no-underline hover:underline ml-1"
                                                    >
                                                        {details?.brand}
                                                    </Link>
                                                </p>

                                                <p className="my-2 overflow-hidden text-ellipsis whitespace-normal break-wordsline-clamp-2"
                                                    style={{
                                                        display: '-webkit-box',
                                                        WebkitBoxOrient: 'vertical',
                                                        WebkitLineClamp: 2,
                                                    }}
                                                >
                                                    <strong>{t("tags")}:</strong> {details?.tags}
                                                </p>

                                                <div className="mt-4 flex items-center gap-3 text-[#687188]">
                                                    <p className="my-1">
                                                        <strong>{t("share")}:</strong>
                                                    </p>

                                                    <FacebookShareButton url={pathname}>
                                                        <FacebookIcon size={32} round />
                                                    </FacebookShareButton>

                                                    <WhatsappShareButton url={pathname} separator=":: ">
                                                        <WhatsappIcon size={32} round />
                                                    </WhatsappShareButton>
                                                </div>
                                            </div>

                                            <div className="w-full block sm:hidden">
                                                <div className="w-full">
                                                    <div
                                                        className="flex justify-between items-center cursor-pointer bg-gray-100 px-3 py-3"
                                                        onClick={toggleAccordion}
                                                    >
                                                        <div className="text-sm font-semibold text-gray-700">
                                                            {t("product_description")}
                                                        </div>
                                                        <button className="text-gray-500 focus:outline-none">
                                                            {isOpenAccordion ? (
                                                                <TiArrowSortedUp size={20} />
                                                            ) : (
                                                                <TiArrowSortedDown size={20} />
                                                            )}
                                                        </button>
                                                    </div>

                                                    {isOpenAccordion && description && (
                                                        <div className="mt-2 bg-gray-100 px-4 py-3 text-sm text-gray-700">
                                                            {parse(description)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="w-full hidden sm:block">
                                                {description && (
                                                    <div className="text-[#687188] text-base">
                                                        {parse(description)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogPanel>
                    </div>
                </div>
            </Dialog>

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
        </>
    );
};

export default AddToCartModal;
